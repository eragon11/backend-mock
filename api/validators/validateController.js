import AHU from '../hvac_masters/ahu/ahuModel';
import Building from '../hvac_masters/building/buildingModel';
import chiller from '../hvac_masters/chiller/chillerModel';
import Compressor from "../hvac_masters/compressor/compressorModel";
import EnergyMeter from "../hvac_masters/eneryMeter/energyMeterModel";
import Fan from "../hvac_masters/fan/fanModel";
import HVACPANEL from "../hvac_masters/hvacPanel/hvacPanelModel";
import Location from "../hvac_masters/location/locationModel";
import main from "../hvac_masters/mainModule/mainModuleModel";
import pump from "../hvac_masters/pump/pumpModel";
import Sensor from "../hvac_masters/sensor/sensorModel";
import Site from "../hvac_masters/site/siteModel";
import SolenoidValve from "../hvac_masters/solenoidValve/solenoidValveModel";
import sub from "../hvac_masters/subModule/subModuleModel";
import User from "../hvac_masters/user/userModel";
import WaterTank from "../hvac_masters/waterTank/waterTankModel";
import Zone from "../hvac_masters/zone/zoneModel";
import ZoneTemprature from "../hvac_masters/zoneTemprature/zoneTempratureModel";
import doorStatus from "../refrigeration_masters/doorStatus/doorStatusModel";
import lightIntensity from "../refrigeration_masters/lightIntensity/lightIntensityModel";
import refrigeration from "../refrigeration_masters/refrigeration/refrigerationModel";
import temprature from "../refrigeration_masters/temprature/tempratureModel";
import waterDetector from "../refrigeration_masters/waterDetector/waterDetectorModel";

let validateController = {};

validateController.validate = async (req, res) => {
  let key = req.params.type;
  let name = req.params.name;
  console.log(key, name);

  let duplicate_detection;
  switch (key) {
    case "AHU":
      duplicate_detection = await AHU.find({ "AHUM_DeviceId_Num": name, 'AHUM_isActive_Bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'BUILDING':
      duplicate_detection = await Building.find({ "BM_BuildingName_Str": name, 'BM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'CHILLER':
      duplicate_detection = await chiller.find({ "CHLRM_DeviceId_Num": name, 'CHLRM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'COMPRESSOR':
      duplicate_detection = await Compressor.find({ "COMPM_DeviceId_Num": name, "COMPM_Is_Deleted_Bool": false });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'ENERGYMETER':
      duplicate_detection = await EnergyMeter.find({ "EMM_DeviceId_Str": name, "EMM_Device_Name_Str": req.body.deviceName, 'EMM_Is_Deleted_bool': false });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'FAN':
      duplicate_detection = await Fan.find({ "FANM_DeviceId_Str": name, 'FANM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'HVACPANEL':
      duplicate_detection = await HVACPANEL.find({ "HVACP_DeviceId_Num": name, 'HVACP_isActive_Bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'LOCATION':
      duplicate_detection = await Location.find({ "LM_LocationName_Str": name, "LM_Is_Deleted_Bool": false });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'MAINMODULE':
      duplicate_detection = await main.find({ "MMM_MainModuleName_str": name, 'MMM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'PUMP':
      duplicate_detection = await pump.find({ "PUMPM_DeviceId_Num": name, 'PUMPM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 400,
          msg: "",
          data: []
        })
      }
      break;
    case 'SENSOR':
      duplicate_detection = await Sensor.find({ "Sensor_Name_str": name, 'Sensor_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'SITE':
      duplicate_detection = await Site.find({ "SM_SiteName_Str": name, "SM_Is_Deleted_bool": false });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 400,
          msg: "",
          data: []
        })
      }
      break;
    case 'SOLENOIDVALVE':
      duplicate_detection = await SolenoidValve.find({ "SOVM_DeviceId_Num": name, 'SOVM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'SUBMODULE':
      duplicate_detection = await sub.find({ "SMM_SubModuleName_str": name, 'SMM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'USER':
      let duplicate_detection = await User.find({ "User_Email_Id_Str": req.body.emailId, });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'WATERTANK':
      duplicate_detection = await WaterTank.find({ WTKM_DeviceId_Num: name, 'WTKM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'ZONE':
      duplicate_detection = await Zone.find({ ZM_ZoneName_Str: name, "ZM_IsDeleted_Bool": false });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'ZONETEMPERATURE':
      duplicate_detection = await ZoneTemprature.find({ ZNTM_DeviceId_Str: name, "ZNTM_IsActive_Bool": true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'DOORSTATUS':
      duplicate_detection = await doorStatus.find({ DSM_DeviceId_Num: name, 'DSM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'LIGHTINTENSITY':
      duplicate_detection = await lightIntensity.find({ LIM_DeviceId_Num: name, 'LIM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'REFRIGERATION':
      duplicate_detection = await refrigeration.find({ REFM_Device_Id_Num: name, 'REFM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'TEMPERATURE':
      duplicate_detection = await temprature.find({ REFTM_DeviceId_Num: name, 'REFTM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;
    case 'WATERDETECTOR':
      duplicate_detection = await waterDetector.find({ WDM_DeviceId_Num: name, 'WDM_IsActive_bool': true });
      if (duplicate_detection.length != 0) {
        res.send({
          code: 400,
          msg: name + " Already Exits",
          data: []
        })
      } else {
        res.send({
          code: 200,
          msg: "",
          data: []
        })
      }
      break;

    default:
      break;
  }
}

export default validateController;