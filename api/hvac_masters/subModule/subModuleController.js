import sub from './subModuleModel';

const subController = {};

// common success and error response...
subController.successmsg = async (res, subModuleData, msg) => {
    res.status(200).send({
        code: 200,
        message: msg,
        subModuleData
    })
}

subController.errormsg = async (res, msg) => {
    res.status(400).send({
        code: 400,
        message: msg,
        subModuleData: []
    })
}

//sub find all records

subController.findAll = function (req, res) {
    sub.find({}, function (err, docs) {
        res.send(docs);
    });
},

    subController.findAll = async (req, res) => {

        try {

            const suball = await sub.find({ 'SMM_IsActive_bool': true }).populate('SMM_Fk_MainModule_Id_obj');
            console.log(suball);
            subController.successmsg(res, suball, 'found All Successfully')

        } catch (error) {
            console.log(error);
            subController.errormsg(res, error);
        }
    }

//sub save 
subController.insert = async (req, res) => {

    let duplicate_data = await sub.find({ "SMM_SubModuleName_str": req.body.subModuleName, 'SMM_IsActive_bool': true });
    if (duplicate_data.length == 0) {
        try {
            let subObj = new sub({
                SMM_SubModuleName_str: req.body.subModuleName,
                SMM_SubModuleDisplayName_str: req.body.displayName,
                SMM_Description_str: req.body.description,
                SMM_Fk_MainModule_Id_obj: req.body.mainModuleId,
                // SMM_CreatedbyId_obj: req.body.createdById,
                // SMM_ModifiedbyId_obj: req.body.modifiedById,
                // SMM_CreatedIP_str: req.body.createdIP,
                // SMM_ModifiedIP_str: req.body.modifiedIP,
            });
            const subinsert = await subObj.save();
            subController.successmsg(res, subinsert, 'saved successfully')

        } catch (error) {
            console.log(error);
            subController.errormsg(res, error);
        }
    } else {
        subController.errormsg(res, "Duplicate Occurred");
    }
}

//sub update all
subController.update = async (req, res) => {
    let duplicate_data = await sub.find({ "SMM_SubModuleName_str": req.body.subModuleName, 'SMM_IsActive_bool': true });
    if (duplicate_data.length == 0) {
        try {
            let sub_id = req.params.id
            let subObj = {
                SMM_SubModuleName_str: req.body.subModuleName,
                SMM_SubModuleDisplayName_str: req.body.displayName,
                SMM_Description_str: req.body.description,
                SMM_Fk_MainModule_Id_obj: req.body.mainModuleId,
                // SMM_CreatedbyId_obj: req.body.createdById,
                // SMM_ModifiedbyId_obj: req.body.modifiedById,
                // SMM_CreatedIP_str: req.body.createdIP,
                // SMM_ModifiedIP_str: req.body.modifiedIP,
            };
            const subupdate = await sub.findByIdAndUpdate(sub_id, subObj, { new: true });
            subController.successmsg(res, subupdate, 'updated successfully')
        } catch (error) {
            console.log(error);
            subController.errormsg(res, error);
        }
    } else {
        subController.errormsg(res, "Duplicate Occurred");
    }
}

//sub find single record
subController.find = async (req, res) => {
    try {
        let sub_id = req.params.id;
        const subOne = await sub.findOne({ '_id': sub_id, 'SMM_IsActive_bool': true }).populate('SMM_Fk_MainModule_Id_obj');
        subController.successmsg(res, subOne, "found By Id Successfully");
    } catch (error) {
        console.log(error);
        subController.errormsg(res, error);
    }
}

//sub delete soft
subController.delete = async (req, res) => {
    try {
        let sub_id = req.params.id;
        let subObj = {
            SMM_IsActive_bool: false
        }
        const soft_delete_sub = await sub.findByIdAndUpdate(sub_id, subObj, { new: true });
        subController.successmsg(res, soft_delete_sub, "Deleted Successfully")

    } catch (error) {
        console.log(error);
        subController.errormsg(res, error)
    }
}

export default subController;