import chiller from './chillerModel';

const ChillerController = {};

// common success and error response...
ChillerController.successmsg = async (res, data, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    chillerMasterData: data
  })
}

ChillerController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    chillerMasterData: []
  })
}

//chiller find all records
ChillerController.findAll = async (req, res) => {

  try {
    const chillerall = await chiller.find({ 'CHLRM_IsActive_bool': true }).populate('CHLRM_Fk_LM_LocationID_Obj CHLRM_Fk_SM_SiteID_Obj CHLRM_Fk_BM_BuildingID_Obj CHLRM_Fk_ZM_ZoneID_Obj CHLRM_Fk_SubModuleId_Obj');
    ChillerController.successmsg(res, chillerall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error);
  }
}


//chiller save 
ChillerController.insert = async (req, res) => {

  let duplicate_data = await chiller.find({ "CHLRM_DeviceId_Num": req.body.deviceId, 'CHLRM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let ChillerObj = new chiller({
        CHLRM_DeviceId_Num: req.body.deviceId,
        CHLRM_Device_Name_Str: req.body.deviceName,
        CHLRM_Fk_LM_LocationID_Obj: req.body.locationId,
        CHLRM_Fk_SM_SiteID_Obj: req.body.siteId,
        CHLRM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        CHLRM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        CHLRM_AssetCode_Str: req.body.assetCode,
        CHLRM_ChillerType_Str: req.body.chillerType,
        CHLRM_PhaseType_Str: req.body.phaseType,
        CHLRM_MinVoltage_Num: req.body.minVoltage,
        CHLRM_MaxVoltage_Num: req.body.maxVoltage,
        CHLRM_MaxCurrent_Num: req.body.maxCurrent,
        CHLRM_MaxPower_Num: req.body.maxPower,
        CHLRM_MinOutTemp_Num: req.body.minOutTemp,
        CHLRM_MaxOutTemp_Num: req.body.maxOutTemp,
        CHLRM_MinInletTemp_Num: req.body.minInletTemp,
        CHLRM_MaxInletTemp_Num: req.body.maxInletTemp,
        CHLRM_Waterflowrate_Num: req.body.waterflowrate,
        CHLRM_MaxRPMOfChiller_Num: req.body.maxRPMOfChiller,
        CHLRM_Fk_SubModuleId_Obj: req.body.subModuleId,
        CHLRM_Brand_Str: req.body.brand,
        CHLRM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        CHLRM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        CHLRM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        CHLRM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        CHLRM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        CHLRM_MODBUS_Parity_Num: req.body.modbusParity,
        CHLRM_RegStartAddress_Num: req.body.regStartAddress,
        CHLRM_ByteLength_Num: req.body.byteLength,
        // CHLRM_CreatedbyId_obj: req.body.createId,
        // CHLRM_ModifiedbyId_obj: req.body.modifiedId,
        // CHLRM_CreatedIP_str: req.body.createdIP,
        // CHLRM_ModifiedIP_str: req.body.modifiedIP,
      });

      const chillerinsert = await ChillerObj.save();

      ChillerController.successmsg(res, chillerinsert, 'saved successfully')
    } catch (error) {
      ChillerController.errormsg(res, error);
    }
  } else {
    ChillerController.errormsg(res, "Duplicate Occurred");
  }
}

//chiller update all
ChillerController.update = async (req, res) => {

  let duplicate_data = await chiller.find({ "CHLRM_DeviceId_Num": req.body.deviceId, 'CHLRM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let chiller_id = req.params.id;
      let ChillerObj = {
        CHLRM_DeviceId_Num: req.body.deviceId,
        CHLRM_Device_Name_Str: req.body.deviceName,
        CHLRM_Fk_LM_LocationID_Obj: req.body.locationId,
        CHLRM_Fk_SM_SiteID_Obj: req.body.siteId,
        CHLRM_Fk_BM_BuildingID_Obj: req.body.buildingId,
        CHLRM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
        CHLRM_AssetCode_Str: req.body.assetCode,
        CHLRM_ChillerType_Str: req.body.chillerType,
        CHLRM_PhaseType_Str: req.body.phaseType,
        CHLRM_MinVoltage_Num: req.body.minVoltage,
        CHLRM_MaxVoltage_Num: req.body.maxVoltage,
        CHLRM_MaxCurrent_Num: req.body.maxCurrent,
        CHLRM_MaxPower_Num: req.body.maxPower,
        CHLRM_MinOutTemp_Num: req.body.minOutTemp,
        CHLRM_MaxOutTemp_Num: req.body.maxOutTemp,
        CHLRM_MinInletTemp_Num: req.body.minInletTemp,
        CHLRM_MaxInletTemp_Num: req.body.maxInletTemp,
        CHLRM_Waterflowrate_Num: req.body.waterflowrate,
        CHLRM_MaxRPMOfChiller_Num: req.body.maxRPMOfChiller,
        CHLRM_Fk_SubModuleId_Obj: req.body.subModuleId,
        CHLRM_Brand_Str: req.body.brand,
        CHLRM_DataLogger_Mode_Str: req.body.dataLoggerMode,
        CHLRM_DataLogger_TCPIP_Str: req.body.dataLoggerTCPIP,
        CHLRM_DataLogger_MacID_Str: req.body.dataLoggerMacID,
        CHLRM_MODBUS_Device_ID_Num: req.body.modbusDeviceID,
        CHLRM_MODBUS_BaudRate_Num: req.body.modbusBaudRate,
        CHLRM_MODBUS_Parity_Num: req.body.modbusParity,
        CHLRM_RegStartAddress_Num: req.body.regStartAddress,
        CHLRM_ByteLength_Num: req.body.byteLength,
        // CHLRM_CreatedbyId_obj: req.body.createId,
        // CHLRM_ModifiedbyId_obj: req.body.modifiedId,
        // CHLRM_CreatedIP_str: req.body.createdIP,
        // CHLRM_ModifiedIP_str: req.body.modifiedIP,
      };

      const chillerupdate = await chiller.findByIdAndUpdate(chiller_id, ChillerObj, { new: true });

      ChillerController.successmsg(res, chillerupdate, 'updated successfully')
    } catch (error) {
      ChillerController.errormsg(res, error);
    }
  } else {
    ChillerController.errormsg(res, "Duplicate Occurred");
  }
}

//chiller find single record
ChillerController.find = async (req, res) => {
  try {
    let chiller_id = req.params.id;
    const chillerOne = await chiller.findOne({ '_id': chiller_id, 'CHLRM_IsActive_bool': true }).populate('CHLRM_Fk_LM_LocationID_Obj CHLRM_Fk_SM_SiteID_Obj CHLRM_Fk_BM_BuildingID_Obj CHLRM_Fk_ZM_ZoneID_Obj CHLRM_Fk_SubModuleId_Obj');

    ChillerController.successmsg(res, chillerOne, "found By Id Successfully");

  } catch (error) {
    ChillerController.errormsg(res, error);
  }
}


//chiller delete soft
ChillerController.delete = async (req, res) => {
  try {

    let chiller_id = req.params.id;

    let chillerObj = {
      CHLRM_IsActive_bool: false
    }

    const soft_delete_chiller = await chiller.findByIdAndUpdate(chiller_id, chillerObj, { new: true });

    ChillerController.successmsg(res, soft_delete_chiller, "Deleted Successfully")

  } catch (error) {
    ChillerController.errormsg(res, error)
  }
}

export default ChillerController;