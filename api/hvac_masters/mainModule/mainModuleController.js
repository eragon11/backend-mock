import main from './mainModuleModel';

const mainController = {};

// common success and error response...
mainController.successmsg = async (res, mainModuleData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    mainModuleData
  })
}

mainController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    mainModuleData: []
  })
}

//main find all records
mainController.findAll = async (req, res) => {
  try {
    const mainall = await main.find({ 'MMM_IsActive_bool': true });
    console.log(mainall);

    mainController.successmsg(res, mainall, 'found All Successfully')
  } catch (error) {
    console.log(error);
    mainController.errormsg(res, error);
  }
}

//main save 
mainController.insert = async (req, res) => {

  let duplicate_data = await main.find({ "MMM_MainModuleName_str": req.body.moduleName, 'MMM_IsActive_bool': true });
  if (duplicate_data.length == 0) {
    try {
      let mainObj = new main({
        MMM_MainModuleName_str: req.body.moduleName,
        MMM_MainModuleDisplayName_str: req.body.displayName,
        MMM_Description_str: req.body.description,
        // MMM_CreatedbyId_obj: req.body.createdById,
        // MMM_ModifiedbyId_obj: req.body.modifiedById,
        // MMM_CreatedIP_str: req.body.createdIP,
        // MMM_ModifiedIP_str: req.body.modifiedIP,
      });
      const maininsert = await mainObj.save();
      mainController.successmsg(res, maininsert, 'saved successfully');
    } catch (error) {
      console.log(error);
      mainController.errormsg(res, error);
    }
  } else {
    mainController.errormsg(res, "Duplicate Occurred");
  }
}

//main update all
mainController.update = async (req, res) => {
  let duplicate_data = await main.find({ "MMM_MainModuleName_str": req.body.moduleName, 'MMM_IsActive_bool': true });

  if (duplicate_data.length == 0) {
    try {
      let main_id = req.params.id
      let mainObj = {
        MMM_MainModuleName_str: req.body.moduleName,
        MMM_MainModuleDisplayName_str: req.body.displayName,
        MMM_Description_str: req.body.description,
        // MMM_CreatedbyId_obj: req.body.createdById,
        // MMM_ModifiedbyId_obj: req.body.modifiedById,
        // MMM_CreatedIP_str: req.body.createdIP,
        // MMM_ModifiedIP_str: req.body.modifiedIP,
      };
      const mainupdate = await main.findByIdAndUpdate(main_id, mainObj, { new: true });
      mainController.successmsg(res, mainupdate, 'Updated successfully')
    } catch (error) {
      console.log(error);
      mainController.errormsg(res, error);
    }
  } else {
    mainController.errormsg(res, "Duplicate Occurred");
  }
}

//main find single record
mainController.find = async (req, res) => {
  try {
    let main_id = req.params.id;
    console.log(main_id);

    const mainOne = await main.findOne({ '_id': main_id, 'MMM_IsActive_bool': true });
    mainController.successmsg(res, mainOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    mainController.errormsg(res, error);
  }
}

//main delete soft
mainController.delete = async (req, res) => {
  try {
    let main_id = req.params.id;
    let mainObj = {
      MMM_IsActive_bool: false
    }
    console.log(mainObj);
    const soft_delete_main = await main.findByIdAndUpdate(main_id, mainObj, { new: true });
    mainController.successmsg(res, soft_delete_main, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    mainController.errormsg(res, error)
  }
}

export default mainController;