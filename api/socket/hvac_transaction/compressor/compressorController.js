
import compressorTransaction from '../../../hvac_transaction/compressor/compressorModel';
import compressorMaster from '../../../hvac_masters/compressor/compressorModel';
var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;

let compressorController = {};

compressorController.compressor = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceCompressorMapDocs = await compressorMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "COMPM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "COMPM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "COMPM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
          }
        },
        {
          "$lookup": {
            from: "compressorenergyrpmtransactions",
            localField: "_id",
            foreignField: "COMPTS_Fk_COMPDeviceId_obj",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$RightTableData.COMPTS_IoModuleID_str",
            "COMPTS_IoModuleID_str": { "$last": "$RightTableData.COMPTS_IoModuleID_str" },
            "COMPTS_Created_date": { "$last": "$RightTableData.COMPTS_Created_date" },
            "rightabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "COMPTS_Created_date": 1.0
          }
        },
        {
          $project: {
            CurrentB: "$rightabledata.RightTableData.COMPTS_CurrentB_Num",
            CurrentY: "$rightabledata.RightTableData.COMPTS_CurrentY_Num",
            CurrentR: "$rightabledata.RightTableData.COMPTS_CurrentR_Num",
            VoltageB: "$rightabledata.RightTableData.COMPTS_VoltageB_Num",
            VoltageY: "$rightabledata.RightTableData.COMPTS_VoltageY_Num",
            VoltageR: "$rightabledata.RightTableData.COMPTS_VoltageR_Num",
            PowerB: "$rightabledata.RightTableData.COMPTS_PowerB_Num",
            PowerY: "$rightabledata.RightTableData.COMPTS_PowerY_Num",
            PowerR: "$rightabledata.RightTableData.COMPTS_PowerR_Num",
            Rpm: "$rightabledata.RightTableData.COMPTS_RPM_Num",
            PowerM: "$rightabledata.COMPM_MaxPower_Num",
            CurrentM: "$rightabledata.COMPM_MaxCurrent_Num",
            VoltageM: "$rightabledata.COMPM_MaxVoltage_Num",
            RpmM: "$rightabledata.COMPM_MaxRPM_Num",
            createdDate: { "$dateToString": { "format": "%Y-%m-%d", "date": "$COMPTS_Created_date" } },
            deviceId: "$COMPTS_IoModuleID_str",
            deviceName: "$rightabledata.COMPM_Device_Name_Str",
            phaseType: "$rightabledata.COMPM_PhaseType_Str",
            createdTime: { $substr: ["$COMPTS_Created_date", 11, 8] },
            COMPM_Fk_ZM_ZoneID_Obj: "$rightabledata.COMPM_Fk_ZM_ZoneID_Obj"
          }
        }
      ], function (err, docs) {
        console.log("docs");

        console.log(docs);
        var options = {
          path: 'COMPM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        compressorMaster.populate(docs, options, function (err, projects) {
          console.log("inner master");
          console.log(projects);

          projects.map(data => {
            if (data.phaseType == "Single Phase") {
              data.Current = data.CurrentR;
              data.Voltage = data.VoltageR;
              data.Power = data.PowerR;
            } else {
              data.Current = (Math.abs(data.CurrentB) + Math.abs(data.CurrentY) + Math.abs(data.CurrentR));
              data.Power = (Math.abs(data.PowerB) + Math.abs(data.PowerY) + Math.abs(data.PowerR));
              data.Voltage = (Math.abs(data.VoltageB) + Math.abs(data.VoltageY) + Math.abs(data.VoltageR)) / 3;
            }
          })

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

compressorController.compressorGraph = async (req, res) => {
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
      dateRange = { "RightTableData.COMPTS_Created_date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.COMPTS_Created_date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.COMPTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.COMPTS_Created_date" };
    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.COMPTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.COMPTS_Created_date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.COMPTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.COMPTS_Created_date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.COMPTS_Created_date" };
      }
    }

    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.COMPTS_IoModuleID_str": { $in: req.body.selectValue }
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
          "COMPTS_IoModuleID_str": "$RightTableData.COMPTS_IoModuleID_str"
        },
        "COMPTS_IoModuleID_str": {
          "$last": "$RightTableData.COMPTS_IoModuleID_str"
        },
        "COMPTS_Created_date": {
          "$last": "$RightTableData.COMPTS_Created_date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [
      {
        "$match": {
          "$and": [{ "COMPM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "COMPM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "COMPM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
        }
      },
      {
        "$lookup": {
          from: "compressorenergyrpmtransactions",
          localField: "_id",
          foreignField: "COMPTS_Fk_COMPDeviceId_obj",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "COMPTS_Created_date": -1 } },
      {
        "$project": {
          "deviceId": "$COMPTS_IoModuleID_str",
          "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$COMPTS_Created_date" } },
          "createdTime": { $substr: ["$COMPTS_Created_date", 11, 8] },
          "id": "$_id",
          "deviceName": "$rightabledata.COMPM_Device_Name_Str",
          "phaseType": "$rightabledata.COMPM_PhaseType_Str",
          "Rpm": "$rightabledata.RightTableData.COMPTS_RPM_Num",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.COMPM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.COMPTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.COMPTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.COMPTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.COMPTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.COMPM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.COMPTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.COMPTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.COMPTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.COMPTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.COMPM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.COMPTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.COMPTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.COMPTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.COMPTS_VoltageR_Num" }] }, 3]
              }
            }
          }
        }
      }
    ]

    pipeline.splice(3, 0, match, group);

    let deviceAhuMapDocs = await compressorMaster.aggregate(pipeline)

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

export default compressorController;