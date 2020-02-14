import compressor from './compressorModel';
import compressorMaster from "../../hvac_masters/compressor/compressorModel";
const CompressorController = {};

// common success and error response...
CompressorController.successmsg = async (res, compressorTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    compressorTransactionData
  })
}
CompressorController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    compressorTransactionData: []
  })
}

//compressor find all records
CompressorController.findAll = async (req, res) => {
  try {
    const compressorall = await compressor.find({ 'COMPTS_Is_Deleted_Bool': false }).populate('COMPTS_Fk_COMPDeviceId_obj');

    CompressorController.successmsg(res, compressorall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    CompressorController.errormsg(res, error);
  }
}

//compressor save 
CompressorController.insert = async (req, res) => {
  try {
    let device_id = await compressorMaster.findOne({ "COMPM_DeviceId_Num": req.body.ioModuleId });

    let deviceId = device_id._id;
    let CompressorObj = new compressor({
      COMPTS_Fk_COMPDeviceId_obj: deviceId,
      COMPTS_IoModuleID_str: req.body.ioModuleId,
      COMPTS_DeviceId_str: req.body.deviceId,
      COMPTS_DeviceType_str: req.body.deviceType,
      COMPTS_VoltageR_Num: req.body.voltageR,
      COMPTS_VoltageY_Num: req.body.voltageY,
      COMPTS_VoltageB_Num: req.body.voltageB,
      COMPTS_CurrentR_Num: req.body.currentR,
      COMPTS_CurrentY_Num: req.body.currentY,
      COMPTS_CurrentB_Num: req.body.currentB,
      COMPTS_PowerR_Num: req.body.powerR,
      COMPTS_PowerY_Num: req.body.powerY,
      COMPTS_PowerB_Num: req.body.powerB,
      COMPTS_DevideIdRPM_str: req.body.deviceIdRpm,
      COMPTS_RPM_Num: req.body.rpm,
      COMPTS_RelayStatus_R_Bool: req.body.relayR,
      COMPTS_RelayStatus_Y_Bool: req.body.relayY,
      COMPTS_RelayStatus_B_Bool: req.body.relayB,
      COMPTS_Anomaly_Check_int: req.body.anomalyCheck,
      // COMPTS_CreatedIP_str: req.body.createdIP
    });

    const compressorinsert = await CompressorObj.save();
    CompressorController.successmsg(res, compressorinsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    CompressorController.errormsg(res, error);
  }
}

//compressor update all
CompressorController.update = async (req, res) => {
  try {
    let compressor_id = req.params.id
    let CompressorObj = {
      COMPTS_Fk_COMPDeviceId_obj: req.body.compressorDeviceId,
      COMPTS_IoModuleID_str: req.body.ioModuleId,
      COMPTS_DeviceId_str: req.body.deviceId,
      COMPTS_DeviceType_str: req.body.deviceType,
      COMPTS_VoltageR_Num: req.body.voltageR,
      COMPTS_VoltageY_Num: req.body.voltageY,
      COMPTS_VoltageB_Num: req.body.voltageB,
      COMPTS_CurrentR_Num: req.body.currentR,
      COMPTS_CurrentY_Num: req.body.currentY,
      COMPTS_CurrentB_Num: req.body.currentB,
      COMPTS_PowerR_Num: req.body.powerR,
      COMPTS_PowerY_Num: req.body.powerY,
      COMPTS_PowerB_Num: req.body.powerB,
      COMPTS_DevideIdRPM_str: req.body.deviceIdRpm,
      COMPTS_RPM_Num: req.body.rpm,
      COMPTS_RelayStatus_R_Bool: req.body.relayR,
      COMPTS_RelayStatus_Y_Bool: req.body.relayY,
      COMPTS_RelayStatus_B_Bool: req.body.relayB,
      COMPTS_Anomaly_Check_int: req.body.anomalyCheck,
      // COMPTS_CreatedIP_str: req.body.createdIP
    };

    const compressorupdate = await compressor.findByIdAndUpdate(compressor_id, CompressorObj, { new: true });
    CompressorController.successmsg(res, compressorupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    CompressorController.errormsg(res, error);
  }
}

//compressor find single record
CompressorController.find = async (req, res) => {
  try {
    let compressor_id = req.params.id;

    const compressorOne = await compressor.findOne({ '_id': compressor_id, 'COMPTS_Is_Deleted_Bool': false }).populate('COMPTS_Fk_COMPDeviceId_obj');
    CompressorController.successmsg(res, compressorOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    CompressorController.errormsg(res, error);
  }
}

//compressor delete soft
CompressorController.delete = async (req, res) => {
  try {
    let compressor_id = req.params.id;
    let compressorObj = {
      COMPTS_Is_Deleted_Bool: true
    }

    const soft_delete_compressor = await compressor.findByIdAndUpdate(compressor_id, compressorObj, { new: true });
    CompressorController.successmsg(res, soft_delete_compressor, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    CompressorController.errormsg(res, error)
  }
}

export default CompressorController;