import doorStatus from './doorStatusModel';

const DoorStatusController = {};

// common success and error response...
DoorStatusController.successmsg = async (res, doorStatusMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    doorStatusMasterData
  })
}

DoorStatusController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    doorStatusMasterData: []
  })
}

//doorStatus find all records
DoorStatusController.findAll = async (req, res) => {

  try {

    const doorStatusall = await doorStatus.find({ 'DSM_IsActive_bool': true }).populate('DSM_Fk_LM_LocationID_Obj DSM_Fk_BM_BuildingID_Obj DSM_Fk_SM_SiteID_Obj DSM_Fk_ZoneID_Obj DSM_Fk_RefrigerationDeviceId_Obj DSM_Fk_MainModuleId_Obj');
    console.log(doorStatusall);

    DoorStatusController.successmsg(res, doorStatusall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error);
  }
}


//doorStatus save 
DoorStatusController.insert = async (req, res) => {

  let duplicate_data = await doorStatus.find({ DSM_DeviceId_Num: req.body.deviceId, 'DSM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let DoorStatusObj = new doorStatus({
        DSM_Device_Name_Str: req.body.deviceName,
        DSM_DeviceId_Num: req.body.deviceId,
        DSM_Fk_LM_LocationID_Obj: req.body.locationId,
        DSM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        DSM_Fk_SM_SiteID_Obj: req.body.siteId,
        DSM_Fk_ZoneID_Obj: req.body.zoneId,
        DSM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        DSM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        DSM_AssetCode_Str: req.body.assetCode,
        DSM_Status_bool: req.body.status,
        DSM_Brand_Str: req.body.brand,
        DSM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        DSM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        DSM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        DSM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        DSM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        DSM_MODBUS_Parity_Num: req.body.modbusParity,
        DSM_RegStartAddress_Num: req.body.regStartAddress,
        DSM_ByteLength_Num: req.body.byteLength,
        // DSM_CreatedbyId_obj: req.body.createdById,
        // DSM_ModifedbyId_obj: req.body.modifiedById,
        // DSM_CreatedIP_str: req.body.createdIP,
        // DSM_ModifiedIP_str: req.body.modifiedIP,
      });
      const doorStatusinsert = await DoorStatusObj.save();
      DoorStatusController.successmsg(res, doorStatusinsert, 'saved successfully')
    } catch (error) {
      console.log(error);
      DoorStatusController.errormsg(res, error);
    }
  } else {
    DoorStatusController.errormsg(res, "Duplicate Occurred");
  }
}

//doorStatus update all
DoorStatusController.update = async (req, res) => {

  let duplicate_data = await doorStatus.find({ DSM_DeviceId_Num: req.body.deviceId, 'DSM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let doorStatus_id = req.params.id
      let DoorStatusObj = {
        DSM_Device_Name_Str: req.body.deviceName,
        DSM_DeviceId_Num: req.body.deviceId,
        DSM_Fk_LM_LocationID_Obj: req.body.locationId,
        DSM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        DSM_Fk_SM_SiteID_Obj: req.body.siteId,
        DSM_Fk_ZoneID_Obj: req.body.zoneId,
        DSM_Fk_RefrigerationDeviceId_Obj: req.body.refrigerationDeviceId,
        DSM_Fk_MainModuleId_Obj: req.body.mainModuleId,
        DSM_AssetCode_Str: req.body.assetCode,
        DSM_Status_bool: req.body.status,
        DSM_Brand_Str: req.body.brand,
        DSM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        DSM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        DSM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        DSM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        DSM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        DSM_MODBUS_Parity_Num: req.body.modbusParity,
        DSM_RegStartAddress_Num: req.body.regStartAddress,
        DSM_ByteLength_Num: req.body.byteLength,
        // DSM_CreatedbyId_obj: req.body.createdById,
        // DSM_ModifedbyId_obj: req.body.modifiedById,
        // DSM_CreatedIP_str: req.body.createdIP,
        // DSM_ModifiedIP_str: req.body.modifiedIP,
      };

      const doorStatusupdate = await doorStatus.findByIdAndUpdate(doorStatus_id, DoorStatusObj, { new: true });

      DoorStatusController.successmsg(res, doorStatusupdate, 'updated successfully')

    } catch (error) {
      console.log(error);
      DoorStatusController.errormsg(res, error);
    }
  } else {
    DoorStatusController.errormsg(res, "Duplicate Occurred");
  }
}

//doorStatus find single record
DoorStatusController.find = async (req, res) => {
  try {
    let doorStatus_id = req.params.id;
    console.log(doorStatus_id);

    const doorStatusOne = await doorStatus.findOne({ '_id': doorStatus_id, 'DSM_IsActive_bool': true }).populate('DSM_Fk_LM_LocationID_Obj DSM_Fk_BM_BuildingID_Obj DSM_Fk_SM_SiteID_Obj DSM_Fk_ZoneID_Obj DSM_Fk_RefrigerationDeviceId_Obj DSM_Fk_MainModuleId_Obj');

    DoorStatusController.successmsg(res, doorStatusOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error);
  }
}


//doorStatus delete soft
DoorStatusController.delete = async (req, res) => {
  try {

    let doorStatus_id = req.params.id;

    let doorStatusObj = {
      DSM_IsActive_bool: false
    }
    console.log(doorStatusObj);

    const soft_delete_doorStatus = await doorStatus.findByIdAndUpdate(doorStatus_id, doorStatusObj, { new: true });

    DoorStatusController.successmsg(res, soft_delete_doorStatus, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error)
  }
}

export default DoorStatusController;