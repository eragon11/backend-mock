import ZoneTemprature from "./zoneTempratureModel";


export default {
  findAll: function (req, res) {
    ZoneTemprature.find({ "ZNTM_IsActive_Bool": true }).populate('ZNTM_Fk_ZM_ZoneID_Obj ZNTM_Fk_LM_LocationID_Obj ZNTM_Fk_SM_SiteID_Obj ZNTM_Fk_BM_BuildingID_Obj ZNTM_Fk_SubModuleId_Obj').exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send({ zoneTempratureMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    ZoneTemprature.findById({ _id: id, "ZNTM_IsActive_Bool": true }).populate('ZNTM_Fk_ZM_ZoneID_Obj ZNTM_Fk_LM_LocationID_Obj ZNTM_Fk_SM_SiteID_Obj ZNTM_Fk_BM_BuildingID_Obj ZNTM_Fk_SubModuleId_Obj').exec(function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ zoneTempratureMasterData: doc });
    });
  },

  insert: async function (req, res) {
    let duplicate_data = await ZoneTemprature.find({ ZNTM_DeviceId_Str: req.body.deviceId, "ZNTM_IsActive_Bool": true });
    if (duplicate_data.length == 0) {
      try {
        let zoneTemperature = new ZoneTemprature({
          ZNTM_DeviceId_Str: req.body.deviceId,
          ZNTM_Device_Name_Str: req.body.deviceName,
          ZNTM_Fk_LM_LocationID_Obj: req.body.locationId,
          ZNTM_Fk_SM_SiteID_Obj: req.body.siteId,
          ZNTM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          ZNTM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          ZNTM_AssetCode_Str: req.body.assetCode,
          ZNTM_TemperatureUpp_Num: req.body.tempratureUp,
          ZNTM_TemperatureLow_Num: req.body.tempratureLow,
          ZNTM_HumidityUpp_Num: req.body.humidityUp,
          ZNTM_HumidityLow_Num: req.body.humidityLow,
          ZNTM_OccupyType_Str: req.body.occupyType,
          ZNTM_Fk_SubModuleId_Obj: req.body.subModuleId,
          ZNTM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          ZNTM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          ZNTM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          ZNTM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          ZNTM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          ZNTM_MODBUS_Parity_Num: req.body.modbusParity,
          ZNTM_RegStartAddress_Num: req.body.regStartAddress,
          ZNTM_ByteLength_Num: req.body.byteLength,
          // ZNTM_CreatedbyId_Obj: req.body.createdById,
          // ZNTM_ModifiedbyId_Obj: req.body.modifiedById,
          // ZNTM_CreatedIP_str: req.body.createdIP,
          // ZNTM_ModifiedIP_str: req.body.modifiedIP
        });

        let zone_temp_data = await zoneTemperature.save();
        res.send({ code: 200, msg: "Saved Successfully", zoneTempratureMasterData: zone_temp_data })
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", zoneTempratureMasterData: [] })
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", zoneTempratureMasterData: [] })
    }
  },

  update: async function (req, res) {
    let duplicate_data = await ZoneTemprature.find({ ZNTM_DeviceId_Str: req.body.deviceId, "ZNTM_IsActive_Bool": true });
    if (duplicate_data.length == 0) {
      try {
        let id = req.params.id;
        let updateDoc = {
          ZNTM_DeviceId_Str: req.body.deviceId,
          ZNTM_Device_Name_Str: req.body.deviceName,
          ZNTM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          ZNTM_AssetCode_Str: req.body.assetCode,
          ZNTM_TemperatureUpp_Num: req.body.tempratureUp,
          ZNTM_TemperatureLow_Num: req.body.tempratureLow,
          ZNTM_HumidityUpp_Num: req.body.humidityUp,
          ZNTM_HumidityLow_Num: req.body.humidityLow,
          ZNTM_OccupyType_Str: req.body.occupyType,
          ZNTM_Fk_SubModuleId_Obj: req.body.subModuleId,
          ZNTM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          ZNTM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          ZNTM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          ZNTM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          ZNTM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          ZNTM_MODBUS_Parity_Num: req.body.modbusParity,
          ZNTM_RegStartAddress_Num: req.body.regStartAddress,
          ZNTM_ByteLength_Num: req.body.byteLength,
          // ZNTM_CreatedbyId_Obj: req.body.createdById,
          // ZNTM_ModifiedbyId_Obj: req.body.modifiedById,
          // ZNTM_CreatedIP_str: req.body.createdIP,
          // ZNTM_ModifiedIP_str: req.body.modifiedIP
        }
        ZoneTemprature.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
          if (err) {
            console.log(err);
            res.send(err);
          }
          res.send({ zoneTempratureMasterData: doc });
        });
        let zone_temp_data = await ZoneTemprature.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Saved Successfully", zoneTempratureMasterData: zone_temp_data })
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", zoneTempratureMasterData: [] })
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", zoneTempratureMasterData: [] })
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      ZNTM_IsActive_Bool: false
    }

    ZoneTemprature.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ zoneTempratureMasterData: doc });
    });
  }
}