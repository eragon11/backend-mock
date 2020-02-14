import entitlementHeader from './entitlementHeaderModel';
import emo from './entitlementHeaderModel';
const EntitlementHeaderController = {};

// common success and error response...
EntitlementHeaderController.successmsg = async (res, entitlementHeaderData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    entitlementHeaderData
  })
}

EntitlementHeaderController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    entitlementHeaderData: []
  })
}

//entitlementHeader find all records
EntitlementHeaderController.findAll = async (req, res) => {

  try {

    const entitlementHeaderall = await entitlementHeader.find({ 'ENTH_IsActive_bool': true })
    /*.map(function(d){
      console.log(d);
    })*/
    .populate('ENTH_Fk_MainModule_obj')
    .populate('ENTH_Fk_Role_ID_obj')
    /*.forEach(function(event) {
     // event.user = db.user.findOne({ "_id": eventUser });
      printjson(event)
  })*/
    /*User.findOne({ '_id': id, 'User_IsActive_Bool': { $ne: false } }).populate('User_Fk_LM_LocationID_Obj')
    .populate('AHUM_Fk_SM_SiteID_Obj')
    .populate('AHUM_Fk_BM_BuildingID_Obj')
    .populate('AHUM_Fk_ZM_ZoneID_Obj')*/

    



  /*  db.events.find().forEach(function(event) {
      event.user = db.user.findOne({ "_id": eventUser });
      printjson(event)
  })*/

    console.log(entitlementHeaderall);

    EntitlementHeaderController.successmsg(res, entitlementHeaderall, 'found All Successfully sankari')

  } catch (error) {
    console.log(error);
    EntitlementHeaderController.errormsg(res, error);
  }
}


//entitlementHeader save 
EntitlementHeaderController.insert = async (req, res) => {

  try {
      var mainModuleId=req.body.mainModuleId;
      var roleId= req.body.roleId;
      var ObjectId = require('mongodb').ObjectID;
  
      await entitlementHeader.updateMany({"ENTH_Fk_Role_ID_obj" : ObjectId(roleId),"ENTH_Fk_MainModule_obj" : ObjectId(mainModuleId)},{ $set: { "ENTH_IsActive_bool" : false } })

    let EntitlementHeaderObj = new entitlementHeader({
      ENTH_Fk_Role_ID_obj: req.body.roleId,
      ENTH_Fk_MainModule_obj: req.body.mainModuleId,
      ENTH_Fk_SubModule_obj:req.body.subModuleId,
      ENTH_SubModuleDataIndex_obj:req.body.subModuleDataIndex
      // ENTH_CreatedbyId_obj: req.body.createdById,
      // ENTH_ModifiedbyId_obj: req.body.modifiedById,
      // ENTH_CreatedIP_str: req.body.createdIP,
      // ENTH_ModifiedIP_str: req.body.modifiedIP,
    });


    const entitlementHeaderinsert = await EntitlementHeaderObj.save();

    EntitlementHeaderController.successmsg(res, entitlementHeaderinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    EntitlementHeaderController.errormsg(res, error);
  }
}

//entitlementHeader update all
EntitlementHeaderController.update = async (req, res) => {
  try {

    let entitlementHeader_id = req.params.id

    let EntitlementHeaderObj = {
      ENTH_Fk_Role_ID_obj: req.body.roleId,
      ENTH_Fk_MainModule_obj: req.body.mainModule,
      // ENTH_CreatedbyId_obj: req.body.createdById,
      // ENTH_ModifiedbyId_obj: req.body.modifiedById,
      // ENTH_CreatedIP_str: req.body.createdIP,
      // ENTH_ModifiedIP_str: req.body.modifiedIP,
    };

    const entitlementHeaderupdate = await entitlementHeader.findByIdAndUpdate(entitlementHeader_id, EntitlementHeaderObj, { new: true });

    EntitlementHeaderController.successmsg(res, entitlementHeaderupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    EntitlementHeaderController.errormsg(res, error);
  }
}

//entitlementHeader find single record
EntitlementHeaderController.find = async (req, res) => {
  try {
    let entitlementHeader_id = req.params.id;
    console.log(entitlementHeader_id);

    const entitlementHeaderOne = await entitlementHeader.findOne({ '_id': entitlementHeader_id, 'ENTH_IsActive_bool': true });

    EntitlementHeaderController.successmsg(res, entitlementHeaderOne, "found By Id Successfully final");

  } catch (error) {
    console.log(error);
    EntitlementHeaderController.errormsg(res, error);
  }
}


//entitlementHeader delete soft
EntitlementHeaderController.delete = async (req, res) => {
  try {

    let entitlementHeader_id = req.params.id;

    let entitlementHeaderObj = {
      ENTH_IsActive_bool: true
    }
    console.log(entitlementHeaderObj);

    const soft_delete_entitlementHeader = await entitlementHeader.findByIdAndUpdate(entitlementHeader_id, entitlementHeaderObj, { new: true });

    EntitlementHeaderController.successmsg(res, soft_delete_entitlementHeader, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    EntitlementHeaderController.errormsg(res, error)
  }
}






export default EntitlementHeaderController;