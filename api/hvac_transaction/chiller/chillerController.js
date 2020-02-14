import chiller from './chillerModel';
import chillerMaster from "../../hvac_masters/chiller/chillerModel";
const ChillerController = {};

// common success and error response...
ChillerController.successmsg = async (res, chillerTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    chillerTransactionData
  })
}
ChillerController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    chillerTransactionData: []
  })
}

//chiller find all records
ChillerController.findAll = async (req, res) => {
  try {
    const chillerall = await chiller.find({ 'CHLRTS_Is_Deleted_Bool': false }).populate('CHLRTS_FK_CHILLERDeviceId_obj');
    console.log(chillerall);

    ChillerController.successmsg(res, chillerall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error);
  }
}

//chiller save 
ChillerController.insert = async (req, res) => {
  try {
    let device_id = await chillerMaster.findOne({ "CHLRM_DeviceId_Num": req.body.ioModuleId });

    let chillerDeviceId = device_id._id;
    let ChillerObj = new chiller({
      CHLRTS_FK_CHILLERDeviceId_obj: chillerDeviceId,
      CHLRTS_IoModuleID_str: req.body.ioModuleId,
      CHLRTS_DeviceId_str: req.body.deviceId,
      CHLRTS_DeviceType_str: req.body.deviceType,
      CHLRTS_VoltageR_Num: req.body.voltageR,
      CHLRTS_VoltageY_Num: req.body.voltageY,
      CHLRTS_VoltageB_Num: req.body.voltageB,
      CHLRTS_CurrentR_Num: req.body.currentR,
      CHLRTS_CurrentY_Num: req.body.currentY,
      CHLRTS_CurrentB_Num: req.body.currentB,
      CHLRTS_PowerR_Num: req.body.powerR,
      CHLRTS_PowerY_Num: req.body.powerY,
      CHLRTS_PowerB_Num: req.body.powerB,
      CHLRTS_DevideIdRPM_str: req.body.deviceIdRPM,
      CHLRTS_RPM_Num: req.body.rpm,
      CHLRTS_InletTemprature_Num: req.body.inletTemperature,
      CHLRTS_OutletTemprature_Num: req.body.outletTemperature,
      CHLRTS_WaterFlowRate_Num: req.body.waterFlowRate,
      CHLRTS_WaterLevel_Num: req.body.waterLevel,
      CHLRTS_CreatedIP_str: req.body.createdIP,
      CHLRTS_Anomaly_Check_int: req.body.anomalyCheck,
    });

    const chillerinsert = await ChillerObj.save();
    ChillerController.successmsg(res, chillerinsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error);
  }
}

//chiller update all
ChillerController.update = async (req, res) => {
  try {
    let chiller_id = req.params.id
    let ChillerObj = {
      CHLRTS_FK_CHILLERDeviceId_obj: chillerDeviceId,
      CHLRTS_IoModuleID_str: req.body.ioModuleId,
      CHLRTS_DeviceId_str: req.body.deviceId,
      CHLRTS_DeviceType_str: req.body.deviceType,
      CHLRTS_VoltageR_Num: req.body.voltageR,
      CHLRTS_VoltageY_Num: req.body.voltageY,
      CHLRTS_VoltageB_Num: req.body.voltageB,
      CHLRTS_CurrentR_Num: req.body.currentR,
      CHLRTS_CurrentY_Num: req.body.currentY,
      CHLRTS_CurrentB_Num: req.body.currentB,
      CHLRTS_PowerR_Num: req.body.powerR,
      CHLRTS_PowerY_Num: req.body.powerY,
      CHLRTS_PowerB_Num: req.body.powerB,
      CHLRTS_DevideIdRPM_str: req.body.deviceIdRPM,
      CHLRTS_RPM_Num: req.body.rpm,
      CHLRTS_InletTemprature_Num: req.body.inletTemperature,
      CHLRTS_OutletTemprature_Num: req.body.outletTemperature,
      CHLRTS_WaterFlowRate_Num: req.body.waterFlowRate,
      CHLRTS_WaterLevel_Num: req.body.waterLevel,
      CHLRTS_CreatedIP_str: req.body.createdIP,
      CHLRTS_Anomaly_Check_int: req.body.anomalyCheck,
    };

    const chillerupdate = await chiller.findByIdAndUpdate(chiller_id, ChillerObj, { new: true });
    ChillerController.successmsg(res, chillerupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error);
  }
}

//chiller find single record
ChillerController.find = async (req, res) => {
  try {
    let chiller_id = req.params.id;
    console.log(chiller_id);

    const chillerOne = await chiller.findOne({ '_id': chiller_id, 'CHLRTS_Is_Deleted_Bool': false }).populate('CHLRTS_FK_CHILLERDeviceId_obj');
    ChillerController.successmsg(res, chillerOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error);
  }
}

//chiller delete soft
ChillerController.delete = async (req, res) => {
  try {
    let chiller_id = req.params.id;
    let chillerObj = {
      CHLRTS_Is_Deleted_Bool: true
    }
    console.log(chillerObj);

    const soft_delete_chiller = await chiller.findByIdAndUpdate(chiller_id, chillerObj, { new: true });
    ChillerController.successmsg(res, soft_delete_chiller, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error)
  }
}

export default ChillerController;