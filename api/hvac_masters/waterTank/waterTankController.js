import WaterTank from "./waterTankModel";

var waterTank = {};

waterTank.successResponse = async (res, msg, data) => {
  res.status(200).send({
    message: msg,
    waterTankMasterData: data
  });
}

waterTank.errorResponse = async (res, msg) => {
  res.status(400).send({
    message: msg,
    waterTankMasterData: []
  });
}

waterTank.findAll = async (req, res) => {
  try {
    let waterTankDocs = await WaterTank.find({ 'WTKM_IsActive_bool': { $ne: false } }).populate('WTKM_Fk_LM_LocationID_Obj WTKM_Fk_SM_SiteID_Obj WTKM_Fk_BM_BuildingID_Obj WTKM_Fk_ZM_ZoneID_Obj WTKM_Fk_SubModuleId_Obj');
    waterTank.successResponse(res, "Success", waterTankDocs);
  } catch (error) {
    waterTank.errorResponse(error);
  }
}

waterTank.find = async (req, res) => {
  try {
    let id = req.params.id;
    let waterTankDoc = await WaterTank.findOne({ '_id': id }).populate('WTKM_Fk_LM_LocationID_Obj WTKM_Fk_SM_SiteID_Obj WTKM_Fk_BM_BuildingID_Obj WTKM_Fk_ZM_ZoneID_Obj WTKM_Fk_SubModuleId_Obj')
    waterTank.successResponse(res, "Success", waterTankDoc);
  } catch (error) {
    waterTank.errorResponse(error);
  }
}

waterTank.insert = async (req, res) => {

  let duplicate_data = await WaterTank.find({ WTKM_DeviceId_Num: req.body.deviceId, 'WTKM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let watertankObj = new WaterTank({
        WTKM_DeviceId_Num: req.body.deviceId,
        WTKM_Device_Name_Str: req.body.deviceName,
        WTKM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        WTKM_AssetCode_Str: req.body.assetCode,
        WTKM_MaxVolume_Num: req.body.maxVolume,
        WTKM_MinLevel_Num: req.body.minLevel,
        WTKM_Shape_Str: req.body.shape,
        WTKM_Fk_LM_LocationID_Obj: req.body.locationId,
        WTKM_Fk_SM_SiteID_Obj: req.body.siteId,
        WTKM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        WTKM_Fk_SubModuleId_Obj: req.body.subModuleId,
        WTKM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        WTKM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        WTKM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        WTKM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        WTKM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        WTKM_MODBUS_Parity_Num: req.body.modbusParity,
        WTKM_RegStartAddress_Num: req.body.regStartAddress,
        WTKM_ByteLength_Num: req.body.byteLength,
        // WTKM_CreatedbyId_Obj: req.body.createdById,
        // WTKM_ModifiedbyId_Obj: req.body.modifiedById,
        // WTKM_CreatedIP_str: req.body.createdIP,
        // WTKM_ModifiedIP_str: req.body.modifiedIP
      })
      let waterTankdoc = await watertankObj.save();
      waterTank.successResponse(res, "success", waterTankdoc);
    } catch (error) {
      waterTank.errorResponse(res, error);
    }
  } else {
    waterTank.errorResponse(res, "Duplicate Occurred");
  }

}

waterTank.update = async (req, res) => {
  let duplicate_data = await WaterTank.find({ WTKM_DeviceId_Num: req.body.deviceId, 'WTKM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let id = req.params.id
      let updateDocObj = {
        WTKM_DeviceId_Num: req.body.deviceId,
        WTKM_Device_Name_Str: req.body.deviceName,
        WTKM_Fk_LM_LocationID_Obj: req.body.locationId,
        WTKM_Fk_SM_SiteID_Obj: req.body.siteId,
        WTKM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        WTKM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        WTKM_AssetCode_Str: req.body.assetCode,
        WTKM_MaxVolume_Num: req.body.maxVolume,
        WTKM_MinLevel_Num: req.body.minLevel,
        WTKM_Shape_Str: req.body.shape,
        WTKM_Fk_LM_LocationID_Obj: req.body.locationId,
        WTKM_Fk_SM_SiteID_Obj: req.body.siteId,
        WTKM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        WTKM_Fk_SubModuleId_Obj: req.body.subModuleId,
        WTKM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        WTKM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        WTKM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        WTKM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        WTKM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        WTKM_MODBUS_Parity_Num: req.body.modbusParity,
        WTKM_RegStartAddress_Num: req.body.regStartAddress,
        WTKM_ByteLength_Num: req.body.byteLength,
        // WTKM_CreatedbyId_Obj: req.body.createdById,
        // WTKM_ModifiedbyId_Obj: req.body.modifiedById,
        // WTKM_CreatedIP_str: req.body.createdIP,
        // WTKM_ModifiedIP_str: req.body.modifiedIP
      }
      let updateDoc = await WaterTank.findByIdAndUpdate(id, updateDocObj, { new: true });
      waterTank.successResponse(res, "success", updateDoc);
    } catch (error) {
      waterTank.errorResponse(res, error);
    }
  } else {
    waterTank.errorResponse(res, "Duplicate Occurred");
  }
}

waterTank.delete = async (req, res) => {
  try {
    let id = req.params.id;
    let updateDocObj = {
      WTKM_IsActive_bool: false
    }

    let updatedDoc = await waterTank.findByIdAndUpdate(id, { $set: updateDocObj }, { new: true });
    waterTank.successResponse(res, "success", updatedDoc);
  } catch (error) {
    waterTank.errorResponse(error);
  }

}

export default waterTank;

