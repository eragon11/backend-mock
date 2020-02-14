import Compressor from "./compressorModel";

export default {
  findAll: function (req, res) {
    Compressor.find({ "COMPM_Is_Deleted_Bool": false }).populate('COMPM_Fk_LM_LocationID_Obj COMPM_Fk_SM_SiteID_Obj COMPM_Fk_BM_BuildingID_Obj COMPM_Fk_ZM_ZoneID_Obj COMPM_Fk_SubModuleId_Obj').exec(function (err, docs) {
      if (err) {
        res.send({ err: err })
      }
      res.send({ compressorMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    Compressor.findById({ _id: id, "COMPM_Is_Deleted_Bool": false }).populate('COMPM_Fk_LM_LocationID_Obj COMPM_Fk_SM_SiteID_Obj COMPM_Fk_BM_BuildingID_Obj COMPM_Fk_ZM_ZoneID_Obj COMPM_Fk_SubModuleId_Obj').exec(function (err, doc) {
      res.send({ compressorMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await Compressor.find({ "COMPM_DeviceId_Num": req.body.deviceId, "COMPM_Is_Deleted_Bool": false });
    if (duplicate_data.length == 0) {
      try {
        let compressor = new Compressor({
          COMPM_DeviceId_Num: req.body.deviceId,
          COMPM_Device_Name_Str: req.body.deviceName,
          COMPM_Fk_LM_LocationID_Obj: req.body.locationId,
          COMPM_Fk_SM_SiteID_Obj: req.body.siteId,
          COMPM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          COMPM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          COMPM_Fk_SubModuleId_Obj: req.body.subModuleId,
          COMPM_AssetCode_Str: req.body.assetCode,
          COMPM_BrandName_Str: req.body.brandName,
          COMPM_PhaseType_Str: req.body.phaseType,
          COMPM_MinVoltage_Num: req.body.minVoltage,
          COMPM_MaxVoltage_Num: req.body.maxVoltage,
          COMPM_MaxCurrent_Num: req.body.maxCurrent,
          COMPM_MaxPower_Num: req.body.maxPower,
          COMPM_MaxRPM_Num: req.body.maxRPM,
          COMPM_Brand_Str: req.body.brand,
          COMPM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          COMPM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          COMPM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          COMPM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          COMPM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          COMPM_MODBUS_Parity_Num: req.body.modbusParity,
          COMPM_RegStartAddress_Num: req.body.regStartAddress,
          COMPM_ByteLength_Num: req.body.byteLength,
          // COMPM_CreatedbyId_Str: req.body.createdBy,
          // COMPM_ModifiedbyId_Str: req.body.modifiedBy,
          // COMPM_CreatedIP_str: req.body.createdIP,
          // COMPM_ModifiedIP_str: req.body.modifiedIP
        });
        let compressor_data = await compressor.save();
        res.send({ code: 200, msg: "Saved Successfully", compressorMasterData: compressor_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", compressorMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", compressorMasterData: [] });
    }
  },

  update: async function (req, res) {
    let id = req.params.id;

    let duplicate_data = await Compressor.find({ "COMPM_DeviceId_Num": req.body.deviceId, "COMPM_Is_Deleted_Bool": false });
    if (duplicate_data.length == 0) {
      try {
        let updateDoc = {
          COMPM_DeviceId_Num: req.body.deviceId,
          COMPM_Device_Name_Str: req.body.deviceName,
          COMPM_Fk_LM_LocationID_Obj: req.body.locationId,
          COMPM_Fk_SM_SiteID_Obj: req.body.siteId,
          COMPM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          COMPM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          COMPM_Fk_SubModuleId_Obj: req.body.subModuleId,
          COMPM_AssetCode_Str: req.body.assetCode,
          COMPM_BrandName_Str: req.body.brandName,
          COMPM_PhaseType_Str: req.body.phaseType,
          COMPM_MinVoltage_Num: req.body.minVoltage,
          COMPM_MaxVoltage_Num: req.body.maxVoltage,
          COMPM_MaxCurrent_Num: req.body.maxCurrent,
          COMPM_MaxPower_Num: req.body.maxPower,
          COMPM_MaxRPM_Num: req.body.maxRPM,
          COMPM_Brand_Str: req.body.brand,
          COMPM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          COMPM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          COMPM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          COMPM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          COMPM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          COMPM_MODBUS_Parity_Num: req.body.modbusParity,
          COMPM_RegStartAddress_Num: req.body.regStartAddress,
          COMPM_ByteLength_Num: req.body.byteLength,
          // COMPM_CreatedbyId_Str: req.body.createdBy,
          // COMPM_ModifiedbyId_Str: req.body.modifiedBy,
          // COMPM_CreatedIP_str: req.body.createdIP,
          // COMPM_ModifiedIP_str: req.body.modifiedIP
        }
        let compressor_data = await Compressor.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Updated Successfully", compressorMasterData: compressor_data });
      } catch (error) {
        res.send({ code: 200, msg: "Updated Not Successfully", compressorMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", compressorMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let compObj = {
      "COMPM_Is_Deleted_Bool": true
    }
    Compressor.findOneAndUpdate({ _id: id }, compObj, function (doc) {
      res.send({ compressorMasterData: doc })
    });
  }
}