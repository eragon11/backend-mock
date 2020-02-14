
import refrigerationTempTransaction from '../../../refrigeration_transaction/temprature/tempratureModel';
import refrigerationTempMaster from '../../../refrigeration_masters/temprature/tempratureModel';
import refrigerationMaster from "../../../refrigeration_masters/refrigeration/refrigerationModel";
import lightIntensityMaster from "../../../refrigeration_masters/lightIntensity/lightIntensityModel";
import doorStatusMaster from "../../../refrigeration_masters/doorStatus/doorStatusModel";
import waterDetectionMaster from "../../../refrigeration_masters/waterDetector/waterDetectorModel";
var moment = require('moment');
import * as _ from 'lodash';
import mongoose from 'mongoose'
let ObjectID = mongoose.Types.ObjectId;

let refrigerationTemperatureController = {};

refrigerationTemperatureController.refrigeration = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceRefrigerationMapDocs = await refrigerationTempMaster.aggregate(
      [
        {
          "$match": {
            "$and": [
              { "REFTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
              { "REFTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
              { "REFTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
              { "REFTM_IsActive_bool": true }
            ]
          }
        },
        {
          "$lookup": {
            "from": "refrigerationtempraturetransactions",
            "localField": "_id",
            "foreignField": "RFTMTS_Fk_TempratureDeviceId_Obj",
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
            "_id": "$RightTableData.RFTMTS_Fk_TempratureDeviceId_Obj",
            "RFTMTS_Fk_TempratureDeviceId_Obj": {
              "$last": "$RightTableData.RFTMTS_Fk_TempratureDeviceId_Obj"
            },
            "RFTMTS_Created_Date": {
              "$last": "$RightTableData.RFTMTS_Created_Date"
            },
            "RFTMTS_Humidity_Num": {
              "$last": "$RightTableData.RFTMTS_Humidity_Num"
            },
            "RFTMTS_Temperature_Num": {
              "$last": "$RightTableData.RFTMTS_Temperature_Num"
            },
            "righttabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "RFTMTS_Created_Date": 1.0
          }
        },
        {
          "$project": {
            "Temperature": "$RFTMTS_Temperature_Num",
            "TemperatureUp": "$righttabledata.REFTM_TempratureUpp_Num",
            "TemperatureLow": "$righttabledata.REFTM_TempratureLow_Num",
            "Humidity": "$RFTMTS_Humidity_Num",
            "HumidityUp": "$righttabledata.REFTM_HumidityUpp_Num",
            "HumidityLow": "$righttabledata.REFTM_HumidityLow_Num",
            "createdDate": { "$dateToString": { "format": "%Y-%m-%d", "date": "$RFTMTS_Created_Date" } },
            "deviceId": "$RFTMTS_Fk_TempratureDeviceId_Obj",
            "idM": "$righttabledata.REFTM_Fk_RefrigerationDeviceId_Obj",
            "deviceName": "$righttabledata.REFTM_Device_Name_Str",
            "createdTime": {
              "$substr": [
                "$RFTMTS_Created_Date",
                11.0,
                8.0
              ]
            },
            "statusT": {
              "$cond": {
                "if": {
                  "$and": [
                    {
                      "$gt": [
                        "$RFTMTS_Temperature_Num",
                        "$righttabledata.REFTM_TempratureLow_Num"
                      ]
                    },
                    {
                      "$lt": [
                        "$RFTMTS_Temperature_Num",
                        "$righttabledata.REFTM_TempratureUpp_Num"
                      ]
                    }
                  ]
                },
                "then": "Normal",
                "else": {
                  "$cond": {
                    "if": {
                      "$lt": [
                        "$RFTMTS_Humidity_Num",
                        "$righttabledata.REFTM_TempratureLow_Num"
                      ]
                    },
                    "then": "Low",
                    "else": "High"
                  }
                }
              }
            },
            "statusH": {
              "$cond": {
                "if": {
                  "$and": [
                    {
                      "$gt": [
                        "$RFTMTS_Humidity_Num",
                        "$righttabledata.REFTM_HumidityLow_Num"
                      ]
                    },
                    {
                      "$lt": [
                        "$RFTMTS_Humidity_Num",
                        "$righttabledata.REFTM_HumidityUpp_Num"
                      ]
                    }
                  ]
                },
                "then": "Normal",
                "else": {
                  "$cond": {
                    "if": {
                      "$lt": [
                        "$RFTMTS_Humidity_Num",
                        "$righttabledata.REFTM_HumidityLow_Num"
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

    let refrigerationMapDocs = await refrigerationMaster.aggregate([
      {
        "$match": {
          "REFM_Device_Id_Num": "REF-1"
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "REFM_Device_Id_Num",
          "foreignField": "ENTS_IoModuleID_str",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.ENTS_Fk_EnergyMaster_Id_obj",
          "ENTS_Created_Date": { "$last": "$RightTableData.ENTS_Created_Date" },
          "CurrentR": { "$sum": "$RightTableData.ENTS_CurrentR_Num" },
          "CurrentB": { "$sum": "$RightTableData.ENTS_CurrentB_Num" },
          "CurrentY": { "$sum": "$RightTableData.ENTS_CurrentY_Num" },
          "VoltageR": { "$sum": "$RightTableData.ENTS_VoltageR_Num" },
          "VoltageB": { "$sum": "$RightTableData.ENTS_VoltageB_Num" },
          "VoltageY": { "$sum": "$RightTableData.ENTS_VoltageY_Num" }
        }
      }
    ])

    let refrigerationWaterDetection = await waterDetectionMaster.aggregate([
      {
        "$lookup": {
          "from": "waterdetectortransactions",
          "localField": "_id",
          "foreignField": "WDTS_Fk_WaterDetectorDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.WDTS_Fk_WaterDetectorDeviceId_obj",
          "WDTS_Created_Date": { "$last": "$RightTableData.WDTS_Created_Date" },
          "righttabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "deviceName": "$righttabledata.WDM_Device_Name_Str",
          "createdDate": "$WDTS_Created_Date",
          "status": "$righttabledata.RightTableData.WDTS_Status_Bool",
          "idM": "$righttabledata.WDM_Fk_RefrigerationDeviceId_Obj"
        }
      }
    ]);

    let refrigerationDoorStatus = await doorStatusMaster.aggregate([
      {
        "$lookup": {
          "from": "refrigerationdoorstatustransactions",
          "localField": "_id",
          "foreignField": "DSTS_Fk_DoorStatusDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.DSTS_Fk_DoorStatusDeviceId_obj",
          "DSTS_Created_Date": { "$last": "$RightTableData.DSTS_Created_Date" },
          "righttabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "deviceName": "$righttabledata.DSM_Device_Name_Str",
          "createdDate": "$DSTS_Created_Date",
          "status": "$righttabledata.RightTableData.WDTS_Status_Bool",
          "idM": "$righttabledata.DSM_Fk_RefrigerationDeviceId_Obj"
        }
      }
    ])

    deviceRefrigerationMapDocs.forEach(outerData => {
      let index = _.findIndex(refrigerationMapDocs, function (innerData) {
        return String(innerData._id) == String(outerData.idM);
      })

      let secondindex = _.findIndex(refrigerationWaterDetection, function (innerData) {
        return String(innerData.idM) == String(outerData.idM);
      })

      let thirdindex = _.findIndex(refrigerationDoorStatus, function (innerData) {
        return String(innerData.idM) == String(outerData.idM);
      })

      if (index != -1) {
        outerData.currentR = refrigerationMapDocs[index].CurrentR;
        outerData.currentB = refrigerationMapDocs[index].CurrentB;
        outerData.currentY = refrigerationMapDocs[index].CurrentY;
        outerData.voltageR = refrigerationMapDocs[index].VoltageR;
        outerData.voltageB = refrigerationMapDocs[index].VoltageB;
        outerData.voltageY = refrigerationMapDocs[index].VoltageY;
      }

      if (secondindex != -1) {
        outerData.waterDetectedStatus = refrigerationWaterDetection[secondindex].status;
      }
      if (thirdindex != -1) {
        outerData.doorStatus = refrigerationWaterDetection[thirdindex].status;
      }
    })

    res.status(200).send({
      code: 200,
      message: "success",
      data: deviceRefrigerationMapDocs
    });

  } catch (error) {
    console.log(error);
  }
}

refrigerationTemperatureController.refrigerationPower = async (req, res) => {
  try {

    let deviceRefrigerationPowerDocs = await refrigerationMaster.aggregate([
      {
        "$match": {
          "REFM_Device_Id_Num": "REF-1"
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "REFM_Device_Id_Num",
          "foreignField": "ENTS_IoModuleID_str",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.ENTS_Fk_EnergyMaster_Id_obj",
          "Power": { "$last": "$RightTableData.ENTS_PowerT_Num" }
        }
      }
    ])

    res.status(200).send({
      code: 200,
      message: "success",
      data: deviceRefrigerationPowerDocs
    });
  } catch (error) {
    console.log(error);
  }
}

refrigerationTemperatureController.refrigerationGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let selectValue = req.body.selectValue;

    let locationId = req.body.locationId || "5d788965545440369c4964ce";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    let today = false;
    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      today = true;
      dateRange = { "RightTableData.RFTMTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.RFTMTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.RFTMTS_Created_Date" };
      dateRange = { "RightTableData.RFTMTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.RFTMTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.RFTMTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.RFTMTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.RFTMTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.RFTMTS_Created_Date" };
      }
    }

    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.RFTMTS_Fk_TempratureDeviceId_Obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
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
          "RFTMTS_Fk_TempratureDeviceId_Obj": "$RightTableData.RFTMTS_Fk_TempratureDeviceId_Obj"
        },
        "RFTMTS_Fk_TempratureDeviceId_Obj": {
          "$last": "$RightTableData.RFTMTS_Fk_TempratureDeviceId_Obj"
        },
        "RFTMTS_Created_Date": {
          "$last": "$RightTableData.RFTMTS_Created_Date"
        },
        "RFTMTS_Humidity_Num": {
          "$last": "$RightTableData.RFTMTS_Humidity_Num"
        },
        "RFTMTS_Temperature_Num": {
          "$last": "$RightTableData.RFTMTS_Temperature_Num"
        },
        "righttabledata": { "$last": "$$ROOT" }
      }
    };
    let pipeline = [
      {
        "$match": {
          "$and": [
            { "REFTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
            { "REFTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "REFTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "REFTM_IsActive_bool": true }
          ]
        }
      },
      {
        "$lookup": {
          "from": "refrigerationtempraturetransactions",
          "localField": "_id",
          "foreignField": "RFTMTS_Fk_TempratureDeviceId_Obj",
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
          "RFTMTS_Created_Date": -1.0
        }
      },
      {
        "$project": {
          "Temperature": "$RFTMTS_Temperature_Num",
          "Humidity": "$RFTMTS_Humidity_Num",
          "deviceId": "$righttabledata.RightTableData.RFTMTS_IoModuleID_str",
          "createdDate": {
            "$dateToString": {
              "format": "%Y-%m-%d",
              "date": "$RFTMTS_Created_Date"
            }
          },
          "createdTime": {
            "$substr": [
              "$RFTMTS_Created_Date",
              11.0,
              8.0
            ]
          },
          "id": "$_id.RFTMTS_Fk_TempratureDeviceId_Obj",
          "idM": "$righttabledata.REFTM_Fk_RefrigerationDeviceId_Obj",
          "deviceName": "$righttabledata.REFTM_Device_Name_Str"
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await refrigerationTempMaster.aggregate(pipeline);

    let refrigerationMapDocs = await refrigerationMaster.aggregate([
      {
        "$match": {
          "REFM_Device_Id_Num": "REF-1"
        }
      },
      {
        "$lookup": {
          "from": "energymetertransactions",
          "localField": "REFM_Device_Id_Num",
          "foreignField": "ENTS_IoModuleID_str",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.ENTS_Fk_EnergyMaster_Id_obj",
          "totalpower": { "$sum": "$RightTableData.ENTS_PowerT_Num" },
          "CurrentR": { "$sum": "RightTableData.ENTS_CurrentR_Num" },
          "CurrentB": { "$sum": "RightTableData.ENTS_CurrentB_Num" },
          "CurrentY": { "$sum": "RightTableData.ENTS_CurrentY_Num" },
          "VoltageR": { "$sum": "RightTableData.ENTS_VoltageR_Num" },
          "VoltageB": { "$sum": "RightTableData.ENTS_VoltageB_Num" },
          "VoltageY": { "$sum": "RightTableData.ENTS_VoltageY_Num" }
        }
      }
    ]);


    let refrigerationWaterDetection = await waterDetectionMaster.aggregate([
      {
        "$lookup": {
          "from": "waterdetectortransactions",
          "localField": "_id",
          "foreignField": "WDTS_Fk_WaterDetectorDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.WDTS_Fk_WaterDetectorDeviceId_obj",
          "WDTS_Created_Date": { "$last": "$RightTableData.WDTS_Created_Date" },
          "righttabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "deviceName": "$righttabledata.WDM_Device_Name_Str",
          "createdDate": "$WDTS_Created_Date",
          "status": "$righttabledata.RightTableData.WDTS_Status_Bool",
          "idM": "$righttabledata.WDM_Fk_RefrigerationDeviceId_Obj"
        }
      }
    ]);


    let refrigerationDoorStatus = await doorStatusMaster.aggregate([
      {
        "$lookup": {
          "from": "refrigerationdoorstatustransactions",
          "localField": "_id",
          "foreignField": "DSTS_Fk_DoorStatusDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.DSTS_Fk_DoorStatusDeviceId_obj",
          "DSTS_Created_Date": { "$last": "$RightTableData.DSTS_Created_Date" },
          "righttabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "deviceName": "$righttabledata.DSM_Device_Name_Str",
          "createdDate": "$DSTS_Created_Date",
          "status": "$righttabledata.RightTableData.WDTS_Status_Bool",
          "idM": "$righttabledata.DSM_Fk_RefrigerationDeviceId_Obj"
        }
      }
    ])

    deviceZoneMapDocs.forEach(outerData => {
      let index = _.findIndex(refrigerationMapDocs, function (innerData) {
        return String(innerData._id) == String(outerData.idM)
      })
      let secondindex = _.findIndex(refrigerationWaterDetection, function (innerData) {
        return String(innerData.idM) == String(outerData.idM);
      })

      let thirdindex = _.findIndex(refrigerationDoorStatus, function (innerData) {
        return String(innerData.idM) == String(outerData.idM);
      })

      if (index != -1) {
        outerData.currentR = refrigerationMapDocs[index].CurrentR;
        outerData.currentB = refrigerationMapDocs[index].CurrentB;
        outerData.currentY = refrigerationMapDocs[index].CurrentY;
        outerData.voltageR = refrigerationMapDocs[index].VoltageR;
        outerData.voltageB = refrigerationMapDocs[index].VoltageB;
        outerData.voltageY = refrigerationMapDocs[index].VoltageY;
      }
      if (secondindex != -1) {
        outerData.WaterDetection = refrigerationWaterDetection[secondindex].status ? 1 : 0;
      }
      if (thirdindex != -1) {
        outerData.DoorStatus = refrigerationWaterDetection[thirdindex].status ? 1 : 0;
      }

    })

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


refrigerationTemperatureController.lightIntensity = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";


    let devicelightIntensity = await lightIntensityMaster.aggregate([
      {
        "$match": {
          "$and": [{ "LIM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "LIM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "LIM_Fk_SM_SiteID_Obj": ObjectID(siteId) }]
        }
      },
      {
        "$lookup": {
          "from": "lightintesitytransactions",
          "localField": "_id",
          "foreignField": "LITS_Fk_LightIntensityDeviceId_Obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.LITS_Fk_LightIntensityDeviceId_Obj",
          "LITS_Created_Date": { "$last": "$RightTableData.LITS_Created_Date" },
          "rightabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "createdDate": "$LITS_Created_Date",
          "deviceName": "$rightabledata.LIM_Device_Name_Str",
          "intensityM": "$rightabledata.LIM_Intensity_Num",
          "intensity": "$rightabledata.RightTableData.LITS_Intensity_Num"
        }
      }
    ])
    res.status(200).send({
      code: 200,
      message: "success",
      data: devicelightIntensity
    });

  } catch (error) {
    console.log(error);

  }
}

refrigerationTemperatureController.doorStatus = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";


    let devicedoorStatus = await doorStatusMaster.aggregate([
      {
        "$match": {
          "$and": [{ "DSM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "DSM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "DSM_Fk_SM_SiteID_Obj": ObjectID(siteId) }]
        }
      },
      {
        "$lookup": {
          "from": "refrigerationdoorstatustransactions",
          "localField": "_id",
          "foreignField": "DSTS_Fk_DoorStatusDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.DSTS_Fk_DoorStatusDeviceId_obj",
          "DSTS_Created_Date": { "$last": "$RightTableData.DSTS_Created_Date" },
          "rightabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "createdDate": "$DSTS_Created_Date",
          "id": "$_id",
          "deviceName": "$rightabledata.DSM_Device_Name_Str",
          "doorStatus": "$rightabledata.RightTableData.DSTS_Status_Bool"
        }
      }
    ])
    res.status(200).send({
      code: 200,
      message: "success",
      data: devicedoorStatus
    });

  } catch (error) {
    console.log(error);

  }
}

refrigerationTemperatureController.waterDetection = async (req, res) => {

  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let devicewaterDetectionStatus = await waterDetectionMaster.aggregate([
      {
        "$match": {
          "$and": [{ "WDM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "WDM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "WDM_Fk_SM_SiteID_Obj": ObjectID(siteId) }]
        }
      },
      {
        "$lookup": {
          "from": "waterdetectortransactions",
          "localField": "_id",
          "foreignField": "WDTS_Fk_WaterDetectorDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$group": {
          "_id": "$RightTableData.WDTS_Fk_WaterDetectorDeviceId_obj",
          "WDTS_Created_Date": { "$last": "$RightTableData.WDTS_Created_Date" },
          "rightabledata": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "createdDate": "$WDTS_Created_Date",
          "id": "$_id",
          "deviceName": "$rightabledata.WDM_Device_Name_Str",
          "waterDetectionStatus": "$rightabledata.RightTableData.WDTS_Status_Bool"
        }
      }
    ])
    res.status(200).send({
      code: 200,
      message: "success",
      data: devicewaterDetectionStatus
    });

  } catch (error) {
    console.log(error);

  }

}

refrigerationTemperatureController.doorstatusGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let selectValue = req.body.selectValue;

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.DSTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.DSTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.DSTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.DSTS_Created_Date" };

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.DSTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.DSTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.DSTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.DSTS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.DSTS_Created_Date" };
      }
    }

    let match = {
      "$match": {

        "$and": [
          {
            "RightTableData.DSTS_Fk_DoorStatusDeviceId_obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
          }, dateRange
        ]
      }
    };

    let group = {
      "$group": {
        "_id": {
          "date": {
            "$dateToString": dateGroupString
          }, "DSTS_Fk_DoorStatusDeviceId_obj": "$RightTableData.DSTS_Fk_DoorStatusDeviceId_obj"
        },
        "DSTS_Created_Date": { "$last": "$RightTableData.DSTS_Created_Date" },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [

      {
        "$match": {
          "$and": [{ "DSM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "DSM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "DSM_Fk_SM_SiteID_Obj": ObjectID(siteId) }]
        }
      },
      {
        "$lookup": {
          "from": "refrigerationdoorstatustransactions",
          "localField": "_id",
          "foreignField": "DSTS_Fk_DoorStatusDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "DSTS_Created_Date": -1.0 } },
      {
        "$project": {
          "createdDate": "$DSTS_Created_Date",
          "id": "$_id.DSTS_Fk_DoorStatusDeviceId_obj",
          "deviceName": "$rightabledata.DSM_Device_Name_Str",
          "DoorStatus":
          {
            $cond: [{ $eq: ["$rightabledata.RightTableData.DSTS_Status_Bool", true] }, 1, 0]
          },
          "Open":
          {
            $cond: [{ $eq: ["$rightabledata.RightTableData.DSTS_Status_Bool", true] }, 1, 0]
          },
          "Close":
          {
            $cond: [{ $eq: ["$rightabledata.RightTableData.DSTS_Status_Bool", false] }, 1, 0]
          }
        }
      }
    ]

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await doorStatusMaster.aggregate(pipeline);

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
    })
  } catch (error) {
    console.log(error);

  }
}


refrigerationTemperatureController.lightIntensityGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let selectValue = req.body.selectValue;

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.LITS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.LITS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.LITS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.LITS_Created_Date" };

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.LITS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.LITS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.LITS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        dateGroupString = { "format": "%H", "date": "$RightTableData.LITS_Created_Date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.LITS_Created_Date" };
      }
    }

    let match = {
      "$match": {

        "$and": [
          {
            "RightTableData.LITS_Fk_LightIntensityDeviceId_Obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
          }, dateRange
        ]
      }
    };

    let group = {
      "$group": {
        "_id": "$RightTableData.LITS_Fk_LightIntensityDeviceId_Obj",
        "LITS_Created_Date": { "$last": "$RightTableData.LITS_Created_Date" },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [

      {
        "$match": {
          "$and": [{ "LIM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "LIM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "LIM_Fk_SM_SiteID_Obj": ObjectID(siteId) }]
        }
      },
      {
        "$lookup": {
          "from": "lightintesitytransactions",
          "localField": "_id",
          "foreignField": "LITS_Fk_LightIntensityDeviceId_Obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      {
        "$project": {
          "createdDate": "$LITS_Created_Date",
          "id": "$_id",
          "intensityM": "$rightabledata.LIM_Intensity_Num",
          "intensity": "$rightabledata.RightTableData.LITS_Intensity_Num"
        }
      }

    ]

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await lightIntensityMaster.aggregate(pipeline);

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
    })
  } catch (error) {
    console.log(error);
  }
}


refrigerationTemperatureController.waterDetectionGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let selectValue = req.body.selectValue;

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.WDTS_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
      dateGroupString = { "format": "%H", "date": "$RightTableData.WDTS_Created_Date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "RightTableData.WDTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.WDTS_Created_Date" };

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "RightTableData.WDTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.WDTS_Created_Date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "RightTableData.WDTS_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
    }

    let match = {
      "$match": {

        "$and": [
          {
            "RightTableData.WDTS_Fk_WaterDetectorDeviceId_obj": { $in: selectValue.map(data => { return ObjectID(data) }) }
          }, dateRange
        ]
      }
    };

    let group = {
      "$group": {
        "_id": {
          "date": {
            "$dateToString": dateGroupString
          }, "WDTS_Fk_WaterDetectorDeviceId_obj": "$RightTableData.WDTS_Fk_WaterDetectorDeviceId_obj"
        },
        "WDTS_Created_Date": { "$last": "$RightTableData.WDTS_Created_Date" },
        "rightabledata": { "$last": "$$ROOT" }
      }
    };

    let pipeline = [

      {
        "$match": {
          "$and": [{ "WDM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "WDM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) },
          { "WDM_Fk_SM_SiteID_Obj": ObjectID(siteId) }]
        }
      },
      {
        "$lookup": {
          "from": "waterdetectortransactions",
          "localField": "_id",
          "foreignField": "WDTS_Fk_WaterDetectorDeviceId_obj",
          "as": "RightTableData"
        }
      },
      { "$unwind": "$RightTableData" },
      { "$sort": { "WDTS_Created_Date": -1.0 } },
      {
        "$project": {
          "createdDate": "$WDTS_Created_Date",
          "id": "$_id.WDTS_Fk_WaterDetectorDeviceId_obj",
          "deviceName": "$rightabledata.WDM_Device_Name_Str",
          "WaterDetection":
          {
            $cond: [{ $eq: ["$rightabledata.RightTableData.WDTS_Status_Bool", true] }, 1, 0]
          },
          "Open":
          {
            $cond: [{ $eq: ["$rightabledata.RightTableData.WDTS_Status_Bool", true] }, 1, 0]
          },
          "Close":
          {
            $cond: [{ $eq: ["$rightabledata.RightTableData.WDTS_Status_Bool", false] }, 1, 0]
          }
        }
      }
    ]

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await waterDetectionMaster.aggregate(pipeline);

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
    })
  } catch (error) {
    console.log(error);
  }
}


export default refrigerationTemperatureController;