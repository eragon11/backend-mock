
import AHU from "./ahuModel";
import * as _ from "lodash";

export default {
  findAll: function (req, res) {
    AHU.find({ 'AHUM_isActive_Bool': { $ne: false } }).populate('AHUM_Fk_LM_LocationID_Obj AHUM_Fk_SM_SiteID_Obj AHUM_Fk_BM_BuildingID_Obj AHUM_Fk_ZM_ZoneID_Obj AHUM_Fk_SubModuleId_Obj').exec(function (err, docs) {
      if (err) return res.send(err);
      res.send({ ahuMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    AHU.findOne({ '_id': id, 'AHUM_isActive_Bool': { $ne: false } }).populate('AHUM_Fk_LM_LocationID_Obj AHUM_Fk_SM_SiteID_Obj AHUM_Fk_BM_BuildingID_Obj AHUM_Fk_ZM_ZoneID_Obj AHUM_Fk_SubModuleId_Obj').exec(function (err, doc) {
      if (err) return res.send(err);
      res.send({ ahuMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_detection = await AHU.find({ "AHUM_DeviceId_Num": req.body.deviceId, 'AHUM_isActive_Bool': true });

    if (duplicate_detection.length == 0) {
      try {
        let ahu = new AHU({
          AHUM_DeviceId_Num: req.body.deviceId,
          AHUM_Device_Name_Str: req.body.deviceName,
          AHUM_Fk_LM_LocationID_Obj: req.body.locationId,
          AHUM_Fk_SM_SiteID_Obj: req.body.siteId,
          AHUM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          AHUM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          AHUM_Fk_SubModuleId_Obj: req.body.subModuleId,
          AHUM_AssetCode_Str: req.body.assetCode,
          AHUM_BrandName_Str: req.body.brandName,
          AHUM_PhaseType_Str: req.body.phaseType,
          AHUM_MinVoltage_Num: req.body.minVoltage,
          AHUM_MaxVoltage_Num: req.body.maxVoltage,
          AHUM_MaxCurrent_Num: req.body.maxCurrent,
          AHUM_MaxPower_Num: req.body.maxPower,
          AHUM_Brand_Str: req.body.brand,
          AHUM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          AHUM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          AHUM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          AHUM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          AHUM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          AHUM_MODBUS_Parity_Num: req.body.modbusParity,
          AHUM_RegStartAddress_Num: req.body.regStartAddress,
          AHUM_ByteLength_Num: req.body.byteLength,
          // AHUM_CreatedbyId_Str: req.body.createdBy,
          // AHUM_ModifiedbyId_Str: req.body.modifiedBy,
          // AHUM_CreatedIP_str: req.body.createdIP,
          // AHUM_ModifiedIP_str: req.body.modifiedIP
        });

        let ahu_data = await ahu.save();
        res.send({ code: 200, msg: 'Saved Successfully', ahuMasterData: ahu_data });
      } catch (error) {
        res.send({ code: 400, msg: 'Saved Not Successfully', ahuMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: 'Duplicate Occurred', ahuMasterData: [] });
    }
  },

  update: async function (req, res) {
    let id = req.params.id;

    let duplicate_detection = await AHU.find({ "AHUM_DeviceId_Num": req.body.deviceId, 'AHUM_isActive_Bool': true });

    if (duplicate_detection.length == 0) {
      try {
        let updateDoc = {
          AHUM_DeviceId_Num: req.body.deviceId,
          AHUM_Device_Name_Str: req.body.deviceName,
          AHUM_Fk_LM_LocationID_Obj: req.body.locationId,
          AHUM_Fk_SM_SiteID_Obj: req.body.siteId,
          AHUM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          AHUM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          AHUM_Fk_SubModuleId_Obj: req.body.subModuleId,
          AHUM_AssetCode_Str: req.body.assetCode,
          AHUM_BrandName_Str: req.body.brandName,
          AHUM_PhaseType_Str: req.body.phaseType,
          AHUM_MinVoltage_Num: req.body.minVoltage,
          AHUM_MaxVoltage_Num: req.body.maxVoltage,
          AHUM_MaxCurrent_Num: req.body.maxCurrent,
          AHUM_MaxPower_Num: req.body.maxPower,
          AHUM_Brand_Str: req.body.brand,
          AHUM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          AHUM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          AHUM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          AHUM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          AHUM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          AHUM_MODBUS_Parity_Num: req.body.modbusParity,
          AHUM_RegStartAddress_Num: req.body.regStartAddress,
          AHUM_ByteLength_Num: req.body.byteLength,
          // AHUM_CreatedbyId_Str: req.body.createdBy,
          // AHUM_ModifiedbyId_Str: req.body.modifiedBy,
          // AHUM_CreatedIP_str: req.body.createdIP,
          // AHUM_ModifiedIP_str: req.body.modifiedIP
        }
        let ahu_data = await AHU.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: 'Updated Successfully', ahuMasterData: ahu_data });
      } catch (error) {
        res.send({ code: 400, msg: 'Updated Not Successfully', ahuMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: 'Duplicate Occurred', ahuMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      AHUM_isActive_Bool: false
    }

    AHU.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ ahuMasterData: doc });
    });
  }


}