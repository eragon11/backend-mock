import role from './roleModel';

const roleController = {};

// common success and error response...
roleController.successmsg = async (res, roleMasterData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    roleMasterData
  })
}

roleController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    roleMasterData: []
  })
}

//role find all records
roleController.findAll = async (req, res) => {

  try {

    const roleall = await role.find({ 'Role_IsActive_bool': true });

    roleController.successmsg(res, roleall, 'found All Successfully')

  } catch (error) {
    roleController.errormsg(res, error);
  }
}


//role save 
roleController.insert = async (req, res) => {

  try {
    let RoleObj = new role({
      Role_Name_Str: req.body.roleName,
      Role_DisplayName_Str: req.body.roleDisplayName,
      Role_Description_Str: req.body.roleDescription
      // Role_CreatedbyId_obj: req.body.createdById,
      // Role_ModifiedbyId_obj: req.body.ModifiedById,
      // Role_CreatedIP_str: req.body.createdIP,
      // Role_ModifiedIP_str: req.body.modifiedIP
    });

    const roleinsert = await RoleObj.save();

    roleController.successmsg(res, roleinsert, 'saved successfully')

  } catch (error) {
    roleController.errormsg(res, error);
  }
}

//role update all
roleController.update = async (req, res) => {
  try {

    let role_id = req.params.id

    let RoleObj = {
      Role_Name_Str: req.body.roleName,
      Role_DisplayName_Str: req.body.roleDisplayName,
      Role_Description_Str: req.body.roleDescription,
      // Role_CreatedbyId_obj: req.body.createdById,
      // Role_ModifiedbyId_obj: req.body.ModifiedById,
      // Role_CreatedIP_str: req.body.createdIP,
      // Role_ModifiedIP_str: req.body.modifiedIP
    };

    const roleupdate = await role.findByIdAndUpdate(role_id, RoleObj, { new: true });

    roleController.successmsg(res, roleupdate, 'updated successfully')

  } catch (error) {
    roleController.errormsg(res, error);
  }
}

//role find single record
roleController.find = async (req, res) => {
  try {
    let role_id = req.params.id;

    const roleOne = await role.findOne({ '_id': role_id, 'Role_IsActive_bool': true });

    roleController.successmsg(res, roleOne, "found By Id Successfully");

  } catch (error) {
    roleController.errormsg(res, error);
  }
}


//role delete soft
roleController.delete = async (req, res) => {
  try {

    let role_id = req.params.id;

    let roleObj = {
      Role_IsActive_bool: false
    }

    const soft_delete_role = await role.findByIdAndUpdate(role_id, roleObj, { new: true });

    roleController.successmsg(res, soft_delete_role, "Deleted Successfully")

  } catch (error) {
    roleController.errormsg(res, error)
  }
}

export default roleController;