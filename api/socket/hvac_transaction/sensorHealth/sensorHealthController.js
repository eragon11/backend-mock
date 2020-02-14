
import ahuMaster from "../../../hvac_masters/ahu/ahuModel";
import ahuTransaction from "../../../hvac_transaction/ahu/ahuModel";
import ahuRelayTransaction from "../../../hvac_relay_transaction/ahu/ahuModel";

import compressorMaster from "../../../hvac_masters/compressor/compressorModel";
import compressorTransaction from "../../../hvac_transaction/compressor/compressorModel";
import compressorRelayTransaction from "../../../hvac_relay_transaction/compressor/compressorModel";

import zoneTemperatureMaster from "../../../hvac_masters/zoneTemprature/zoneTempratureModel";
import zoneTemperatureTransaction from "../../../hvac_transaction/zoneTemprature/zoneTempratureModel";

import fanMaster from "../../../hvac_masters/fan/fanModel";
import fanTransaction from "../../../hvac_transaction/fan/fanModel";
import fanRelayTransaction from "../../../hvac_relay_transaction/fan/fanModel";

import pumpMaster from "../../../hvac_masters/pump/pumpModel";
import pumpTransaction from "../../../hvac_transaction/pump/pumpModel";
import pumpRelayTransaction from "../../../hvac_relay_transaction/pump/pumpModel";

import chillerMaster from "../../../hvac_masters/chiller/chillerModel";
import chillerTransaction from "../../../hvac_transaction/chiller/chillerModel";
import chillerRelayTransaction from "../../../hvac_relay_transaction/chiller/chillerModel";

import solenoidValveMaster from "../../../hvac_masters/solenoidValve/solenoidValveModel";
import solenoidValveTransaction from "../../../hvac_transaction/solenoidValve/solenoidValveModel";
import solenoidValveRelayTransaction from "../../../hvac_relay_transaction/solenoidValve/solenoidValveModel";

import waterTankMaster from "../../../hvac_masters/waterTank/waterTankModel";
import waterTankTransaction from "../../../hvac_transaction/waterTank/waterTankModel";

import * as _ from 'lodash';
var moment = require('moment');

let sensorHealthController = {};

sensorHealthController.sensorHealthAhu = async (req, res) => {
  try {
    let count = 0;
    var currentTime = moment();
    let ahuDocs1 = await ahuMaster.aggregate(
      [
        {
          "$lookup": {
            from: "devicesensors",
            localField: "_id",
            foreignField: "DSCNF_FK_Device_Id_Obj",
            as: "sensorData"
          }
        },
        { "$unwind": "$sensorData" },
        { "$match": { "sensorData.DSCNF_IsActive_bool": { $eq: true } } },
        {
          $project: {
            id: "$_id",
            createdDate: "$AHUM_Created_Date",
            createdTime: { $substr: ["$AHUM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);

    let ahuDocs2 = await ahuTransaction.aggregate([
      {
        "$group": {
          "_id": "$AHUTS_FK_AHUDeviceId_obj",
          "last_record": { "$last": "$$ROOT" }
        }
      },
    ]);

    ahuDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(ahuDocs1, function (doc) {
        const lastDataHour = moment(data.last_record.AHUTS_Created_Date);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          count += 1
          if (data.last_record.AHUTS_RelayStatus_R_Bool) {
            count += 1
          }
          if (data.last_record.AHUTS_RelayStatus_B_Bool) {
            count += 1
          }
          if (data.last_record.AHUTS_RelayStatus_Y_Bool) {
            count += 1
          }
        }
      }
    })
    // let ahuDocs3 = await ahuRelayTransaction.aggregate([
    //   {
    //     "$group": {
    //       "_id": "$AHUTS_FK_AHUDeviceId_obj",
    //       "last_record": { "$last": "$$ROOT" }
    //     }
    //   },
    // ])

    // ahuDocs3.forEach(function (data, index) {
    //   let sensor_t;
    //   var index = _.findIndex(ahuDocs1, function (doc) {
    //     const lastDataHour = moment(data.last_record.createdDate);
    //     var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

    //     if (timeDiff < 2) {
    //       sensor_t = true;
    //     } else {
    //       sensor_t = false;
    //     }

    //     return String(data._id) === String(doc._id);
    //   });
    //   if (index !== -1) {
    //     if (sensor_t) {
    //       if (data.last_record.AHUTS_RelayStatus_R_Bool) {
    //         count += 1
    //       }
    //       if (data.last_record.AHUTS_RelayStatus_B_Bool) {
    //         count += 1
    //       }
    //       if (data.last_record.AHUTS_RelayStatus_Y_Bool) {
    //         count += 1
    //       }
    //     }
    //   }
    // })

    const reducer = (acc, cur) => { return acc + cur }

    let finalSensorData = [];
    finalSensorData.push({
      ahuTotalCount: ahuDocs1.length > 0 ? ahuDocs1.map(data => data.sensorData).reduce(reducer) : 0, ahuActivecount: count
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthCompressor = async (req, res) => {
  try {
    let compressorCount = 0;
    var currentTime = moment();
    let compressorDocs1 = await compressorMaster.aggregate(
      [
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
          $project: {
            id: "$_id",
            createdDate: "$COMPM_Created_Date",
            createdTime: { $substr: ["$COMPM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);

    let compressorDocs2 = await compressorTransaction.aggregate([
      {
        "$group": {
          "_id": "$COMPTS_Fk_COMPDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" }
        }
      }
    ]);

    compressorDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(compressorDocs1, function (doc) {
        const lastDataHour = moment(data.lastRecord.COMPTS_Created_date);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));
        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });
      if (index !== -1) {
        if (sensor_t) {
          compressorCount += 1
          if (compressorDocs2[index].lastRecord.COMPTS_RPM_Num >= 0) {
            compressorCount += 1
          }
        }
      }
    })

    let compressorDocs3 = await compressorRelayTransaction.aggregate([
      {
        "$group": {
          "_id": "$COMPTS_FK_COMPDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" }
        }
      }
    ])

    compressorDocs3.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(compressorDocs1, function (doc) {
        const lastDataHour = moment(data.lastRecord.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (compressorDocs3[index].lastRecord.COMPTS_RelayStatus_R_Bool) {
            compressorCount += 1
          }
          if (compressorDocs3[index].lastRecord.COMPTS_RelayStatus_B_Bool) {
            compressorCount += 1
          }
          if (compressorDocs3[index].lastRecord.COMPTS_RelayStatus_Y_Bool) {
            compressorCount += 1
          }
        }
      }
    })

    let finalSensorData = [];
    finalSensorData.push({
      compressorTotalCount: compressorDocs1.length > 0 ? compressorDocs1[0].sensorData : 0, compressorActivecount: compressorCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthFan = async (req, res) => {
  try {
    let fanCount = 0;
    var currentTime = moment();
    let fanDocs1 = await fanMaster.aggregate(
      [
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
          $project: {
            id: "$_id",
            createdDate: "$FANM_Created_Date",
            createdTime: { $substr: ["$FANM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);


    let fanDocs2 = await fanTransaction.aggregate([
      {
        "$group": {
          "_id": "$FANTS_Fk_FANDeviceId_object",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
      {
        "$project": {
          "createdDate": "$lastRecord.FANTS_Created_date"
        }
      }
    ]);

    fanDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(fanDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t)
          fanCount += 1
      }
    })

    let fanDocs3 = await fanRelayTransaction.aggregate([
      {
        "$group": {
          "_id": "$FANTS_Fk_FANDeviceId_object",
          "lastRecord": { "$last": "$$ROOT" },
        }
      }
    ])

    fanDocs3.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(fanDocs1, function (doc) {
        const lastDataHour = moment(data.lastRecord.FANTS_Created_date);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (fanDocs3[0].lastRecord.FANTS_RelayStatus_Bool) {
            fanCount += 1
          }
        }
      }
    })

    let finalSensorData = [];
    finalSensorData.push({
      fanTotalCount: fanDocs1.length > 0 ? fanDocs1[0].sensorData : 0, fanActivecount: fanCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthZoneTemperature = async (req, res) => {
  try {
    let zonetemperatureCount = 0;
    var currentTime = moment();
    let zonetemperatureDocs1 = await zoneTemperatureMaster.aggregate(
      [
        {
          "$lookup": {
            from: "devicesensors",
            localField: "_id",
            foreignField: "DSCNF_FK_Device_Id_Obj",
            as: "sensorData"
          }
        },
        { "$unwind": "$sensorData" },
        { "$match": { "sensorData.DSCNF_IsActive_bool": { $eq: true } } },
        {
          $project: {
            id: "$_id",
            createdDate: "$ZNTM_Created_Date",
            createdTime: { $substr: ["$ZNTM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);


    let zonetemperatureDocs2 = await zoneTemperatureTransaction.aggregate([
      {
        "$group": {
          "_id": "$ZNTTS_Fk_ZoneDeviceId_Obj",
          "lastRecord": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "createdDate": "$lastRecord.ZNTTS_Created_date",
          "temperature": "$lastRecord.ZNTTS_Temperature_Num",
          "humidity": "$lastRecord.ZNTTS_Humidity_Num"
        }
      }
    ]);

    zonetemperatureDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(zonetemperatureDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (data.temperature >= 0)
            zonetemperatureCount += 1
          if (data.humidity >= 0)
            zonetemperatureCount += 1
        }
      }
    })
    const reducer = (acc, cur) => { return acc + cur }

    let finalSensorData = [];
    finalSensorData.push({
      zoneTemperatureTotalCount: zonetemperatureDocs1.length > 0 ? zonetemperatureDocs1.map(data => data.sensorData).reduce(reducer) : 0, zoneTemperatureActivecount: zonetemperatureCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthPump = async (req, res) => {
  try {
    let pumpCount = 0;
    var currentTime = moment();
    let pumpDocs1 = await pumpMaster.aggregate(
      [
        {
          "$lookup": {
            from: "devicesensors",
            localField: "_id",
            foreignField: "DSCNF_FK_Device_Id_Obj",
            as: "sensorData"
          }
        },
        { "$unwind": "$sensorData" },
        { "$match": { "sensorData.DSCNF_IsActive_bool": { $eq: true } } },
        {
          $project: {
            id: "$_id",
            createdDate: "$PUMPM_Created_Date",
            createdTime: { $substr: ["$PUMPM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);

    let pumpDocs2 = await pumpTransaction.aggregate([
      {
        "$group": {
          "_id": "$PUMPTS_Fk_PUMPDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
      {
        "$project": {
          "createdDate": "$lastRecord.PUMPTS_Created_Date",
          "rpm": "$lastRecord.PUMPTS_RPM_Num"
        }
      }
    ]);


    pumpDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(pumpDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          pumpCount += 1
        }
      }
    })

    let pumpDocs3 = await pumpRelayTransaction.aggregate([
      {
        "$group": {
          "_id": "$PUMPTS_Fk_PUMPDeviceId_object",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
    ])

    pumpDocs3.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(pumpDocs1, function (doc) {
        const lastDataHour = moment(data.lastRecord.PUMPTS_Created_date);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          pumpCount += 1
        }
      }
    })

    let finalSensorData = [];
    finalSensorData.push({
      pumpTotalCount: pumpDocs1.length > 0 ? pumpDocs1[0].sensorData : 0, pumpActivecount: pumpCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });

  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthChiller = async (req, res) => {
  try {
    let chillerCount = 0;
    var currentTime = moment();
    let chillerDocs1 = await chillerMaster.aggregate(
      [
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
            deviceName: "$CHLRM_Device_Name_Str",
            createdDate: "$CHLRM_Created_Date",
            createdTime: { $substr: ["$CHLRM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);

    let chillerDocs2 = await chillerTransaction.aggregate([
      {
        "$group": {
          "_id": "$CHLRTS_FK_CHILLERDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
      {
        "$project": {
          "createdDate": "$lastRecord.CHLRTS_Created_Date",
          "Rpm": "$lastRecord.CHLRTS_RPM_Num",
          "waterFlowRate": "$lastRecord.CHLRTS_WaterFlowRate_Num",
          "inlet": "$lastRecord.CHLRTS_InletTemprature_Num",
          "outlet": "$lastRecord.CHLRTS_OutletTemprature_Num"
        }
      }
    ]);

    chillerDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(chillerDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          chillerCount += 1
          if (data.inlet >= 0) {
            chillerCount += 1
          }
          if (data.outlet >= 0) {
            chillerCount += 1
          }
          if (data.Rpm >= 0) {
            chillerCount += 1
          }
        }
      }
    })

    let chillerDocs3 = await chillerRelayTransaction.aggregate([
      {
        "$group": {
          "_id": "$CHLRTS_FK_CHILLERDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
      {
        "$project": {
          "relayR": "$lastRecord.CHLRTS_RelayStatus_R_Bool",
          "relayY": "$lastRecord.CHLRTS_RelayStatus_Y_Bool",
          "relayB": "$lastRecord.CHLRTS_RelayStatus_B_Bool"
        }
      }
    ])

    chillerDocs3.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(chillerDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (data.relayR) {
            chillerCount += 1
          }
          if (data.relayB) {
            chillerCount += 1
          }
          if (data.relayY) {
            chillerCount += 1
          }
        }
      }
    })

    let finalSensorData = [];
    finalSensorData.push({
      chillerTotalCount: chillerDocs1.length > 0 ? chillerDocs1[0].sensorData : 0, chillerActivecount: chillerCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthSolenoidValve = async (req, res) => {
  try {
    let solenoidValveCount = 0;
    var currentTime = moment();
    //solenoidValve
    let solenoidValveDocs1 = await solenoidValveMaster.aggregate(
      [
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
            deviceName: "$SOVM_Device_Name_Str",
            createdDate: "$SOVM_Created_Date",
            createdTime: { $substr: ["$SOVM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);

    let solenoidValveDocs2 = await solenoidValveTransaction.aggregate([
      {
        "$group": {
          "_id": "$SOVTS_Fk_SOVDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" },
        }
      }
    ]);

    solenoidValveDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(solenoidValveDocs1, function (doc) {
        const lastDataHour = moment(data.lastRecord.SOVTS_Created_Date);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (data.lastRecord.SOVTS_WaterFlowRate_Num >= 0) {
            solenoidValveCount += 1
          }
        }
      }
    })

    let solenoidValveDocs3 = await solenoidValveRelayTransaction.aggregate([
      {
        "$group": {
          "_id": "$SOVTS_Fk_SOVDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
      {
        "$project": {
          "relayR": "$lastRecord.SOVTS_RelayStatus_Bool",
          "createDate": "$lastRecord.SOVTS_Created_Date"
        }
      }
    ])

    solenoidValveDocs3.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(solenoidValveDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (data.relayR) {
            solenoidValveCount += 1
          }
        }
      }
    })

    let finalSensorData = [];
    finalSensorData.push({
      solenoidValveTotalCount: solenoidValveDocs1.length > 0 ? solenoidValveDocs1[0].sensorData : 0, solenoidValveActivecount: solenoidValveCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthWaterTank = async (req, res) => {
  try {
    let waterTankCount = 0;
    var currentTime = moment();
    //waterTank
    let waterTankDocs1 = await waterTankMaster.aggregate(
      [
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
            deviceName: "$WTKM_Device_Name_Str",
            createdDate: "$WTKM_Created_Date",
            createdTime: { $substr: ["$WTKM_Created_Date", 11, 8] },
            sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
          }
        }
      ]);

    let waterTankDocs2 = await waterTankTransaction.aggregate([
      {
        "$group": {
          "_id": "$WTKTS_Fk_WaterTankDeviceId_obj",
          "lastRecord": { "$last": "$$ROOT" },
        }
      },
      {
        "$project": {
          "createdDate": "$lastRecord.WTKTS_Created_Date",
          "waterLevel": "$lastRecord.WTKTS_WaterLevel_Num"
        }
      }
    ]);

    waterTankDocs2.forEach(function (data, index) {
      let sensor_t;
      var index = _.findIndex(waterTankDocs1, function (doc) {
        const lastDataHour = moment(data.createdDate);
        var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

        if (timeDiff < 1) {
          sensor_t = true;
        } else {
          sensor_t = false;
        }
        return String(data._id) === String(doc._id);
      });

      if (index !== -1) {
        if (sensor_t) {
          if (data.waterLevel >= 0) {
            waterTankCount += 1
          }
        }
      }
    })

    let finalSensorData = [];
    finalSensorData.push({
      waterTankTotalCount: waterTankDocs1.length > 0 ? waterTankDocs1[0].sensorData : 0, waterTankActivecount: waterTankCount
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

sensorHealthController.sensorHealthBasedOnType = async (req, res) => {
  try {
    let sensor_t = false, relay_r = 0, relay_b = 0, relay_y = 0;
    let finalSensorData = [];
    let type = req.params.type;
    var currentTime = moment();
    if (type == "ahu") {
      let ahuDocs1 = await ahuMaster.aggregate(
        [
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
              deviceName: "$AHUM_Device_Name_Str",
              createdDate: "$AHUM_Created_Date",
              createdTime: { $substr: ["$AHUM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);
      console.log(ahuDocs1);

      let ahuDocs2 = await ahuTransaction.aggregate([
        {
          "$group": {
            "_id": "$AHUTS_FK_AHUDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        }
      ]);
      console.log(ahuDocs2);

      ahuDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(ahuDocs1, function (doc) {
          const lastDataHour = moment(data.lastRecord.AHUTS_Created_Date);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            ahuDocs1[index].ahuSensorTransaction = sensor_t;
            ahuDocs1[index].ahuTransactionCreatedDate = data.lastRecord.AHUTS_Created_Date;
            ahuDocs1[index].ahuRelayR = data.lastRecord.AHUTS_RelayStatus_R_Bool;
            ahuDocs1[index].ahuRelayY = data.lastRecord.AHUTS_RelayStatus_B_Bool;
            ahuDocs1[index].ahuRelayB = data.lastRecord.AHUTS_RelayStatus_Y_Bool;
          } else {
            ahuDocs1[index].ahuSensorTransaction = false;
            ahuDocs1[index].ahuTransactionCreatedDate = data.lastRecord.AHUTS_Created_Date;
            ahuDocs1[index].ahuRelayR = false;
            ahuDocs1[index].ahuRelayY = false;
            ahuDocs1[index].ahuRelayB = false;
          }
        }
      })

      // let ahuDocs3 = await ahuRelayTransaction.aggregate([
      //   {
      //     "$group": {
      //       "_id": "$AHUTS_FK_AHUDeviceId_obj",
      //       "lastRecord": { "$last": "$$ROOT" },
      //     }
      //   },
      //   {
      //     "$project": {
      //       "createdDate": "$lastRecord.AHUTS_Created_Date",
      //       "relay_r": "$lastRecord.AHUTS_RelayStatus_R_Bool",
      //       "relay_b": "$lastRecord.AHUTS_RelayStatus_B_Bool",
      //       "relay_y": "$lastRecord.AHUTS_RelayStatus_Y_Bool",
      //     }
      //   }
      // ])

      // ahuDocs3.forEach(function (data, index) {
      //   let sensor_t;
      //   var index = _.findIndex(ahuDocs1, function (doc) {
      //     const lastDataHour = moment(data.createdDate);
      //     var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

      //     if (timeDiff < 2) {
      //       sensor_t = true;
      //     } else {
      //       sensor_t = false;
      //     }

      //     return String(data._id) === String(doc._id);
      //   });
      //   if (index !== -1) {
      //     if (sensor_t) {
      //       ahuDocs1[index].ahuRelayR = data.relay_r;
      //       ahuDocs1[index].ahuRelayY = data.relay_y;
      //       ahuDocs1[index].ahuRelayB = data.relay_b;
      //     } else {
      //       ahuDocs1[index].ahuRelayR = false;
      //       ahuDocs1[index].ahuRelayY = false;
      //       ahuDocs1[index].ahuRelayB = false;
      //     }
      //   }
      // })
      finalSensorData = ahuDocs1;
    }
    else if (type == "compressor") {
      let compressorDocs1 = await compressorMaster.aggregate(
        [
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
              deviceName: "$COMPM_Device_Name_Str",
              createdDate: "$COMPM_Created_Date",
              createdTime: { $substr: ["$COMPM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let compressorDocs2 = await compressorTransaction.aggregate([
        {
          "$group": {
            "_id": "$COMPTS_Fk_COMPDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.COMPTS_Created_date",
            "Rpm": "$lastRecord.COMPTS_RPM_Num"
          }
        }

      ]);
      compressorDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(compressorDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));
          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });
        if (index !== -1) {
          if (sensor_t) {
            compressorDocs1[index].compressorSensorTransaction = sensor_t;
            compressorDocs1[index].Rpm = data.Rpm >= 0 ? true : false;
          } else {
            compressorDocs1[index].compressorSensorTransaction = sensor_t;
            compressorDocs1[index].Rpm = false;
          }
          compressorDocs1[index].compressorTransactionCreatedDate = data.createdDate;
        }
      })

      let compressorDocs3 = await compressorRelayTransaction.aggregate([
        {
          "$group": {
            "_id": "$COMPTS_FK_COMPDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.createdAt",
            "relay_r": "$lastRecord.COMPTS_RelayStatus_R_Bool",
            "relay_b": "$lastRecord.COMPTS_RelayStatus_B_Bool",
            "relay_y": "$lastRecord.COMPTS_RelayStatus_Y_Bool",
          }
        }
      ])
      compressorDocs3.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(compressorDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            compressorDocs1[index].compressorRelayR = data.relay_r;
            compressorDocs1[index].compressorRelayY = data.relay_y;
            compressorDocs1[index].compressorRelayB = data.relay_b;
          } else {
            compressorDocs1[index].compressorRelayR = false;
            compressorDocs1[index].compressorRelayY = false;
            compressorDocs1[index].compressorRelayB = false;
          }
          compressorDocs1[index].compressorRelayCreatedDate = data.createdDate;
        }
      })
      finalSensorData = compressorDocs1;
    }
    else if (type == "fan") {
      let fanDocs1 = await fanMaster.aggregate(
        [
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
              deviceName: "$FANM_Device_Name_Str",
              createdDate: "$FANM_Created_Date",
              createdTime: { $substr: ["$FANM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let fanDocs2 = await fanTransaction.aggregate([
        {
          "$group": {
            "_id": "$FANTS_Fk_FANDeviceId_object",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.FANTS_Created_date"
          }
        }

      ]);
      fanDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(fanDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          fanDocs1[index].fanSensorTransaction = sensor_t;
          fanDocs1[index].fanTransactionCreatedDate = data.createdDate;
        }
      })

      let fanDocs3 = await fanRelayTransaction.aggregate([
        {
          "$group": {
            "_id": "$FANTS_Fk_FANDeviceId_object",
            "lastRecord": { "$last": "$$ROOT" },
          }
        }
      ])
      fanDocs3.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(fanDocs1, function (doc) {
          const lastDataHour = moment(data.lastRecord.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            fanDocs1[index].fanRelay = data.lastRecord.relay;
          } else {
            fanDocs1[index].fanRelay = false;
          }
          fanDocs1[index].fanRelayCreatedDate = data.lastRecord.createdDate;
        }
      })
      finalSensorData = fanDocs1;
    }
    else if (type == "zoneTemperature") {
      let zonetemperatureDocs1 = await zoneTemperatureMaster.aggregate(
        [
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
              deviceName: "$ZNTM_Device_Name_Str",
              createdDate: "$ZNTM_Created_Date",
              createdTime: { $substr: ["$ZNTM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let zonetemperatureDocs2 = await zoneTemperatureTransaction.aggregate([
        {
          "$group": {
            "_id": "$ZNTTS_Fk_ZoneDeviceId_Obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.ZNTTS_Created_date",
            "temperature": "$lastRecord.ZNTTS_Temperature_Num",
            "humidity": "$lastRecord.ZNTTS_Humidity_Num"
          }
        }
      ]);

      zonetemperatureDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(zonetemperatureDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            zonetemperatureDocs1[index].temperature = data.temperature >= 0 ? true : false;
            zonetemperatureDocs1[index].humidity = data.humidity >= 0 ? true : false;
            zonetemperatureDocs1[index].zoneTransactionCreatedDate = data.createdDate;
          } else {
            zonetemperatureDocs1[index].temperature = false;
            zonetemperatureDocs1[index].humidity = false;
            zonetemperatureDocs1[index].zoneTransactionCreatedDate = data.createdDate;
          }
        }
      })
      finalSensorData = zonetemperatureDocs1;
    } else if (type == "pump") {
      let pumpDocs1 = await pumpMaster.aggregate(
        [
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
              deviceName: "$PUMPM_Device_Name_Str",
              createdDate: "$PUMPM_Created_Date",
              createdTime: { $substr: ["$PUMPM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let pumpDocs2 = await pumpTransaction.aggregate([
        {
          "$group": {
            "_id": "$PUMPTS_Fk_PUMPDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.PUMPTS_Created_Date",
            "rpm": "$lastRecord.PUMPTS_RPM_Num"
          }
        }
      ]);
      pumpDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(pumpDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            pumpDocs1[index].pumpSensorTransaction = sensor_t;
            pumpDocs1[index].pumpTransactionCreatedDate = data.createdDate;
            pumpDocs1[index].Rpm = data.rpm >= 0 ? true : false
          } else {
            pumpDocs1[index].pumpSensorTransaction = sensor_t;
            pumpDocs1[index].pumpTransactionCreatedDate = data.createdDate;
            pumpDocs1[index].Rpm = false
          }

        }
      })
      let pumpDocs3 = await pumpRelayTransaction.aggregate([
        {
          "$group": {
            "_id": "$PUMPTS_Fk_PUMPDeviceId_object",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
      ])

      pumpDocs3.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(pumpDocs1, function (doc) {
          const lastDataHour = moment(data.lastRecord.PUMPTS_Created_date);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            pumpDocs1[index].pumpRelayTransaction = data.lastRecord.PUMPTS_RelayStatus_Bool;
          } else {
            pumpDocs1[index].pumpRelayTransaction = false;
          }
          pumpDocs1[index].pumpRelayCreatedDate = data.lastRecord.PUMPTS_Created_date;
        }
      })
      finalSensorData = pumpDocs1;
    } else if (type == "chiller") {

      let chillerDocs1 = await chillerMaster.aggregate(
        [
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
              deviceName: "$CHLRM_Device_Name_Str",
              createdDate: "$CHLRM_Created_Date",
              createdTime: { $substr: ["$CHLRM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let chillerDocs2 = await chillerTransaction.aggregate([
        {
          "$group": {
            "_id": "$CHLRTS_FK_CHILLERDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.CHLRTS_Created_Date",
            "Rpm": "$lastRecord.CHLRTS_RPM_Num",
            "waterFlowRate": "$lastRecord.CHLRTS_WaterFlowRate_Num",
            "inlet": "$lastRecord.CHLRTS_InletTemprature_Num",
            "outlet": "$lastRecord.CHLRTS_OutletTemprature_Num"
          }
        }
      ]);
      chillerDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(chillerDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            chillerDocs1[index].chillerSensorTransaction = sensor_t;
            chillerDocs1[index].chillerTransactionCreatedDate = data.createdDate;
            chillerDocs1[index].Rpm = data.Rpm >= 0 ? true : false
            chillerDocs1[index].waterFlowRate = data.waterFlowRate > 0 ? true : false;
            chillerDocs1[index].inlet = data.inlet >= 0 ? true : false;
            chillerDocs1[index].outlet = data.outlet >= 0 ? true : false
          } else {
            chillerDocs1[index].chillerSensorTransaction = sensor_t;
            chillerDocs1[index].chillerTransactionCreatedDate = data.createdDate;
            chillerDocs1[index].Rpm = false;
            chillerDocs1[index].waterFlowRate = false;
            chillerDocs1[index].inlet = false;
            chillerDocs1[index].outlet = false
          }
        }
      })
      let chillerDocs3 = await chillerRelayTransaction.aggregate([
        {
          "$group": {
            "_id": "$CHLRTS_FK_CHILLERDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "relayR": "$lastRecord.CHLRTS_RelayStatus_R_Bool",
            "relayY": "$lastRecord.CHLRTS_RelayStatus_Y_Bool",
            "relayB": "$lastRecord.CHLRTS_RelayStatus_B_Bool"
          }
        }
      ])

      chillerDocs3.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(chillerDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            chillerDocs1[index].chillerRelayTransactionR = data.relayR;
            chillerDocs1[index].chillerRelayTransactionY = data.relayY;
            chillerDocs1[index].chillerRelayTransactionB = data.relayB;
          } else {
            chillerDocs1[index].chillerRelayTransactionR = false;
            chillerDocs1[index].chillerRelayTransactionY = false;
            chillerDocs1[index].chillerRelayTransactionB = false;
          }
          chillerDocs1[index].chillerRelayCreatedDate = data.createdDate;
        }
      })
      finalSensorData = chillerDocs1;
    } else if (type == "solenoidValve") {
      let solenoidValveDocs1 = await solenoidValveMaster.aggregate(
        [
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
              deviceName: "$SOVM_Device_Name_Str",
              createdDate: "$SOVM_Created_Date",
              createdTime: { $substr: ["$SOVM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let solenoidValveDocs2 = await solenoidValveTransaction.aggregate([
        {
          "$group": {
            "_id": "$SOVTS_Fk_SOVDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        }
      ]);

      let solenoidValveDocs3 = await solenoidValveRelayTransaction.aggregate([
        {
          "$group": {
            "_id": "$SOVTS_Fk_SOVDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "relayR": "$lastRecord.SOVTS_RelayStatus_Bool",
            "createDate": "$lastRecord.SOVTS_Created_Date"
          }
        }
      ])

      solenoidValveDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(solenoidValveDocs1, function (doc) {
          const lastDataHour = moment(data.lastRecord.SOVTS_Created_Date);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            solenoidValveDocs1[index].Transaction = sensor_t;
            solenoidValveDocs1[index].CreatedDate = data.lastRecord.SOVTS_Created_Date;
            solenoidValveDocs1[index].waterFlowRate = data.lastRecord.SOVTS_WaterFlowRate_Num >= 0 ? true : false;
          } else {
            solenoidValveDocs1[index].Transaction = sensor_t;
            solenoidValveDocs1[index].CreatedDate = data.lastRecord.SOVTS_Created_Date;
            solenoidValveDocs1[index].waterFlowRate = false;
          }
        }
      })

      solenoidValveDocs3.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(solenoidValveDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            solenoidValveDocs1[index].relay = data.relayR;
          } else {
            solenoidValveDocs1[index].relay = false;
          }
          solenoidValveDocs1[index].chillerRelayCreatedDate = data.createdDate;
        }
      })

      finalSensorData = solenoidValveDocs1;
    } else if (type == "WaterTank") {
      let waterTankDocs1 = await waterTankMaster.aggregate(
        [
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
              deviceName: "$WTKM_Device_Name_Str",
              createdDate: "$WTKM_Created_Date",
              createdTime: { $substr: ["$WTKM_Created_Date", 11, 8] },
              sensorData: { $size: "$sensorData.DSCNF_Fk_SensorId_List" }
            }
          }
        ]);

      let waterTankDocs2 = await waterTankTransaction.aggregate([
        {
          "$group": {
            "_id": "$WTKTS_Fk_WaterTankDeviceId_obj",
            "lastRecord": { "$last": "$$ROOT" },
          }
        },
        {
          "$project": {
            "createdDate": "$lastRecord.WTKTS_Created_Date",
            "waterLevel": "$lastRecord.WTKTS_WaterLevel_Num"
          }
        }
      ]);

      waterTankDocs2.forEach(function (data, index) {
        let sensor_t;
        var index = _.findIndex(waterTankDocs1, function (doc) {
          const lastDataHour = moment(data.createdDate);
          var timeDiff = (currentTime.diff(lastDataHour, 'minutes'));

          if (timeDiff < 1) {
            sensor_t = true;
          } else {
            sensor_t = false;
          }
          return String(data._id) === String(doc._id);
        });

        if (index !== -1) {
          if (sensor_t) {
            waterTankDocs1[index].waterLevel = data.waterLevel >= 0 ? true : false;
            waterTankDocs1[index].CreatedDate = data.createdDate;
          } else {
            waterTankDocs1[index].waterLevel = false;
            waterTankDocs1[index].CreatedDate = data.createdDate;
          }

        }
      })
      finalSensorData = waterTankDocs1;
    }

    res.status(200).send({
      code: 200,
      message: "success",
      data: finalSensorData
    });
  } catch (error) {
    console.log(error);
  }
}

export default sensorHealthController;