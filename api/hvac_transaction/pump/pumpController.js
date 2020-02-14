import pump from './pumpModel';
import pumpMaster from "../../hvac_masters/pump/pumpModel";
const PumpController = {};

// common success and error response...
PumpController.successmsg = async (res, pumpTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    pumpTransactionData
  })
}
PumpController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    pumpTransactionData: []
  })
}

//pump find all records
PumpController.findAll = async (req, res) => {
  try {
    const pumpall = await pump.find({ 'PUMPTS_Is_Deleted_Bool': false }).populate('PUMPTS_Fk_PUMPDeviceId_obj');

    PumpController.successmsg(res, pumpall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    PumpController.errormsg(res, error);
  }
}

//pump save 
PumpController.insert = async (req, res) => {
  try {
    let device_id = await pumpMaster.findOne({ "PUMPM_DeviceId_Num": req.body.ioModuleId });

    let deviceId = device_id._id;
    let PumpObj = new pump({
      PUMPTS_Fk_PUMPDeviceId_obj: deviceId,
      PUMPTS_Status_Bool: req.body.status,
      PUMPTS_RPM_Num: req.body.rpm,
      PUMPTS_IoModuleID_str: req.body.ioModuleId,
      PUMPTS_DeviceId_str: req.body.deviceId,
      PUMPTS_DeviceType_str: req.body.deviceType,
      PUMPTS_Anomaly_Check_int: req.body.anomalyCheck,
      // PUMPTS_CreatedIP_str: req.body.createdIP
    });

    const pumpinsert = await PumpObj.save();
    PumpController.successmsg(res, pumpinsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    PumpController.errormsg(res, error);
  }
}

//pump update all
PumpController.update = async (req, res) => {
  try {
    let pump_id = req.params.id
    let PumpObj = {
      PUMPTS_Fk_PUMPDeviceId_obj: req.body.pumpDeviceId,
      PUMPTS_Status_Bool: req.body.status,
      PUMPTS_RPM_Num: req.body.rpm,
      PUMPTS_IoModuleID_str: req.body.ioModule,
      PUMPTS_DeviceId_str: req.body.deviceId,
      PUMPTS_DeviceType_str: req.body.deviceType,
      PUMPTS_Anomaly_Check_int: req.body.anomalyCheck,
      // PUMPTS_CreatedIP_str: req.body.createdIP
    };

    const pumpupdate = await pump.findByIdAndUpdate(pump_id, PumpObj, { new: true });
    PumpController.successmsg(res, pumpupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    PumpController.errormsg(res, error);
  }
}

//pump find single record
PumpController.find = async (req, res) => {
  try {
    let pump_id = req.params.id;

    const pumpOne = await pump.findOne({ '_id': pump_id, 'PUMPTS_Is_Deleted_Bool': false }).populate('PUMPTS_Fk_PUMPDeviceId_obj');
    PumpController.successmsg(res, pumpOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    PumpController.errormsg(res, error);
  }
}

//pump delete soft
PumpController.delete = async (req, res) => {
  try {
    let pump_id = req.params.id;
    let pumpObj = {
      PUMPTS_Is_Deleted_Bool: true
    }

    const soft_delete_pump = await pump.findByIdAndUpdate(pump_id, pumpObj, { new: true });
    PumpController.successmsg(res, soft_delete_pump, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    PumpController.errormsg(res, error)
  }
}

export default PumpController;