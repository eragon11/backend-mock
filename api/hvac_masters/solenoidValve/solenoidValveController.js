import SolenoidValve from "./solenoidValveModel";

var solenoidValve = {};

var successResponse = (res, msg, data) => {
  res.status(200).send({
    message: msg,
    solenoidValveMasterData: data
  });
}

var errorResponse = (res, msg) => {
  res.status(400).send({
    message: msg,
    solenoidValveMasterData: []
  });
}

solenoidValve.findAll = async (req, res) => {
  try {
    let solenoidValveDocs = await SolenoidValve.find({ 'SOVM_IsActive_bool': { $ne: false } }).populate('SOVM_Fk_LM_LocationID_Obj SOVM_Fk_SM_SiteID_Obj SOVM_Fk_BM_BuildingID_Obj SOVM_Fk_ZM_ZoneID_Obj SOVM_Fk_SubModuleId_Obj');
    successResponse(res, "sucess", solenoidValveDocs);
  } catch (error) {
    errorResponse(res, error);
  }
}

solenoidValve.find = async (req, res) => {
  try {
    let id = req.params.id;
    let solenoidValveDoc = await SolenoidValve.findOne({ '_id': id, 'SOVM_IsActive_bool': { $ne: false } }).populate('SOVM_Fk_LM_LocationID_Obj SOVM_Fk_SM_SiteID_Obj SOVM_Fk_BM_BuildingID_Obj SOVM_Fk_ZM_ZoneID_Obj SOVM_Fk_SubModuleId_Obj')
    successResponse(res, "success", solenoidValveDoc);
  } catch (error) {
    errorResponse(res, error);
  }
}

solenoidValve.insert = async (req, res) => {

  let duplicate_data = await SolenoidValve.find({ "SOVM_DeviceId_Num": req.body.deviceId, 'SOVM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let solenoidvalve = new SolenoidValve({
        SOVM_DeviceId_Num: req.body.deviceId,
        SOVM_Device_Name_Str: req.body.deviceName,
        SOVM_Fk_LM_LocationID_Obj: req.body.locationId,
        SOVM_Fk_SM_SiteID_Obj: req.body.siteId,
        SOVM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        SOVM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        SOVM_AssetCode_Str: req.body.assetCode,
        SOVM_Waterflowrate_Num: req.body.waterFlowRate,
        SOVM_Fk_SubModuleId_Obj: req.body.subModuleId,
        SOVM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        SOVM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        SOVM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        SOVM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        SOVM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        SOVM_MODBUS_Parity_Num: req.body.modbusParity,
        SOVM_RegStartAddress_Num: req.body.regStartAddress,
        SOVM_ByteLength_Num: req.body.byteLength,
        // SOVM_CreatedbyId_Obj: req.body.createdById,
        // SOVM_ModifedbyId_Obj: req.body.modifiedById,
        // SOVM_CreatedIP_str: req.body.createdIP,
        // SOVM_ModifiedIP_str: req.body.modifiedIP
      })
      let solenoidValvedoc = await solenoidvalve.save();
      successResponse(res, "success", solenoidValvedoc);
    } catch (error) {
      errorResponse(res, error);
    }
  } else {
    errorResponse(res, "Duplicate Occurred");
  }
}

solenoidValve.update = async (req, res) => {

  let duplicate_data = await SolenoidValve.find({ "SOVM_DeviceId_Num": req.body.deviceId, 'SOVM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let id = req.params.id
      let updateDoc = {
        SOVM_DeviceId_Num: req.body.deviceId,
        SOVM_Device_Name_Str: req.body.deviceName,
        SOVM_Fk_LM_LocationID_Obj: req.body.locationId,
        SOVM_Fk_SM_SiteID_Obj: req.body.siteId,
        SOVM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        SOVM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        SOVM_AssetCode_Str: req.body.assetCode,
        SOVM_Waterflowrate_Num: req.body.waterFlowRate,
        SOVM_Fk_SubModuleId_Obj: req.body.subModuleId,
        SOVM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        SOVM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        SOVM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        SOVM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        SOVM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        SOVM_MODBUS_Parity_Num: req.body.modbusParity,
        SOVM_RegStartAddress_Num: req.body.regStartAddress,
        SOVM_ByteLength_Num: req.body.byteLength,
        // SOVM_CreatedbyId_Obj: req.body.createdById,
        // SOVM_ModifedbyId_Obj: req.body.modifiedById,
        // SOVM_CreatedIP_str: req.body.createdIP,
        // SOVM_ModifiedIP_str: req.body.modifiedIP
      }
      let solenoidValvedoc = await SolenoidValve.findByIdAndUpdate(id, updateDoc, { new: true });
      successResponse(res, "success", solenoidValvedoc);
    } catch (error) {
      errorResponse(res, error);
    }
  } else {
    errorResponse(res, "Duplicate Occurred");
  }
}

solenoidValve.delete = async (req, res) => {
  try {
    let id = req.params.id;

    let updateDoc = {
      SOVM_IsActive_Bool: false
    }

    let updatedSolenoidDoc = await SolenoidValve.findByIdAndUpdate(id, { $set: updateDoc }, { new: true });
    console.log(updatedSolenoidDoc);

    successResponse(res, "success", updatedSolenoidDoc);
  } catch (error) {
    errorResponse(res, error);
  }

}

export default solenoidValve;

