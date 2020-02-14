import Zone from "./zoneModel";

export default {
  findAll: function (req, res) {
    Zone.find({ "ZM_IsDeleted_Bool": false }).populate('ZM_PK_BuildingID_Obj ZM_Fk_MainModule_Id_Obj').exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send({ zoneMasterData: docs });
    });
  },

  find: function (req, res) {
    let _id = req.params.id;
    Zone.findById({ _id, "ZM_IsDeleted_Bool": false }).populate('ZM_PK_BuildingID_Obj ZM_Fk_MainModule_Id_Obj').exec(function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ zoneMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await Zone.find({ ZM_ZoneName_Str: req.body.zoneName, "ZM_IsDeleted_Bool": false });

    if (duplicate_data.length == 0) {
      try {
        let zoneObj = new Zone({
          ZM_ZoneName_Str: req.body.zoneName,
          ZM_ZoneDisplayName_Str: req.body.displayName,
          ZM_Floor_Str: req.body.floor,
          ZM_PK_BuildingID_Obj: req.body.buildingId,
          ZM_Fk_MainModule_Id_Obj: req.body.mainModuleId
          // ZM_Photo_Str: req.file.path,
          // ZM_CreatedbyId_int: req.body.createdById,
          // ZM_ModifiedbyId_int: req.body.modifiedById,
          // ZM_CreatedIP_str: req.body.createdIp,
          // ZM_ModifiedIP_str: req.body.modifiedIp
        });
        let zone_data = await zoneObj.save();
        res.send({ code: 200, msg: "Saved Successfully", zoneMasterData: zone_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", zoneMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Saved Not Successfully", zoneMasterData: [] });
    }
  },

  update: async function (req, res) {

    let duplicate_data = await Zone.find({ ZM_ZoneName_Str: req.body.zoneName, "ZM_IsDeleted_Bool": false });

    if (duplicate_data.length == 0) {
      try {
        let id = req.params.id;
        let updateDocObj = {
          ZM_ZoneName_Str: req.body.zoneName,
          ZM_ZoneDisplayName_Str: req.body.displayName,
          ZM_Floor_Str: req.body.floor,
          // ZM_Photo_Str: req.body.photoName,
          ZM_PK_BuildingID_Obj: req.body.buildingId,
          ZM_Fk_MainModule_Id_Obj: req.body.mainModuleId

          // ZM_CreatedbyId_int: req.body.createdById,
          // ZM_ModifiedbyId_int: req.body.modifiedById,
          // ZM_CreatedIP_str: req.body.createdIp,
          // ZM_ModifiedIP_str: req.body.modifiedIp
        }
        let zone_data = await Zone.findOneAndUpdate({ _id: id }, updateDocObj, { new: true });
        res.send({ code: 200, msg: "Saved Successfully", zoneMasterData: zone_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", zoneMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Saved Not Successfully", zoneMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let zoneObj = {
      ZM_IsDeleted_Bool: true
    }
    Zone.findOneAndUpdate({ _id: id }, zoneObj, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ zoneMasterData: doc });
    });
  }
}