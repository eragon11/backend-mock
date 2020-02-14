import ahuMaster from '../../../hvac_masters/ahu/ahuModel';
import compressorMaster from '../../../hvac_masters/compressor/compressorModel';
import fanUnitMaster from '../../../hvac_masters/fan/fanModel';
import zoneTempMaster from '../../../hvac_masters/zoneTemprature/zoneTempratureModel';
import chillerMaster from '../../../hvac_masters/chiller/chillerModel';
import pumpMaster from '../../../hvac_masters/chiller/chillerModel';
import solenoidValveMaster from '../../../hvac_masters/solenoidValve/solenoidValveModel';
import waterTankMaster from '../../../hvac_masters/waterTank/waterTankModel';

var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;

let ahuController = {};

ahuController.trendingAnalytics = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let deviceAhuMapDocs = await ahuMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "AHUM_Fk_LM_LocationID_Obj": ObjectID(locationId) }, { "AHUM_Fk_SM_SiteID_Obj": ObjectID(siteId) }, { "AHUM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
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
        {
          $group:
          {
            _id: "$RightTableData.AHUTS_FK_AHUDeviceId_obj",
            powerR: { $last: "$RightTableData.AHUTS_PowerR_Num" },
            powerY: { $last: "$RightTableData.AHUTS_PowerY_Num" },
            powerB: { $last: "$RightTableData.AHUTS_PowerB_Num" }
          }
        }
      ])

    let deviceAhuArr = [
      {
        _id: deviceAhuMapDocs[0]._id,
        power: deviceAhuMapDocs[0].powerR + deviceAhuMapDocs[0].powerY + deviceAhuMapDocs[0].powerB
      }
    ]

    res.status(200).send({
      code: 200,
      message: "success",
      data: deviceAhuArr
    });

  } catch (error) {
    console.log(error);
  }
}

ahuController.zoneTemperature = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d78897c545440369c4964cf";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceZoneMapDocs = await zoneTempMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "ZNTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "ZNTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "ZNTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
          }
        },
        {
          "$lookup": {
            "from": "zonetempraturetransactions",
            "localField": "_id",
            "foreignField": "ZNTTS_Fk_ZoneDeviceId_Obj",
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
            "_id": "$RightTableData.ZNTTS_IoModuleID_str",
            "ZNTTS_IoModuleID_str": {
              "$last": "$RightTableData.ZNTTS_IoModuleID_str"
            },
            "ZNTTS_Created_date": {
              "$last": "$RightTableData.ZNTTS_Created_date"
            },
            "ZNTTS_Temperature_Num": {
              "$last": "$RightTableData.ZNTTS_Temperature_Num"
            },
            "righttabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "ZNTTS_Created_date": 1.0
          }
        },
        {
          "$project": {
            "Temperature": "$ZNTTS_Temperature_Num",
            "UpTemperature": "$righttabledata.ZNTM_TemperatureUpp_Num",
            "LowTemperature": "$righttabledata.ZNTM_TemperatureLow_Num",
            "deviceId": "$ZNTTS_IoModuleID_str",
            "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$ZNTTS_Created_date" } },
            "createdTime": { $substr: ["$ZNTTS_Created_date", 11, 8] },
            "id": "$_id",
            "deviceName": "$righttabledata.ZNTM_Device_Name_Str"
          }
        }
      ])

    let normal = 0, low = 0, high = 0;
    let zoneTempData = {}
    deviceZoneMapDocs.map(data => {
      if ((data.Temperature > data.LowTemperature) && (data.Temperature < data.UpTemperature)) {
        normal = normal + 1
      } else if (data.Temperature < data.LowTemperature) {
        low = low + 1
      } else {
        high = high + 1
      }
      zoneTempData.normal = normal;
      zoneTempData.low = low;
      zoneTempData.high = high;
      zoneTempData.total_count = deviceZoneMapDocs.length;
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: zoneTempData
    });
  } catch (error) {
    console.log(error);
  }
}


ahuController.zoneHumidity = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d78897c545440369c4964cf";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceZoneMapDocs = await zoneTempMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "ZNTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "ZNTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "ZNTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
          }
        },
        {
          "$lookup": {
            "from": "zonetempraturetransactions",
            "localField": "_id",
            "foreignField": "ZNTTS_Fk_ZoneDeviceId_Obj",
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
            "_id": "$RightTableData.ZNTTS_IoModuleID_str",
            "ZNTTS_IoModuleID_str": {
              "$last": "$RightTableData.ZNTTS_IoModuleID_str"
            },
            "ZNTTS_Created_date": {
              "$last": "$RightTableData.ZNTTS_Created_date"
            },
            "ZNTTS_Humidity_Num": {
              "$last": "$RightTableData.ZNTTS_Humidity_Num"
            },
            "righttabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "ZNTTS_Created_date": 1.0
          }
        },
        {
          "$project": {
            "Humidity": "$ZNTTS_Humidity_Num",
            "UpHumidity": "$righttabledata.ZNTM_HumidityUpp_Num",
            "LowHumidity": "$righttabledata.ZNTM_HumidityLow_Num",
            "deviceId": "$ZNTTS_IoModuleID_str",
            "createdDate": { $dateToString: { format: "%Y-%m-%d", date: "$ZNTTS_Created_date" } },
            "createdTime": { $substr: ["$ZNTTS_Created_date", 11, 8] },
            "id": "$_id",
            "deviceName": "$righttabledata.ZNTM_Device_Name_Str"
          }
        }
      ])

    let normal = 0, low = 0, high = 0;
    let zoneTempData = {}
    deviceZoneMapDocs.map(data => {
      if ((data.Humidity > data.LowHumidity) && (data.Humidity < data.UpHumidity)) {
        normal = normal + 1
      } else if (data.Humidity < data.LowHumidity) {
        low = low + 1
      } else {
        high = high + 1
      }
      zoneTempData.normal = normal;
      zoneTempData.low = low;
      zoneTempData.high = high;
      zoneTempData.total_count = deviceZoneMapDocs.length;
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: zoneTempData
    });
  } catch (error) {
    console.log(error);
  }
}


ahuController.zoneDevices = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";


    let deviceZoneMapDocs = await zoneTempMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "ZNTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "ZNTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "ZNTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
          }
        },
        {
          "$lookup": {
            "from": "zonetempraturetransactions",
            "localField": "_id",
            "foreignField": "ZNTTS_Fk_ZoneDeviceId_Obj",
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
            "_id": "$RightTableData.ZNTTS_Fk_ZoneDeviceId_Obj",
            "righttabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "righttabledata.RightTableData.ZNTTS_Created_date": 1.0
          }
        },
        {
          "$project": {
            "Temperature": "$righttabledata.RightTableData.ZNTTS_Temperature_Num",
            "TemperatureUp": "$righttabledata.ZNTM_TemperatureUpp_Num",
            "TemperatureLow": "$righttabledata.ZNTM_TemperatureLow_Num",
            "Humidity": "$righttabledata.RightTableData.ZNTTS_Humidity_Num",
            "HumidityUp": "$righttabledata.ZNTM_HumidityUpp_Num",
            "HumidityLow": "$righttabledata.ZNTM_HumidityLow_Num",
            "createdDate": { "$dateToString": { "format": "%Y-%m-%d", "date": "$ZNTTS_Created_date" } },
            "deviceId": "$righttabledata.RightTableData.ZNTTS_IoModuleID_str",
            "deviceName": "$righttabledata.ZNTM_Device_Name_Str",
            "createdTime": {
              "$substr": [
                "$ZNTTS_Created_date",
                11.0,
                8.0
              ]
            },
            "ZNTM_Fk_ZM_ZoneID_Obj": "$righttabledata.ZNTM_Fk_ZM_ZoneID_Obj",
            "status": {
              "$cond": {
                "if": {
                  "$and": [
                    {
                      "$gt": [
                        "$ZNTTS_Temperature_Num",
                        "$righttabledata.ZNTM_TemperatureLow_Num"
                      ]
                    },
                    {
                      "$lt": [
                        "$ZNTTS_Temperature_Num",
                        "$righttabledata.ZNTM_TemperatureUpp_Num"
                      ]
                    }
                  ]
                },
                "then": "Normal",
                "else": {
                  "$cond": {
                    "if": {
                      "$lt": [
                        "$ZNTTS_Temperature_Num",
                        "$righttabledata.ZNTM_TemperatureLow_Num"
                      ]
                    },
                    "then": "Low",
                    "else": "High"
                  }
                }
              }
            }
          }
        }
      ])

    // deviceZoneMapDocs.map(data => {
    //   if ((data.Temperature > data.LowTemperature) && (data.Temperature < data.UpTemperature)) {
    //     data.status = 'normal'
    //   } else if (data.Temperature < data.LowTemperature) {
    //     data.status = 'low'
    //   } else {
    //     data.status = 'high'
    //   }
    // })

    res.status(200).send({
      code: 200,
      message: "success",
      data: deviceZoneMapDocs
    });
  } catch (error) {
    console.log(error);
  }
}

ahuController.activeDevices = async (req, res) => {
  try {

    let ahu_active = await ahuMaster.find({ "AHUM_isActive_Bool": true }).countDocuments();
    let compressor_active = await compressorMaster.find({ "COMPM_Is_Deleted_Bool": false }).countDocuments();
    let fanUnit_active = await fanUnitMaster.find({ "FANM_IsActive_bool": true }).countDocuments();
    let zoneTemp_active = await zoneTempMaster.find({ "ZNTM_IsActive_Bool": true }).countDocuments();
    let chiller_active = await chillerMaster.find({ "CHLRM_IsActive_bool": true }).countDocuments();
    let pump_active = await pumpMaster.find({ "CHLRM_IsActive_bool": true }).countDocuments();
    let solenoidValve_active = await solenoidValveMaster.find({ "SOVM_IsActive_Bool": true }).countDocuments();
    let waterTank_active = await waterTankMaster.find({ "WTKM_isActive_Bool": true }).countDocuments();

    let activedevices = {
      ahu: ahu_active,
      compressor: compressor_active,
      fanUnit: fanUnit_active,
      zoneTemp: zoneTemp_active,
      chiller: chiller_active,
      pump: pump_active,
      solenoidValve: solenoidValve_active,
      waterTank: waterTank_active
    };

    res.status(200).send({
      code: 200,
      msg: "active Devices",
      data: activedevices
    })

  } catch (error) {
    console.log(error);
  }
}

ahuController.totalDevices = async (req, res) => {
  try {

    let ahu = await ahuMaster.find({ "AHUM_isActive_Bool": true }).countDocuments();
    let compressor = await compressorMaster.find({ "COMPM_Is_Deleted_Bool": false }).countDocuments();
    let fanUnit = await fanUnitMaster.find({ "FANM_IsActive_bool": true }).countDocuments();
    let zoneTemp = await zoneTempMaster.find({ "ZNTM_IsActive_Bool": true }).countDocuments();
    let chiller = await chillerMaster.find({ "CHLRM_IsActive_bool": true }).countDocuments();
    let pump = await pumpMaster.find({ "CHLRM_IsActive_bool": true }).countDocuments();
    let solenoidValve = await solenoidValveMaster.find({ "SOVM_IsActive_Bool": true }).countDocuments();
    let waterTank = await waterTankMaster.find({ "WTKM_isActive_Bool": true }).countDocuments();

    let totaldevices = {
      ahu: ahu,
      compressor: compressor,
      fanUnit: fanUnit,
      zoneTemp: zoneTemp,
      chiller: chiller,
      pump: pump,
      solenoidValve: solenoidValve,
      waterTank: waterTank
    };

    res.status(200).send({
      code: 200,
      msg: "total Devices",
      data: totaldevices
    })

  } catch (error) {
    console.log(error);
  }
}

export default ahuController;