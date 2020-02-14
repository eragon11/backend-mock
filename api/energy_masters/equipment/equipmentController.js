import equipment from './equipmentModel';

const EquipmentController = {};

// common success and error response...
EquipmentController.successmsg = async (res, data, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    equipmentMasterData: data
  })
}

EquipmentController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    equipmentMasterData: []
  })
}

//equipment find all records
EquipmentController.findAll = async (req, res) => {

  try {
    const equipmentall = await equipment.find({ 'EQPTM_IsActive_bool': true }).populate('EQPTM_Fk_CircuitBreakerId_Obj EQPTM_Fk_LM_LocationID_Obj EQPTM_Fk_SM_SiteID_Obj  EQPTM_Fk_BuildingId_obj');
    EquipmentController.successmsg(res, equipmentall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    EquipmentController.errormsg(res, error);
  }
}


//equipment save 
EquipmentController.insert = async (req, res) => {

  try {
    let EquipmentObj = new equipment({
      EQPTM_EquipmentName_str: req.body.equipmentName,
      EQPTM_EquipmentDisplayName_str: req.body.equipmentDisplayName,
      EQPTM_Fk_LM_LocationID_Obj: req.body.locationId,
      EQPTM_Fk_SM_SiteID_Obj: req.body.siteId,
      EQPTM_Fk_BuildingId_Obj: req.body.buildingId,
      EQPTM_Fk_CircuitBreakerId_Obj: req.body.circuitBreakerId,
      EQPTM_PhaseType_int: req.body.phaseType,
      EQPTM_Current_Num: req.body.current,
      EQPTM_Description_Str: req.body.description,
      // EQPTM_CreatedbyId_obj: req.body.createdById,
      // EQPTM_ModifedbyId_obj: req.body.modifiedById,
      // EQPTM_CreatedIP_str: req.body.createdIP,
      // EQPTM_ModifiedIP_str: req.body.modifiedIP
    });

    const equipmentinsert = await EquipmentObj.save();

    EquipmentController.successmsg(res, equipmentinsert, 'saved successfully')

  } catch (error) {
    EquipmentController.errormsg(res, error);
  }
}

//equipment update all
EquipmentController.update = async (req, res) => {

  try {

    let equipment_id = req.params.id;

    let EquipmentObj = {
      EQPTM_EquipmentName_str: req.body.equipmentName,
      EQPTM_EquipmentDisplayName_str: req.body.equipmentDisplayName,
      EQPTM_Fk_LM_LocationID_Obj: req.body.locationId,
      EQPTM_Fk_SM_SiteID_Obj: req.body.siteId,
      EQPTM_Fk_BuildingId_Obj: req.body.buildingId,
      EQPTM_Fk_CircuitBreakerId_Obj: req.body.circuitBreakerId,
      EQPTM_PhaseType_int: req.body.phaseType,
      EQPTM_Current_Num: req.body.current,
      EQPTM_Description_Str: req.body.description,
      // EQPTM_CreatedbyId_obj: req.body.createdById,
      // EQPTM_ModifedbyId_obj: req.body.modifiedById,
      // EQPTM_CreatedIP_str: req.body.createdIP,
      // EQPTM_ModifiedIP_str: req.body.modifiedIP
    };


    const equipmentupdate = await equipment.findByIdAndUpdate(equipment_id, EquipmentObj, { new: true });

    EquipmentController.successmsg(res, equipmentupdate, 'updated successfully')

  } catch (error) {
    EquipmentController.errormsg(res, error);
  }
}

//equipment find single record
EquipmentController.find = async (req, res) => {
  try {
    let equipment_id = req.params.id;
    const equipmentOne = await equipment.findOne({ '_id': equipment_id, 'EQPTM_IsActive_bool': true }).populate('EQPTM_Fk_CircuitBreakerId_Obj EQPTM_Fk_LM_LocationID_Obj EQPTM_Fk_SM_SiteID_Obj  EQPTM_Fk_BuildingId_obj');

    EquipmentController.successmsg(res, equipmentOne, "found By Id Successfully");

  } catch (error) {
    EquipmentController.errormsg(res, error);
  }
}


//equipment delete soft
EquipmentController.delete = async (req, res) => {
  try {

    let equipment_id = req.params.id;

    let equipmentObj = {
      EQPTM_IsActive_bool: false
    }

    const soft_delete_equipment = await equipment.findByIdAndUpdate(equipment_id, equipmentObj, { new: true });

    EquipmentController.successmsg(res, soft_delete_equipment, "Deleted Successfully")

  } catch (error) {
    EquipmentController.errormsg(res, error)
  }
}

export default EquipmentController;