import pump from './pumpModel';

const pumpController = {};

// common success and error response...
pumpController.successmsg = async (res, pumpMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    pumpMasterData
  })
}

pumpController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    pumpMasterData: []
  })
}

//pump find all records
pumpController.findAll = async (req, res) => {

  try {
    const pumpall = await pump.find({ 'PUMPM_IsActive_bool': true }).populate('PUMPM_Fk_ZM_ZoneID_Num PUMPM_Fk_SubModuleId_Obj PUMPM_Fk_LM_LocationID_Obj PUMPM_Fk_SM_SiteID_Obj PUMPM_Fk_BM_BuildingID_Obj PUMPM_Fk_ZM_ZoneID_Obj');
    pumpController.successmsg(res, pumpall, 'found All Successfully');

  } catch (error) {
    console.log(error);
    pumpController.errormsg(res, error);
  }
}

//pump find single record
pumpController.find = async (req, res) => {
  try {
    let pump_id = req.params.id;
    console.log(pump_id);

    const pumpOne = await pump.findOne({ '_id': pump_id, 'PUMPM_IsActive_bool': true }).populate('PUMPM_Fk_ZM_ZoneID_Num PUMPM_Fk_SubModuleId_Obj PUMPM_Fk_LM_LocationID_Obj PUMPM_Fk_SM_SiteID_Obj PUMPM_Fk_BM_BuildingID_Obj PUMPM_Fk_ZM_ZoneID_Obj');
    pumpController.successmsg(res, pumpOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    pumpController.errormsg(res, error);
  }
}


//pump save 
pumpController.insert = async (req, res) => {

  let duplicate_data = await pump.find({ "PUMPM_DeviceId_Num": req.body.deviceId, 'PUMPM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let pumpObj = new pump({
        PUMPM_DeviceId_Num: req.body.deviceId,
        PUMPM_Device_Name_Str: req.body.deviceName,
        PUMPM_Fk_LM_LocationID_Obj: req.body.locationId,
        PUMPM_Fk_SM_SiteID_Obj: req.body.siteId,
        PUMPM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        PUMPM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        PUMPM_AssetCode_Str: req.body.assetCode,
        PUMPM_PumpType_Str: req.body.pumpType,
        PUMPM_MaxRPM_Num: req.body.maxRPM,
        PUMPM_Fk_SubModuleId_Obj: req.body.subModuleId,
        PUMPM_Brand_Str: req.body.brand,
        PUMPM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        PUMPM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        PUMPM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        PUMPM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        PUMPM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        PUMPM_MODBUS_Parity_Num: req.body.modbusParity,
        PUMPM_RegStartAddress_Num: req.body.regStartAddress,
        PUMPM_ByteLength_Num: req.body.byteLength,
        // PUMPM_CreatedbyId_obj: req.body.createdById,
        // PUMPM_ModifiedbyId_obj: req.body.modifiedById,
        // PUMPM_CreatedIP_str: req.body.createdIP,
        // PUMPM_ModifiedIP_str: req.body.modifiedIp,
      });

      const pumpinsert = await pumpObj.save();
      pumpController.successmsg(res, pumpinsert, 'Saved Successfully')

    } catch (error) {
      console.log(error);
      pumpController.errormsg(res, error);
    }
  } else {
    pumpController.errormsg(res, "Duplicate Occurred");
  }
}

//pump update all
pumpController.update = async (req, res) => {

  let duplicate_data = await pump.find({ "PUMPM_DeviceId_Num": req.body.deviceId, 'PUMPM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let pump_id = req.params.id
      let pumpObj = {
        PUMPM_DeviceId_Num: req.body.deviceId,
        PUMPM_Device_Name_Str: req.body.deviceName,
        PUMPM_Fk_LM_LocationID_Obj: req.body.locationId,
        PUMPM_Fk_SM_SiteID_Obj: req.body.siteId,
        PUMPM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        PUMPM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        PUMPM_AssetCode_Str: req.body.assetCode,
        PUMPM_PumpType_Str: req.body.pumpType,
        PUMPM_MaxRPM_Num: req.body.maxRPM,
        PUMPM_Fk_SubModuleId_Obj: req.body.subModuleId,
        PUMPM_Brand_Str: req.body.brand,
        PUMPM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        PUMPM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        PUMPM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        PUMPM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        PUMPM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        PUMPM_MODBUS_Parity_Num: req.body.modbusParity,
        PUMPM_RegStartAddress_Num: req.body.regStartAddress,
        PUMPM_ByteLength_Num: req.body.byteLength,
        // PUMPM_CreatedbyId_obj: req.body.createdById,
        // PUMPM_ModifiedbyId_obj: req.body.modifiedById,
        // PUMPM_CreatedIP_str: req.body.createdIP,
        // PUMPM_ModifiedIP_str: req.body.modifiedIp,
      };

      const pumpupdate = await pump.findByIdAndUpdate(pump_id, pumpObj, { new: true });
      pumpController.successmsg(res, pumpupdate, 'Updated Successfully')

    } catch (error) {
      console.log(error);
      pumpController.errormsg(res, error);
    }
  } else {
    pumpController.errormsg(res, 'Duplicate Occurred');
  }
}

//pump delete soft
pumpController.delete = async (req, res) => {
  try {
    let pump_id = req.params.id;
    let pumpObj = {
      PUMPM_IsActive_bool: false
    }
    const soft_delete_pump = await pump.findByIdAndUpdate(pump_id, pumpObj, { new: true });
    pumpController.successmsg(res, soft_delete_pump, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    pumpController.errormsg(res, error)
  }
}

export default pumpController;