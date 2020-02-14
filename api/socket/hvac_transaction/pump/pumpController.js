
import pumpTransaction from "../../../hvac_transaction/pump/pumpModel";
import pumpMaster from "../../../hvac_masters/pump/pumpModel";
var moment = require('moment');
import * as _ from 'lodash';
var ObjectID = require('mongoose').Types.ObjectId;
let pumpController = {};

pumpController.pump = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d78897c545440369c4964cf";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let devicePumpMapDocs = await pumpMaster.aggregate(
      [
        {
          $match: {
            "$and": [
              { "PUMPM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
              { "PUMPM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
              { "PUMPM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
            ]
          }
        },
        {
          $lookup:
          {
            from: "pumptransactions",
            localField: "_id",
            foreignField: "PUMPTS_Fk_PUMPDeviceId_obj",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$RightTableData.PUMPTS_Fk_PUMPDeviceId_obj",
            "PUMPTS_IoModuleID_str": { "$last": "$RightTableData.PUMPTS_IoModuleID_str" },
            "PUMPTS_Created_Date": { "$last": "$RightTableData.PUMPTS_Created_Date" },
            "rightabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "PUMPTS_Created_Date": 1.0
          }
        },
        {
          $project: {
            Rpm: "$rightabledata.RightTableData.PUMPTS_RPM_Num",
            RpmM: "$rightabledata.PUMPM_MaxRPM_Num",
            createdDate: "$PUMPTS_Created_Date",
            deviceId: "$PUMPTS_IoModuleID_str",
            deviceName: "$rightabledata.PUMPM_Device_Name_Str",
            createdTime: { $substr: ["$PUMPTS_Created_Date", 11, 8] },
            PUMPM_Fk_ZM_ZoneID_Obj: "$rightabledata.PUMPM_Fk_ZM_ZoneID_Obj"
          }
        }
      ], function (err, docs) {
        var options = {
          path: 'PUMPM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        pumpMaster.populate(docs, options, function (err, projects) {
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

pumpController.pumpGraph = async (req, res) => {
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
      dateRange = { "RightTableData.PUMPTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.PUMPTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.PUMPTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.PUMPTS_Created_Date" };
    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.PUMPTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.PUMPTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.PUMPTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.PUMPTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.PUMPTS_Created_Date" };
      }
    }

    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.PUMPTS_Fk_PUMPDeviceId_obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
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
          "PUMPTS_IoModuleID_str": "$RightTableData.PUMPTS_IoModuleID_str"
        },
        "PUMPTS_IoModuleID_str": {
          "$last": "$RightTableData.PUMPTS_IoModuleID_str"
        },
        "PUMPTS_Created_Date": {
          "$last": "$RightTableData.PUMPTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [
      {
        $match: {
          "$and": [
            { "PUMPM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "PUMPM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "PUMPM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          ]
        }
      },
      {
        $lookup:
        {
          from: "pumptransactions",
          localField: "_id",
          foreignField: "PUMPTS_Fk_PUMPDeviceId_obj",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "PUMPTS_Created_Date": -1 } },
      {
        "$project": {
          "deviceId": "$rightabledata.RightTableData.PUMPTS_Fk_PUMPDeviceId_obj",
          "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$PUMPTS_Created_Date" } },
          "createdTime": { $substr: ["$PUMPTS_Created_Date", 11, 8] },
          "id": "$_id",
          "deviceName": "$rightabledata.PUMPM_Device_Name_Str",
          "Rpm": "$rightabledata.RightTableData.PUMPTS_RPM_Num"
        }
      }
    ];


    pipeline.splice(3, 0, match, group);


    let devicePumpMapDocs = await pumpMaster.aggregate(pipeline)
    console.log(devicePumpMapDocs);

    const outJSON = {};
    if (req.body.sortType == "Today") {
      for (let i = 0, len = devicePumpMapDocs.length; i < len; i++) {
        const di = devicePumpMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        if ((diLen > 0) || diLen == 0) {
          outJSON[di].push(devicePumpMapDocs[i]);
        }
      }
    } else {
      for (let i = 0, len = devicePumpMapDocs.length; i < len; i++) {
        const di = devicePumpMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        const previousDat = diLen > 0 ? outJSON[di][diLen - 1] : undefined;
        if ((diLen > 0 && previousDat.createdDate != devicePumpMapDocs[i].createdDate) || diLen == 0) {
          outJSON[di].push(devicePumpMapDocs[i]);
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

export default pumpController;