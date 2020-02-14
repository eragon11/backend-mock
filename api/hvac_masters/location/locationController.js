import Location from "./locationModel";

export default {
  findAll: function (req, res) {
    Location.find({ "LM_Is_Deleted_Bool": false }).populate('LM_Fk_MainModule_Id_Obj').exec(function (err, docs) {
      res.send({ locationMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    Location.findById({ _id: id, "LM_Is_Deleted_Bool": false }).populate('LM_Fk_MainModule_Id_Obj').exec(function (err, doc) {
      res.send({ locationMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await Location.find({ "LM_LocationName_Str": req.body.locationName, "LM_Is_Deleted_Bool": false });

    if (duplicate_data.length == 0) {
      try {
        let location = new Location({
          LM_LocationName_Str: req.body.locationName,
          LM_LocationDisplayName_str: req.body.locationDisplay,
          LM_Description_str: req.body.description,
          LM_Fk_MainModule_Id_Obj: req.body.mainModuleId
          // LM_CreatedbyId_int: req.body.createdUser,
          // LM_ModifiedbyId_int: req.body.modifyUser,
          // LM_CreatedIP_str: req.body.createdIP,
          // LM_ModifiedIP_str: req.body.modifyIP,
        });

        let location_data = await location.save();
        res.send({ code: 200, msg: "Saved Successfully", locationMasterData: location_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", locationMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", locationMasterData: [] });
    }
  },

  update: async function (req, res) {
    let id = req.params.id;
    let duplicate_data = await Location.find({ "LM_LocationName_Str": req.body.locationName, "LM_Is_Deleted_Bool": false });

    if (duplicate_data.length == 0) {
      try {
        let updateDoc = {
          LM_LocationName_Str: req.body.locationName,
          LM_LocationDisplayName_str: req.body.locationDisplay,
          LM_Description_str: req.body.description,
          LM_Fk_MainModule_Id_Obj: req.body.mainModuleId

          // LM_CreatedbyId_int: req.body.createdUser,
          // LM_ModifiedbyId_int: req.body.modifyUser,
          // LM_CreatedIP_str: req.body.createdIP,
          // LM_ModifiedIP_str: req.body.modifyIP,
        }
        let location_data = await Location.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Saved Successfully", data: location_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", data: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", data: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let locationObj = {
      "LM_Is_Deleted_Bool": true
    }
    Location.findOneAndUpdate({ _id: id }, locationObj, function (doc) {
      res.send({ locationMasterData: doc });
    });
  }

}