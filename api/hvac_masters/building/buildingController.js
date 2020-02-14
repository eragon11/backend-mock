import Building from "./buildingModel";


export default {
  findAll: function (req, res) {
    Building.find({ 'BM_IsActive_bool': true }).populate('BM_Fk_Site_Id_Obj BM_Fk_MainModule_Id_Obj').sort({ "BM_Modified_Date": 1 }).exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send({ buidingMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    Building.findById({ _id: id, 'BM_IsActive_bool': true }).populate('BM_Fk_Site_Id_Obj BM_Fk_MainModule_Id_Obj').exec(function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ buidingMasterData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await Building.find({ "BM_BuildingName_Str": req.body.buildingName, 'BM_IsActive_bool': true });

    if (duplicate_data.length == 0) {
      try {
        let building = new Building({
          BM_BuildingName_Str: req.body.buildingName,
          BM_BuildingDisplayName_Str: req.body.buildingDisplayName,
          BM_BuildingAddress_Str: req.body.buidlingAddress,
          BM_Latitude_Str: req.body.lat,
          BM_Longitude_Str: req.body.long,
          BM_BuildingImagePath_Str: req.body.photo,
          BM_BuildingType_Str: req.body.buildingType,
          BM_BuildingOfficeHrs_Str: req.body.officeHrs,
          BM_BuildingTotalArea_Num: req.body.buildingTotalArea,
          BM_BuildingFloorArea_Num: req.body.buildingFloorArea,
          BM_ElectricityUnitPrice_Str: req.body.electricityUnitPrice,
          BM_ElectricityCurrencyType_Str: req.body.electricityCurrencyType,
          BM_ElectricityUnitType_Str: req.body.electricityUnitType,
          BM_EffectDatePrice_Date: req.body.effectiveDateprice,
          BM_PermittedPower_Num: req.body.permittedPower,
          BM_Fk_Site_Id_Obj: req.body.siteId,
          BM_Fk_MainModule_Id_Obj: req.body.mainModuleId,
          //BM_BuildingImagePath_Str: req.body.buildingImage,
          //BM_CreatedbyId_int: req.body.createdId,
          //BM_ModifiedbyId_int: req.body.modifiedId
          //BM_CreatedIP_str: req.body.createdIp
          //BM_ModifiedIP_str: req.body.modifiedIp
        });
        let building_data = await building.save();
        res.send({ code: 200, msg: "Saved Successfully", buildingMasterData: building_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", buildingMasterData: [] })
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", buildingMasterData: [] });
    }
  },

  update: async function (req, res) {
    let id = req.params.id;

    let duplicate_data = await Building.find({ "BM_BuildingName_Str": req.body.buildingName, 'BM_IsActive_bool': true });

    if (duplicate_data.length == 0) {

      try {
        let updateDoc = {
          BM_BuildingName_Str: req.body.buildingName,
          BM_BuildingAddress_Str: req.body.buidlingAddress,
          BM_Latitude_Str: req.body.lat,
          BM_Longitude_Str: req.body.long,
          BM_BuildingImagePath_Str: req.body.photo,
          BM_BuildingDisplayName_Str: req.body.buildingDisplayName,
          BM_BuildingType_Str: req.body.buildingType,
          BM_BuildingOfficeHrs_Str: req.body.officeHrs,
          BM_BuildingTotalArea_Num: req.body.buildingTotalArea,
          BM_BuildingFloorArea_Num: req.body.buildingFloorArea,
          BM_ElectricityUnitPrice_Str: req.body.electricityUnitPrice,
          BM_ElectricityCurrencyType_Str: req.body.electricityCurrencyType,
          BM_ElectricityUnitType_Str: req.body.electricityUnitType,
          BM_EffectDatePrice_Date: req.body.effectiveDateprice,
          BM_PermittedPower_Num: req.body.permittedPower,
          BM_Fk_Site_Id_Obj: req.body.siteId,
          BM_Fk_MainModule_Id_Obj: req.body.mainModuleId,
          //BM_BuildingImagePath_Str: req.body.buildingImage,
          //BM_CreatedbyId_int: req.body.createdId,
          //BM_ModifiedbyId_int: req.body.modifiedId
          //BM_CreatedIP_str: req.body.createdIp
          //BM_ModifiedIP_str: req.body.modifiedIp
        }
        let building_data = await Building.findOneAndUpdate({ _id: id }, updateDoc, { new: true })
        res.send({ code: 200, msg: "Updated Successfully", buildingMasterData: building_data });
      } catch (error) {
        res.send({ code: 400, msg: "Updated Not Successfully", buildingMasterData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", buildingMasterData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;

    let buildingObj = {
      BM_IsActive_bool: false
    }

    Building.findOneAndUpdate({ _id: id }, buildingObj, function (doc) {
      res.send({ buidingMasterData: doc });
    });
  }
}