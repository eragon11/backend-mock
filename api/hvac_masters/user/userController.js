import jwt from "jsonwebtoken";
import User from "./userModel";
import { isEmpty } from "lodash";
import bcrypt from "bcrypt";
import validate from "../../../helpers/validatorCustom";
import key from "../../../config/store";
import locationModel from '../location/locationModel';
import siteModel from '../site/siteModel';
import buildingModel from '../building/buildingModel';
import zoneModel from '../zone/zoneModel';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

export default {
  create: async function (req, res, next) {
    //let token = jwt.sign({ user }, "secret")
    //res.json({ token: token });
    try {
      //new user
      var locationData = req.body.locationList;

      if (locationData != 'undefined') {
        var locationDataUpper = locationData.map(function toUpper(item) {
          return item.toUpperCase();
        });
      }
      //console.log(locationDataUpper);
      let locationObjectID = await locationModel.find({ LM_LocationDisplayName_str: locationDataUpper }).select('_id')
      //console.log(locationObjectID);

      var siteData = req.body.siteList;

      if (siteData != 'undefined') {
        var siteDataUpper = siteData.map(function toUpper(item) {
          return item.toUpperCase();
        });
      }
      //console.log(locationDataUpper);
      let siteObjectID = await siteModel.find({ SM_SiteDisplayName_Str: siteDataUpper }).select('_id')


      var buildingData = req.body.buildingList;

      if (buildingData != 'undefined') {
        var buildingDataUpper = buildingData.map(function toUpper(item) {
          return item.toUpperCase();
        });
      }
      //console.log(locationDataUpper);
      let buildingObjectID = await buildingModel.find({ BM_BuildingName_Str: buildingDataUpper }).select('_id')


      var zoneData = req.body.zoneList;

      if (zoneData != 'undefined') {
        var zoneDataUpper = zoneData.map(function toUpper(item) {
          return item.toUpperCase();
        });
      }
      //console.log(locationDataUpper);
      let zoneObjectID = await zoneModel.find({ ZM_ZoneDisplayName_Str: zoneDataUpper }).select('_id')

      let user_data = await User.find({ "User_Email_Id_Str": req.body.emailId, });

      if (user_data.length == 0) {
        // console.log(req);
        if (!isEmpty(req.body)) {
          //if (req.file !== undefined) {
          const user = new User(
            {
              User_Name_Str: req.body.name,
              User_Fk_Role_Id_Obj: req.body.role,
              User_Fk_LM_LocationID_Obj: locationObjectID,//req.body.locationId,
              User_Fk_SM_SiteID_Obj: siteObjectID,//req.body.siteId,
              User_Fk_BM_BuildingID_Obj: buildingObjectID,//req.body.buildingId,
              User_Fk_ZM_ZoneID_Obj: zoneObjectID,
              User_Firstname_Str: req.body.firstName,
              User_Lastname_Str: req.body.lastName,
              User_Password: cryptr.encrypt(req.body.password),
              User_Profile_Images_path_Str: req.body.imageName,
              User_Gender_Str: req.body.gender,
              User_DOB_Date: req.body.dob,
              User_Mobile_No_Int: cryptr.encrypt(req.body.mobileNo),
              User_Alternate_Mobile_No_Int: cryptr.encrypt(req.body.altMobileNo),
              User_Email_Id_Str: req.body.emailId,
              User_Alternate_Email_Id_Str: req.body.altEmailId,
              User_Address_Str: req.body.address,
              User_City_Str: req.body.city,
              User_Pincode_Str: req.body.pincode,
              User_Validity_From_Str: req.body.validityFrom,
              User_Validity_To_Str: req.body.validityTo,
              // User_CreatedbyId_Obj: req.body.createdBy,
              // User_ModifedbyId_Obj: req.body.modifiedBy,
              // User_CreatedIP_Str: req.body.createdIP,
              // User_ModifiedIP_Str: req.body.modifiedIP,
              // User_IsActive_Bool: false
            }
          );

          user.save().then((data) => {
            res.send({ userMasterData: data })
          });
          //  }
        }
      } else {
        res.send({ code: 400, msg: "EmailId Already Exits", userMasterData: [] })
      }
    } catch (error) {
      console.log("next")
      next(error);
    }
  },

  auth: async (req, res) => {
    try {
      res.send({ data: "Auth success" })
    } catch (error) {
      res.send({ err: error });
    }
  },

  findAll: function (req, res) {
    User.find({ 'User_IsActive_Bool': { $ne: false } })
      //.populate('User_Fk_LM_LocationID_Obj')
      //.populate('AHUM_Fk_SM_SiteID_Obj')
      //.populate('AHUM_Fk_BM_BuildingID_Obj')
      // .populate('AHUM_Fk_ZM_ZoneID_Obj')
      .exec(function (err, docs) {
        if (err) return res.send(err);
        res.send({ userMasterData: docs });
      });
  },

  find: function (req, res) {
    let id = req.params.id;
    User.findOne({ '_id': id, 'User_IsActive_Bool': { $ne: false } }).populate('User_Fk_LM_LocationID_Obj')
      .populate('AHUM_Fk_SM_SiteID_Obj')
      .populate('AHUM_Fk_BM_BuildingID_Obj')
      .populate('AHUM_Fk_ZM_ZoneID_Obj').exec(function (err, doc) {
        if (err) return res.send(err);
        res.send({ userMasterData: doc });
      });
  },

  update: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      User_Name_Str: req.body.name,
      User_Fk_Role_Id_Obj: req.body.role,
      User_Fk_LM_LocationID_Obj: req.body.locationId,
      User_Fk_SM_SiteID_Obj: req.body.siteId,
      User_Fk_BM_BuildingID_Obj: req.body.buildingId,
      User_Fk_ZM_ZoneID_Obj: req.body.zoneId,
      User_Firstname_Str: req.body.firstName,
      User_Lastname_Str: req.body.lastName,
      User_Profile_Images_path_Str: req.body.imageName,
      User_Gender_Str: req.body.gender,
      User_DOB_Date: req.body.dob,
      User_Mobile_No_Int: cryptr.encrypt(req.body.mobileNo),
      User_Alternate_Mobile_No_Int: cryptr.encrypt(req.body.altMobileNo),
      User_Email_Id_Str: req.body.emailId,
      User_Alternate_Email_Id_Str: req.body.altEmailId,
      User_Address_Str: req.body.address,
      User_City_Str: req.body.city,
      User_Pincode_Str: req.body.pincode,
      User_Validity_From_Str: req.body.validityFrom,
      User_Validity_To_Str: req.body.validityTo,
      // User_CreatedbyId_Obj: req.body.createdBy,
      // User_ModifedbyId_Obj: req.body.modifiedBy,
      // User_CreatedIP_Str: req.body.createdIP,
      // User_ModifiedIP_Str: req.body.modifiedIP,
      // User_IsActive_Bool: false

    }
    User.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ userMasterData: doc });
    });
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      User_IsActive_Bool: false
    }

    User.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ userMasterData: doc });
    });
  },

  register: function (req, res, next) {
    // Form validation
    try {
      const { errors, isValid } = validate.validateRegisterInput(req.body);
      // Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      User.findOne({ email: req.body.email }).then(user => {
        try {
          if (user) {
            return res.status(400).json({ email: "Email already exists" });
          } else {
            const newUser = new User({
              User_Name_Str: req.body.name,
              User_Email_Id_Str: req.body.email,
              User_Password: req.body.password,
              User_Fk_Role_Id_Obj: req.body.role
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.User_Password = hash;
                newUser.save().then((user) => {
                  res.json(user);
                }).catch((err) => {
                  console.log(err);
                });
              });
            });
          }
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      next(err);
    }
  },

  login: async function (req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const Role = req.body.role;
      let payload = {};
      var loggedInUser = await User.findOne({ "User_Email_Id_Str": email }).populate('User_Fk_Role_Id_Obj');

      if (cryptr.decrypt(loggedInUser.User_Password) == password) {
        var location_details = []
        loggedInUser.User_Fk_LM_LocationID_Obj.forEach(function (Id) {
          location_details.push(locationById(Id._id))
        });

        await Promise.all(location_details).then(function (details) {
          payload.locationDetails = details;
        })

        var site_details = []
        loggedInUser.User_Fk_SM_SiteID_Obj.forEach(function (Id) {
          site_details.push(siteById(Id._id))
        });

        await Promise.all(site_details).then(function (details) {
          payload.siteDetails = details;
        })

        var building_details = []
        loggedInUser.User_Fk_BM_BuildingID_Obj.forEach(function (Id) {
          building_details.push(buildingById(Id._id))
        });

        await Promise.all(building_details).then(function (details) {
          payload.buildingDetails = details;
        })
        payload.email = loggedInUser.User_Email_Id_Str;
        payload._id = loggedInUser._id;
        payload.firstName = loggedInUser.User_Firstname_Str;
        payload.lastName = loggedInUser.User_Lastname_Str;
        payload.role_name = loggedInUser.User_Fk_Role_Id_Obj.Role_Name_Str;

        res.send({
          code: 200,
          msg: "Login Successfully",
          data: await jwtTokenGeneration(payload)
        })
      } else {
        res.send({
          code: 401,
          msg: "Invalid Password",
          data: []
        })
      }
    } catch (error) {
      res.send({
        code: 400,
        msg: "Login Not Successfully",
        data: error
      })
      next(error)
    }
  },
}

async function locationById(data) {
  let locationData = await locationModel.findById(data).select("_id LM_LocationName_Str");
  return locationData;
}

async function siteById(data) {
  let siteData = await siteModel.findById(data).select("_id SM_SiteName_Str SM_Fk_Location_Id_Obj");
  return siteData;
}

async function buildingById(data) {
  let buildingData = await buildingModel.findById(data).select("_id BM_BuildingName_Str BM_Fk_Site_Id_Obj");
  return buildingData;
}

async function jwtTokenGeneration(payload) {
  const token = await jwt.sign({
    data: payload
  }, key.secret, { expiresIn: 31556926 });
  payload.token = token;

  return payload;
}