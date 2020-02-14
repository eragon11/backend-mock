import waterTank from './waterTankModel';
import waterTankMaster from '../../hvac_masters/waterTank/waterTankModel';
const WaterTankController = {};

// common success and error response...
WaterTankController.successmsg = async (res, waterTankTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    waterTankTransactionData
  })
}
WaterTankController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    waterTankTransactionData: []
  })
}

//waterTank find all records
WaterTankController.findAll = async (req, res) => {
  try {
    const waterTankall = await waterTank.find({ 'WTKTS_Is_Deleted_Bool': false }).populate('WTKTS_Fk_WaterTankDeviceId_obj');

    WaterTankController.successmsg(res, waterTankall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    WaterTankController.errormsg(res, error);
  }
}

//waterTank save 
WaterTankController.insert = async (req, res) => {
  try {
    let device_id = await waterTankMaster.findOne({ "WTKM_DeviceId_Num": req.body.ioModuleId });

    let deviceId = device_id._id;
    let WaterTankObj = new waterTank({
      WTKTS_Fk_WaterTankDeviceId_obj: deviceId,
      WTKTS_WaterLevel_Num: req.body.waterLevel,
      WTKTS_IoModuleID_str: req.body.ioModuleId,
      WTKTS_DeviceId_str: req.body.deviceId,
      WTKTS_DeviceType_str: req.body.deviceType,
      WTKTS_Anomaly_Check_int: req.body.anomalyCheck
      // WTKTS_CreatedIP_str: req.body.createdIP
    });

    const waterTankinsert = await WaterTankObj.save();
    WaterTankController.successmsg(res, waterTankinsert, 'saved successfully')
  } catch (error) {
    console.log(error);
    WaterTankController.errormsg(res, error);
  }
}

//waterTank update all
WaterTankController.update = async (req, res) => {
  try {
    let waterTank_id = req.params.id
    let WaterTankObj = {
      WTKTS_Fk_WaterTankDeviceId_obj: req.body.waterTankDeviceId,
      WTKTS_WaterLevel_Num: req.body.waterLevel,
      WTKTS_IoModuleID_str: req.body.ioModuleId,
      WTKTS_DeviceId_str: req.body.deviceId,
      WTKTS_DeviceType_str: req.body.deviceType,
      WTKTS_Anomaly_Check_int: req.body.anomalyCheck
      // WTKTS_CreatedIP_str: req.body.createdIP
    };

    const waterTankupdate = await waterTank.findByIdAndUpdate(waterTank_id, WaterTankObj, { new: true });
    WaterTankController.successmsg(res, waterTankupdate, 'updated successfully')
  } catch (error) {
    console.log(error);
    WaterTankController.errormsg(res, error);
  }
}

//waterTank find single record
WaterTankController.find = async (req, res) => {
  try {
    let waterTank_id = req.params.id;

    const waterTankOne = await waterTank.findOne({ "_id": waterTank_id, 'WTKTS_Is_Deleted_Bool': false }).populate('WTKTS_Fk_WaterTankDeviceId_obj');
    WaterTankController.successmsg(res, waterTankOne, "found By Id Successfully");
  } catch (error) {
    console.log(error);
    WaterTankController.errormsg(res, error);
  }
}

//waterTank delete soft
WaterTankController.delete = async (req, res) => {
  try {
    let waterTank_id = req.params.id;
    let waterTankObj = {
      WTKTS_Is_Deleted_Bool: true
    }

    const soft_delete_waterTank = await waterTank.findByIdAndUpdate(waterTank_id, waterTankObj, { new: true });
    WaterTankController.successmsg(res, soft_delete_waterTank, "Deleted Successfully")
  } catch (error) {
    console.log(error);
    WaterTankController.errormsg(res, error)
  }
}

export default WaterTankController;