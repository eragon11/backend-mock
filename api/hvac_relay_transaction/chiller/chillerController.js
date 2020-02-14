import chiller from './chillerModel';
import chillerMaster from '../../hvac_masters/chiller/chillerModel';
const ChillerController = {};

// common success and error response...
ChillerController.successmsg = async (res, chillerRelayTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    chillerRelayTransactionData
  })
}

ChillerController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    chillerRelayTransactionData: []
  })
}

//chiller find all records
ChillerController.findAll = async (req, res) => {
  try {
    const chillerall = await chiller.find({ 'CHLRTS_Is_Deleted_Bool': false }).populate('CHLRTS_FK_CHILLERDeviceId_obj');

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
    console.log("chillerRelay");

    console.log(req.body);

    let ChillerObj = new chiller({
      CHLRTS_FK_CHILLERDeviceId_obj: chillerDeviceId,
      CHLRTS_IoModuleID_str: req.body.ioModuleId,
      CHLRTS_DeviceId_str: req.body.deviceId,
      CHLRTS_RelayStatus_Bool: req.body.relayStatus,
      CHLRTS_DeviceType_str: req.body.deviceType,
      // CHLRTS_CreatedIP_str: req.body.createdIP,
      CHLRTS_Anomaly_Check_int: req.body.anomalyCheck,
      CHLRTS_RelayStatus_R_Bool: req.body.relayStatusR,
      CHLRTS_RelayStatus_Y_Bool: req.body.relayStatusY,
      CHLRTS_RelayStatus_B_Bool: req.body.relayStatusB
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
    let ChillerObj = new chiller({
      CHLRTS_FK_CHILLERDeviceId_obj: req.body.chillerDeviceId,
      CHLRTS_IoModuleID_str: req.body.ioModuleId,
      CHLRTS_DeviceId_str: req.body.deviceId,
      CHLRTS_RelayStatus_Bool: req.body.relayStatus,
      CHLRTS_DeviceType_str: req.body.deviceType,
      // CHLRTS_CreatedIP_str: req.body.createdIP,
      CHLRTS_Anomaly_Check_int: req.body.anomalyCheck,
      CHLRTS_RelayStatus_R_Bool: req.body.relayStatusR,
      CHLRTS_RelayStatus_Y_Bool: req.body.relayStatusY,
      CHLRTS_RelayStatus_B_Bool: req.body.relayStatusB
    });
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
    const soft_delete_chiller = await chiller.findByIdAndUpdate(chiller_id, chillerObj, { new: true });
    ChillerController.successmsg(res, soft_delete_chiller, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    ChillerController.errormsg(res, error)
  }
}

export default ChillerController;