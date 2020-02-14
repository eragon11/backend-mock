import refrigeration from './refrigerationModel';

const RefrigerationController = {};

// common success and error response...
RefrigerationController.successmsg = async (res, refrigerationMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    refrigerationMasterData
  })
}

RefrigerationController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    refrigerationMasterData: []
  })
}

//refrigeration find all records
RefrigerationController.findAll = async (req, res) => {

  try {

    const refrigerationall = await refrigeration.find({ 'REFM_IsActive_bool': true }).populate(' REFM_Fk_LM_LocationID_Obj REFM_Fk_BM_BuildingID_Obj REFM_Fk_SM_SiteID_Obj REFM_Fk_ZoneID_Obj REFM_Fk_MainModuleId_Obj');
    console.log(refrigerationall);

    RefrigerationController.successmsg(res, refrigerationall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    RefrigerationController.errormsg(res, error);
  }
}


//refrigeration save 
RefrigerationController.insert = async (req, res) => {
  let duplicate_data = await refrigeration.find({ REFM_Device_Id_Num: req.body.deviceId, 'REFM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let RefrigerationObj = new refrigeration({
        REFM_Device_Name_Str: req.body.deviceName,
        REFM_Device_Id_Num: req.body.deviceId,
        REFM_Description_Str: req.body.description,
        REFM_Fk_LM_LocationID_Obj: req.body.locationId,
        REFM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        REFM_Fk_SM_SiteID_Obj: req.body.siteId,
        REFM_Fk_ZoneID_Obj: req.body.zoneId,
        REFM_Fk_MainModuleId_obj: req.body.mainModuleId,
        REFM_AssetCode_Str: req.body.assetCode,
        REFM_PhaseType_int: req.body.phaseType,
        REFM_MaxVoltage_Num: req.body.maxVoltage,
        REFM_MaxCurrent_Num: req.body.maxCurrent,
        REFM_MaxPower_Num: req.body.maxPower,
        REFM_BenchMarkEnergy_Num: req.body.benchMarkEnergy,
        REFM_StoragePurpose_Str: req.body.storagePurpose,
        REFM_Volume_Str: req.body.volume,
        REFM_imagePath_Str: req.body.imagePath,
        REFM_Brand_Str: req.body.brand,
        REFM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        REFM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        REFM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        REFM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        REFM_MODBUS_BaudRate_num: req.body.modbusBaudRate,
        REFM_MODBUS_Parity_Num: req.body.modbusParity,
        REFM_RegStartAddress_Num: req.body.regStartAddress,
        REFM_ByteLength_Num: req.body.byteLength,
        // REFM_CreatedbyId_obj: req.body.createdById,
        // REFM_ModifedbyId_obj: req.body.modifiedById,
        // REFM_CreatedIP_str: req.body.createdIP,
        // REFM_ModifiedIP_str: req.body.modifiedIP
      });

      const refrigerationinsert = await RefrigerationObj.save();
      RefrigerationController.successmsg(res, refrigerationinsert, 'saved successfully')
    } catch (error) {
      console.log(error);
      RefrigerationController.errormsg(res, error);
    }
  } else {
    RefrigerationController.errormsg(res, 'Duplicate Occurred');
  }
}

//refrigeration update all
RefrigerationController.update = async (req, res) => {
  let duplicate_data = await refrigeration.find({ REFM_Device_Id_Num: req.body.deviceId, 'REFM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let refrigeration_id = req.params.id
      let RefrigerationObj = {
        REFM_Device_Name_Str: req.body.deviceName,
        REFM_Device_Id_Num: req.body.deviceId,
        REFM_Description_Str: req.body.description,
        REFM_Fk_LM_LocationID_Obj: req.body.locationId,
        REFM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        REFM_Fk_SM_SiteID_Obj: req.body.siteId,
        REFM_Fk_ZoneID_Obj: req.body.zoneId,
        REFM_Fk_MainModuleId_obj: req.body.mainModuleId,
        REFM_AssetCode_Str: req.body.assetCode,
        REFM_PhaseType_int: req.body.phaseType,
        REFM_MaxVoltage_Num: req.body.maxVoltage,
        REFM_MaxCurrent_Num: req.body.maxCurrent,
        REFM_MaxPower_Num: req.body.maxPower,
        REFM_BenchMarkEnergy_Num: req.body.benchMarkEnergy,
        REFM_StoragePurpose_Str: req.body.storagePurpose,
        REFM_Volume_Str: req.body.volume,
        REFM_imagePath_Str: req.body.imagePath,
        REFM_Brand_Str: req.body.brand,
        REFM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        REFM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        REFM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        REFM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        REFM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        REFM_MODBUS_Parity_Num: req.body.modbusParity,
        REFM_RegStartAddress_Num: req.body.regStartAddress,
        REFM_ByteLength_Num: req.body.byteLength,
        // REFM_CreatedbyId_obj: req.body.createdById,
        // REFM_ModifedbyId_obj: req.body.modifiedById,
        // REFM_CreatedIP_str: req.body.createdIP,
        // REFM_ModifiedIP_str: req.body.modifiedIP
      };
      const refrigerationupdate = await refrigeration.findByIdAndUpdate(refrigeration_id, RefrigerationObj, { new: true });
      RefrigerationController.successmsg(res, refrigerationupdate, 'updated successfully')
    } catch (error) {
      console.log(error);
      RefrigerationController.errormsg(res, error);
    }
  } else {
    RefrigerationController.errormsg(res, 'Duplicate Occurred');
  }
}

//refrigeration find single record
RefrigerationController.find = async (req, res) => {
  try {
    let refrigeration_id = req.params.id;
    console.log(refrigeration_id);

    const refrigerationOne = await refrigeration.findOne({ '_id': refrigeration_id, 'REFM_IsActive_bool': true }).populate('REFM_Fk_LM_LocationID_Obj REFM_Fk_BM_BuildingID_Obj REFM_Fk_SM_SiteID_Obj REFM_Fk_ZoneID_Obj REFM_Fk_MainModuleId_Obj');

    RefrigerationController.successmsg(res, refrigerationOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    RefrigerationController.errormsg(res, error);
  }
}


//refrigeration delete soft
RefrigerationController.delete = async (req, res) => {
  try {

    let refrigeration_id = req.params.id;

    let refrigerationObj = {
      REFM_IsActive_bool: false
    }
    console.log(refrigerationObj);

    const soft_delete_refrigeration = await refrigeration.findByIdAndUpdate(refrigeration_id, refrigerationObj, { new: true });

    RefrigerationController.successmsg(res, soft_delete_refrigeration, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    RefrigerationController.errormsg(res, error)
  }
}

export default RefrigerationController;