import waterDetector from './waterDetectorModel';

const WaterDetectorController = {};

// common success and error response...
WaterDetectorController.successmsg = async (res, waterDetectorMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    waterDetectorMasterData
  })
}

WaterDetectorController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    waterDetectorMasterData: []
  })
}

//waterDetector find all records
WaterDetectorController.findAll = async (req, res) => {
  try {
    const waterDetectorall = await waterDetector.find({ 'WDM_IsActive_bool': true }).populate('WDM_Fk_LM_LocationID_Obj WDM_Fk_BM_BuildingID_Obj WDM_Fk_SM_SiteID_Obj WDM_Fk_ZoneID_Obj WDM_Fk_RefrigerationDeviceId_Obj WDM_Fk_MainModuleId_Obj');
    WaterDetectorController.successmsg(res, waterDetectorall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error);
  }
}


//waterDetector save 
WaterDetectorController.insert = async (req, res) => {

  let duplicate_data = await waterDetector.find({ WDM_DeviceId_Num: req.body.deviceId, 'WDM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let WaterDetectorObj = new waterDetector({
        WDM_Device_Name_Str: req.body.deviceName,
        WDM_DeviceId_Num: req.body.deviceId,
        WDM_Fk_LM_LocationID_Obj: req.body.locationId,
        WDM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        WDM_Fk_SM_SiteID_Obj: req.body.siteId,
        WDM_Fk_ZoneID_Obj: req.body.zoneId,
        WDM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        WDM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        WDM_AssetCode_Str: req.body.assetCode,
        WDM_Thresold_Num: req.body.thresold,
        WDM_Brand_Str: req.body.brand,
        WDM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        WDM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        WDM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        WDM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        WDM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        WDM_MODBUS_Parity_Num: req.body.modbusParity,
        WDM_RegStartAddress_Num: req.body.regStartAddress,
        WDM_ByteLength_Num: req.body.byteLength,
        // WDM_CreatedbyId_obj: req.body.createdById,
        // WDM_ModifedbyId_obj: req.body.modifiedById,
        // WDM_CreatedIP_str: req.body.createdIP,
        // WDM_ModifiedIP_str: req.body.modifiedIP
      });
      const waterDetectorinsert = await WaterDetectorObj.save();
      WaterDetectorController.successmsg(res, waterDetectorinsert, 'saved successfully')
    } catch (error) {
      console.log(error);
      WaterDetectorController.errormsg(res, error);
    }
  } else {
    WaterDetectorController.errormsg(res, "Duplicate Occurred");
  }
}

//waterDetector update all
WaterDetectorController.update = async (req, res) => {

  let duplicate_data = await waterDetector.find({ WDM_DeviceId_Num: req.body.deviceId, 'WDM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let waterDetector_id = req.params.id
      let WaterDetectorObj = {
        WDM_Device_Name_Str: req.body.deviceName,
        WDM_DeviceId_Num: req.body.deviceId,
        WDM_Fk_LM_LocationID_Obj: req.body.locationId,
        WDM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        WDM_Fk_SM_SiteID_Obj: req.body.siteId,
        WDM_Fk_ZoneID_Obj: req.body.zoneId,
        WDM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        WDM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        WDM_AssetCode_Str: req.body.assetCode,
        WDM_Thresold_Num: req.body.thresold,
        WDM_Brand_Str: req.body.brand,
        WDM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        WDM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        WDM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        WDM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        WDM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        WDM_MODBUS_Parity_Num: req.body.modbusParity,
        WDM_RegStartAddress_Num: req.body.regStartAddress,
        WDM_ByteLength_Num: req.body.byteLength,
        // WDM_CreatedbyId_obj: req.body.createdById,
        // WDM_ModifedbyId_obj: req.body.modifiedById,
        // WDM_CreatedIP_str: req.body.createdIP,
        // WDM_ModifiedIP_str: req.body.modifiedIP
      };
      const waterDetectorupdate = await waterDetector.findByIdAndUpdate(waterDetector_id, WaterDetectorObj, { new: true });
      WaterDetectorController.successmsg(res, waterDetectorupdate, 'updated successfully')
    } catch (error) {
      console.log(error);
      WaterDetectorController.errormsg(res, error);
    }
  } else {
    WaterDetectorController.errormsg(res, "Duplicate Occurred");
  }
}

//waterDetector find single record
WaterDetectorController.find = async (req, res) => {
  try {
    let waterDetector_id = req.params.id;
    const waterDetectorOne = await waterDetector.findOne({ '_id': waterDetector_id, 'WDM_IsActive_bool': true }).populate('WDM_Fk_LM_LocationID_Obj WDM_Fk_BM_BuildingID_Obj WDM_Fk_SM_SiteID_Obj WDM_Fk_ZoneID_Obj WDM_Fk_RefrigerationDeviceId_Obj WDM_Fk_MainModuleId_Obj');

    WaterDetectorController.successmsg(res, waterDetectorOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error);
  }
}

//waterDetector delete soft
WaterDetectorController.delete = async (req, res) => {
  try {
    let waterDetector_id = req.params.id;
    let waterDetectorObj = {
      WDM_IsActive_bool: false
    }
    const soft_delete_waterDetector = await waterDetector.findByIdAndUpdate(waterDetector_id, waterDetectorObj, { new: true });
    WaterDetectorController.successmsg(res, soft_delete_waterDetector, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error)
  }
}
export default WaterDetectorController;