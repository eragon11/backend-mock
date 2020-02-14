import Site from "./siteModel";

export default {
  findAll: function (req, res) {
    Site.find({ "SM_Is_Deleted_bool": false }).populate('SM_Fk_Location_Id_Obj SM_Fk_MainModule_Id_Obj').exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send({ "siteMasterData": docs });
    })
  },

  find: function (req, res) {
    let id = req.params.id;
    Site.findById({ '_id': id, "SM_Is_Deleted_bool": false }).populate('SM_Fk_Location_Id_Obj SM_Fk_MainModule_Id_Obj').exec(function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ "siteMasterData": doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await Site.find({ "SM_SiteName_Str": req.body.siteName, "SM_Is_Deleted_bool": false });

    if (duplicate_data.length == 0) {
      try {
        let site = new Site({
          SM_SiteName_Str: req.body.siteName,
          SM_SiteDisplayName_Str: req.body.displayName,
          SM_Description_Str: req.body.description,
          SM_SiteAddress_Str: req.body.address,
          //SM_CreatedbyId_int: req.body.createdId,
          //SM_ModifiedbyId_int: req.body.modified,
          SM_Fk_Location_Id_Obj: req.body.locationId,
          SM_Fk_MainModule_Id_Obj: req.body.mainModuleId
        });

        let site_data = await site.save();
        res.send({ code: 200, msg: "Saved Successfully", siteMasterData: site_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", siteMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", siteMasterData: [] });
    }
  },

  update: async (req, res) => {

    let duplicate_data = await Site.find({ "SM_SiteName_Str": req.body.siteName, "SM_Is_Deleted_bool": false });

    if (duplicate_data.length == 0) {
      try {
        let id = req.params.id;
        let updateDoc = {
          SM_SiteName_Str: req.body.siteName,
          SM_SiteDisplayName_Str: req.body.displayName,
          SM_Description_Str: req.body.description,
          SM_SiteAddress_Str: req.body.address,
          //SM_CreatedbyId_int: req.body.createdId,
          //SM_ModifiedbyId_int: req.body.modified,
          SM_Fk_Location_Id_Obj: req.body.locationId,
          SM_Fk_MainModule_Id_Obj: req.body.mainModuleId
        }

        let data = await Site.findByIdAndUpdate(id, updateDoc, { new: true });
        res.send({ code: 200, msg: "Updated Successfully", "siteMasterData": data });
      } catch (error) {
        res.send({ code: 200, msg: error, "siteMasterData": [] });
      }
    } else {
      res.send({ code: 200, msg: "Duplicate Occurred", "siteMasterData": [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    Site.findOneAndUpdate({ _id: id }, { "SM_Is_Deleted_bool": true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ "siteMasterData": doc });
    });
  }
}