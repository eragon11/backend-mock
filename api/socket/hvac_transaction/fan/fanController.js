
import fanTransaction from "../../../hvac_transaction/fan/fanModel";
import fanMaster from "../../../hvac_masters/fan/fanModel";
var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;

let fanController = {};

fanController.fan = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceFanMapDocs = await fanMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "FANM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "FANM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "FANM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
          }
        },
        {
          $lookup:
          {
            from: "fanrpmtransactions",
            localField: "_id",
            foreignField: "FANTS_Fk_FANDeviceId_object",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$RightTableData.FANTS_IoModuleID_str",
            "FANTS_IoModuleID_str": { "$last": "$RightTableData.FANTS_IoModuleID_str" },
            "FANTS_Created_date": { "$last": "$RightTableData.FANTS_Created_date" },
            "rightabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "FANTS_Created_date": 1.0
          }
        },
        {
          $project: {
            Rpm: "$rightabledata.RightTableData.FANTS_RPM_Num",
            RpmM: "$rightabledata.FANM_MaxRPM_Num",
            createdDate: { "$dateToString": { "format": "%Y-%m-%d", "date": "$FANTS_Created_date" } },
            deviceId: "$FANTS_IoModuleID_str",
            deviceName: "$rightabledata.FANM_Device_Name_Str",
            createdTime: { $substr: ["$FANTS_Created_date", 11, 8] },
            FANM_Fk_ZM_ZoneID_Obj: "$rightabledata.FANM_Fk_ZM_ZoneID_Obj"
          }
        }
      ], function (err, docs) {

        var options = {
          path: 'FANM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        fanMaster.populate(docs, options, function (err, projects) {

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

fanController.fanGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let today = false;

    let locationId = req.body.locationId || "5d788965545440369c4964ce";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.FANTS_Created_date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.FANTS_Created_date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.FANTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.FANTS_Created_date" };
    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.FANTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.FANTS_Created_date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.FANTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.FANTS_Created_date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.FANTS_Created_date" };
      }
    }
    console.log(dateRange);

    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.FANTS_IoModuleID_str": { $in: req.body.selectValue }
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
          "FANTS_IoModuleID_str": "$RightTableData.FANTS_IoModuleID_str"
        },
        "FANTS_IoModuleID_str": {
          "$last": "$RightTableData.FANTS_IoModuleID_str"
        },
        "FANTS_Created_date": {
          "$last": "$RightTableData.FANTS_Created_date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [

      {
        "$match": {
          "$and": [{ "FANM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "FANM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "FANM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
        }
      },
      {
        $lookup:
        {
          from: "fanrpmtransactions",
          localField: "_id",
          foreignField: "FANTS_Fk_FANDeviceId_object",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "FANTS_Created_date": -1 } },
      {
        "$project": {
          "deviceId": "$FANTS_IoModuleID_str",
          "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$FANTS_Created_date" } },
          "createdTime": { $substr: ["$FANTS_Created_date", 11, 8] },
          "id": "$_id",
          "deviceName": "$rightabledata.FANM_Device_Name_Str",
          "Rpm": "$rightabledata.RightTableData.FANTS_RPM_Num"
        }
      }
    ]

    pipeline.splice(3, 0, match, group);

    let deviceAhuMapDocs = await fanMaster.aggregate(pipeline)

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

export default fanController;