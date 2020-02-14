
import HVACPANEL from "./hvacPanelModel";

export default {
  findAll: function (req, res) {
    HVACPANEL.find({ 'HVACP_isActive_Bool': { $ne: false } }).populate('HVACP_Fk_LM_LocationID_Obj HVACP_Fk_SM_SiteID_Obj HVACP_Fk_BM_BuildingID_Obj HVACP_Fk_ZM_ZoneID_Obj HVACP_Fk_SubModuleId_Obj').exec(function (err, docs) {
      if (err) return res.send(err);
      res.send({ hvacPanelMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    HVACPANEL.findOne({ '_id': id, 'HVACP_isActive_Bool': { $ne: false } }).populate('HVACP_Fk_LM_LocationID_Obj HVACP_Fk_SM_SiteID_Obj HVACP_Fk_BM_BuildingID_Obj HVACP_Fk_ZM_ZoneID_Obj HVACP_Fk_SubModuleId_Obj').exec(function (err, doc) {
      if (err) return res.send(err);
      res.send({ hvacPanelMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await HVACPANEL.find({ "HVACP_DeviceId_Num": req.body.deviceId, 'HVACP_isActive_Bool': true });

    if (duplicate_data.length == 0) {
      try {
        let hvacPanel = new HVACPANEL({
          HVACP_DeviceId_Num: req.body.deviceId,
          HVACP_Device_Name_Str: req.body.deviceName,
          HVACP_Fk_LM_LocationID_Obj: req.body.locationId,
          HVACP_Fk_SM_SiteID_Obj: req.body.siteId,
          HVACP_Fk_BM_BuildingID_Obj: req.body.buildingId,
          HVACP_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          HVACP_Fk_SubModuleId_Obj: req.body.subModuleId,
          HVACP_AssetCode_Str: req.body.assetCode,
          HVACP_BrandName_Str: req.body.brandName,
          HVACP_PhaseType_Str: req.body.phaseType,
          HVACP_MinVoltage_Num: req.body.minVoltage,
          HVACP_MaxVoltage_Num: req.body.maxVoltage,
          HVACP_MaxCurrent_Num: req.body.maxCurrent,
          HVACP_MaxPower_Num: req.body.maxPower,
          HVACP_Brand_Str: req.body.brand,
          HVACP_DataLogger_Mode_Str: req.body.dataLoggerMode,
          HVACP_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          HVACP_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          HVACP_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          HVACP_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          HVACP_MODBUS_Parity_Num: req.body.modbusParity,
          HVACP_RegStartAddress_Num: req.body.regStartAddress,
          HVACP_ByteLength_Num: req.body.byteLength,
          // HVACP_CreatedbyId_Str: req.body.createdBy,
          // HVACP_ModifiedbyId_Str: req.body.modifiedBy,
          // HVACP_CreatedIP_str: req.body.createdIP,
          // HVACP_ModifiedIP_str: req.body.modifiedIP
        });

        let hvac_panel_data = await hvacPanel.save();
        res.send({ code: 200, msg: "Saved Successfully", hvacPanelMasterData: hvac_panel_data });
      } catch (error) {
        res.send({ code: 200, msg: "Saved Not Successfully", hvacPanelMasterData: [] });
      }
    } else {
      res.send({ code: 200, msg: "Duplicate Occurred", hvacPanelMasterData: [] });
    }
  },

  update: async function (req, res) {
    let id = req.params.id;

    let duplicate_data = await HVACPANEL.find({ "HVACP_DeviceId_Num": req.body.deviceId, 'HVACP_isActive_Bool': true });

    if (duplicate_data.length == 0) {
      try {
        let updateDoc = {
          HVACP_DeviceId_Num: req.body.deviceId,
          HVACP_Device_Name_Str: req.body.deviceName,
          HVACP_Fk_LM_LocationID_Obj: req.body.locationId,
          HVACP_Fk_SM_SiteID_Obj: req.body.siteId,
          HVACP_Fk_BM_BuildingID_Obj: req.body.buildingId,
          HVACP_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          HVACP_Fk_SubModuleId_Obj: req.body.subModuleId,
          HVACP_AssetCode_Str: req.body.assetCode,
          HVACP_BrandName_Str: req.body.brandName,
          HVACP_PhaseType_Str: req.body.phaseType,
          HVACP_MinVoltage_Num: req.body.minVoltage,
          HVACP_MaxVoltage_Num: req.body.maxVoltage,
          HVACP_MaxCurrent_Num: req.body.maxCurrent,
          HVACP_MaxPower_Num: req.body.maxPower,
          HVACP_Brand_Str: req.body.brand,
          HVACP_DataLogger_Mode_Str: req.body.dataLoggerMode,
          HVACP_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          HVACP_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          HVACP_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          HVACP_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          HVACP_MODBUS_Parity_Num: req.body.modbusParity,
          HVACP_RegStartAddress_Num: req.body.regStartAddress,
          HVACP_ByteLength_Num: req.body.byteLength,
          // HVACP_CreatedbyId_Str: req.body.createdBy,
          // HVACP_ModifiedbyId_Str: req.body.modifiedBy,
          // HVACP_CreatedIP_str: req.body.createdIP,
          // HVACP_ModifiedIP_str: req.body.modifiedIP
        }

        let hvac_panel_data = await HVACPANEL.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Saved Successfully", hvacPanelMasterData: hvac_panel_data });
      } catch (error) {
        res.send({ code: 200, msg: "Saved Not Successfully", hvacPanelMasterData: [] });
      }
    } else {
      res.send({ code: 200, msg: "Duplicate Occurred", hvacPanelMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      HVACP_isActive_Bool: false
    }
    HVACPANEL.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ hvacPanelMasterData: doc });
    });
  }
}