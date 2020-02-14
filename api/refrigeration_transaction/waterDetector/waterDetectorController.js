import waterDetector from './waterDetectorModel';
import waterDetectorMaster from '../../refrigeration_masters/waterDetector/waterDetectorModel'

const WaterDetectorController = {};

// common success and error response...
WaterDetectorController.successmsg = async (res, waterDetectorTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    waterDetectorTransactionData
  })
}

WaterDetectorController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    waterDetectorTransactionData: []
  })
}

//waterDetector find all records
WaterDetectorController.findAll = async (req, res) => {

  try {

    const waterDetectorall = await waterDetector.find({ 'WDTS_Is_Deleted_Bool': false }).populate('WDTS_Fk_WaterDetectorDeviceId_obj');
    console.log(waterDetectorall);

    WaterDetectorController.successmsg(res, waterDetectorall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error);
  }
}


//waterDetector save 
WaterDetectorController.insert = async (req, res) => {

  try {
    let waterDetection = await waterDetectorMaster.findOne({ "WDM_DeviceId_Num": req.body.ioModuleId });
    let deviceId = waterDetection._id;
    let WaterDetectorObj = new waterDetector({
      WDTS_Fk_WaterDetectorDeviceId_obj: deviceId,
      WDTS_Status_Bool: req.body.status,
      WDTS_IoModuleID_str: req.body.ioModuleId,
      WDTS_DeviceId_str: req.body.deviceId,
      WDTS_DeviceType_str: req.body.deviceType,
      WDTS_Anomaly_Check_int: req.body.anomalyCheck
    });
    const waterDetectorinsert = await WaterDetectorObj.save();

    WaterDetectorController.successmsg(res, waterDetectorinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error);
  }
}

//waterDetector update all
WaterDetectorController.update = async (req, res) => {
  try {

    let waterDetector_id = req.params.id

    let WaterDetectorObj = {
      WDTS_Fk_WaterDetectorDeviceId_obj: req.body.waterDetectorDeviceId,
      WDTS_Status_Bool: req.body.status,
      // WDTS_CreatedIP_str: req.body.createdIP
    };

    const waterDetectorupdate = await waterDetector.findByIdAndUpdate(waterDetector_id, WaterDetectorObj, { new: true });

    WaterDetectorController.successmsg(res, waterDetectorupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error);
  }
}

//waterDetector find single record
WaterDetectorController.find = async (req, res) => {
  try {
    let waterDetector_id = req.params.id;
    console.log(waterDetector_id);

    const waterDetectorOne = await waterDetector.findOne({ '_id': waterDetector_id, 'WDTS_Is_Deleted_Bool': false }).populate('WDTS_Fk_WaterDetectorDeviceId_obj');

    WaterDetectorController.successmsg(res, waterDetectorOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error);
  }
}


//waterDetector delete soft
WaterDetectorController.delete = async (req, res) => {
  try {

    let waterDetector_id = req.params.id;

    let waterDetectorObj = {
      WDTS_Is_Deleted_Bool: true
    }
    console.log(waterDetectorObj);

    const soft_delete_waterDetector = await waterDetector.findByIdAndUpdate(waterDetector_id, waterDetectorObj, { new: true });

    WaterDetectorController.successmsg(res, soft_delete_waterDetector, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    WaterDetectorController.errormsg(res, error)
  }
}

export default WaterDetectorController;