import panel from './panelModel';

const PanelController = {};

// common success and error response...
PanelController.successmsg = async (res, data, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    panelMasterData: data
  })
}

PanelController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    panelMasterData: []
  })
}

//panel find all records
PanelController.findAll = async (req, res) => {

  try {
    const panelall = await panel.find({ 'PANLM_IsActive_bool': true }).populate('PANLM_Fk_BuildingId_Obj PANLM_Fk_MainModule_Id_Obj PANLM_Fk_LM_LocationID_Obj PANLM_Fk_SM_SiteID_Obj PANLM_Fk_SubModule_Id_Obj');
    PanelController.successmsg(res, panelall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    PanelController.errormsg(res, error);
  }
}


//panel save 
PanelController.insert = async (req, res) => {

  try {
    let PanelObj = new panel({
      PANLM_Name_str: req.body.panelName,
      PANL_DisplayName_str: req.body.panelDisplayName,
      PANLM_Fk_LM_LocationID_Obj: req.body.locationId,
      PANLM_Fk_SM_SiteID_Obj: req.body.siteId,
      PANLM_Fk_BuildingId_Obj: req.body.buildingId,
      PANLM_Mode_int: req.body.mode,
      PANLM_Billable_int: req.body.billable,
      PANLM_PhaseType_int: req.body.phaseType,
      PANLM_MCBTripCurrent_Num: req.body.mcbTripCurrent,
      PANLM_Description_Str: req.body.description,
      PANLM_Fk_MainModule_Id_Obj: req.body.mainModuleId,
      PANLM_Fk_SubModule_Id_Obj: req.body.subModuleId,
      // PANLM_CreatedbyId_obj: req.body.createdById,
      // PANLM_ModifiedbyId_obj: req.body.modifiedById,
      // PANLM_CreatedIP_str: req.body.createdIp,
      // PANLM_ModifiedIP_str: req.body.modifiedIp
    });

    const panelinsert = await PanelObj.save();

    PanelController.successmsg(res, panelinsert, 'saved successfully')

  } catch (error) {
    PanelController.errormsg(res, error);
  }
}

//panel update all
PanelController.update = async (req, res) => {

  try {

    let panel_id = req.params.id;

    let PanelObj = {
      PANLM_Name_str: req.body.panelName,
      PANL_DisplayName_str: req.body.panelDisplayName,
      PANLM_Fk_LM_LocationID_Obj: req.body.locationId,
      PANLM_Fk_SM_SiteID_Obj: req.body.siteId,
      PANLM_Fk_BuildingId_Obj: req.body.buildingId,
      PANLM_Mode_int: req.body.mode,
      PANLM_Billable_int: req.body.billable,
      PANLM_PhaseType_int: req.body.phaseType,
      PANLM_MCBTripCurrent_Num: req.body.mcbTripCurrent,
      PANLM_Description_Str: req.body.description,
      PANLM_Fk_MainModule_Id_Obj: req.body.mainModuleId,
      PANLM_Fk_SubModule_Id_Obj: req.body.subModuleId,
      // PANLM_CreatedbyId_obj: req.body.createdById,
      // PANLM_ModifiedbyId_obj: req.body.modifiedById,
      // PANLM_CreatedIP_str: req.body.createdIp,
      // PANLM_ModifiedIP_str: req.body.modifiedIp
    };


    const panelupdate = await panel.findByIdAndUpdate(panel_id, PanelObj, { new: true });

    PanelController.successmsg(res, panelupdate, 'updated successfully')

  } catch (error) {
    PanelController.errormsg(res, error);
  }
}

//panel find single record
PanelController.find = async (req, res) => {
  try {
    let panel_id = req.params.id;
    const panelOne = await panel.findOne({ '_id': panel_id, 'PANLM_IsActive_bool': true }).populate('PANLM_Fk_BuildingId_Obj PANLM_Fk_MainModule_Id_Obj PANLM_Fk_LM_LocationID_Obj PANLM_Fk_SM_SiteID_Obj PANLM_Fk_SubModule_Id_Obj');

    PanelController.successmsg(res, panelOne, "found By Id Successfully");

  } catch (error) {
    PanelController.errormsg(res, error);
  }
}


//panel delete soft
PanelController.delete = async (req, res) => {
  try {

    let panel_id = req.params.id;

    let panelObj = {
      PANLM_IsActive_bool: false
    }

    const soft_delete_panel = await panel.findByIdAndUpdate(panel_id, panelObj, { new: true });

    PanelController.successmsg(res, soft_delete_panel, "Deleted Successfully")

  } catch (error) {
    PanelController.errormsg(res, error)
  }
}

export default PanelController;