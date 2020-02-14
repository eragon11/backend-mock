
import ahuTransaction from "../../../hvac_transaction/ahu/ahuModel";
import ahuRelayTransaction from "../../../hvac_relay_transaction/ahu/ahuModel";
import zoneTransaction from "../../../hvac_transaction/zoneTemprature/zoneTempratureModel";
import compressorTransaction from "../../../hvac_transaction/compressor/compressorModel";
import compressorrelaytransactions from "../../../hvac_relay_transaction/compressor/compressorModel";
import fanTransaction from "../../../hvac_transaction/fan/fanModel";
import fanRelayTransaction from "../../../hvac_relay_transaction/fan/fanModel";
import pumpTransaction from "../../../hvac_transaction/pump/pumpModel";
import pumpRelayTransaction from "../../../hvac_relay_transaction/pump/pumpModel";
import solenoidValveTransaction from "../../../hvac_transaction/solenoidValve/solenoidValveModel";
import solenoidValveRelayTransaction from "../../../hvac_relay_transaction/solenoidValve/solenoidValveModel";
import waterTankTransaction from "../../../hvac_transaction/waterTank/waterTankModel";
import chillerTransaction from "../../../hvac_transaction/chiller/chillerModel";
import chillerRelayTransaction from "../../../hvac_relay_transaction/chiller/chillerModel";
import * as _ from 'lodash';

let liveStatusController = {};

liveStatusController.energypower = async (req, res) => {
  try {
    let id = req.params.id || "00-D0-C9-FF-6D-7A";

    let energyData = await ahuTransaction.aggregate([
      { $match: { "AHUTS_IoModuleID_str": id } },
      { $sort: { "AHUTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'ahumasters',
          localField: 'AHUTS_IoModuleID_str',
          foreignField: 'AHUM_DeviceId_Num',
          as: 'FirstTableData'
        }
      },
      {
        $unwind: {
          path: "$FirstTableData"
        }
      },
      {
        $project: {
          "DeviceId": "$AHUTS_IoModuleID_str",
          "createdDate": "$AHUTS_Created_Date",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.AHUM_PhaseType_Str", "Single Phase"] },
              "then": "$AHUTS_CurrentR_Num",
              "else": {
                $add: ["$AHUTS_CurrentB_Num", "$AHUTS_CurrentY_Num", "$AHUTS_CurrentR_Num"]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.AHUM_PhaseType_Str", "Single Phase"] },
              "then": "$AHUTS_PowerR_Num",
              "else": {
                $add: ["$AHUTS_PowerB_Num", "$AHUTS_PowerY_Num", "$AHUTS_PowerR_Num"]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.AHUM_PhaseType_Str", "Single Phase"] },
              "then": "$AHUTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: ["$AHUTS_VoltageB_Num", "$AHUTS_VoltageY_Num", "$AHUTS_VoltageR_Num"] }, 3]
              }
            }
          },
          "PhaseType": "$FirstTableData.AHUM_PhaseType_Str",
          "StatusR": "$AHUTS_RelayStatus_R_Bool",
          "StatusY": "$AHUTS_RelayStatus_Y_Bool",
          "StatusB": "$AHUTS_RelayStatus_B_Bool"
        }
      }
    ])

    // let energyRelayData = await ahuRelayTransaction.aggregate([
    //   { $match: { "AHUTS_IoModuleID_str": id } },
    //   { $sort: { "AHUTS_Created_Date": -1 } },
    //   { $limit: 1 },
    //   {
    //     $lookup: {
    //       from: 'ahumasters',
    //       localField: 'AHUTS_IoModuleID_str',
    //       foreignField: 'AHUM_DeviceId_Num',
    //       as: "secondTableData"
    //     }
    //   },
    //   {
    //     $project: {
    //       "StatusR": "$AHUTS_RelayStatus_R_Bool",
    //       "StatusY": "$AHUTS_RelayStatus_Y_Bool",
    //       "StatusB": "$AHUTS_RelayStatus_B_Bool"
    //     }
    //   }
    // ])

    let energydataarr = [];
    let combineData = {
      "DeviceId": energyData[0].DeviceId,
      "createdDate": energyData[0].createdDate,
      "Current": energyData[0].Current,
      "Power": energyData[0].Power,
      "Voltage": energyData[0].Voltage,
      "PhaseType": energyData[0].PhaseType,
      "StatusR": energyData[0].StatusR,
      "StatusY": energyData[0].StatusY,
      "StatusB": energyData[0].StatusB
    }
    energydataarr.push(combineData)

    res.status(200).send({
      code: 200,
      message: "success",
      data: energydataarr
    });
  } catch (error) {
    console.log(error);
  }
}


liveStatusController.compressor = async (req, res) => {
  try {
    let id = req.params.id || "00-D0-C9-FF-6D-7A";

    let compressorData = await compressorTransaction.aggregate([
      { $match: { "COMPTS_IoModuleID_str": id } },
      { $sort: { "COMPTS_Created_date": -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'compressormasters',
          localField: 'COMPTS_IoModuleID_str',
          foreignField: 'COMPM_DeviceId_Num',
          as: 'FirstTableData'
        }
      },
      {
        $unwind: {
          path: "$FirstTableData",
        }
      },
      {
        $project: {
          "DeviceId": "$COMPTS_IoModuleID_str",
          "createdDate": "$COMPTS_Created_date",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.COMPM_PhaseType_Str", "Single Phase"] },
              "then": "$COMPTS_CurrentR_Num",
              "else": {
                $add: ["$COMPTS_CurrentB_Num", "$COMPTS_CurrentY_Num", "$COMPTS_CurrentR_Num"]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.COMPM_PhaseType_Str", "Single Phase"] },
              "then": "$COMPTS_PowerR_Num",
              "else": {
                $add: ["$COMPTS_PowerB_Num", "$COMPTS_PowerY_Num", "$COMPTS_PowerR_Num"]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.COMPM_PhaseType_Str", "Single Phase"] },
              "then": "$COMPTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: ["$COMPTS_VoltageB_Num", "$COMPTS_VoltageY_Num", "$COMPTS_VoltageR_Num"] }, 3]
              }
            }
          },
          "PhaseType": "$FirstTableData.COMPM_PhaseType_Str",
          "RPM": "$COMPTS_RPM_Num"
        }
      }

    ])

    let compressorRelayData = await compressorrelaytransactions.aggregate([
      { $match: { "COMPTS_IoModuleID_str": id } },
      { $sort: { "createdAt": -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'compressormasters',
          localField: 'COMPTS_IoModuleID_str',
          foreignField: 'COMPM_DeviceId_Num',
          as: 'SecondTableData'
        }
      },
      {
        $project: {
          "StatusR": "$COMPTS_RelayStatus_R_Bool",
          "StatusY": "$COMPTS_RelayStatus_Y_Bool",
          "StatusB": "$COMPTS_RelayStatus_B_Bool"
        }
      }
    ])

    let compressordataarr = [];
    let combineData = {
      "DeviceId": compressorData[0].DeviceId,
      "createdDate": compressorData[0].createdDate,
      "Current": compressorData[0].Current,
      "Power": compressorData[0].Power,
      "Voltage": compressorData[0].Voltage,
      "PhaseType": compressorData[0].PhaseType,
      "Rpm": compressorData[0].RPM,
      "StatusR": compressorRelayData[0].StatusR,
      "StatusY": compressorRelayData[0].StatusY,
      "StatusB": compressorRelayData[0].StatusB
    }
    compressordataarr.push(combineData)

    res.status(200).send({
      code: 200,
      message: "success",
      data: compressordataarr
    });

  } catch (error) {
    console.log(error);
  }
}

liveStatusController.zoneTemperature = async (req, res) => {
  try {
    let id = req.params.id || "00-D0-C9-FF-6D-7A";

    let zoneTempData = await zoneTransaction.find({ "ZNTTS_IoModuleID_str": id }).sort({ "ZNTTS_Created_date": -1 }).limit(1);

    res.status(200).send({
      code: 200,
      message: "success",
      data: zoneTempData
    });
  } catch (error) {
    console.log(error);
  }
}

liveStatusController.fan = async (req, res) => {
  try {
    let id = req.params.id || "FAN MAC ID";

    let fan_trans_data = await fanTransaction.find({ "FANTS_IoModuleID_str": id }).sort({ "FANTS_Created_date": -1 }).limit(1);
    let fan_relay_data = await fanRelayTransaction.find({ "FANTS_IoModuleID_str": id }).sort({ "FANTS_Created_date": -1 }).limit(1);
    let fanData = [{
      "DeviceId": fan_trans_data[0].FANTS_IoModuleID_str,
      "rpm": fan_trans_data[0].FANTS_RPM_Num,
      "createdDate": fan_trans_data[0].FANTS_Created_date,
      "status": fan_relay_data[0].FANTS_RelayStatus_Bool
    }]

    res.status(200).send({
      code: 200,
      message: "success",
      data: fanData
    });
  } catch (error) {
    console.log(error);
  }
}

liveStatusController.pump = async (req, res) => {
  try {
    let id = req.params.id;
    let pumpData = await pumpTransaction.aggregate([
      { $match: { "PUMPTS_IoModuleID_str": id } },
      {
        $lookup: {
          from: 'pumpmasters',
          localField: "PUMPTS_IoModuleID_str",
          foreignField: "PUMPM_DeviceId_Num",
          as: 'FirstTableData'
        }
      },
      {
        $unwind: {
          path: "$FirstTableData",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { "PUMPTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $project: {
          "DeviceId": "$PUMPTS_IoModuleID_str",
          "rpm": "$PUMPTS_RPM_Num",
          "createdDate": "$PUMPTS_Created_Date"
        }
      }
    ])

    let pumpRelayData = await pumpRelayTransaction.aggregate([
      { $match: { "PUMPTS_IoModuleID_str": id } },
      { $sort: { "PUMPTS_Created_date": -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'pumpmasters',
          localField: 'PUMPTS_IoModuleID_str',
          foreignField: 'PUMPM_DeviceId_Num',
          as: "secondTableData"
        }
      },
      {
        $project: {
          "Status": "$PUMPTS_RelayStatus_Bool",
        }
      }
    ])

    let pumpdataarr = [];
    let combineData = {
      "DeviceId": pumpData[0].DeviceId,
      "createdDate": pumpData[0].createdDate,
      "Rpm": pumpData[0].rpm,
      "Status": (pumpRelayData.length > 0) ? pumpRelayData[0].Status : false
    }
    pumpdataarr.push(combineData)

    res.status(200).send({
      code: 200,
      message: "success",
      data: pumpdataarr
    });
  } catch (error) {
    console.log(error);
  }
}

liveStatusController.solenoidValve = async (req, res) => {
  try {
    let id = req.params.id;
    let solenoidValveData = await solenoidValveTransaction.aggregate([
      { $match: { "SOVTS_IoModuleID_str": id } },
      {
        $lookup: {
          from: 'solenoidvalvemasters',
          localField: "SOVTS_IoModuleID_str",
          foreignField: "SOVM_DeviceId_Num",
          as: 'FirstTableData'
        }
      },
      {
        $unwind: {
          path: "$FirstTableData",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { "SOVTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $project: {
          "DeviceId": "$SOVTS_IoModuleID_str",
          "waterFlowRate": "$SOVTS_WaterFlowRate_Num",
          "createdDate": "$SOVTS_Created_Date"
        }
      }
    ])

    let solenoidValveRelayData = await solenoidValveRelayTransaction.aggregate([
      { $match: { "SOVTS_IoModuleID_str": id } },
      { $sort: { "SOVTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'solenoidvalvemasters',
          localField: "SOVTS_IoModuleID_str",
          foreignField: "SOVM_DeviceId_Num",
          as: "secondTableData"
        }
      },
      {
        $project: {
          "Status": "$SOVTS_RelayStatus_Bool",
        }
      }
    ])

    let solenoidValvedataarr = [];
    let combineData = {
      "DeviceId": solenoidValveData[0].DeviceId,
      "createdDate": solenoidValveData[0].createdDate,
      "WaterFlowRate": solenoidValveData[0].waterFlowRate,
      "Status": (solenoidValveRelayData.length > 0) ? solenoidValveRelayData[0].Status : false
    }
    solenoidValvedataarr.push(combineData)

    res.status(200).send({
      code: 200,
      message: "success",
      data: solenoidValvedataarr
    });
  } catch (error) {
    console.log(error);
  }
}


liveStatusController.waterTank = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);

    let waterTankData = await waterTankTransaction.aggregate([
      { $match: { "WTKTS_IoModuleID_str": id } },
      {
        $lookup: {
          from: 'watertankmasters',
          localField: "WTKTS_IoModuleID_str",
          foreignField: "WTKM_DeviceId_Num",
          as: 'FirstTableData'
        }
      },
      {
        $unwind: "$FirstTableData",
      },
      { $sort: { "WTKTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $project: {
          "DeviceId": "$WTKTS_IoModuleID_str",
          "waterLevel": "$WTKTS_WaterLevel_Num",
          "createdDate": "$WTKTS_Created_Date",
          "waterLevelMin": "$FirstTableData.WTKM_MinLevel_Num",
          "waterLevelMax": "$FirstTableData.WTKM_MaxVolume_Num"
        }
      }
    ])

    // let waterTankRelayData = await waterTankRelayTransaction.aggregate([
    //   { $match: { "SOVTS_IoModuleID_str": id } },
    //   { $sort: { "SOVTS_Created_Date": -1 } },
    //   { $limit: 1 },
    //   {
    //     $lookup: {
    //       from: 'waterTankmasters',
    //       localField: "SOVTS_IoModuleID_str",
    //       foreignField: "SOVM_DeviceId_Num",
    //       as: "secondTableData"
    //     }
    //   },
    //   {
    //     $project: {
    //       "Status": "$SOVTS_RelayStatus_Bool",
    //     }
    //   }
    // ])

    console.log(waterTankData);
    // console.log(waterTankRelayData);

    let waterTankdataarr = [];
    let combineData = {
      "DeviceId": waterTankData[0].DeviceId,
      "createdDate": waterTankData[0].createdDate,
      "WaterLevel": waterTankData[0].waterLevel,
      "WaterLevelMin": waterTankData[0].waterLevelMin,
      "WaterLevelMax": waterTankData[0].waterLevelMax
      // "Status": (waterTankRelayData.length > 0) ? waterTankRelayData[0].Status : false
    }
    waterTankdataarr.push(combineData)

    res.status(200).send({
      code: 200,
      message: "success",
      data: waterTankdataarr
    });
  } catch (error) {
    console.log(error);
  }
}


liveStatusController.chiller = async (req, res) => {
  try {
    let id = req.params.id;
    let chillerData = await chillerTransaction.aggregate([
      { $match: { "CHLRTS_IoModuleID_str": id } },
      {
        $lookup: {
          from: 'chillermasters',
          localField: "CHLRTS_IoModuleID_str",
          foreignField: "CHLRM_DeviceId_Num",
          as: 'FirstTableData'
        }
      },
      {
        $unwind: {
          path: "$FirstTableData",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { "CHLRTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $project: {
          "DeviceId": "$CHLRTS_IoModuleID_str",
          "createdDate": "$CHLRTS_Created_Date",
          "phaseType": "$FirstTableData.CHLRM_PhaseType_Str",
          "Rpm": "$CHLRTS_RPM_Num",
          "Current": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.CHLRM_PhaseType_Str", "Single Phase"] },
              "then": "$CHLRTS_CurrentR_Num",
              "else": {
                $add: [{ "$abs": "$CHLRTS_CurrentB_Num" }, { "$abs": "$CHLRTS_CurrentY_Num" }, { "$abs": "$CHLRTS_CurrentR_Num" }]
              }
            }
          },
          "Power": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.CHLRM_PhaseType_Str", "Single Phase"] },
              "then": "$CHLRTS_PowerR_Num",
              "else": {
                $add: [{ "$abs": "$CHLRTS_PowerB_Num" }, { "$abs": "$CHLRTS_PowerY_Num" }, { "$abs": "$CHLRTS_PowerR_Num" }]
              }
            }
          },
          "Voltage": {
            "$cond": {
              "if": { "$eq": ["$FirstTableData.CHLRM_PhaseType_Str", "Single Phase"] },
              "then": "$CHLRTS_VoltageR_Num",
              "else": {
                $divide: [{ $add: [{ "$abs": "$CHLRTS_VoltageB_Num" }, { "$abs": "$CHLRTS_VoltageY_Num" }, { "$abs": "$CHLRTS_VoltageR_Num" }] }, 3]
              }
            }
          },
          "InletTemp": "$CHLRTS_InletTemprature_Num",
          "OutletTemp": "$CHLRTS_OutletTemprature_Num"
        }
      }
    ])

    let chillerRelayData = await chillerRelayTransaction.aggregate([
      { $match: { "CHLRTS_IoModuleID_str": id } },
      { $sort: { "CHLRTS_Created_Date": -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'chillermasters',
          localField: 'CHLRTS_IoModuleID_str',
          foreignField: 'CHLRM_DeviceId_Num',
          as: "secondTableData"
        }
      },
      {
        $project: {
          "StatusR": "$CHLRTS_RelayStatus_R_Bool",
          "StatusY": "$CHLRTS_RelayStatus_Y_Bool",
          "StatusB": "$CHLRTS_RelayStatus_B_Bool"
        }
      }
    ])

    let chillerdataarr = [];
    let combineData = {
      "DeviceId": chillerData[0].DeviceId,
      "createdDate": chillerData[0].createdDate,
      "Rpm": chillerData[0].Rpm,
      "Voltage": chillerData[0].Voltage,
      "Power": chillerData[0].Power,
      "Current": chillerData[0].Current,
      "InletTemp": chillerData[0].InletTemp,
      "OutletTemp": chillerData[0].OutletTemp,
      "PhaseType": chillerData[0].phaseType,
      "StatusR": (chillerRelayData.length > 0) ? chillerRelayData[0].StatusR : false,
      "StatusY": (chillerRelayData.length > 0) ? chillerRelayData[0].StatusY : false,
      "StatusB": (chillerRelayData.length > 0) ? chillerRelayData[0].StatusB : false

    }
    chillerdataarr.push(combineData)

    res.status(200).send({
      code: 200,
      message: "success",
      data: chillerdataarr
    });
  } catch (error) {
    console.log(error);
  }
}



export default liveStatusController;