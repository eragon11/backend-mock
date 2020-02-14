import fan from './fanModel';
import fanMaster from "../../hvac_masters/fan/fanModel";
const FanController = {};

// common success and error response...
FanController.successmsg = async (res, fanTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    fanTransactionData
  })
}
FanController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    fanTransactionData: []
  })
}

//fan find all records
FanController.findAll = async (req, res) => {
  try {
    const fanall = await fan.find({ 'FANTS_Is_Deleted_Bool': false }).populate('FANTS_Fk_FANDeviceId_object');

    FanController.successmsg(res, fanall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    FanController.errormsg(res, error);
  }
}

//fan save 
FanController.insert = async (req, res) => {
  try {
    let device_id = await fanMaster.findOne({ "FANM_DeviceId_Str": req.body.ioModuleId });
    let deviceId = device_id._id;
    let FanObj = new fan({
      FANTS_Fk_FANDeviceId_object: deviceId,
      FANTS_IoModuleID_str: req.body.ioModuleId,
      FANTS_DeviceId_str: req.body.deviceId,
      FANTS_DeviceType_str: req.body.deviceType,
      FANTS_RPM_Num: req.body.rpm,
      FANTS_Anomaly_Check_int: req.body.anomalyCheck,
      // FANTS_CreatedIP_str: req.body.createdIP,
    });

    const faninsert = await FanObj.save();
    FanController.successmsg(res, faninsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    FanController.errormsg(res, error);
  }
}

//fan update all
FanController.update = async (req, res) => {
  try {
    let fan_id = req.params.id
    let FanObj = {
      FANTS_Fk_FANDeviceId_object: req.body.fanDeviceId,
      FANTS_IoModuleID_str: req.body.ioModuleId,
      FANTS_DeviceId_str: req.body.deviceId,
      FANTS_DeviceType_str: req.body.deviceType,
      FANTS_RPM_Num: req.body.rpm,
      FANTS_Anomaly_Check_int: req.body.anomalyCheck,
      // FANTS_CreatedIP_str: req.body.createdIP,
    };

    const fanupdate = await fan.findByIdAndUpdate(fan_id, FanObj, { new: true });
    FanController.successmsg(res, fanupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    FanController.errormsg(res, error);
  }
}

//fan find single record
FanController.find = async (req, res) => {
  try {
    let fan_id = req.params.id;
    
    const fanOne = await fan.findOne({ '_id': fan_id, 'FANTS_Is_Deleted_Bool': false }).populate('FANTS_Fk_FANDeviceId_object');
    FanController.successmsg(res, fanOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    FanController.errormsg(res, error);
  }
}

//fan delete soft
FanController.delete = async (req, res) => {
  try {
    let fan_id = req.params.id;
    let fanObj = {
      FANTS_Is_Deleted_Bool: true
    }
  
    const soft_delete_fan = await fan.findByIdAndUpdate(fan_id, fanObj, { new: true });
    FanController.successmsg(res, soft_delete_fan, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    FanController.errormsg(res, error)
  }
}

export default FanController;