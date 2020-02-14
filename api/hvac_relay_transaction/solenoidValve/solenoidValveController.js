import solenoidValve from './solenoidValveModel';
import solenoidValveMaster from '../../hvac_masters/solenoidValve/solenoidValveModel';
const SolenoidValveController = {};

// common success and error response...
SolenoidValveController.successmsg = async (res, solenoidValveRelayTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    solenoidValveRelayTransactionData
  })
}

SolenoidValveController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    solenoidValveRelayTransactionData: []
  })
}

//solenoidValve find all records
SolenoidValveController.findAll = async (req, res) => {
  try {
    const solenoidValveall = await solenoidValve.find({ 'SOVTS_Is_Deleted_Bool': false }).populate('SOVTS_Fk_SOVDeviceId_obj');

    SolenoidValveController.successmsg(res, solenoidValveall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    SolenoidValveController.errormsg(res, error);
  }
}


//solenoidValve save 
SolenoidValveController.insert = async (req, res) => {
  try {

    let device_id = await solenoidValveMaster.findOne({ "SOVM_DeviceId_Num": req.body.ioModuleId });

    let solenoidValveDeviceId = device_id._id;

    let SolenoidValveObj = new solenoidValve({
      SOVTS_Fk_SOVDeviceId_obj: solenoidValveDeviceId,
      SOVTS_IoModuleID_str: req.body.ioModuleId,
      SOVTS_DeviceId_str: req.body.deviceId,
      SOVTS_DeviceType_str: req.body.deviceType,
      SOVTS_RelayStatus_Bool: req.body.relayStatus,
      // SOVTS_CreatedIP_str: req.body.createdIP,
      SOVTS_Anomaly_Check_int: req.body.anomalyCheck,
    });

    const solenoidValveinsert = await SolenoidValveObj.save();

    SolenoidValveController.successmsg(res, solenoidValveinsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    SolenoidValveController.errormsg(res, error);
  }
}

//solenoidValve update all
SolenoidValveController.update = async (req, res) => {
  try {
    let solenoidValve_id = req.params.id
    let SolenoidValveObj = {
      SOVTS_Fk_SOVDeviceId_obj: req.body.solenoidValveId,
      SOVTS_IoModuleID_str: req.body.ioModuleId,
      SOVTS_DeviceId_str: req.body.deviceId,
      SOVTS_DeviceType_str: req.body.deviceType,
      SOVTS_RelayStatus_Bool: req.body.relayStatus,
      // SOVTS_CreatedIP_str: req.body.createdIP,
      SOVTS_Anomaly_Check_int: req.body.anomalyCheck,
      // PUMPTS_CreatedIP_str: req.body.createdIP,
    };
    const solenoidValveupdate = await solenoidValve.findByIdAndUpdate(solenoidValve_id, SolenoidValveObj, { new: true });
    SolenoidValveController.successmsg(res, solenoidValveupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    SolenoidValveController.errormsg(res, error);
  }
}

//solenoidValve find single record
SolenoidValveController.find = async (req, res) => {
  try {
    let solenoidValve_id = req.params.id;

    const solenoidValveOne = await solenoidValve.findOne({ '_id': solenoidValve_id, 'SOVTS_Is_Deleted_Bool': false }).populate('SOVTS_Fk_SOVDeviceId_obj');

    SolenoidValveController.successmsg(res, solenoidValveOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    SolenoidValveController.errormsg(res, error);
  }
}


//solenoidValve delete soft
SolenoidValveController.delete = async (req, res) => {
  try {

    let solenoidValve_id = req.params.id;

    let solenoidValveObj = {
      SOVTS_Is_Deleted_Bool: true
    }

    const soft_delete_solenoidValve = await solenoidValve.findByIdAndUpdate(solenoidValve_id, solenoidValveObj, { new: true });

    SolenoidValveController.successmsg(res, soft_delete_solenoidValve, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    SolenoidValveController.errormsg(res, error)
  }
}

export default SolenoidValveController;