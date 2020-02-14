
import waterTankTransaction from "../../../hvac_transaction/waterTank/waterTankModel";
import waterTankMaster from "../../../hvac_masters/waterTank/waterTankModel";
var moment = require('moment');
import * as _ from 'lodash';
var ObjectID = require('mongoose').Types.ObjectId;
let waterTankController = {};

waterTankController.waterTank = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d78897c545440369c4964cf";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let devicewaterTankMapDocs = await waterTankMaster.aggregate(
      [
        {
          "$match": {
            "$and": [
              { "WTKM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
              { "WTKM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
              { "WTKM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
            ]
          }
        },
        {
          $lookup:
          {
            from: "watertanktransactions",
            localField: "_id",
            foreignField: "WTKTS_Fk_WaterTankDeviceId_obj",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$RightTableData.WTKTS_IoModuleID_str",
            "WTKTS_IoModuleID_str": { "$last": "$RightTableData.WTKTS_IoModuleID_str" },
            "WTKTS_Created_Date": { "$last": "$RightTableData.WTKTS_Created_Date" },
            "rightabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "WTKTS_Created_Date": 1.0
          }
        },
        {
          $project: {
            WaterLevel: "$rightabledata.RightTableData.WTKTS_WaterLevel_Num",
            WaterTankMinM: "$rightabledata.WTKM_MinLevel_Num",
            WaterTankMaxM: "$rightabledata.WTKM_MaxLevel_Num",
            createdDate: "$WTKTS_Created_Date",
            deviceId: "$WTKTS_IoModuleID_str",
            deviceName: "$rightabledata.WTKM_Device_Name_Str",
            createdTime: { $substr: ["$WTKTS_Created_Date", 11, 8] },
            WTKM_Fk_ZM_ZoneID_Obj: "$rightabledata.WTKM_Fk_ZM_ZoneID_Obj"
          }
        }
      ], function (err, docs) {
        var options = {
          path: 'WTKM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        waterTankMaster.populate(docs, options, function (err, projects) {
          res.status(200).send({
            code: 200,
            message: "success",
            data: projects
          });
        })
      })
  } catch (error) {
    console.log(error);
  }
}

waterTankController.waterTankGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let today = false;
    let selectValue = req.body.selectValue;
    console.log(selectValue);

    let locationId = req.body.locationId || "5d78897c545440369c4964cf";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.WTKTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.WTKTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.WTKTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.WTKTS_Created_Date" };
    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.WTKTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.WTKTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.WTKTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.WTKTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.WTKTS_Created_Date" };
      }
    }
    console.log(dateRange);

    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.WTKTS_Fk_WaterTankDeviceId_obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
          }, dateRange
        ]
      }
    };

    let group = {
      "$group": {
        "_id": {
          "date": {
            "$dateToString": dateGroupString
          },
          "WTKTS_IoModuleID_str": "$RightTableData.WTKTS_IoModuleID_str"
        },
        "WTKTS_IoModuleID_str": {
          "$last": "$RightTableData.WTKTS_IoModuleID_str"
        },
        "WTKTS_Created_Date": {
          "$last": "$RightTableData.WTKTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [
      {
        "$match": {
          "$and": [
            { "WTKM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "WTKM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "WTKM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          ]
        }
      },
      {
        $lookup:
        {
          from: "watertanktransactions",
          localField: "_id",
          foreignField: "WTKTS_Fk_WaterTankDeviceId_obj",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "WTKTS_Created_Date": -1 } },
      {
        "$project": {
          "deviceId": "$rightabledata.RightTableData.WTKTS_Fk_WaterTankDeviceId_obj",
          "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$WTKTS_Created_Date" } },
          "createdTime": { $substr: ["$WTKTS_Created_Date", 11, 8] },
          "id": "$_id",
          "deviceName": "$rightabledata.WTKM_Device_Name_Str",
          "WaterLevel": "$rightabledata.RightTableData.WTKTS_WaterLevel_Num",
        }
      }
    ];


    pipeline.splice(3, 0, match, group);


    let deviceAhuMapDocs = await waterTankMaster.aggregate(pipeline)

    const outJSON = {};
    if (req.body.sortType == "Today") {
      for (let i = 0, len = deviceAhuMapDocs.length; i < len; i++) {
        const di = deviceAhuMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        if ((diLen > 0) || diLen == 0) {
          outJSON[di].push(deviceAhuMapDocs[i]);
        }
      }
    } else {
      for (let i = 0, len = deviceAhuMapDocs.length; i < len; i++) {
        const di = deviceAhuMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        const previousDat = diLen > 0 ? outJSON[di][diLen - 1] : undefined;
        if ((diLen > 0 && previousDat.createdDate != deviceAhuMapDocs[i].createdDate) || diLen == 0) {
          outJSON[di].push(deviceAhuMapDocs[i]);
        }
      }
    }

    res.status(200).send({
      code: 200,
      message: "success",
      data: outJSON
    });
  } catch (error) {
    console.log(error);
  }
}

export default waterTankController;