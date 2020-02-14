import temprature from './tempratureModel';
import temperatureMaster from "../../refrigeration_masters/temprature/tempratureModel";
const TempratureController = {};

// common success and error response...
TempratureController.successmsg = async (res, tempratureTransactionData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    tempratureTransactionData
  })
}

TempratureController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    tempratureTransactionData: []
  })
}

//temprature find all records
TempratureController.findAll = async (req, res) => {

  try {

    const tempratureall = await temprature.find({ 'RFTMTS_Is_Deleted_Bool': false }).populate('REFTM_Fk_RefrigerationDeviceId_Obj REFTM_Fk_MainModuleId_Obj');
    console.log(tempratureall);

    TempratureController.successmsg(res, tempratureall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error);
  }
}


//temprature save 
TempratureController.insert = async (req, res) => {

  try {

    let tempdeviceId = await temperatureMaster.findOne({ "REFTM_DeviceId_Num": req.body.ioModuleId });
    let deviceId = tempdeviceId._id;


    let TempratureObj = new temprature({
      RFTMTS_Fk_TempratureDeviceId_Obj: deviceId,
      RFTMTS_IoModuleID_str: req.body.ioModuleId,
      RFTMTS_Temperature_Num: req.body.temprature,
      RFTMTS_Evaporator_Num: req.body.evaporator,
      RFTMTS_Condensor_Num: req.body.condensor,
      RFTMTS_Humidity_Num: req.body.humidity,
      RFTMTS_CreatedIP_str: req.body.createdIP
    });


    const tempratureinsert = await TempratureObj.save();

    TempratureController.successmsg(res, tempratureinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error);
  }
}

//temprature update all
TempratureController.update = async (req, res) => {
  try {

    let temprature_id = req.params.id

    let TempratureObj = {
      RFTMTS_Fk_TempratureDeviceId_Obj: req.body.tempratureDeviceId,
      RFTMTS_Temperature_Num: req.body.temprature,
      RFTMTS_Humidity_Num: req.body.humidity,
      RFTMTS_CreatedIP_str: req.body.createdIP
    };

    const tempratureupdate = await temprature.findByIdAndUpdate(temprature_id, TempratureObj, { new: true });

    TempratureController.successmsg(res, tempratureupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error);
  }
}

//temprature find single record
TempratureController.find = async (req, res) => {
  try {
    let temprature_id = req.params.id;
    console.log(temprature_id);

    const tempratureOne = await temprature.findOne({ '_id': temprature_id, 'RFTMTS_Is_Deleted_Bool': false }).populate('REFTM_Fk_RefrigerationDeviceId_Obj REFTM_Fk_MainModuleId_Obj');

    TempratureController.successmsg(res, tempratureOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error);
  }
}


//temprature delete soft
TempratureController.delete = async (req, res) => {
  try {

    let temprature_id = req.params.id;

    let tempratureObj = {
      RFTMTS_Is_Deleted_Bool: true
    }
    console.log(tempratureObj);

    const soft_delete_temprature = await temprature.findByIdAndUpdate(temprature_id, tempratureObj, { new: true });

    TempratureController.successmsg(res, soft_delete_temprature, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    TempratureController.errormsg(res, error)
  }
}

export default TempratureController;