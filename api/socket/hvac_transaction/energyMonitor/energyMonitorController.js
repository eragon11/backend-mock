import buildingMaster from "../../../hvac_masters/building/buildingModel";
import siteMaster from "../../../hvac_masters/site/siteModel";
import locationMaster from "../../../hvac_masters/location/locationModel";
import energyTransaction from "../../../hvac_transaction/energyMeter/energyMeterModel";
import energyMeterMasterModel from "../../../hvac_masters/eneryMeter/energyMeterModel";
import energyMeterUnitMaster from "../../../hvac_masters/energyMeterUnit/energyMeterUnitModel";
import panelMaster from "../../../energy_masters/panel/panelModel";
var moment = require('moment');
import * as _ from 'lodash';
import mongoose from 'mongoose'
import energyMeterModel from "../../../hvac_transaction/energyMeter/energyMeterModel";
let ObjectID = mongoose.Types.ObjectId;
let energyMonitorController = {};


energyMonitorController.energyMonitor = async (req, res) => {
  try {

    let building_id = req.params.building || "5d68be0e9f11833dc4dc9cfa";

    let building = await buildingMaster.findById({ "_id": ObjectID(building_id) }).populate({
      path: 'BM_Fk_Site_Id_Obj',
      model: 'site',
      populate: {
        path: 'SM_Fk_Location_Id_Obj',
        model: 'location'
      }
    });

    res.status(200).send({
      code: 200,
      message: "success",
      data: building
    });
  } catch (error) {
    console.log(error);
  }
}


energyMonitorController.energyMonitorConsumption = async (req, res) => {
  try {

    let pastStartDate, pastEndDate, pastDateRange;

    let energyUnitType = await energyMeterUnitMaster.find({ "EMU_BuildingId": ObjectID(req.body.buildingId) }).sort({ "EMU_Created_Date": -1 }).limit(1);

    if (energyUnitType[0].EMU_EnergyForecast == 24) {
      pastStartDate = moment().format('YYYY-MM-DD HH:mm:ss');
      pastEndDate = moment().subtract(24, 'h').format('YYYY-MM-DD HH:mm:ss');
      pastDateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(pastEndDate), "$lte": new Date(pastStartDate) } };
      console.log(pastEndDate, pastStartDate);
      console.log(pastDateRange);

    }

    let deviceAhuMapDocs = await energyMeterMasterModel.aggregate([
      {
        "$match": {
          "$and": [{ "EMM_Fk_BM_BuildingID_Obj": ObjectID(req.body.buildingId) }, { "EMM_Is_Deleted_bool": false }]
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "_id",
          "foreignField": "ENTS_Fk_EnergyMaster_Id_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$match": pastDateRange
      },
      {
        "$group": {
          "_id": {
            "ENTS_Fk_EnergyMaster_Id_obj": "$RightTableData.ENTS_Fk_EnergyMaster_Id_obj"
          },
          "powerR": { "$last": "$RightTableData.ENTS_PowerR_Num" },
          "powerY": { "$last": "$RightTableData.ENTS_PowerY_Num" },
          "powerB": { "$last": "$RightTableData.ENTS_PowerB_Num" },
          "energyWhR": { "$last": "$RightTableData.ENTS_EnergyWhR_Num" },
          "energyWhY": { "$last": "$RightTableData.ENTS_EnergyWhY_Num" },
          "energyWhB": { "$last": "$RightTableData.ENTS_EnergyWhB_Num" },
          "pfR": { "$last": "$RightTableData.ENTS_PFR_Num" },
          "pfY": { "$last": "$RightTableData.ENTS_PFY_Num" },
          "pfB": { "$last": "$RightTableData.ENTS_PFB_Num" },
        }
      },
      {
        "$project": {
          "_id": "$_id.ENTS_Fk_EnergyMaster_Id_obj",
          "totalEnergy": { "$sum": ["$energyWhR", "$energyWhY", "energyWhB"] },
          "totalPower": { "$sum": ["$powerR", "$powerY", "$powerB"] },
          "totalPF": { "$sum": ["$pfR", "$pfY", "$pfB"] }
        }
      }
    ]);

    let building = await buildingMaster.findById({ "_id": ObjectID(req.body.buildingId) })

    let buildingPrice = building.BM_ElectricityUnitPrice_Str == null ? 0 : building.BM_ElectricityUnitPrice_Str;

    deviceAhuMapDocs.forEach(data => {
      data.energyPrice = Number(buildingPrice * data.totalEnergy).toFixed(2)
    });

    let solarPower = await energyMeterMasterModel.aggregate([
      {
        "$match": {
          "EMM_Device_Name_Str": "SOLAR"
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "EMM_DeviceId_Str",
          "foreignField": "ENTS_IoModuleID_str",
          "as": "RightTableData"
        }
      },
      {
        "$unwind": {
          "path": "$RightTableData"
        }
      },
      {
        "$group": {
          "_id": "$_id",
          "powerR": { "$last": "$RightTableData.ENTS_PowerR_Num" },
          "powerY": { "$last": "$RightTableData.ENTS_PowerY_Num" },
          "powerB": { "$last": "$RightTableData.ENTS_PowerB_Num" },
          "energyWhR": { "$last": "$RightTableData.ENTS_EnergyWhR_Num" },
          "energyWhY": { "$last": "$RightTableData.ENTS_EnergyWhY_Num" },
          "energyWhB": { "$last": "$RightTableData.ENTS_EnergyWhB_Num" },
          "pfR": { "$last": "$RightTableData.ENTS_PFR_Num" },
          "pfY": { "$last": "$RightTableData.ENTS_PFY_Num" },
          "pfB": { "$last": "$RightTableData.ENTS_PFB_Num" },
        }
      },
      {
        "$project": {
          "_id": "$_id.ENTS_Fk_EnergyMaster_Id_obj",
          "energy": { "$sum": ["$energyWhR", "$energyWhY", "energyWhB"] },
          "power": { "$sum": ["$powerR", "$powerY", "$powerB"] },
          "PF": { "$sum": ["$pfR", "$pfY", "$pfB"] }
        }
      }

    ])

    let rawPower = await energyMeterMasterModel.aggregate([
      {
        "$match": {
          "EMM_Device_Name_Str": "RAW"
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "EMM_DeviceId_Str",
          "foreignField": "ENTS_IoModuleID_str",
          "as": "RightTableData"
        }
      },
      {
        "$unwind": {
          "path": "$RightTableData"
        }
      },
      {
        "$group": {
          "_id": "$_id",
          "powerR": { "$last": "$RightTableData.ENTS_PowerR_Num" },
          "powerY": { "$last": "$RightTableData.ENTS_PowerY_Num" },
          "powerB": { "$last": "$RightTableData.ENTS_PowerB_Num" },
          "energyWhR": { "$last": "$RightTableData.ENTS_EnergyWhR_Num" },
          "energyWhY": { "$last": "$RightTableData.ENTS_EnergyWhY_Num" },
          "energyWhB": { "$last": "$RightTableData.ENTS_EnergyWhB_Num" },
          "pfR": { "$last": "$RightTableData.ENTS_PFR_Num" },
          "pfY": { "$last": "$RightTableData.ENTS_PFY_Num" },
          "pfB": { "$last": "$RightTableData.ENTS_PFB_Num" },
        }
      },
      {
        "$project": {
          "_id": "$_id.ENTS_Fk_EnergyMaster_Id_obj",
          "energy": { "$sum": ["$energyWhR", "$energyWhY", "energyWhB"] },
          "power": { "$sum": ["$powerR", "$powerY", "$powerB"] },
          "PF": { "$sum": ["$pfR", "$pfY", "$pfB"] }
        }
      }
    ])


    res.status(200).send({
      code: 200,
      message: "success",
      data: { deviceAhuMapDocs, solarPower, rawPower, energyUnitType }
    });
  } catch (error) {
    console.log(error);
  }
}



energyMonitorController.consumptionLastMonth = async (req, res) => {
  try {

    let presentStartDate, presentEndDate, pastStartDate, pastEndDate;
    var pastDateRange, presentDateRange;

    presentStartDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    presentEndDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    presentDateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

    let energyUnitType = await energyMeterUnitMaster.find({ "EMU_BuildingId": ObjectID(req.body.buildingId) }).sort({ "EMU_Created_Date": -1 }).limit(1);

    console.log(energyUnitType);

    if (energyUnitType[0].EMU_EnergyForecast == 24) {
      pastStartDate = moment().format('YYYY-MM-DD HH:mm:ss');
      pastEndDate = moment().subtract(24, 'h').format('YYYY-MM-DD HH:mm:ss');
      pastDateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(pastEndDate), "$lte": new Date(pastStartDate) } };
      console.log(pastEndDate, pastStartDate);
      console.log(pastDateRange);

    } else if (energyUnitType[0].EMU_EnergyForecast == 7) {
      pastStartDate = moment().format('YYYY-MM-DD HH:mm:ss');
      pastEndDate = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
      pastDateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(pastEndDate), "$lte": new Date(pastStartDate) } };
    } else {
      pastStartDate = moment().format('YYYY-MM-DD HH:mm:ss');
      pastEndDate = moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss');
      pastDateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(pastEndDate), "$lte": new Date(pastStartDate) } };
      console.log(pastEndDate, pastStartDate);
      console.log(pastDateRange);
    }

    let consumptionPastMonthDocs = await energyMeterMasterModel.aggregate([
      {
        "$match": {
          "$and": [{ "EMM_Fk_BM_BuildingID_Obj": ObjectID(req.body.buildingId) }, { "EMM_Is_Deleted_bool": false }, { "EMM_Device_Name_Str": "RAW" }]
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "_id",
          "foreignField": "ENTS_Fk_EnergyMaster_Id_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$match": pastDateRange
      },
      {
        "$group": {
          "_id": {
            "ENTS_Fk_EnergyMaster_Id_obj": "$RightTableData.ENTS_Fk_EnergyMaster_Id_obj"
          },
          "totalEnergyFirst": { "$first": "$RightTableData.ENTS_EnergyWhT_Num" },
          "totalEnergyLast": { "$last": "$RightTableData.ENTS_EnergyWhT_Num" }
        }
      }
    ]);

    let consumptionPresentMonthDocs = await energyMeterMasterModel.aggregate([
      {
        "$match": {
          "$and": [{ "EMM_Fk_BM_BuildingID_Obj": ObjectID(req.body.buildingId) }, { "EMM_Is_Deleted_bool": false }, { "EMM_Device_Name_Str": "RAW" }]
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "_id",
          "foreignField": "ENTS_Fk_EnergyMaster_Id_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$match": presentDateRange
      },
      {
        "$group": {
          "_id": {
            "ENTS_Fk_EnergyMaster_Id_obj": "$RightTableData.ENTS_Fk_EnergyMaster_Id_obj"
          },
          "totalEnergyFirst": { "$first": "$RightTableData.ENTS_EnergyWhT_Num" },
          "totalEnergyLast": { "$last": "$RightTableData.ENTS_EnergyWhT_Num" }
        }
      }
    ]);

    let building = await buildingMaster.findById({ "_id": ObjectID(req.body.buildingId) })

    let buildingPrice = building.BM_ElectricityUnitPrice_Str == null ? 0 : building.BM_ElectricityUnitPrice_Str;

    consumptionPastMonthDocs.forEach(data => {
      data.energyPrice = Number(buildingPrice * (data.totalEnergyLast - data.totalEnergyFirst)).toFixed(2)
    });
    consumptionPresentMonthDocs.forEach(data => {
      data.energyPrice = Number(buildingPrice * (data.totalEnergyLast - data.totalEnergyFirst)).toFixed(2)
    });

    res.status(200).send({
      code: 200,
      message: "success",
      data: { consumptionPastMonthDocs, consumptionPresentMonthDocs, energyUnitType }
    });
  } catch (error) {
    console.log(error);
  }
}

energyMonitorController.energyMonitorGraphMulti = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;

    let locationId = req.body.locationId || "5d788965545440369c4964ce";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

      dateGroupString = { "format": "%H", "date": "$ENTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ENTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        dateGroupString = { "format": "%H", "date": "$RightTableData.ENTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ENTS_Created_Date" };
      }
    }
    console.log(dateRange);

    let match = {
      "$match": {
        "$and": [dateRange
        ]
      }
    };
    let group = {
      "$group": {
        "_id": {
          "date": {
            "$dateToString": dateGroupString
          },
          "ENTS_IoModuleID_str": "$RightTableData.ENTS_IoModuleID_str"
        },
        "ENTS_IoModuleID_str": {
          "$last": "$RightTableData.ENTS_IoModuleID_str"
        },
        "ENTS_Created_Date": {
          "$last": "$RightTableData.ENTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };
    let pipeline = [
      {
        "$match": {
          "$and": [{ "EMM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "EMM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "EMM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "EMM_Is_Deleted_bool": false }
          ]
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "_id",
          "foreignField": "ENTS_Fk_EnergyMaster_Id_obj",
          "as": "RightTableData"
        }
      },
      {
        "$unwind": {
          "path": "$RightTableData"
        }
      },
      {
        "$sort": {
          "ENTS_Created_Date": -1.0
        }
      },
      {
        "$project": {
          "deviceName": "$ENTS_IoModuleID_str",
          "createdDate": {
            $dateToString: {
              "format": "%Y-%m-%d",
              "date": "$ENTS_Created_Date"
            }
          },
          "createdTime": { $substr: ["$ENTS_Created_Date", 11, 8] },
          "deviceId": "$rightabledata.EMM_Device_Name_Str",
          "id": "$rightabledata._id",
          "phaseType": "$rightabledata.EMM_PhaseType_int",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$RightTableData.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$RightTableData.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_VoltageR_Num" }] }, 3]
              }
            }
          },
          "Energy": "$rightabledata.RightTableData.ENTS_EnergyWhT_Num",
          "Frequency": "$rightabledata.RightTableData.ENTS_Frequency_Num",
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await energyMeterMasterModel.aggregate(pipeline);
    const outJSON = {};
    if (req.body.sortType == "Today") {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        if ((diLen > 0) || diLen == 0) {
          outJSON[di].push(deviceZoneMapDocs[i]);
        }
      }
    } else {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        outJSON[di].push(deviceZoneMapDocs[i]);
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

energyMonitorController.energyAnalytics = async (req, res) => {
  try {

    let type = req.params.type;
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let energyAnalytics = await energyMeterMasterModel.aggregate([

      {
        "$match": {
          "$and": [{ "EMM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "EMM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "EMM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "EMM_DeviceId_Str": type }
          ]
        }
      },
      {
        $lookup:
        {
          from: "energymetertransactions",
          localField: "_id",
          foreignField: "ENTS_Fk_EnergyMaster_Id_obj",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$EMM_Device_Name_Str",
          "righttabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "deviceId": "$righttabledata.EMM_DeviceId_Str",
          "deviceName": "$righttabledata.EMM_Device_Name_Str",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$righttabledata.EMM_PhaseType_int", "Single Phase"] },
              "then": "$righttabledata.RightTableData.ENTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$righttabledata.ENTS_CurrentB_Num" }, { "$abs": "$righttabledata.ENTS_CurrentY_Num" }, { "$abs": "$righttabledata.ENTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$righttabledata.EMM_PhaseType_int", "Single Phase"] },
              "then": "$righttabledata.RightTableData.ENTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$righttabledata.RightTableData.ENTS_PowerB_Num" }, { "$abs": "$righttabledata.RightTableData.ENTS_PowerY_Num" }, { "$abs": "$righttabledata.RightTableData.ENTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$righttabledata.EMM_PhaseType_int", "Single Phase"] },
              "then": "$righttabledata.RightTableData.ENTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$righttabledata.RightTableData.ENTS_VoltageB_Num" }, { "$abs": "$righttabledata.RightTableData.ENTS_VoltageY_Num" }, { "$abs": "$righttabledata.RightTableData.ENTS_VoltageR_Num" }] }, 3]
              }
            }
          },
          "Energy": "$righttabledata.RightTableData.ENTS_EnergyWhT_Num",
          "createdDate": "$righttabledata.RightTableData.ENTS_Created_Date",
          "Frequency": "$righttabledata.RightTableData.ENTS_Frequency_Num",
          "voltageRup": "$righttabledata.EMM_VoltageRupper_Num",
          "voltageRlow": "$righttabledata.EMM_VoltageRlow_Num",
          "voltageYup": "$righttabledata.EMM_VoltageYupper_Num",
          "voltageYlow": "$righttabledata.EMM_VoltageYlow_Num",
          "voltageBup": "$righttabledata.EMM_VoltageBupper_Num",
          "voltageBlow": "$righttabledata.EMM_VoltageBlow_Num",
          "currentRup": "$righttabledata.EMM_CurrentRupper_Num",
          "currentYup": "$righttabledata.EMM_CurrentYupper_Num",
          "currentBup": "$righttabledata.EMM_CurrentBupper_Num",
          "powerRup": "$righttabledata.EMM_PowerRupper_Num",
          "powerYup": "$righttabledata.EMM_PowerYupper_Num",
          "powerBup": "$righttabledata.EMM_PowerBupper_Num",
          "powerTup": "$righttabledata.EMM_PowerTupper_Num",
          "powerTlow": "$righttabledata.EMM_PowerTlow_Num",
          "energyR": "$righttabledata.EMM_EnergyR_Num",
          "energyY": "$righttabledata.EMM_EnergyY_Num",
          "energyB": "$righttabledata.EMM_EnergyB_Num",
          "energyT": "$righttabledata.EMM_EnergyT_Num",
          "frequencyM": "$righttabledata.EMM_Frequency_Num",
        }
      }

    ])

    res.status(200).send({
      code: 200,
      message: "success",
      data: energyAnalytics
    });


  } catch (error) {
    console.log(error);

  }
}

energyMonitorController.energyMonitorPanel = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let group_id;

    let locationId = req.body.locationId || "5d788965545440369c4964ce";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    let today = false;
    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      group_id = { "$hour": "$ENTS_Created_Date" }
      today = true;
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

      dateGroupString = { "format": "%H", "date": "$ENTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      group_id = { 'ZNTTS_IoModuleID_str': "$ZNTTS_IoModuleID_str", "day": { "$dayOfMonth": "$ENTS_Created_Date" } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      group_id = "$ZNTTS_IoModuleID_str"
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      group_id = "$ZNTTS_IoModuleID_str"
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$ENTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
      }
    }

    let energyTransactionData = await energyTransaction.aggregate([
      {
        "$match": {
          "$and": [
            dateRange, { "ENTS_IoModuleID_str": { "$in": ["PANEL-1", "PANEL-2", "PANEL-3", "PANEL-4"] } }]
        }
      },

      {
        "$group": {
          "_id": "$ENTS_IoModuleID_str",
          "powerR": { "$last": "$ENTS_PowerR_Num" },
          "powerY": { "$last": "$ENTS_PowerY_Num" },
          "powerB": { "$last": "$ENTS_PowerB_Num" },
          "energyWhR": { "$last": "$ENTS_EnergyWhR_Num" },
          "energyWhY": { "$last": "$ENTS_EnergyWhY_Num" },
          "energyWhB": { "$last": "$ENTS_EnergyWhB_Num" },
          "pfR": { "$last": "$ENTS_PFR_Num" },
          "pfY": { "$last": "$ENTS_PFY_Num" },
          "pfB": { "$last": "$ENTS_PFB_Num" },
        }
      },
      {
        "$project": {
          "_id": "$_id",
          "energy": { "$sum": ["$energyWhR", "$energyWhY", "energyWhB"] },
          "power": { "$sum": ["$powerR", "$powerY", "$powerB"] },
          "PF": { "$sum": ["$pfR", "$pfY", "$pfB"] }
        }
      }
    ]);

    let buildingEnergyData = await energyMeterMasterModel.find({
      "EMM_Fk_LM_LocationID_Obj": ObjectID(locationId),
      "EMM_Fk_SM_SiteID_Obj": ObjectID(siteId),
      "EMM_Fk_BM_BuildingID_Obj": ObjectID(buildingId), "EMM_DeviceId_Str": { "$in": ["PANEL-1", "PANEL-2", "PANEL-3", "PANEL-4"] }
    }).select('_id EMM_DeviceId_Str EMM_Fk_BM_BuildingID_Obj').populate('EMM_Fk_BM_BuildingID_Obj');


    buildingEnergyData.forEach(outerData => {
      let index = _.findIndex(energyTransactionData, function (innerData) {
        return String(innerData._id) === String(outerData.EMM_DeviceId_Str);
      })

      if (index != -1) {
        energyTransactionData[index].cost = energyTransactionData[index].energy * Number(buildingEnergyData[index].EMM_Fk_BM_BuildingID_Obj.BM_ElectricityUnitPrice_Str)
      }
    })

    res.status(200).send({
      code: 200,
      msg: "success",
      data: energyTransactionData
    })

  } catch (error) {
    console.log(error);
  }
}

energyMonitorController.energyAnalyticsGraph = async (req, res) => {
  try {

    let dateRange;
    let locationId = req.body.locationId || "5d78897c545440369c4964cf";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

    let panelData = await panelMaster.find({ "PANLM_IsActive_bool": true }).select("PANLM_Name_str")

    let match = {
      "$match": {
        "$and": [dateRange, {
          "RightTableData.ENTS_IoModuleID_str": {
            $in: panelData.map(data => {
              return data.PANLM_Name_str
            })
          }
        },
        ]
      }
    };
    let group = {
      "$group": {
        "_id": {
          "ENTS_IoModuleID_str": "$RightTableData.ENTS_IoModuleID_str"
        },
        "ENTS_IoModuleID_str": {
          "$last": "$RightTableData.ENTS_IoModuleID_str"
        },
        "ENTS_Created_Date": {
          "$last": "$RightTableData.ENTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };
    let pipeline = [
      {
        "$match": {
          "$and": [{ "EMM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "EMM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "EMM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "EMM_Is_Deleted_bool": false }
          ]
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "_id",
          "foreignField": "ENTS_Fk_EnergyMaster_Id_obj",
          "as": "RightTableData"
        }
      },
      {
        "$unwind": {
          "path": "$RightTableData"
        }
      },
      {
        "$sort": {
          "ENTS_Created_Date": -1.0
        }
      },
      {
        "$project": {
          "deviceName": "$ENTS_IoModuleID_str",
          "createdDate": {
            $dateToString: {
              "format": "%Y-%m-%d",
              "date": "$ENTS_Created_Date"
            }
          },
          "createdTime": { $substr: ["$ENTS_Created_Date", 11, 8] },
          "deviceId": "$rightabledata.EMM_Device_Name_Str",
          "id": "$rightabledata._id",
          "phaseType": "$rightabledata.EMM_PhaseType_int",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$RightTableData.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$RightTableData.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_VoltageR_Num" }] }, 3]
              }
            }
          },
          "Energy": "$rightabledata.RightTableData.ENTS_EnergyWhT_Num",
          "Frequency": "$rightabledata.RightTableData.ENTS_Frequency_Num",
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await energyMeterMasterModel.aggregate(pipeline);

    const outJSON = {};
    if (req.body.sortType == "Today") {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['id'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        if ((diLen > 0) || diLen == 0) {
          outJSON[di].push(deviceZoneMapDocs[i]);
        }
      }
    } else {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['id'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }

        outJSON[di].push(deviceZoneMapDocs[i]);
      }
    }

    res.status(200).send({
      code: 200,
      message: "success",
      data: deviceZoneMapDocs
    });
  } catch (error) {
    console.log(error);
  }
}

energyMonitorController.energyConsumptionList = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let group_id;
    let type = req.body.type;

    let today = false;
    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      group_id = { "$hour": "$ENTS_Created_Date" }
      today = true;
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

      dateGroupString = { "format": "%H", "date": "$ENTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      group_id = { 'ZNTTS_IoModuleID_str': "$ZNTTS_IoModuleID_str", "day": { "$dayOfMonth": "$ENTS_Created_Date" } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      group_id = "$ZNTTS_IoModuleID_str"
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      group_id = "$ZNTTS_IoModuleID_str"
      dateRange = { "ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$ENTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
      }
    }



    let deviceEnergyMapDocs = await energyTransaction.aggregate([{

      "$match": {
        "$and": [
          {
            "ENTS_IoModuleID_str": type
          }, dateRange
        ]
      }
    },
    {
      "$group": {
        "_id": {
          "ENTS_IoModuleID_str": "$ENTS_IoModuleID_str"
        },
        "totalPower": { "$last": "$ENTS_PowerT_Num" },
        "totalEnergy": { "$last": "$ENTS_EnergyWhT_Num" },
      }
    }]);

    let building = await buildingMaster.findById({ "_id": ObjectID(req.body.buildingId) })

    deviceEnergyMapDocs[0].energyPrice = building.BM_ElectricityUnitPrice_Str * deviceEnergyMapDocs[0].totalEnergy;

    res.status(200).send({
      code: 200,
      message: "success",
      data: deviceEnergyMapDocs
    });


  } catch (error) {
    console.log(error);
  }
}


energyMonitorController.panelGraph = async (req, res) => {
  try {

    let dateRange, startDate, endDate, dateGroupString;
    let locationId = req.body.locationId || "5d78897c545440369c4964cf";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";
    let type = req.body.type;

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

      dateGroupString = { "format": "%H", "date": "$ENTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateGroupString = { "format": "%Y-%m-%d", "date": "$ENTS_Created_Date" };
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ENTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.ENTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        dateGroupString = { "format": "%H", "date": "$RightTableData.ENTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ENTS_Created_Date" };
      }
    }

    let match = {
      "$match": {
        "$and": [dateRange, {
          "RightTableData.ENTS_IoModuleID_str": type
        },
        ]
      }
    };
    let group = {
      "$group": {
        "_id": {
          "date": {
            "$dateToString": { "format": "%Y-%m-%d", "date": "$RightTableData.ENTS_Created_Date" }
          },
          "ENTS_IoModuleID_str": "$RightTableData.ENTS_IoModuleID_str"
        },
        "ENTS_IoModuleID_str": {
          "$last": "$RightTableData.ENTS_IoModuleID_str"
        },
        "ENTS_Created_Date": {
          "$last": "$RightTableData.ENTS_Created_Date"
        },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };
    let pipeline = [
      {
        "$match": {
          "$and": [{ "EMM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "EMM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "EMM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "EMM_Is_Deleted_bool": false }
          ]
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "_id",
          "foreignField": "ENTS_Fk_EnergyMaster_Id_obj",
          "as": "RightTableData"
        }
      },
      {
        "$unwind": {
          "path": "$RightTableData"
        }
      },
      {
        "$sort": {
          "ENTS_Created_Date": -1.0
        }
      },
      {
        "$project": {
          "deviceName": "$ENTS_IoModuleID_str",
          "createdDate": {
            $dateToString: {
              "format": "%Y-%m-%d",
              "date": "$ENTS_Created_Date"
            }
          },
          "createdTime": { $substr: ["$ENTS_Created_Date", 11, 8] },
          "deviceId": "$rightabledata.EMM_Device_Name_Str",
          "id": "$rightabledata._id",
          "phaseType": "$rightabledata.EMM_PhaseType_int",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$rightabledata.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_CurrentB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_CurrentY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$RightTableData.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_PowerB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_PowerY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$RightTableData.EMM_PhaseType_int", "Single Phase"] },
              "then": "$rightabledata.RightTableData.ENTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$rightabledata.RightTableData.ENTS_VoltageB_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_VoltageY_Num" }, { "$abs": "$rightabledata.RightTableData.ENTS_VoltageR_Num" }] }, 3]
              }
            }
          },
          "Energy": "$rightabledata.RightTableData.ENTS_EnergyWhT_Num",
          "Frequency": "$rightabledata.RightTableData.ENTS_Frequency_Num",
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await energyMeterMasterModel.aggregate(pipeline);

    const outJSON = {};
    if (req.body.sortType == "Today") {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['id'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        if ((diLen > 0) || diLen == 0) {
          outJSON[di].push(deviceZoneMapDocs[i]);
        }
      }
    } else {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['id'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }

        outJSON[di].push(deviceZoneMapDocs[i]);
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


energyMonitorController.sensorHealth = async (req, res) => {
  try {

    let panelData = await panelMaster.find({ "PANLM_IsActive_bool": true }).select("PANLM_Name_str")

    let panelSensor = await panelMaster.aggregate([
      {
        "$lookup": {
          from: "devicesensors",
          localField: "_id",
          foreignField: "DSCNF_FK_Device_Id_Obj",
          as: "sensorData"
        }
      },
      { "$unwind": "$sensorData" },
      {
        "$match":
        {
          'sensorData.DSCNF_IsActive_bool': { $eq: true }
        }
      },
      {
        $project: {
          deviceName: "$PANLM_Name_str",
          createdDate: "$PANLM_Created_Date",
          createdTime: { $substr: ["$PANLM_Created_Date", 11, 8] },
          sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
        }
      }
    ])

    let energySensor = await energyMeterMasterModel.aggregate([

      {
        "$match": {
          "$and": [{
            "EMM_DeviceId_Str": {
              $in: panelData.map(data => {
                return data.PANLM_Name_str
              })
            }
          },
          ]
        }
      },
      {
        "$lookup": {
          from: "energymetertransactions",
          localField: "_id",
          foreignField: "ENTS_Fk_EnergyMaster_Id_obj",
          as: "rightTableData"
        }
      },
      { "$unwind": "$rightTableData" },
      {
        "$group": {
          "_id": "$_id",
          "lastRecord": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "deviceId": "$lastRecord.EMM_DeviceId_Str",
          "deviceName": "$lastRecord.EMM_Device_Name_Str",
          "createdDateM": "$lastRecord.EMM_Created_Date",
          "deviceNameT": "$lastRecord.rightTableData.ENTS_IoModuleID_str",
          "createdDateT": "$lastRecord.rightTableData.ENTS_Created_Date"
        }
      }
    ])

    let testData = _.groupBy(energySensor, 'deviceId');

    panelSensor.forEach(element => {
      element.energyData = testData[element.deviceName];
    });


    res.status(200).send({
      code: 200,
      message: "success",
      // data: { testData, panelSensor }
      data: panelSensor
    });

  } catch (error) {
    console.log(error);
  }
}

export default energyMonitorController;