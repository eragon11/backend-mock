import IOModule from "./ioModuleModel";

export default {
  findAll: function (req, res) {
    IOModule.find({ 'IOML_IsActive_bool': true }).exec(function (err, docs) {
      if (err) return res.send(err);
      res.send({ ioModuleData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    IOModule.findOne({ '_id': id, 'IOML_IsActive_bool': true }).exec(function (err, doc) {
      if (err) return res.send(err);
      res.send({ ioModuleData: doc });
    });
  },

  insert: async function (req, res) {
    console.log(req.body);

    let channelDescObj = req.body.channel;
    console.log(channelDescObj);

    let inbuildBool;
    if (req.body.inbuiltSensor == true) {
      inbuildBool = true;
    } else {
      inbuildBool = false;
    }

    let ioModule = new IOModule({
      IOML_Name_str: req.body.name,
      IOML_DisplayName_str: req.body.displayName,
      IOML_Description_str: req.body.description,
      IOML_Assetcode_str: req.body.assetCode,
      IOML_Type_Int: Number(req.body.type),
      IOML_Inbuilt_Sensors_Bool: inbuildBool,
      IOML_IP_Address_Str: req.body.ipAddress,
      IOML_IP_Mode_Int: Number(req.body.ipMode),
      IOML_UserName_Str: req.body.userName,
      IOML_Password_Str: req.body.password,
      IOML_Authentication_Type_Int: Number(req.body.authType),
      IOML_SSID_Str: req.body.ssid,
      IOML_MAC_Address_Str: req.body.macAddress,
      IOML_Gateway_Obj: req.body.gateway,
      IOML_Gateway_IP_Address_Str: req.body.gatewayIP,
      IOML_Channel_Description_Obj: req.body.channel,
      IOML_URL_Str: req.body.url,

      // IOML_CreatedbyId_Obj: req.body.createdById,
      // IOML_ModifiedbyId_Obj: req.body.modifiedById,
      // IOML_CreatedIP_Str: req.body.createdIP,
      // IOML_ModifiedIP_Str: req.body.modifiedIP
    });

    // res.send({ ioModuleData: 'testing' });

    const data = await ioModule.save();
    if (data !== null) {
      res.status(200).send({ code: 200, msg: "successfully saved", data: data });
    }
  },

  update: function (req, res) {
    let id = req.params.id;

    console.log(req.body);

    let channelDescObj = req.body.channel;
    console.log(channelDescObj);

    let inbuildBool;
    if (req.body.inbuiltSensor == true) {
      inbuildBool = true;
    } else {
      inbuildBool = false;
    }

    let updateDoc = {
      IOML_Name_str: req.body.name,
      IOML_DisplayName_str: req.body.displayName,
      IOML_Description_str: req.body.description,
      IOML_Assetcode_str: req.body.assetCode,
      IOML_Type_Int: Number(req.body.type),
      IOML_Inbuilt_Sensors_Bool: inbuildBool,
      IOML_IP_Address_Str: req.body.ipAddress,
      IOML_IP_Mode_Int: Number(req.body.ipMode),
      IOML_UserName_Str: req.body.userName,
      IOML_Password_Str: req.body.password,
      IOML_Authentication_Type_Int: Number(req.body.authType),
      IOML_SSID_Str: req.body.ssid,
      IOML_MAC_Address_Str: req.body.macAddress,
      IOML_Gateway_Obj: req.body.gateway,
      IOML_Gateway_IP_Address_Str: req.body.gatewayIP,
      IOML_Channel_Description_Obj: req.body.channel,
      IOML_URL_Str: req.body.url,

      // IOML_CreatedbyId_Obj: req.body.createdById,
      // IOML_ModifiedbyId_Obj: req.body.modifiedById,
      // IOML_CreatedIP_Str: req.body.createdIP,
      // IOML_ModifiedIP_Str: req.body.modifiedIP
    }
    IOModule.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ ioModuleData: doc });
    });
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      IOML_IsActive_bool: false
    }

    IOModule.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ ioModuleData: doc });
    });
  }


}