import entitlementDetails from './entitlementDetailsModel';

const EntitlementDetailsController = {};

// common success and error response...
EntitlementDetailsController.successmsg = async (res, entitlementDetailsData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    entitlementDetailsData
  })
}

EntitlementDetailsController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    entitlementDetailsData: []
  })
}

//entitlementDetails find all records
EntitlementDetailsController.findAll = async (req, res) => {

  try {

    const entitlementDetailsall = await entitlementDetails.find();
    console.log(entitlementDetailsall);

    EntitlementDetailsController.successmsg(res, entitlementDetailsall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    EntitlementDetailsController.errormsg(res, error);
  }
}


//entitlementDetails save 
EntitlementDetailsController.insert = async (req, res) => {

  try {
    let EntitlementDetailsObj = new entitlementDetails({
      ENTD_Fk_Ent_Header_Id_object: req.body.headerId,
      ENTD_Fk_SubModuleId_object: req.body.subModuleId,
      ENTD_Technician_object: req.body.technician,
      // ENTD_CreatedbyId_obj: req.body.createdById,
      // ENTD_ModifiedbyId_obj: req.body.modifiedById,
      // ENTD_CreatedIP_str: req.body.createdIP,
      // ENTD_ModifiedIP_str: req.body.modifiedIP,
    });


    const entitlementDetailsinsert = await EntitlementDetailsObj.save();

    EntitlementDetailsController.successmsg(res, entitlementDetailsinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    EntitlementDetailsController.errormsg(res, error);
  }
}

//entitlementDetails update all
EntitlementDetailsController.update = async (req, res) => {
  try {

    let entitlementDetails_id = req.params.id

    let EntitlementDetailsObj = {
      ENTD_Fk_Ent_Header_Id_object: req.body.headerId,
      ENTD_Fk_SubModuleId_object: req.body.subModuleId,
      ENTD_Technician_object: req.body.technician,
      // ENTD_CreatedbyId_obj: req.body.createdById,
      // ENTD_ModifiedbyId_obj: req.body.modifiedById,
      // ENTD_CreatedIP_str: req.body.createdIP,
      // ENTD_ModifiedIP_str: req.body.modifiedIP,
    };

    const entitlementDetailsupdate = await entitlementDetails.findByIdAndUpdate(entitlementDetails_id, EntitlementDetailsObj, { new: true });

    EntitlementDetailsController.successmsg(res, entitlementDetailsupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    EntitlementDetailsController.errormsg(res, error);
  }
}

//entitlementDetails find single record
EntitlementDetailsController.find = async (req, res) => {
  try {
    let entitlementDetails_id = req.params.id;
    console.log(entitlementDetails_id);

    const entitlementDetailsOne = await entitlementDetails.findOne({ '_id': entitlementDetails_id });

    EntitlementDetailsController.successmsg(res, entitlementDetailsOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    EntitlementDetailsController.errormsg(res, error);
  }
}


//entitlementDetails delete soft
// EntitlementDetailsController.delete = async (req, res) => {
//   try {

//     let entitlementDetails_id = req.params.id;

//     let entitlementDetailsObj = {
//       ENTD_IsActive_bool: true
//     }
//     console.log(entitlementDetailsObj);

//     const soft_delete_entitlementDetails = await entitlementDetails.findByIdAndUpdate(entitlementDetails_id, entitlementDetailsObj, { new: true });

//     EntitlementDetailsController.successmsg(res, soft_delete_entitlementDetails, "Deleted Successfully")

//   } catch (error) {
//     console.log(error);
//     EntitlementDetailsController.errormsg(res, error)
//   }
// }

export default EntitlementDetailsController;