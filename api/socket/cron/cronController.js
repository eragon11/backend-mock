import autoIssue from "../../user_management/AutoIssues/autoIssuesModel";
import * as _ from 'lodash';
import sites from "../../hvac_masters/site/siteModel";
import building from "../../hvac_masters/building/buildingModel";
import location from "../../hvac_masters/location/locationModel";
import roles from "../../user_management/role/roleModel";
import main_module from "../../hvac_masters/mainModule/mainModuleModel";
import sub_module from "../../hvac_masters/subModule/subModuleModel";
import entitlementheaders from "../../user_management/EntitlementHeader/entitlementHeaderModel";
var cron = require('node-cron');
let ObjectID = require("mongoose").Types.ObjectId;

//testing
import buildingMaster from "../../hvac_masters/building/buildingModel";


let cronController = {};

cronController.testCron = async (req, res) => {
  try {
    console.log("hi");

    cron.schedule('*/10 * * * *', async () => {
      console.log("hi Im running......");
      let autoFindAll = await autoIssue.find({ 'Issues_Status_Str': 0 });
      console.log(autoFindAll);
      let ahuArray = [];
      if (autoFindAll.length > 0) {
        autoFindAll.forEach(data => {
          console.log(data.Issues_Fk_User_Id_object);
          ahuArray.push(cronController.testcronupdate(data.Issues_Fk_User_Id_object));
          console.log("iteration 1");
        })
        await Promise.all(ahuArray).then(data => {
          console.log(data);
        }).catch(err => {
          console.log(err);
        })
      }
    });
  } catch (error) {
    console.log(error);
  }
}

cronController.testcronupdate = async (data) => {
  try {
    return new Promise(function (resolve, reject) {
      autoIssue.updateOne({ "Issues_Fk_User_Id_object": ObjectID(data), 'Issues_Status_Str': 0 }, { $set: { 'Issues_Status_Str': 1 } }, { upsert: true })
        .then(function (details, err) {
          if (err) reject(err);
          resolve(details);
        })
    })
  } catch (error) {
    console.log(error);
  }
}

cronController.basedOnBuildingId = async (req, res) => {
  try {

    let site_data = await sites.aggregate([
      { "$match": { "SM_Is_Deleted_bool": { "$eq": false } } },
      {
        "$group": {
          "_id": "$_id",
          "lastRecord": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "SM_Fk_Location_Id_Obj": "$lastRecord.SM_Fk_Location_Id_Obj",
          "SM_SiteName_Str": "$lastRecord.SM_SiteName_Str"
        }
      }
    ])

    let building_data = await building.aggregate([
      { "$match": { "BM_IsActive_bool": { "$eq": true } } },
      {
        "$group": {
          "_id": "$_id",
          "lastRecord": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "BM_Fk_Site_Id_Obj": "$lastRecord.BM_Fk_Site_Id_Obj",
          "BM_BuildingName_Str": "$lastRecord.BM_BuildingName_Str"
        }
      }
    ])

    let location_data = await location.aggregate([
      { "$match": { "LM_Is_Deleted_Bool": { "$eq": false } } },
      {
        "$group": {
          "_id": "$_id",
          "lastRecord": { "$last": "$$ROOT" }
        }
      },
      {
        "$project": {
          "LM_LocationName_Str": "$lastRecord.LM_LocationName_Str"
        }
      }
    ])

    let location_json = {};
    location_data.forEach(location => {
      let id = location._id;
      let location_name = location.LM_LocationName_Str;
      location_json[id] = {};
      location_json[id]["location_name"] = location_name;
      location_json[id]["site_json"] = {};
      site_data.forEach(site => {
        if (String(id) == String(site.SM_Fk_Location_Id_Obj)) {
          let site_id = site._id;
          location_json[id]["site_json"][site_id] = {};
          location_json[id]["site_json"][site_id]["id"] = site._id;
          location_json[id]["site_json"][site_id]["SM_Fk_Location_Id_Obj"] = site.SM_Fk_Location_Id_Obj;
          location_json[id]["site_json"][site_id]["site_name"] = site.SM_SiteName_Str;
          location_json[id]["site_json"][site_id]["building_json"] = {}
          building_data.forEach(building => {
            if (String(site_id) == String(building.BM_Fk_Site_Id_Obj)) {
              let building_id = building._id;
              location_json[id]["site_json"][site_id]["building_json"][building_id] = {};
              location_json[id]["site_json"][site_id]["building_json"][building_id]["id"] = building_id;
              location_json[id]["site_json"][site_id]["building_json"][building_id]["BM_Fk_Site_Id_Obj"] = building.BM_Fk_Site_Id_Obj;
              location_json[id]["site_json"][site_id]["building_json"][building_id]["building_name"] = building.BM_BuildingName_Str;
            }
          })
        }
      })
    })
    res.send({
      code: 200,
      msg: 'success',
      data: { site_data, building_data, location_data, location_json }
    })

  } catch (error) {
    console.log(error);
  }
}

cronController.basedOnRoles = async (req, res) => {
  try {

    let main_module_json = await main_module.find({ "MMM_IsActive_bool": true }).select('_id MMM_MainModuleName_str');
    let sub_module_json = await sub_module.find({ "SMM_IsActive_bool": true }).select('_id SMM_Fk_MainModule_Id_obj SMM_SubModuleName_str');

    let test_arr = [];
    sub_module_json.map(data => {
      test_arr.push({
        '_id': data._id, 'SMM_Fk_MainModule_Id_obj': data.SMM_Fk_MainModule_Id_obj, 'SMM_SubModuleName_str': data.SMM_SubModuleName_str, status: false
      });
    })

    let test_sub_module = _.groupBy(test_arr, 'SMM_Fk_MainModule_Id_obj');
    let main_arr = [];
    main_module_json.forEach(element => {
      main_arr.push({
        '_id': element._id,
        "MMM_MainModuleName_str": element.MMM_MainModuleName_str,
        "submoduledata": test_sub_module[element._id]
      })
    })

    let role = await entitlementheaders.find({ 'ENTH_Fk_Role_ID_obj': ObjectID("5d68ff0c780e823e64069c80") });

    let test_section = role.map(data => {
      main_arr.forEach(innerData => {
        if (String(data.ENTH_Fk_MainModule_obj) == String(innerData._id)) {
          data.ENTH_Fk_SubModule_obj.map(deepdata => {
            innerData.submoduledata.forEach(dee_data => {
              if (String(deepdata) == String(dee_data._id)) {
                dee_data.status = true
              }
            })
          })
        }
      })
    })

    res.send({
      code: 200,
      msg: "ok",
      data: { main_arr }
    })

    // return main_arr;

  } catch (error) {
    console.log(error);
  }
}

export default cronController;