var moment = require('moment');

import zoneTempMaster from './api/hvac_masters/zoneTemprature/zoneTempratureModel';
import zoneTempTransaction from './api/hvac_transaction/zoneTemprature/zoneTempratureModel';

let socketService = {};

socketService.zone = async () => {
  try {
    const dat = await zoneTempTransaction.aggregate(
      [
        {
          $lookup:
          {
            from: "zonetempraturemasters",
            localField: "ZNTTS_Fk_ZoneDeviceId_obj",
            foreignField: "ZNTM_DeviceId_Str",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$ZNTTS_Fk_ZoneDeviceId_obj",
            "ZNTTS_Fk_ZoneDeviceId_obj": { "$last": "$ZNTTS_Fk_ZoneDeviceId_obj" },
            "ZNTTS_Created_date": { "$last": "$ZNTTS_Created_date" },
            "ZNTTS_Humidity_Num": { "$last": "$ZNTTS_Humidity_Num" },
            "ZNTTS_Temperature_Num": { "$last": "$ZNTTS_Temperature_Num" },
            "rightabledata": { "$first": "$$ROOT" }
          }
        },
        {
          $project: {
            Temperature: "$ZNTTS_Temperature_Num",
            Humidity: "$ZNTTS_Humidity_Num",
            createdDate: "$ZNTTS_Created_date",
            deviceId: "$ZNTTS_Fk_ZoneDeviceId_obj",
            deviceName: "$rightabledata.RightTableData.ZNTM_Device_Name_Str",
            createdTime: { $substr: ["$ZNTTS_Created_date", 11, 8] },
            ZNTM_Fk_ZM_ZoneID_Obj: "$rightabledata.RightTableData.ZNTM_Fk_ZM_ZoneID_Obj"
          }
        }
      ]);
    var options = {
      path: 'ZNTM_Fk_ZM_ZoneID_Obj',
      model: 'zone'
    };
    const projects = await zoneTempMaster.populate(dat, options);
    // console.log("projects");

    // console.log(projects);
    return projects;
  } catch (error) {
    console.log(error);
  }

}

socketService.zoneGraph = async (data) => {

  try {
    // console.log("zoneGraph");

    // console.log(data);
    let startDate, endDate;
    let group_id;
    if (data.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      group_id = { "$hour": "$ZNTTS_Created_date" }
    } else if (data.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      group_id = "$ZNTTS_Fk_ZoneDeviceId_obj"
    } else if (data.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      group_id = "$ZNTTS_Fk_ZoneDeviceId_obj"
    } else {
      startDate = moment(data.fromDate).format('YYYY-MM-DD');
      endDate = moment(data.toDate).format('YYYY-MM-DD');
      group_id = "$ZNTTS_Fk_ZoneDeviceId_obj"
    }

    let deviceZoneMapDocs = await zoneTempTransaction.aggregate(
      [
        { "$match": { $and: [{ "ZNTTS_Fk_ZoneDeviceId_obj": { $in: data.selectValue } }, { "ZNTTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }] } },
        { "$sort": { "ZNTTS_Created_date": -1 } },
        {
          "$group": {
            // "_id": group_id,
            "first": { "$first": "$$ROOT" },
            "last": { "$last": "$$ROOT" }
          }
        },
        {
          "$project": {
            "Temperature": "$ZNTTS_Temperature_Num",
            "Humidity": "$ZNTTS_Humidity_Num",
            "deviceId": "$ZNTTS_Fk_ZoneDeviceId_obj",
            "createdDate": "$ZNTTS_Created_date",
            "createdTime": { $substr: ["$ZNTTS_Created_date", 11, 8] },
            "id": "$_id"
          }
        }
      ])
    // console.log(deviceZoneMapDocs);


    return deviceZoneMapDocs;
  } catch (error) {
    console.log(error);
  }

}


export default socketService;