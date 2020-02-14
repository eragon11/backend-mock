
import doorStatusTransaction from "../../refrigeration_transaction/doorStatus/doorStatusModel";
import doorStatusMaster from "../../refrigeration_masters/doorStatus/doorStatusModel";

const DoorStatusController = {};

// common success and error response...
DoorStatusController.successmsg = async (res, doorStatusMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    doorStatusMasterData
  })
}

DoorStatusController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    doorStatusMasterData: []
  })
}

//doorStatus find all records
DoorStatusController.findAll = async (req, res) => {

  try {

    const doorStatusall = await doorStatusTransaction.find({ 'DSTS_Is_Deleted_Bool': false }).populate('DSTS_Fk_DoorStatusDeviceId_obj');
    console.log(doorStatusall);
    DoorStatusController.successmsg(res, doorStatusall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error);
  }
}


//doorStatus save 
DoorStatusController.insert = async (req, res) => {
  try {
    let doorStatus = await doorStatusMaster.findOne({ "DSM_DeviceId_Num": req.body.ioModuleId });
    let deviceId = doorStatus._id;
    let DoorStatusObj = new doorStatusTransaction({
      DSTS_Fk_DoorStatusDeviceId_obj: deviceId,
      DSTS_Status_Bool: req.body.status,
      DSTS_IoModuleID_str: req.body.ioModuleId,
      DSTS_DeviceId_str: req.body.deviceId,
      DSTS_DeviceType_str: req.body.deviceType,
      DSTS_Anomaly_Check_int: req.body.anomalyCheck
    });
    const doorStatusinsert = await DoorStatusObj.save();

    DoorStatusController.successmsg(res, doorStatusinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error);
  }
}

//doorStatus update all
DoorStatusController.update = async (req, res) => {
  try {

    let doorStatus_id = req.params.id

    let DoorStatusObj = {
      DSTS_Fk_DoorStatusDeviceId_obj: req.body.doorStatusDeviceId,
      DSTS_Status_Bool: req.body.status,
      // DSTS_CreatedIP_str: req.body.createdIP,
    };

    const doorStatusupdate = await doorStatusTransaction.findByIdAndUpdate(doorStatus_id, DoorStatusObj, { new: true });

    DoorStatusController.successmsg(res, doorStatusupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error);
  }
}

//doorStatus find single record
DoorStatusController.find = async (req, res) => {
  try {
    let doorStatus_id = req.params.id;
    console.log(doorStatus_id);

    const doorStatusOne = await doorStatusTransaction.findOne({ '_id': doorStatus_id, 'DSTS_Is_Deleted_Bool': false }).populate('DSTS_Fk_DoorStatusDeviceId_obj');

    DoorStatusController.successmsg(res, doorStatusOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error);
  }
}


//doorStatus delete soft
DoorStatusController.delete = async (req, res) => {
  try {

    let doorStatus_id = req.params.id;

    let doorStatusObj = {
      DSTS_Is_Deleted_Bool: true
    }
    console.log(doorStatusObj);

    const soft_delete_doorStatus = await doorStatusTransaction.findByIdAndUpdate(doorStatus_id, doorStatusObj, { new: true });

    DoorStatusController.successmsg(res, soft_delete_doorStatus, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    DoorStatusController.errormsg(res, error)
  }
}

export default DoorStatusController;