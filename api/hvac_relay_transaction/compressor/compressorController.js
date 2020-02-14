import compressor from './compressorModel';
import compressorMaster from '../../hvac_masters/compressor/compressorModel';
const CompressorController = {};

// common success and error response...
CompressorController.successmsg = async (res, compressorRelayTransactionData, msg) => {
    res.status(200).send({
        code: 200,
        message: msg,
        compressorRelayTransactionData
    })
}

CompressorController.errormsg = async (res, msg) => {
    res.status(400).send({
        code: 400,
        message: msg,
        compressorRelayTransactionData: []
    })
}

//compressor find all records
CompressorController.findAll = async (req, res) => {
    try {
        const compressorall = await compressor.find({ 'COMPTS_Is_Deleted_Bool': false }).populate('COMPTS_FK_COMPDeviceId_obj');
        CompressorController.successmsg(res, compressorall, 'found All Successfully')
    } catch (error) {
        console.log(error);
        CompressorController.errormsg(res, error);
    }
}


//compressor save 
CompressorController.insert = async (req, res) => {
    try {
        let device_id = await compressorMaster.findOne({ "COMPM_DeviceId_Num": req.body.ioModuleId });

        let compressorDeviceId = device_id._id;

        let CompressorObj = new compressor({
            COMPTS_FK_COMPDeviceId_obj: compressorDeviceId,
            COMPTS_IoModuleID_str: req.body.ioModuleId,
            COMPTS_DeviceId_str: req.body.deviceId,
            COMPTS_DeviceType_str: req.body.deviceType,
            COMPTS_Anomaly_Check_int: req.body.anomalyCheck,
            COMPTS_RelayStatus_R_Bool: req.body.relayStatusR,
            COMPTS_RelayStatus_Y_Bool: req.body.relayStatusY,
            COMPTS_RelayStatus_B_Bool: req.body.relayStatusB,
            // COMPTS_CreatedIP_str: req.body.createdIP
        });

        const compressorinsert = await CompressorObj.save();

        CompressorController.successmsg(res, compressorinsert, 'saved successfully')
    } catch (error) {
        console.log(error);
        CompressorController.errormsg(res, error);
    }
}

//compressor update all
CompressorController.update = async (req, res) => {
    try {
        let compressor_id = req.params.id
        let CompressorObj = {
            COMPTS_FK_COMPDeviceId_obj: req.body.compressorDeviceId,
            COMPTS_IoModuleID_str: req.body.ioModuleId,
            COMPTS_DeviceId_str: req.body.deviceId,
            COMPTS_DeviceType_str: req.body.deviceType,
            COMPTS_Anomaly_Check_int: req.body.anomalyCheck,
            COMPTS_RelayStatus_R_Bool: req.body.relayStatusR,
            COMPTS_RelayStatus_Y_Bool: req.body.relayStatusY,
            COMPTS_RelayStatus_B_Bool: req.body.relayStatusB,
            COMPTS_CreatedIP_str: req.body.createdIP
        };
        const compressorupdate = await compressor.findByIdAndUpdate(compressor_id, CompressorObj, { new: true });
        CompressorController.successmsg(res, compressorupdate, 'updated successfully')
    } catch (error) {
        console.log(error);
        CompressorController.errormsg(res, error);
    }
}

//compressor find single record
CompressorController.find = async (req, res) => {
    try {
        let compressor_id = req.params.id;
    
        const compressorOne = await compressor.findOne({ '_id': compressor_id, 'COMPTS_Is_Deleted_Bool': false }).populate('COMPTS_FK_COMPDeviceId_obj');

        CompressorController.successmsg(res, compressorOne, "found By Id Successfully");

    } catch (error) {
        console.log(error);
        CompressorController.errormsg(res, error);
    }
}


//compressor delete soft
CompressorController.delete = async (req, res) => {
    try {

        let compressor_id = req.params.id;

        let compressorObj = {
            COMPTS_Is_Deleted_Bool: true
        }
        
        const soft_delete_compressor = await compressor.findByIdAndUpdate(compressor_id, compressorObj, { new: true });

        CompressorController.successmsg(res, soft_delete_compressor, "Deleted Successfully")

    } catch (error) {
        console.log(error);
        CompressorController.errormsg(res, error)
    }
}

export default CompressorController;