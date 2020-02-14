import ahu from './ahuModel';
import ahuMaster from '../../hvac_masters/ahu/ahuModel';

const AhuController = {};

// common success and error response...
AhuController.successmsg = async (res, ahuTransactionData, msg) => {
    res.status(200).send({
        code: 200,
        message: msg,
        ahuTransactionData
    })
}

AhuController.errormsg = async (res, msg) => {
    res.status(400).send({
        code: 400,
        message: msg,
        ahuTransactionData: []
    })
}

//ahu find all records
AhuController.findAll = async (req, res) => {

    try {

        const ahuall = await ahu.find({ 'AHUTS_Is_Deleted_Bool': false }).populate('AHUTS_FK_AHUDeviceId_obj');

        AhuController.successmsg(res, ahuall, 'found All Successfully')

    } catch (error) {
        console.log(error);
        AhuController.errormsg(res, error);
    }
}


//ahu save 
AhuController.insert = async (req, res) => {

    try {

        let device_id = await ahuMaster.findOne({ "AHUM_DeviceId_Num": req.body.ioModuleId });

       let ahuDeviceId = device_id._id;
        let AhuObj = new ahu({
           AHUTS_FK_AHUDeviceId_obj: ahuDeviceId,
            AHUTS_IoModuleID_str: req.body.ioModuleId,
            AHUTS_DeviceId_str: req.body.deviceId,
            AHUTS_DeviceType_str: req.body.deviceType,
            AHUTS_VoltageR_Num: req.body.voltageR,
            AHUTS_VoltageY_Num: req.body.voltageY,
            AHUTS_VoltageB_Num: req.body.voltageB,
            AHUTS_CurrentR_Num: req.body.currentR,
            AHUTS_CurrentY_Num: req.body.currentY,
            AHUTS_CurrentB_Num: req.body.currentB,
            AHUTS_PowerR_Num: req.body.powerR,
            AHUTS_PowerY_Num: req.body.powerY,
            AHUTS_PowerB_Num: req.body.powerB,
            AHUTS_RelayStatus_R_Bool: req.body.relayStatusR,
            AHUTS_RelayStatus_Y_Bool: req.body.relayStatusY,
            AHUTS_RelayStatus_B_Bool: req.body.relayStatusB,
            AHUTS_Anomaly_Check_int: req.body.anomalyCheck
            // AHUTS_CreatedIP_str: req.body.createdIP,
        });


        const ahuinsert = await AhuObj.save();

        AhuController.successmsg(res, ahuinsert, 'saved successfully')

    } catch (error) {
        console.log(error);
        AhuController.errormsg(res, error);
    }
}

//ahu update all
AhuController.update = async (req, res) => {
    try {

        let ahu_id = req.params.id

        let AhuObj = {
            // AHUTS_FK_AHUDeviceId_obj: req.body.ahuDeviceId,
            AHUTS_IoModuleID_str: req.body.ioModuleId,
            AHUTS_DeviceId_str: req.body.deviceId,
            AHUTS_DeviceType_str: req.body.deviceType,
            AHUTS_VoltageR_Num: req.body.voltageR,
            AHUTS_VoltageY_Num: req.body.voltageY,
            AHUTS_VoltageB_Num: req.body.voltageB,
            AHUTS_CurrentR_Num: req.body.currentR,
            AHUTS_CurrentY_Num: req.body.currentY,
            AHUTS_CurrentB_Num: req.body.currentB,
            AHUTS_PowerR_Num: req.body.powerR,
            AHUTS_PowerY_Num: req.body.powerY,
            AHUTS_PowerB_Num: req.body.powerB,
            AHUTS_Anomaly_Check_int: req.body.anomalyCheck
            // AHUTS_CreatedIP_str: req.body.createdIP,
        };

        const ahuupdate = await ahu.findByIdAndUpdate(ahu_id, AhuObj, { new: true });

        AhuController.successmsg(res, ahuupdate, 'updated successfully')

    } catch (error) {
        console.log(error);
        AhuController.errormsg(res, error);
    }
}

//ahu find single record
AhuController.find = async (req, res) => {
    try {
        let ahu_id = req.params.id;

        const ahuOne = await ahu.findOne({ '_id': ahu_id, 'AHUTS_Is_Deleted_Bool': false }).populate('AHUTS_FK_AHUDeviceId_obj');

        AhuController.successmsg(res, ahuOne, "found By Id Successfully");

    } catch (error) {
        console.log(error);
        AhuController.errormsg(res, error);
    }
}


//ahu delete soft
AhuController.delete = async (req, res) => {
    try {

        let ahu_id = req.params.id;

        let ahuObj = {
            AHUTS_Is_Deleted_Bool: true
        }

        const soft_delete_ahu = await ahu.findByIdAndUpdate(ahu_id, ahuObj, { new: true });

        AhuController.successmsg(res, soft_delete_ahu, "Deleted Successfully")

    } catch (error) {
        console.log(error);
        AhuController.errormsg(res, error)
    }
}

export default AhuController;