import ahuMaster from "../../../hvac_masters/ahu/ahuModel";
import compressorMaster from "../../../hvac_masters/compressor/compressorModel";
import fanMaster from "../../../hvac_masters/fan/fanModel";
import zoneTemperatureMaster from "../../../hvac_masters/zoneTemprature/zoneTempratureModel";
import pumpMaster from "../../../hvac_masters/pump/pumpModel";
import solenoidValveMaster from "../../../hvac_masters/solenoidValve/solenoidValveModel";
import waterTankMaster from "../../../hvac_masters/waterTank/waterTankModel";
import chillerMaster from "../../../hvac_masters/chiller/chillerModel";
var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;
let issueTrendingController = {};

issueTrendingController.issueTrending = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let sortBy = req.query.sortBy;

    let locationId = req.body.locationId || "5d788965545440369c4964ce";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    let ahu_issue = 0,
      ahu_resolved = 0,
      compressor_issue = 0,
      compressor_resolved = 0,
      fan_issue = 0,
      fan_resolved = 0,
      zoneTemperature_issue = 0,
      zoneTemperature_resolved = 0,
      pump_issue = 0,
      pump_resolved = 0,
      solenoidValve_issue = 0,
      solenoidValve_resolved = 0,
      waterTank_issue = 0,
      waterTank_resolved = 0,
      chiller_issue = 0,
      chiller_resolved = 0;

    if (sortBy == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.Issues_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
    } else if (sortBy == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.Issues_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
    } else if (sortBy == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.Issues_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.Issues_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } };
    }

    let pipeline = [
      {
        "$match": {
          "$and": [{ "COMPM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "COMPM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "COMPM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
        }
      },
      {
        $lookup:
        {
          from: "autoissues",
          localField: "COMPM_DeviceId_Num",
          foreignField: "Issues_Device_ID_Str",
          as: "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$match": dateRange },
    ]

    let deviceCompressorMapDocs = await compressorMaster.aggregate(pipeline);

    deviceCompressorMapDocs.map(data => {
      if (data.RightTableData.Issues_Status_Str == 1) {
        compressor_issue += 1
      }
      if (data.RightTableData.Issues_Status_Str == 2) {
        compressor_resolved += 1
      }
    })

    let ahuData = await ahu(dateRange, locationId, siteId, buildingId, ahu_issue, ahu_resolved);
    let fanData = await fan(dateRange, locationId, siteId, buildingId, fan_issue, fan_resolved);
    let zoneTemperatureData = await zoneTemperature(dateRange, locationId, siteId, buildingId, zoneTemperature_issue, zoneTemperature_resolved);
    let pumpData = await pump(dateRange, locationId, siteId, buildingId, pump_issue, pump_resolved);
    let solenoidValveData = await solenoidValve(dateRange, locationId, siteId, buildingId, solenoidValve_issue, solenoidValve_resolved);
    let waterTankData = await waterTank(dateRange, locationId, siteId, buildingId, waterTank_issue, waterTank_resolved)
    let chillerData = await chiller(dateRange, locationId, siteId, buildingId, chiller_issue, chiller_resolved);
    let issueTrending = {
      ahuIssue: ahuData.ahu_issue ? ahuData.ahu_issue : ahu_issue,
      ahuResolved: ahuData.ahu_resolved ? ahuData.ahu_resolved : ahu_resolved,
      compressorIssue: compressor_issue,
      compressorResolved: compressor_resolved,
      fanIssue: fanData.fan_issue ? fanData.fan_issue : fan_issue,
      fanResolved: fanData.fan_resolved ? fanData.fan_resolved : fan_resolved,
      zoneTemperatureIssue: zoneTemperatureData.zoneTemperature_issue ? zoneTemperatureData.zoneTemperature_issue : zoneTemperature_issue,
      zoneTemperatureResolved: zoneTemperatureData.zoneTemperature_resolved ? zoneTemperatureData.zoneTemperature_resolved : zoneTemperature_resolved,
      pumpIssue: pumpData.pump_issue ? pumpData.pump_issue : pump_issue,
      pumpResolved: pumpData.pump_resolved ? pumpData.pump_resolved : pump_resolved,
      solenoidValveIssue: solenoidValveData.solenoidValve_issue ? solenoidValveData.solenoidValve_issue : solenoidValve_issue,
      solenoidValveResolved: solenoidValveData.solenoidValve_resolved ? solenoidValveData.solenoidValve_resolved : solenoidValve_resolved,
      waterTankIssue: waterTankData.waterTank_issue ? waterTankData.waterTank_issue : waterTank_issue,
      waterTankResolved: waterTankData.waterTank_resolved ? waterTankData.waterTank_resolved : waterTank_resolved,
      chillerIssue: chillerData.chiller_issue ? chillerData.chiller_issue : chiller_issue,
      chillerResolved: chillerData.chiller_resolved ? chillerData.chiller_resolved : chiller_resolved
    }

    res.status(200).send({
      code: 200,
      message: "success",
      data: issueTrending
    });
  } catch (error) {
    console.log(error);
  }
}


async function ahu(dateRange, locationId, siteId, buildingId, ahu_issue, ahu_resolved) {
  let pipeline = [
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
        from: "autoissues",
        localField: "AHUM_DeviceId_Num",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange },
  ]

  let deviceFanMapDocs = await ahuMaster.aggregate(pipeline);

  deviceFanMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      ahu_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      ahu_resolved += 1
    }
  })
  return { ahu_issue, ahu_resolved };

}


async function fan(dateRange, locationId, siteId, buildingId, fan_issue, fan_resolved) {
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
        from: "autoissues",
        localField: "FANM_DeviceId_Str",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange },
  ]

  let deviceFanMapDocs = await fanMaster.aggregate(pipeline);

  deviceFanMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      fan_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      fan_resolved += 1
    }
  })
  return { fan_issue, fan_resolved };

}

async function zoneTemperature(dateRange, locationId, siteId, buildingId, zoneTemperature_issue, zoneTemperature_resolved) {
  let pipeline = [
    {
      "$match": {
        "$and": [{ "ZNTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
        { "ZNTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
        { "ZNTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
      }
    },
    {
      $lookup:
      {
        from: "autoissues",
        localField: "ZNTM_DeviceId_Str",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange },
  ]

  let devicezoneTemperatureMapDocs = await zoneTemperatureMaster.aggregate(pipeline);

  devicezoneTemperatureMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      zoneTemperature_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      zoneTemperature_resolved += 1
    }
  })
  return { zoneTemperature_issue, zoneTemperature_resolved };

}

async function pump(dateRange, locationId, siteId, buildingId, pump_issue, pump_resolved) {
  let pipeline = [
    {
      "$match": {
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
        from: "autoissues",
        localField: "PUMPM_DeviceId_Num",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange }
  ]

  let devicepumpMapDocs = await pumpMaster.aggregate(pipeline);

  devicepumpMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      pump_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      pump_resolved += 1
    }
  })
  return { pump_issue, pump_resolved };
}

async function solenoidValve(dateRange, locationId, siteId, buildingId, solenoidValve_issue, solenoidValve_resolved) {
  let pipeline = [
    {
      "$match": {
        "$and": [
          { "SOVM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "SOVM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "SOVM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
        ]
      }
    },
    {
      $lookup:
      {
        from: "autoissues",
        localField: "SOVM_DeviceId_Num",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange }
  ]

  let devicesolenoidValveMapDocs = await solenoidValveMaster.aggregate(pipeline);

  devicesolenoidValveMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      solenoidValve_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      solenoidValve_resolved += 1
    }
  })
  return { solenoidValve_issue, solenoidValve_resolved };
}

async function waterTank(dateRange, locationId, siteId, buildingId, waterTank_issue, waterTank_resolved) {
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
        from: "autoissues",
        localField: "WTKM_DeviceId_Num",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange }
  ]

  let devicesolenoidValveMapDocs = await waterTankMaster.aggregate(pipeline);

  devicesolenoidValveMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      waterTank_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      waterTank_resolved += 1
    }
  })
  return { waterTank_issue, waterTank_resolved };
}


async function chiller(dateRange, locationId, siteId, buildingId, chiller_issue, chiller_resolved) {
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
        from: "autoissues",
        localField: "CHLRM_DeviceId_Num",
        foreignField: "Issues_Device_ID_Str",
        as: "RightTableData"
      }
    },
    { "$unwind": "$RightTableData" },
    { "$match": dateRange }
  ]

  let devicechillerMapDocs = await chillerMaster.aggregate(pipeline);

  devicechillerMapDocs.map(data => {
    if (data.RightTableData.Issues_Status_Str == 1) {
      chiller_issue += 1
    }
    if (data.RightTableData.Issues_Status_Str == 2) {
      chiller_resolved += 1
    }
  })
  return { chiller_issue, chiller_resolved };
}


export default issueTrendingController;