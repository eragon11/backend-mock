
import chillerTransaction from '../../../hvac_transaction/chiller/chillerModel';
import chillerMaster from '../../../hvac_masters/chiller/chillerModel';
var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;

let chillerController = {};

chillerController.chiller = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d78897c545440369c4964cf";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let devicechillerMapDocs = await chillerMaster.aggregate(
      [
        {
          "$match": {
            "$and": [
              { "CHLRM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
              { "CHLRM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
              { "CHLRM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
            ]
          }
        },
        {
          $lookup:
          {
            from: "chillertransactions",
            localField: "_id",
            foreignField: "CHLRTS_FK_CHILLERDeviceId_obj",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$RightTableData.CHLRTS_IoModuleID_str",
            "CHLRTS_IoModuleID_str": { "$last": "$RightTableData.CHLRTS_IoModuleID_str" },
            "CHLRTS_Created_Date": { "$last": "$RightTableData.CHLRTS_Created_Date" },
            "rightabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "CHLRTS_Created_Date": 1.0
          }
        },
        {
          $project: {
            createdDate: "$CHLRTS_Created_Date",
            deviceId: "$CHLRTS_IoModuleID_str",
            deviceName: "$rightabledata.CHLRM_Device_Name_Str",
            createdTime: { $substr: ["$CHLRTS_Created_Date", 11, 8] },
            CHLRM_Fk_ZM_ZoneID_Obj: "$rightabledata.CHLRM_Fk_ZM_ZoneID_Obj",
            "phaseType": "$rightabledata.CHLRM_PhaseType_Str",
            "Rpm": "$rightabledata.RightTableData.CHLRTS_RPM_Num",
            "Current": {
              "$cond": {
                "if": { "$eq": ["$rightabledata.CHLRM_PhaseType_Str", "Single Phase"] },
                "then": "$rightabledata.RightTableData.CHLRTS_CurrentR_Num",
                "else": {
                  $add: [{ "$abs": "$rightabledata.RightTableData.CHLRTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_CurrentR_Num" }]
                }
              }
            },
            "Power": {
              "$cond": {
                "if": { "$eq": ["$rightabledata.CHLRM_PhaseType_Str", "Single Phase"] },
                "then": "$rightabledata.RightTableData.CHLRTS_PowerR_Num",
                "else": {
                  $add: [{ "$abs": "$rightabledata.RightTableData.CHLRTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_PowerR_Num" }]
                }
              }
            },
            "Voltage": {
              "$cond": {
                "if": { "$eq": ["$rightabledata.CHLRM_PhaseType_Str", "Single Phase"] },
                "then": "$rightabledata.RightTableData.CHLRTS_VoltageR_Num",
                "else": {
                  $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.CHLRTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_VoltageR_Num" }] }, 3]
                }
              }
            },
            "voltageMin": "$rightabledata.CHLRM_MinVoltage_Num",
            "voltageMax": "$rightabledata.CHLRM_MaxVoltage_Num",
            "currentMin": "$rightabledata.CHLRM_MaxCurrent_Num",
            "currentMax": "$rightabledata.CHLRM_MaxPower_Num",
            "outTempMin": "$rightabledata.CHLRM_MinOutTemp_Num",
            "outTempMax": "$rightabledata.CHLRM_MaxOutTemp_Num",
            "inletTempMin": "$rightabledata.CHLRM_MinInletTemp_Num",
            "inletTempMax": "$rightabledata.CHLRM_MaxInletTemp_Num",
            "waterFlowRateM": "$rightabledata.CHLRM_Waterflowrate_Num",
            "RpmM": "$rightabledata.CHLRM_MaxRPMOfChiller_Num",
            "InletTemp": "$rightabledata.RightTableData.CHLRTS_InletTemprature_Num",
            "OutletTemp": "$rightabledata.RightTableData.CHLRTS_OutletTemprature_Num"
          }
        }
      ], function (err, docs) {
        var options = {
          path: 'CHLRM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        chillerMaster.populate(docs, options, function (err, projects) {
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

chillerController.chillerGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let today = false;
    let selectValue = req.body.selectValue;

    let locationId = req.body.locationId || "5d78897c545440369c4964cf";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.CHLRTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.CHLRTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.CHLRTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.CHLRTS_Created_Date" };
    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.CHLRTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.CHLRTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.CHLRTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.CHLRTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.CHLRTS_Created_Date" };
      }
    }
    console.log(dateRange);

    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.CHLRTS_FK_CHILLERDeviceId_obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
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
          "CHLRTS_IoModuleID_str": "$RightTableData.CHLRTS_IoModuleID_str"
        },
        "CHLRTS_IoModuleID_str": {
          "$last": "$RightTableData.CHLRTS_IoModuleID_str"
        },
        "CHLRTS_Created_Date": {
          "$last": "$RightTableData.CHLRTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [
      {
        "$match": {
          "$and": [
            { "CHLRM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "CHLRM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "CHLRM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          ]
        }
      },
      {
        $lookup:
        {
          from: "chillertransactions",
          localField: "_id",
          foreignField: "CHLRTS_FK_CHILLERDeviceId_obj",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "CHLRTS_Created_Date": -1 } },
      {
        "$project": {
          "deviceId": "$rightabledata.RightTableData.CHLRTS_FK_CHILLERDeviceId_obj",
          "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$CHLRTS_Created_Date" } },
          "createdTime": { $substr: ["$CHLRTS_Created_Date", 11, 8] },
          "id": "$rightabledata.RightTableData._id",
          "deviceName": "$rightabledata.CHLRM_Device_Name_Str",
          "phaseType": "$rightabledata.CHLRM_PhaseType_Str",
          "Rpm": "$rightabledata.RightTableData.CHLRTS_RPM_Num",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.CHLRM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.CHLRTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.CHLRTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.CHLRM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.CHLRTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.CHLRTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.CHLRM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.CHLRTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.CHLRTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.CHLRTS_VoltageR_Num" }] }, 3]
              }
            }
          },
          "InletTemp": "$rightabledata.RightTableData.CHLRTS_InletTemprature_Num",
          "OutletTemp": "$rightabledata.RightTableData.CHLRTS_OutletTemprature_Num"
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceAhuMapDocs = await chillerMaster.aggregate(pipeline)

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

export default chillerController;