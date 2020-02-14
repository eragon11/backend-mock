import LightIntensity from "./lightIntensityModel";
import lightIntensity from "../../refrigeration_masters/lightIntensity/lightIntensityModel";
let ObjectId = require("mongoose").Types.ObjectId;
let lightIntensityController = {};

lightIntensityController.successmsg = async (res, msg, data) => {
  res.status(200).send({
    msg: msg,
    lightIntensityTransactionData: data
  })
}

lightIntensityController.errormsg = async (res, err) => {
  res.status(400).send({
    msg: "Error Found",
    lightIntensityTransactionData: err
  })
}


lightIntensityController.findAll = async (req, res) => {
  try {
    let lightIntensityData = await LightIntensity.find({ 'LITS_IsActive_Bool': true }).populate('LITS_Fk_LightIntensityDeviceId_Obj')
    lightIntensityController.successmsg(res, "Success", lightIntensityData);
  } catch (error) {
    lightIntensityController.successmsg(res, error);
  }
}

lightIntensityController.find = async (req, res) => {
  try {
    let lightIntensity_id = req.params.id;
    console.log("lightIntensity");

    console.log(lightIntensity_id);

    let lightIntensityOne = await LightIntensity.findById({ '_id': ObjectId(lightIntensity_id), 'LITS_IsActive_bool': true }).populate('LITS_Fk_LightIntensityDeviceId_Obj');

    lightIntensityController.successmsg(res, "found By Id Successfully", lightIntensityOne);

  } catch (error) {
    console.log(error);
    lightIntensityController.errormsg(res, error);
  }
}
lightIntensityController.insert = async (req, res) => {
  try {
    let lightIntensitydeviceId = await lightIntensity.findOne({ "LIM_DeviceId_Num": req.body.ioModuleId });
    let deviceId = lightIntensitydeviceId._id;
    let LightIntensityObj = new LightIntensity({
      LITS_Intensity_Num: req.body.intensityNumber,
      LITS_Fk_LightIntensityDeviceId_Obj: deviceId,
      LITS_IoModuleID_str: req.body.ioModuleId,
      LITS_DeviceId_str: req.body.deviceId,
      LITS_DeviceType_str: req.body.deviceType,
      LITS_Anomaly_Check_int: req.body.anomalyCheck
    });
    const lightIntensityinsert = await LightIntensityObj.save();
    lightIntensityController.successmsg(res, 'saved successfully', lightIntensityinsert)

  } catch (error) {
    console.log(error);
    lightIntensityController.errormsg(res, error);
  }
}

lightIntensityController.update = async (req, res) => {

  try {
    let id = req.params.id;
    let LightIntensityObj = {
      LITS_Intensity_Num: req.body.intensityNumber,
      LITS_Fk_LightIntensityDeviceId_Obj: req.body.lightIntensityDeviceId,
      // LITS_CreatedbyId_obj: req.body.createdById,
      // LITS_ModifedbyId_obj: req.body.modifiedById,
      // LITS_CreatedIP_str: req.body.createdIP,
      // LITS_ModifiedIP_str: req.body.modifiedIP
    };


    const lightIntensityUpdate = await LightIntensity.findByIdAndUpdate(id, { LightIntensityObj });

    lightIntensityController.successmsg(res, 'updated successfully', lightIntensityUpdate)

  } catch (error) {
    console.log(error);
    lightIntensityController.errormsg(res, error);
  }
}


lightIntensityController.delete = async (req, res) => {
  try {

    let lightIntensity_id = req.params.id;

    let lightIntensityObj = {
      LITS_IsActive_bool: false
    }
    console.log(lightIntensityObj);

    const soft_delete_lightIntensity = await LightIntensity.findByIdAndUpdate(lightIntensity_id, lightIntensityObj, { new: true });

    lightIntensityController.successmsg(res, "Deleted Successfully", soft_delete_lightIntensity)

  } catch (error) {
    console.log(error);
    lightIntensityController.errormsg(res, error);
  }
}

export default lightIntensityController;