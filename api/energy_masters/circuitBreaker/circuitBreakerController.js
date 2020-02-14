import circuitBreaker from './circuitBreakerModel';

const CircuitBreakerController = {};

// common success and error response...
CircuitBreakerController.successmsg = async (res, data, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    circuitBreakerMasterData: data
  })
}

CircuitBreakerController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    circuitBreakerMasterData: []
  })
}

//circuitBreaker find all records
CircuitBreakerController.findAll = async (req, res) => {

  try {
    const circuitBreakerall = await circuitBreaker.find({ 'CBM_IsActive_bool': true }).populate('CBM_Fk_PanelId_Obj CBM_Fk_LM_LocationID_Obj CBM_Fk_SM_SiteID_Obj CBM_Fk_BuildingId_Obj');
    CircuitBreakerController.successmsg(res, circuitBreakerall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    CircuitBreakerController.errormsg(res, error);
  }
}


//circuitBreaker save 
CircuitBreakerController.insert = async (req, res) => {

  try {
    let CircuitBreakerObj = new circuitBreaker({
      CBM_CircuitBreakerName_str: req.body.circuitBreakerName,
      CBM_CircuitBreakerDispalyName_str: req.body.circuitBreakerDisplayName,
      CBM_Fk_LM_LocationID_Obj: req.body.locationId,
      CBM_Fk_SM_SiteID_Obj: req.body.siteId,
      CBM_Fk_BuildingId_Obj: req.body.buildingId,
      CBM_Fk_PanelId_Obj: req.body.panelId,
      CBM_PhaseType_int: req.body.phaseType,
      CBM_MCBTripCurrent_Num: req.body.mcbTripCurrent,
      CBM_Description_Str: req.body.description,
      // CBM_CreatedbyId_obj: req.body.createdById,
      // CBM_ModifedbyId_obj: req.body.modifiedById,
      // CBM_CreatedIP_str: req.body.createdIP,
      // CBM_ModifiedIP_str: req.body.modifiedIP
    });

    const circuitBreakerinsert = await CircuitBreakerObj.save();

    CircuitBreakerController.successmsg(res, circuitBreakerinsert, 'saved successfully')

  } catch (error) {
    CircuitBreakerController.errormsg(res, error);
  }
}

//circuitBreaker update all
CircuitBreakerController.update = async (req, res) => {

  try {

    let circuitBreaker_id = req.params.id;

    let CircuitBreakerObj = {
      CBM_CircuitBreakerName_str: req.body.circuitBreakerName,
      CBM_Fk_LM_LocationID_Obj: req.body.locationId,
      CBM_Fk_SM_SiteID_Obj: req.body.siteId,
      CBM_Fk_BuildingId_Obj: req.body.buildingId,
      CBM_CircuitBreakerDispalyName_str: req.body.circuitBreakerDisplayName,
      CBM_Fk_PanelId_Obj: req.body.panelId,
      CBM_PhaseType_int: req.body.phaseType,
      CBM_MCBTripCurrent_Num: req.body.mcbTripCurrent,
      CBM_Description_Str: req.body.description,
      // CBM_CreatedbyId_obj: req.body.createdById,
      // CBM_ModifedbyId_obj: req.body.modifiedById,
      // CBM_CreatedIP_str: req.body.createdIP,
      // CBM_ModifiedIP_str: req.body.modifiedIP
    };


    const circuitBreakerupdate = await circuitBreaker.findByIdAndUpdate(circuitBreaker_id, CircuitBreakerObj, { new: true });

    CircuitBreakerController.successmsg(res, circuitBreakerupdate, 'updated successfully')

  } catch (error) {
    CircuitBreakerController.errormsg(res, error);
  }
}

//circuitBreaker find single record
CircuitBreakerController.find = async (req, res) => {
  try {
    let circuitBreaker_id = req.params.id;
    const circuitBreakerOne = await circuitBreaker.findOne({ '_id': circuitBreaker_id, 'CBM_IsActive_bool': true }).populate('CBM_Fk_PanelId_Obj CBM_Fk_LM_LocationID_Obj CBM_Fk_SM_SiteID_Obj CBM_Fk_BuildingId_Obj');

    CircuitBreakerController.successmsg(res, circuitBreakerOne, "found By Id Successfully");

  } catch (error) {
    CircuitBreakerController.errormsg(res, error);
  }
}


//circuitBreaker delete soft
CircuitBreakerController.delete = async (req, res) => {
  try {

    let circuitBreaker_id = req.params.id;

    let circuitBreakerObj = {
      CBM_IsActive_bool: false
    }

    const soft_delete_circuitBreaker = await circuitBreaker.findByIdAndUpdate(circuitBreaker_id, circuitBreakerObj, { new: true });

    CircuitBreakerController.successmsg(res, soft_delete_circuitBreaker, "Deleted Successfully")

  } catch (error) {
    CircuitBreakerController.errormsg(res, error)
  }
}

export default CircuitBreakerController;