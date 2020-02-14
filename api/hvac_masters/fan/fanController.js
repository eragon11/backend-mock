import Fan from "./fanModel";


export default {
  findAll: function (req, res) {
    Fan.find({ 'FANM_IsActive_bool': true }).populate('FANM_Fk_SubModuleId_Obj FANM_Fk_ZM_ZoneID_Obj FANM_Fk_LM_LocationID_Obj FANM_Fk_BM_BuildingID_Obj FANM_Fk_SM_SiteID_Obj')
      .exec(function (err, docs) {
        if (err) {
          res.send(err);
        }
        res.send({ fanMasterData: docs });
      });
  },

  find: function (req, res) {
    let _id = req.params.id;
    Fan.findById(_id).populate('FANM_Fk_SubModuleId_Obj FANM_Fk_ZM_ZoneID_Obj FANM_Fk_LM_LocationID_Obj FANM_Fk_BM_BuildingID_Obj FANM_Fk_SM_SiteID_Obj')
      .exec(function (err, doc) {
        if (err) {
          res.send(err);
        }
        res.send({ fanMasterData: doc });
      });
  },

  insert: async function (req, res) {

    let duplicate_data = await Fan.find({ "FANM_DeviceId_Str": req.body.deviceId, 'FANM_IsActive_bool': true });

    if (duplicate_data.length == 0) {
      try {
        let fan = new Fan({
          FANM_DeviceId_Str: req.body.deviceId,
          FANM_Device_Name_Str: req.body.deviceName,
          FANM_Fk_LM_LocationID_Obj: req.body.locationId,
          FANM_Fk_SM_SiteID_Obj: req.body.siteId,
          FANM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          FANM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          FANM_AssetCode_Str: req.body.assetCode,
          FANM_MaxRPM_Num: req.body.maxRPM,
          FANM_Fk_SubModuleId_Obj: req.body.subModuleId,
          FANM_Brand_Str: req.body.brand,
          FANM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          FANM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          FANM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          FANM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          FANM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          FANM_MODBUS_Parity_Num: req.body.modbusParity,
          FANM_RegStartAddress_Num: req.body.regStartAddress,
          FANM_ByteLength_Num: req.body.byteLength,
          // FANM_CreatedbyId_Obj: req.body.createdById,
          // FANM_ModifiedbyId_Obj: req.body.modifiedById,
          // FANM_CreatedIP_str: req.body.createdIP
          // FANM_ModifiedIP_str: req.body.modifiedIP

        });

        let fan_data = await fan.save();
        res.send({ code: 200, msg: "Saved Successfully", fanMasterData: fan_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", fanMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Error", fanMasterData: [] });
    }
  },

  update: async function (req, res) {

    let id = req.params.id;

    let duplicate_data = await Fan.find({ "FANM_DeviceId_Str": req.body.deviceId, 'FANM_IsActive_bool': true });

    if (duplicate_data.length == 0) {
      try {
        let updateDoc = {
          FANM_DeviceId_Str: req.body.deviceId,
          FANM_Device_Name_Str: req.body.deviceName,
          FANM_Fk_LM_LocationID_Obj: req.body.locationId,
          FANM_Fk_SM_SiteID_Obj: req.body.siteId,
          FANM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          FANM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          FANM_AssetCode_Str: req.body.assetCode,
          FANM_MaxRPM_Num: req.body.maxRPM,
          FANM_Fk_SubModuleId_Obj: req.body.subModuleId,
          FANM_Brand_Str: req.body.brand,
          FANM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          FANM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          FANM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          FANM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          FANM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          FANM_MODBUS_Parity_Num: req.body.modbusParity,
          FANM_RegStartAddress_Num: req.body.regStartAddress,
          FANM_ByteLength_Num: req.body.byteLength,
          // FANM_CreatedbyId_Obj: req.body.createdById,
          // FANM_ModifiedbyId_Obj: req.body.modifiedById,
          // FANM_CreatedIP_str: req.body.createdIP
          // FANM_ModifiedIP_str: req.body.modifiedIP
        }

        let fan_data = await Fan.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Updated Successfully", fanMasterData: fan_data });
      } catch (error) {
        res.send({ code: 200, msg: "Updated Not Successfully", fanMasterData: [] });
      }
    } else {
      res.send({ code: 200, msg: "Duplicate Occurred", fanMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      FANM_IsActive_bool: false
    }

    Fan.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ fanMasterData: doc });
    });
  }
}