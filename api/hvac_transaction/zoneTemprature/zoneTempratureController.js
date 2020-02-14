import zoneTemprature from './zoneTempratureModel';
import zoneTemperatureMaster from "../../hvac_masters/zoneTemprature/zoneTempratureModel";

const ZoneTempratureController = {};

// common success and error response...
ZoneTempratureController.successmsg = async (res, zoneTempratureTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    zoneTempratureTransactionData
  })
}
ZoneTempratureController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    zoneTempratureTransactionData: []
  })
}

//zoneTemprature find all records
ZoneTempratureController.findAll = async (req, res) => {
  try {
    const zoneTempratureall = await zoneTemprature.find({ 'ZNTTS_Is_Deleted_Bool': false }).populate('ZNTTS_Fk_ZoneDeviceId_obj');
   
    ZoneTempratureController.successmsg(res, zoneTempratureall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    ZoneTempratureController.errormsg(res, error);
  }
}

//zoneTemprature save 
ZoneTempratureController.insert = async (req, res) => {
  try {

    let device_id = await zoneTemperatureMaster.findOne({ "ZNTM_DeviceId_Str": req.body.ioModuleId });
    
    let deviceId = device_id._id;
    let ZoneTempratureObj = new zoneTemprature({
      ZNTTS_Fk_ZoneDeviceId_Obj: deviceId,
      ZNTTS_IoModuleID_str: req.body.ioModuleId,
      ZNTTS_DeviceId_str: req.body.deviceId,
      ZNTTS_DeviceType_str: req.body.deviceType,
      ZNTTS_Temperature_Num: req.body.temprature,
      ZNTTS_Humidity_Num: req.body.humidity,
      ZNTTS_Anomaly_Check_int: req.body.anomalyCheck,
      ZNTTS_CreatedIP_str: req.body.createdIP
    });

    const zoneTempratureinsert = await ZoneTempratureObj.save();
    ZoneTempratureController.successmsg(res, zoneTempratureinsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    ZoneTempratureController.errormsg(res, error);
  }
}

//zoneTemprature update all
ZoneTempratureController.update = async (req, res) => {
  try {
    let zoneTemprature_id = req.params.id
    let ZoneTempratureObj = {
      ZNTTS_Fk_ZoneDeviceId_Obj: req.body.zoneDeviceId,
      ZNTTS_IoModuleID_str: req.body.ioModuleId,
      ZNTTS_DeviceId_str: req.body.deviceId,
      ZNTTS_DeviceType_str: req.body.deviceType,
      ZNTTS_Temperature_Num: req.body.temprature,
      ZNTTS_Humidity_Num: req.body.humidity,
      ZNTTS_Anomaly_Check_int: req.body.anomalyCheck
      // ZNTTS_CreatedIP_str: req.body.createdIP
    };

    const zoneTempratureupdate = await zoneTemprature.findByIdAndUpdate(zoneTemprature_id, ZoneTempratureObj, { new: true });
    ZoneTempratureController.successmsg(res, zoneTempratureupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    ZoneTempratureController.errormsg(res, error);
  }
}

//zoneTemprature find single record
ZoneTempratureController.find = async (req, res) => {
  try {
    let zoneTemprature_id = req.params.id;
   
    const zoneTempratureOne = await zoneTemprature.findOne({ '_id': zoneTemprature_id, 'ZNTTS_Is_Deleted_Bool': false }).populate('ZNTTS_Fk_ZoneDeviceId_obj');
    ZoneTempratureController.successmsg(res, zoneTempratureOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    ZoneTempratureController.errormsg(res, error);
  }
}

//zoneTemprature delete soft
ZoneTempratureController.delete = async (req, res) => {
  try {
    let zoneTemprature_id = req.params.id;
    let zoneTempratureObj = {
      ZNTTS_Is_Deleted_Bool: true
    }
   
    const soft_delete_zoneTemprature = await zoneTemprature.findByIdAndUpdate(zoneTemprature_id, zoneTempratureObj, { new: true });
    ZoneTempratureController.successmsg(res, soft_delete_zoneTemprature, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    ZoneTempratureController.errormsg(res, error)
  }
}

export default ZoneTempratureController;