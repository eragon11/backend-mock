
import ahuTransaction from '../../../hvac_transaction/ahu/ahuModel';
import ahuMaster from '../../../hvac_masters/ahu/ahuModel';
var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;

let ahuController = {};

ahuController.ahu = async (req, res) => {
  try {
  
    let locationId = req.params.locationId || "5d78897c545440369c4964cf";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceAhuMapDocs = await ahuMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "AHUM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "AHUM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "AHUM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }, { "AHUM_isActive_Bool": true }]
          }
        },
        {
          $lookup:
          {
            from: "ahuenergytransactions",
            localField: "AHUM_DeviceId_Num",
            foreignField: "AHUTS_IoModuleID_str",
            as: "RightTableData"
          }
        },
        { "$unwind": "$RightTableData" },
        {
          $group: {
            "_id": "$RightTableData.AHUTS_IoModuleID_str",
            "AHUTS_IoModuleID_str": { "$last": "$RightTableData.AHUTS_IoModuleID_str" },
            "AHUTS_Created_Date": { "$last": "$RightTableData.AHUTS_Created_Date" },
            "rightabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "RightTableData.AHUTS_Created_Date": 1.0
          }
        },
        {
          $project: {
            CurrentB: "$rightabledata.RightTableData.AHUTS_CurrentB_Num",
            CurrentY: "$rightabledata.RightTableData.AHUTS_CurrentY_Num",
            CurrentR: "$rightabledata.RightTableData.AHUTS_CurrentR_Num",
            VoltageB: "$rightabledata.RightTableData.AHUTS_VoltageB_Num",
            VoltageY: "$rightabledata.RightTableData.AHUTS_VoltageY_Num",
            VoltageR: "$rightabledata.RightTableData.AHUTS_VoltageR_Num",
            PowerB: "$rightabledata.RightTableData.AHUTS_PowerB_Num",
            PowerY: "$rightabledata.RightTableData.AHUTS_PowerY_Num",
            PowerR: "$rightabledata.RightTableData.AHUTS_PowerR_Num",
            PowerM: "$rightabledata.AHUM_MaxPower_Num",
            CurrentM: "$rightabledata.AHUM_MaxCurrent_Num",
            VoltageM: "$rightabledata.AHUM_MaxVoltage_Num",
            createdDate: { $dateToString: { format: "%Y-%m-%d", date: "$AHUTS_Created_Date" } },
            deviceId: "$AHUTS_IoModuleID_str",
            deviceName: "$rightabledata.AHUM_Device_Name_Str",
            phaseType: "$rightabledata.AHUM_PhaseType_Str",
            createdTime: { $substr: ["$AHUTS_Created_Date", 11, 8] },
            AHUM_Fk_ZM_ZoneID_Obj: "$rightabledata.AHUM_Fk_ZM_ZoneID_Obj"
          }
        }
      ], function (err, docs) {
        var options = {
          path: 'AHUM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        console.log(docs);
        
        ahuMaster.populate(docs, options, function (err, projects) {
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

ahuController.ahuGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let today = false;

    let locationId = req.body.locationId || "5d78897c545440369c4964cf";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.AHUTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      today = true;
      dateGroupString = { "format": "%H", "date": "$RightTableData.AHUTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.AHUTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.AHUTS_Created_Date" };

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.AHUTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.AHUTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.AHUTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.AHUTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.AHUTS_Created_Date" };
      }
    }

    let match = {
      "$match": {

        "$and": [
          {
            "RightTableData.AHUTS_IoModuleID_str": { $in: req.body.selectValue }
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
          "AHUTS_IoModuleID_str": "$RightTableData.AHUTS_IoModuleID_str"
        },
        "AHUTS_IoModuleID_str": {
          "$last": "$RightTableData.AHUTS_IoModuleID_str"
        },
        "AHUTS_Created_Date": {
          "$last": "$RightTableData.AHUTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [
      {
        "$match": {
          "$and": [{ "AHUM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "AHUM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "AHUM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
        }
      },
      {
        "$lookup": {
          from: "ahuenergytransactions",
          localField: "_id",
          foreignField: "AHUTS_FK_AHUDeviceId_obj",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "AHUTS_Created_Date": -1.0 } },
      {
        "$project": {
          "deviceId": "$AHUTS_IoModuleID_str",
          "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$AHUTS_Created_Date" } },
          "createdTime": { $substr: ["$AHUTS_Created_Date", 11, 8] },
          "id": "$_id.AHUTS_IoModuleID_str",
          "deviceName": "$rightabledata.AHUM_Device_Name_Str",
          "phaseType": "$rightabledata.AHUM_PhaseType_Str",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.AHUM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.AHUTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.AHUTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.AHUTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.AHUTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.AHUM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.AHUTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.AHUTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.AHUTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.AHUTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.AHUM_PhaseType_Str", "Single Phase"] },
              "then": "$rightabledata.RightTableData.AHUTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.AHUTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.AHUTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.AHUTS_VoltageR_Num" }] }, 3]
              }
            }
          }
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceAhuMapDocs = await ahuMaster.aggregate(pipeline);

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

export default ahuController;