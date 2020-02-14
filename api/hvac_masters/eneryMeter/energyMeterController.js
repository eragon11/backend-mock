import EnergyMeter from "./energyMeterModel";

export default {
  findAll: function (req, res) {
    EnergyMeter.find({ 'EMM_Is_Deleted_bool': false }).populate('EMM_Fk_PanelId_obj EMM_Fk_CircuitBreakerId_obj EMM_Fk_EquipmentId_obj EMM_Fk_LM_LocationID_Obj EMM_Fk_BM_BuildingID_Obj EMM_Fk_SM_SiteID_Obj EMM_Fk_ZM_ZoneID_Obj EMM_Fk_MainModuleId_obj').exec(function (err, docs) {
      if (err) {
        res.send({ err: err })
      }
      res.send({ energyMeterMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    EnergyMeter.findById({ '_id': id, 'EMM_Is_Deleted_bool': false }).populate('EMM_Fk_PanelId_obj EMM_Fk_CircuitBreakerId_obj EMM_Fk_EquipmentId_obj EMM_Fk_LM_LocationID_Obj EMM_Fk_BM_BuildingID_Obj EMM_Fk_SM_SiteID_Obj EMM_Fk_ZM_ZoneID_Obj EMM_Fk_MainModuleId_obj').exec(function (err, doc) {
      if (err) {
        res.send({ err: err })
      }
      res.send({ energyMeterMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await EnergyMeter.find({ "EMM_DeviceId_Str": req.body.deviceId, EMM_Device_Name_Str: req.body.deviceName, 'EMM_Is_Deleted_bool': false });

    if (duplicate_data.length == 0) {
      try {
        let energyMeter = new EnergyMeter({
          EMM_DeviceId_Str: req.body.deviceId,
          EMM_Device_Name_Str: req.body.deviceName,
          EMM_DeviceDisplayName_Str: req.body.displayName,
          EMM_Fk_PanelId_obj: req.body.panelId,
          EMM_Fk_CircuitBreakerId_obj: req.body.circuitBreakerId,
          EMM_Fk_EquipmentId_obj: req.body.equipmentId,
          EMM_Fk_LM_LocationID_Obj: req.body.locationId,
          EMM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          EMM_Fk_SM_SiteID_Obj: req.body.siteId,
          EMM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          EMM_Fk_MainModuleId_obj: req.body.mainModuleId,
          EMM_AssetCode_Str: req.body.assetCode,
          EMM_PhaseType_int: req.body.phaseType,
          EMM_VoltageRupper_Num: req.body.voltageRupper,
          EMM_VoltageRlow_Num: req.body.voltageRlow,
          EMM_VoltageYupper_Num: req.body.voltageYupper,
          EMM_VoltageYlow_Num: req.body.voltageYlow,
          EMM_VoltageBupper_Num: req.body.voltageBupper,
          EMM_VoltageBlow_Num: req.body.voltageBlow,
          EMM_CurrentRupper_Num: req.body.currentRupper,
          EMM_CurrentYupper_Num: req.body.currentYupper,
          EMM_CurrentBupper_Num: req.body.currentBupper,
          EMM_PowerRupper_Num: req.body.powerRupper,
          EMM_PowerYupper_Num: req.body.powerYupper,
          EMM_PowerBupper_Num: req.body.powerBupper,
          EMM_PowerTupper_Num: req.body.powerTupper,
          EMM_PowerTlow_Num: req.body.powerTlow,
          EMM_PowerUnit_Num: req.body.powerUnit,
          EMM_PFRlow_Num: req.body.PFRlow,
          EMM_PFYlow_Num: req.body.PFYlow,
          EMM_PFBlow_Num: req.body.PFBlow,
          EMM_EnergyR_Num: req.body.energyR,
          EMM_EnergyY_Num: req.body.energyY,
          EMM_EnergyB_Num: req.body.energyB,
          EMM_EnergyT_Num: req.body.energyT,
          EMM_Energy_Unit_Num: req.body.energyUnit,
          EMM_Frequency_Num: req.body.frequency,
          EMM_Brand_Str: req.body.brand,
          EMM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          EMM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          EMM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          EMM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          EMM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          EMM_MODBUS_Parity_Num: req.body.modbusParity,
          EMM_RegStartAddress_Num: req.body.regStartAddress,
          EMM_ByteLength_Num: req.body.byteLength,
          // EMM_CreatedbyId_obj: req.body.createdBy,
          // EMM_ModifiedbyId_obj: req.body.modifiedBy,
          // EMM_CreatedIP_str: req.body.createdByIP,
          // EMM_ModifiedIP_str: req.body.modifiedByIP
        });
        let energy_meter_data = await energyMeter.save();
        res.send({ code: 200, msg: "Saved Successfully", energyMeterMasterData: energy_meter_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", energyMeterMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", energyMeterMasterData: [] })
    }
  },

  update: async function (req, res) {
    let id = req.params.id;

    let duplicate_data = await EnergyMeter.find({ "EMM_DeviceId_Str": req.body.deviceId, EMM_Device_Name_Str: req.body.deviceName, 'EMM_Is_Deleted_bool': false });

    if (duplicate_data.length == 0) {
      try {
        let updateDoc = {
          EMM_DeviceId_Str: req.body.deviceId,
          EMM_Device_Name_Str: req.body.deviceName,
          EMM_DeviceDisplayName_Str: req.body.displayName,
          EMM_Fk_PanelId_obj: req.body.panelId,
          EMM_Fk_CircuitBreakerId_obj: req.body.circuitBreakerId,
          EMM_Fk_EquipmentId_obj: req.body.equipmentId,
          EMM_Fk_LM_LocationID_Obj: req.body.locationId,
          EMM_Fk_BM_BuildingID_Obj: req.body.buildingId,
          EMM_Fk_SM_SiteID_Obj: req.body.siteId,
          EMM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
          EMM_Fk_MainModuleId_obj: req.body.mainModuleId,
          EMM_AssetCode_Str: req.body.assetCode,
          EMM_PhaseType_int: req.body.phaseType,
          EMM_VoltageRupper_Num: req.body.voltageRupper,
          EMM_VoltageRlow_Num: req.body.voltageRlow,
          EMM_VoltageYupper_Num: req.body.voltageYupper,
          EMM_VoltageYlow_Num: req.body.voltageYlow,
          EMM_VoltageBupper_Num: req.body.voltageBupper,
          EMM_VoltageBlow_Num: req.body.voltageBlow,
          EMM_CurrentRupper_Num: req.body.currentRupper,
          EMM_CurrentYupper_Num: req.body.currentYupper,
          EMM_CurrentBupper_Num: req.body.currentBupper,
          EMM_PowerRupper_Num: req.body.powerRupper,
          EMM_PowerYupper_Num: req.body.powerYupper,
          EMM_PowerBupper_Num: req.body.powerBupper,
          EMM_PowerTupper_Num: req.body.powerTupper,
          EMM_PowerTlow_Num: req.body.powerTlow,
          EMM_PowerUnit_Num: req.body.powerUnit,
          EMM_PFRlow_Num: req.body.PFRlow,
          EMM_PFYlow_Num: req.body.PFYlow,
          EMM_PFBlow_Num: req.body.PFBlow,
          EMM_EnergyR_Num: req.body.energyR,
          EMM_EnergyY_Num: req.body.energyY,
          EMM_EnergyB_Num: req.body.energyB,
          EMM_EnergyT_Num: req.body.energyT,
          EMM_Energy_Unit_Num: req.body.energyUnit,
          EMM_Frequency_Num: req.body.frequency,
          EMM_Brand_Str: req.body.brand,
          EMM_DataLogger_Mode_Str: req.body.dataLoggerMode,
          EMM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
          EMM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
          EMM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
          EMM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
          EMM_MODBUS_Parity_Num: req.body.modbusParity,
          EMM_RegStartAddress_Num: req.body.regStartAddress,
          EMM_ByteLength_Num: req.body.byteLength,
          // EMM_CreatedbyId_obj: req.body.createdBy,
          // EMM_ModifiedbyId_obj: req.body.modifiedBy,
          // EMM_CreatedIP_str: req.body.createdByIP,
          // EMM_ModifiedIP_str: req.body.modifiedByIP
        }

        let energy_meter_data = await EnergyMeter.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Saved Successfully", energyMeterMasterData: energy_meter_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", energyMeterMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", energyMeterMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    EnergyMeter.findOneAndUpdate({ _id: id }, { 'EMM_Is_Deleted_bool': true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ energyMeterMasterData: doc })
    });
  }

}


