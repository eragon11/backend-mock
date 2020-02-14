import temprature from './tempratureModel';

const TempratureController = {};

// common success and error response...
TempratureController.successmsg = async (res, tempratureMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    tempratureMasterData
  })
}

TempratureController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    tempratureMasterData: []
  })
}

//temprature find all records
TempratureController.findAll = async (req, res) => {
  try {
    const tempratureall = await temprature.find({ 'REFTM_IsActive_bool': true }).populate('REFTM_Fk_LM_LocationID_Obj REFTM_Fk_BM_BuildingID_Obj REFTM_Fk_SM_SiteID_Obj REFTM_Fk_ZoneID_Obj REFTM_Fk_RefrigerationDeviceId_Obj REFTM_Fk_MainModuleId_Obj');
    console.log(tempratureall);

    TempratureController.successmsg(res, tempratureall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error);
  }
}


//temprature save 
TempratureController.insert = async (req, res) => {

  let duplicate_data = await temprature.find({ REFTM_DeviceId_Num: req.body.deviceId, 'REFTM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let TempratureObj = new temprature({
        REFTM_Device_Name_Str: req.body.deviceName,
        REFTM_DeviceId_Num: req.body.deviceId,
        REFTM_Fk_LM_LocationID_Obj: req.body.locationId,
        REFTM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        REFTM_Fk_SM_SiteID_Obj: req.body.siteId,
        REFTM_Fk_ZoneID_Obj: req.body.zoneId,
        REFTM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        REFTM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        REFTM_AssetCode_Str: req.body.assetCode,
        REFTM_TempratureUpp_Num: req.body.tempratureUp,
        REFTM_TempratureLow_Num: req.body.tempratureLow,
        REFTM_HumidityUpp_Num: req.body.humidityUp,
        REFTM_HumidityLow_Num: req.body.humidityLow,
        REFTM_Brand_Str: req.body.brand,
        REFTM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        REFTM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        REFTM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        REFTM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        REFTM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        REFTM_MODBUS_Parity_Num: req.body.modbusParity,
        REFTM_RegStartAddress_Num: req.body.regStartAddress,
        REFTM_ByteLength_Num: req.body.byteLength,
        // REFTM_CreatedbyId_obj: req.body.createdById,
        // REFTM_ModifiedbyId_obj: req.body.modifiedById,
        // REFTM_CreatedIP_str: req.body.createdIP,
        // REFTM_ModifiedIP_str: req.body.modifiedIP
      });
      const tempratureinsert = await TempratureObj.save();
      TempratureController.successmsg(res, tempratureinsert, 'saved successfully')
    } catch (error) {
      console.log(error);
      TempratureController.errormsg(res, error);
    }
  } else {
    TempratureController.errormsg(res, 'Duplicate Occurred');
  }
}

//temprature update all
TempratureController.update = async (req, res) => {
  let duplicate_data = await temprature.find({ REFTM_DeviceId_Num: req.body.deviceId, 'REFTM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let temprature_id = req.params.id
      let TempratureObj = {
        REFTM_Device_Name_Str: req.body.deviceName,
        REFTM_DeviceId_Num: req.body.deviceId,
        REFTM_Fk_LM_LocationID_Obj: req.body.locationId,
        REFTM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        REFTM_Fk_SM_SiteID_Obj: req.body.siteId,
        REFTM_Fk_ZoneID_Obj: req.body.zoneId,
        REFTM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        REFTM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        REFTM_AssetCode_Str: req.body.assetCode,
        REFTM_TempratureUpp_Num: req.body.tempratureUp,
        REFTM_TempratureLow_Num: req.body.tempratureLow,
        REFTM_HumidityUpp_Num: req.body.humidityUp,
        REFTM_HumidityLow_Num: req.body.humidityLow,
        REFTM_Brand_Str: req.body.brand,
        REFTM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        REFTM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        REFTM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        REFTM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        REFTM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        REFTM_MODBUS_Parity_Num: req.body.modbusParity,
        REFTM_RegStartAddress_Num: req.body.regStartAddress,
        REFTM_ByteLength_Num: req.body.byteLength,
        // REFTM_CreatedbyId_obj: req.body.createdById,
        // REFTM_ModifiedbyId_obj: req.body.modifiedById,
        // REFTM_CreatedIP_str: req.body.createdIP,
        // REFTM_ModifiedIP_str: req.body.modifiedIP
      };
      const tempratureupdate = await temprature.findByIdAndUpdate(temprature_id, TempratureObj, { new: true });
      TempratureController.successmsg(res, tempratureupdate, 'updated successfully')
    } catch (error) {
      console.log(error);
      TempratureController.errormsg(res, error);
    }
  } else {
    TempratureController.errormsg(res, 'Duplicate Occurred');
  }
}

//temprature find single record
TempratureController.find = async (req, res) => {
  try {
    let temprature_id = req.params.id;

    const tempratureOne = await temprature.findOne({ '_id': temprature_id, 'REFTM_IsActive_bool': true }).populate('REFTM_Fk_LM_LocationID_Obj REFTM_Fk_BM_BuildingID_Obj REFTM_Fk_SM_SiteID_Obj REFTM_Fk_ZoneID_Obj REFTM_Fk_RefrigerationDeviceId_Obj REFTM_Fk_MainModuleId_Obj');

    TempratureController.successmsg(res, tempratureOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error);
  }
}


//temprature delete soft
TempratureController.delete = async (req, res) => {
  try {

    let temprature_id = req.params.id;

    let tempratureObj = {
      REFTM_IsActive_bool: false
    }

    const soft_delete_temprature = await temprature.findByIdAndUpdate(temprature_id, tempratureObj, { new: true });

    TempratureController.successmsg(res, soft_delete_temprature, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error)
  }
}

export default TempratureController;