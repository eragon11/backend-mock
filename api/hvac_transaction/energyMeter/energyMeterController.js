import energymeter from './energyMeterModel';
import compressorMaster from "../../hvac_masters/compressor/compressorModel";
import ahuMaster from "../../hvac_masters/ahu/ahuModel";
import energyMaster from "../../hvac_masters/eneryMeter/energyMeterModel";
import refrigerationMaster from "../../refrigeration_masters/refrigeration/refrigerationModel"
import phaseOneConfig from "../../../config/phaseOneConfig";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(phaseOneConfig.emailService);

const mailOptions = {
  from: 'noreply@gmail.com', // sender address
  to: 'Sivasankari.S@siqsess.com', // list of receivers
  subject: 'Subject of your email', // Subject line
  html: '<p>Your html here</p>'// plain text body
};

const EnergyMeterController = {};

// common success and error response...
EnergyMeterController.successmsg = async (res, energyMeterTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    energyMeterTransactionData
  })
}

EnergyMeterController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    energyMeterTransactionData: []
  })
}

//energymeter find all records
EnergyMeterController.findAll = async (req, res) => {
  try {
    const energymeterall = await energymeter.find({ 'ENTS_Is_Deleted_Bool': false }).populate('ENTS_Fk_EnergyMaster_Id_obj ENTS_Fk_MainModuleId_obj');
    console.log(energymeterall);

    EnergyMeterController.successmsg(res, energymeterall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    EnergyMeterController.errormsg(res, error);
  }
}

//energymeter save 
EnergyMeterController.insert = async (req, res) => {

  try {
    let deviceId;
    if (req.body.deviceType == "COMP") {
      let device_id = await compressorMaster.findOne({ "COMPM_DeviceId_Num": req.body.ioModuleId });

      deviceId = device_id._id;
    } else if (req.body.deviceType == "AHU") {
      let device_id = await ahuMaster.findOne({ "AHUM_DeviceId_Num": req.body.ioModuleId });
      deviceId = device_id._id;
    } else if (req.body.deviceType == "REF") {
      let device_id = await refrigerationMaster.findOne({ "REFM_Device_Id_Num": req.body.ioModuleId });

      deviceId = device_id._id;
    } else {
      let device_id = await energyMaster.findOne({ "EMM_DeviceId_Str": req.body.ioModuleId });

      deviceId = device_id._id;
    }

    let EnergyMeterObj = new energymeter({
      ENTS_Fk_EnergyMaster_Id_obj: deviceId,
      ENTS_IoModuleID_str: req.body.ioModuleId,
      ENTS_DeviceId_str: req.body.deviceId,
      ENTS_DeviceType_str: req.body.deviceType,
      ENTS_VoltageR_Num: req.body.voltageR,
      ENTS_VoltageY_Num: req.body.voltageY,
      ENTS_VoltageB_Num: req.body.voltageB,
      ENTS_CurrentR_Num: req.body.currentR,
      ENTS_CurrentY_Num: req.body.currentY,
      ENTS_CurrentB_Num: req.body.currentB,
      ENTS_PowerR_Num: req.body.powerR,
      ENTS_PowerY_Num: req.body.powerY,
      ENTS_PowerB_Num: req.body.powerB,
      ENTS_PowerT_Num: req.body.powerT,
      ENTS_EnergyWhR_Num: req.body.energyWhR,
      ENTS_EnergyWhY_Num: req.body.energyWhY,
      ENTS_EnergyWhB_Num: req.body.energyWhB,
      ENTS_EnergyWhT_Num: req.body.energyWhT,
      ENTS_PFR_Num: req.body.pfR,
      ENTS_PFY_Num: req.body.pfY,
      ENTS_PFB_Num: req.body.pfB,
      ENTS_Frequency_Num: req.body.frequency,
      ENTS_Anomaly_Check_int: req.body.anomalyCheck,
      // ENTS_CreatedIP_str : req.body.credatedIP
    });

    // if (req.body.anomalyCheck == 1) {
    //   transporter.sendMail(mailOptions, function (err, info) {
    //     if (err)
    //       console.log(err)
    //     else
    //       console.log(info);
    //   });
    // }

    // if (req.body.anomalyCheck == 2) {

    // }

    const energymeterinsert = await EnergyMeterObj.save();

    EnergyMeterController.successmsg(res, energymeterinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    EnergyMeterController.errormsg(res, error);
  }
}

//energymeter update all
EnergyMeterController.update = async (req, res) => {
  try {

    let energymeter_id = req.params.id

    let EnergyMeterObj = {
      ENTS_Fk_EnergyMaster_Id_obj: req.body.energyMasterId,
      ENTS_IoModuleID_str: req.body.ioModuleId,
      ENTS_DeviceId_str: req.body.deviceId,
      ENTS_DeviceType_str: req.body.deviceType,
      ENTS_VoltageR_Num: req.body.voltageR,
      ENTS_VoltageY_Num: req.body.voltageY,
      ENTS_VoltageB_Num: req.body.voltageB,
      ENTS_CurrentR_Num: req.body.currentR,
      ENTS_CurrentY_Num: req.body.currentY,
      ENTS_CurrentB_Num: req.body.currentB,
      ENTS_PowerR_Num: req.body.powerR,
      ENTS_PowerY_Num: req.body.powerY,
      ENTS_PowerB_Num: req.body.powerB,
      ENTS_PowerT_Num: req.body.powerT,
      ENTS_EnergyWhR_Num: req.body.energyWhR,
      ENTS_EnergyWhY_Num: req.body.energyWhY,
      ENTS_EnergyWhB_Num: req.body.energyWhB,
      ENTS_EnergyWhT_Num: req.body.energyWhT,
      ENTS_PFR_Num: req.body.pfR,
      ENTS_PFY_Num: req.body.pfY,
      ENTS_PFB_Num: req.body.pfB,
      ENTS_Frequency_Num: req.body.frequency,
      ENTS_Anomaly_Check_int: req.body.anomalyCheck,
      // ENTS_CreatedIP_str : req.body.credatedIP
    };

    const energymeterupdate = await energymeter.findByIdAndUpdate(energymeter_id, EnergyMeterObj, { new: true });

    EnergyMeterController.successmsg(res, energymeterupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    EnergyMeterController.errormsg(res, error);
  }
}

//energymeter find single record
EnergyMeterController.find = async (req, res) => {
  try {
    let energymeter_id = req.params.id;

    const energymeterOne = await energymeter.findOne({ '_id': energymeter_id, 'ENTS_Is_Deleted_Bool': false }).populate('ENTS_Fk_EnergyMaster_Id_obj ENTS_Fk_MainModuleId_obj');

    EnergyMeterController.successmsg(res, energymeterOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    EnergyMeterController.errormsg(res, error);
  }
}

//energymeter delete soft
EnergyMeterController.delete = async (req, res) => {
  try {

    let energymeter_id = req.params.id;

    let energymeterObj = {
      ENTS_Is_Deleted_Bool: true
    }
    const soft_delete_energymeter = await energymeter.findByIdAndUpdate(energymeter_id, energymeterObj, { new: true });
    EnergyMeterController.successmsg(res, soft_delete_energymeter, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    EnergyMeterController.errormsg(res, error)
  }
}

export default EnergyMeterController;