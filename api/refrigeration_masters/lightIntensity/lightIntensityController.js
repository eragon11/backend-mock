import lightIntensity from './lightIntensityModel';

const LightIntensityController = {};

// common success and error response...
LightIntensityController.successmsg = async (res, lightIntensityMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    lightIntensityMasterData
  })
}

LightIntensityController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    lightIntensityMasterData: []
  })
}

//lightIntensity find all records
LightIntensityController.findAll = async (req, res) => {

  try {

    const lightIntensityall = await lightIntensity.find({ 'LIM_IsActive_bool': true }).populate('LIM_Fk_LM_LocationID_Obj LIM_Fk_BM_BuildingID_Obj LIM_Fk_SM_SiteID_Obj LIM_Fk_ZoneID_Obj LIM_Fk_RefrigerationDeviceId_Obj LIM_Fk_MainModuleId_Obj');
    console.log(lightIntensityall);

    LightIntensityController.successmsg(res, lightIntensityall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    LightIntensityController.errormsg(res, error);
  }
}


//lightIntensity save 
LightIntensityController.insert = async (req, res) => {

  let duplicate_data = await lightIntensity.find({ LIM_DeviceId_Num: req.body.deviceId, 'LIM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let LightIntensityObj = new lightIntensity({
        LIM_Device_Name_Str: req.body.deviceName,
        LIM_DeviceId_Num: req.body.deviceId,
        LIM_Fk_LM_LocationID_Obj: req.body.locationId,
        LIM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        LIM_Fk_SM_SiteID_Obj: req.body.siteId,
        LIM_Fk_ZoneID_Obj: req.body.zoneId,
        LIM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        LIM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        LIM_AssetCode_Str: req.body.assetCode,
        LIM_Intensity_Num: req.body.intensity,
        LIM_Brand_Str: req.body.brand,
        LIM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        LIM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        LIM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        LIM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        LIM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        LIM_MODBUS_Parity_Num: req.body.modbusParity,
        LIM_RegStartAddress_Num: req.body.regStartAddress,
        LIM_ByteLength_Num: req.body.byteLength,
        // LIM_CreatedbyId_obj: req.body.createdById,
        // LIM_ModifedbyId_obj: req.body.modifiedById,
        // LIM_CreatedIP_str: req.body.createdIP,
        // LIM_ModifiedIP_str: req.body.modifiedIP
      });

      const lightIntensityinsert = await LightIntensityObj.save();
      LightIntensityController.successmsg(res, lightIntensityinsert, 'saved successfully')
    } catch (error) {
      console.log(error);
      LightIntensityController.errormsg(res, error);
    }
  } else {
    LightIntensityController.errormsg(res, 'Duplicate Occurred');
  }
}

//lightIntensity update all
LightIntensityController.update = async (req, res) => {
  let duplicate_data = await lightIntensity.find({ LIM_DeviceId_Num: req.body.deviceId, 'LIM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let lightIntensity_id = req.params.id
      let LightIntensityObj = {
        LIM_Device_Name_Str: req.body.deviceName,
        LIM_DeviceId_Num: req.body.deviceId,
        LIM_Fk_LM_LocationID_Obj: req.body.locationId,
        LIM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        LIM_Fk_SM_SiteID_Obj: req.body.siteId,
        LIM_Fk_ZoneID_Obj: req.body.zoneId,
        LIM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        LIM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        LIM_AssetCode_Str: req.body.assetCode,
        LIM_Intensity_Num: req.body.intensity,
        LIM_Brand_Str: req.body.brand,
        LIM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        LIM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        LIM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        LIM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        LIM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        LIM_MODBUS_Parity_Num: req.body.modbusParity,
        LIM_RegStartAddress_Num: req.body.regStartAddress,
        LIM_ByteLength_Num: req.body.byteLength,
        // LIM_CreatedbyId_obj: req.body.createdById,
        // LIM_ModifedbyId_obj: req.body.modifiedById,
        // LIM_CreatedIP_str: req.body.createdIP,
        // LIM_ModifiedIP_str: req.body.modifiedIP
      };
      const lightIntensityupdate = await lightIntensity.findByIdAndUpdate(lightIntensity_id, LightIntensityObj, { new: true });
      LightIntensityController.successmsg(res, lightIntensityupdate, 'updated successfully')
    } catch (error) {
      console.log(error);
      LightIntensityController.errormsg(res, error);
    }
  } else {
    LightIntensityController.errormsg(res, 'Duplicate Occurred');
  }
}

//lightIntensity find single record
LightIntensityController.find = async (req, res) => {
  try {
    let lightIntensity_id = req.params.id;
    console.log(lightIntensity_id);

    const lightIntensityOne = await lightIntensity.findOne({ '_id': lightIntensity_id, 'LIM_IsActive_bool': true }).populate('LIM_Fk_LM_LocationID_Obj LIM_Fk_BM_BuildingID_Obj LIM_Fk_SM_SiteID_Obj LIM_Fk_ZoneID_Obj LIM_Fk_RefrigerationDeviceId_Obj LIM_Fk_MainModuleId_Obj');

    LightIntensityController.successmsg(res, lightIntensityOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    LightIntensityController.errormsg(res, error);
  }
}


//lightIntensity delete soft
LightIntensityController.delete = async (req, res) => {
  try {

    let lightIntensity_id = req.params.id;

    let lightIntensityObj = {
      LIM_IsActive_bool: false
    }
    console.log(lightIntensityObj);

    const soft_delete_lightIntensity = await lightIntensity.findByIdAndUpdate(lightIntensity_id, lightIntensityObj, { new: true });

    LightIntensityController.successmsg(res, soft_delete_lightIntensity, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    LightIntensityController.errormsg(res, error)
  }
}

export default LightIntensityController;