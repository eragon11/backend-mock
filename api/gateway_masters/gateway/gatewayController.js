import gateway from './gatewayModel';

const gatewayController = {};

// common success and error response...
gatewayController.successmsg = async (res, data, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    gatewayMasterData: data
  })
}

gatewayController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    gatewayMasterData: []
  })
}

//gateway find all records
gatewayController.findAll = async (req, res) => {

  try {
    const gatewayall = await gateway.find({ 'GTWM_IsActive_bool': true });
    gatewayController.successmsg(res, gatewayall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    gatewayController.errormsg(res, error);
  }
}


//gateway save 
gatewayController.insert = async (req, res) => {

  try {
    let gatewayObj = new gateway({
      GTWM_GatewayName_Str: req.body.gatewayName,
      GTWM_GatewayID_Str: req.body.gatewayID,
      GTWM_Gateway_IP_Str: req.body.gatewayIP,
      GTWM_Gateway_MAC_str: req.body.gatewayMAC,
      GTWM_Gateway_Model_Str: req.body.gatewayModel,
      // GTWM_CreatedbyId_Obj: req.body.createdById,
      // GTWM_ModifiedbyId_Obj: req.body.modifiedById,
      // GTWM_CreatedIP_str: req.body.createdIP,
      // GTWM_ModifiedIP_str: req.body.modifiedIP,
    });

    const gatewayinsert = await gatewayObj.save();

    gatewayController.successmsg(res, gatewayinsert, 'saved successfully')

  } catch (error) {
    gatewayController.errormsg(res, error);
  }
}

//gateway update all
gatewayController.update = async (req, res) => {

  try {
    let gateway_id = req.params.id;
    let gatewayObj = {
      GTWM_GatewayName_Str: req.body.gatewayName,
      GTWM_GatewayID_Str: req.body.gatewayID,
      GTWM_Gateway_IP_Str: req.body.gatewayIP,
      GTWM_Gateway_MAC_str: req.body.gatewayMAC,
      GTWM_Gateway_Model_Str: req.body.gatewayModel,
      // GTWM_CreatedbyId_Obj: req.body.createdById,
      // GTWM_ModifiedbyId_Obj: req.body.modifiedById,
      // GTWM_CreatedIP_str: req.body.createdIP,
      // GTWM_ModifiedIP_str: req.body.modifiedIP,
    };

    const gatewayupdate = await gateway.findByIdAndUpdate(gateway_id, gatewayObj, { new: true });

    gatewayController.successmsg(res, gatewayupdate, 'updated successfully')
  } catch (error) {
    gatewayController.errormsg(res, error);
  }
}

//gateway find single record
gatewayController.find = async (req, res) => {
  try {
    let gateway_id = req.params.id;
    const gatewayOne = await gateway.findOne({ '_id': gateway_id, 'GTWM_IsActive_bool': true });

    gatewayController.successmsg(res, gatewayOne, "found By Id Successfully");
  } catch (error) {
    gatewayController.errormsg(res, error);
  }
}


//gateway delete soft
gatewayController.delete = async (req, res) => {
  try {

    let gateway_id = req.params.id;
    let gatewayObj = {
      GTWM_IsActive_bool: false
    }
    const soft_delete_gateway = await gateway.findByIdAndUpdate(gateway_id, gatewayObj, { new: true });

    gatewayController.successmsg(res, soft_delete_gateway, "Deleted Successfully")
  } catch (error) {
    gatewayController.errormsg(res, error)
  }
}

export default gatewayController;