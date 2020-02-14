import subModuleModel from '../hvac_masters/subModule/subModuleModel';
import ahuModel from '../hvac_masters/ahu/ahuModel';
import chillerModel from '../hvac_masters/chiller/chillerModel';
import compressorModel from '../hvac_masters/compressor/compressorModel';
import fanModel from '../hvac_masters/fan/fanModel';
import zoneTempratureModel from '../hvac_masters/zoneTemprature/zoneTempratureModel';
import pumpModel from '../hvac_masters/pump/pumpModel';
import solenoidValveModel from '../hvac_masters/solenoidValve/solenoidValveModel';
import waterTankModel from '../hvac_masters/waterTank/waterTankModel';
import hvacPanelModel from '../hvac_masters/hvacPanel/hvacPanelModel';
import PanelModel from '../energy_masters/panel/panelModel';

import locationModel from '../hvac_masters/location/locationModel';
import siteModel from '../hvac_masters/site/siteModel';
import buildingModel from '../hvac_masters/building/buildingModel';
import zoneModel from '../hvac_masters/zone/zoneModel';
import refrigerationTemperatureModel from '../refrigeration_masters/temprature/tempratureModel';
import energyMeterModel from '../hvac_transaction/energyMeter/energyMeterModel';
import energyMeterMasterModal from '../hvac_masters/eneryMeter/energyMeterModel';
import entitlementModel from '../user_management/EntitlementHeader/entitlementHeaderModel';
import waterDetectionModel from '../refrigeration_masters/waterDetector/waterDetectorModel';
import doorStatusModel from '../refrigeration_masters/doorStatus/doorStatusModel';


let hvacUtilityController = {};

var successResponse = function (res, msg, data) {
  res.send({
    msg: msg,
    result: data
  })
}

var errorResponse = (res, msg) => {
  res.send({
    msg: msg,
    data: []
  });
}

hvacUtilityController.subModulefind = async (req, res) => {
  let id = req.params.id;

  let subModule = await subModuleModel.find({ 'SMM_Fk_MainModule_Id_obj': id, 'SMM_IsActive_bool': true }).select('_id  SMM_SubModuleDisplayName_str');

  let testsubmodule = [];
  subModule.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.SMM_SubModuleDisplayName_str
    })
  })

  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.ahufind = async (req, res) => {
  let id = req.params.id;

  let ahu = await ahuModel.find({ 'AHUM_Fk_SubModuleId_Obj': id, 'AHUM_isActive_Bool': true }).select('_id AHUM_Device_Name_Str');

  let testsubmodule = [];
  ahu.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.AHUM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.chillerfind = async (req, res) => {

  let id = req.params.id;

  let chiller = await chillerModel.find({ 'CHLRM_Fk_SubModuleId_Obj': id, "CHLRM_IsActive_bool": true }).select('_id CHLRM_Device_Name_Str');

  let testsubmodule = [];
  chiller.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.CHLRM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.compressorfind = async (req, res) => {
  let id = req.params.id;

  let compressor = await compressorModel.find({ 'COMPM_Fk_SubModuleId_Obj': id, "COMPM_Is_Deleted_Bool": false }).select('_id COMPM_Device_Name_Str');

  let testsubmodule = [];
  compressor.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.COMPM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.fanfind = async (req, res) => {
  let id = req.params.id;

  let fan = await fanModel.find({ 'FANM_Fk_SubModuleId_Obj': id, "FANM_IsActive_bool": true }).select('_id FANM_Device_Name_Str');

  let testsubmodule = [];
  fan.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.FANM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.zoneTempraturefind = async (req, res) => {
  let id = req.params.id;

  let zoneTemprature = await zoneTempratureModel.find({ 'ZNTM_Fk_SubModuleId_Obj': id, "ZNTM_IsActive_Bool": true }).select('_id ZNTM_Device_Name_Str');

  let testsubmodule = [];
  zoneTemprature.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.ZNTM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })
}

hvacUtilityController.pumpfind = async (req, res) => {
  let id = req.params.id;

  let pump = await pumpModel.find({ 'PUMPM_Fk_SubModuleId_Obj': id, "PUMPM_IsActive_bool": true }).select('_id PUMPM_Device_Name_Str');

  let testsubmodule = [];
  pump.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.PUMPM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })
}

hvacUtilityController.waterTankfind = async (req, res) => {
  let id = req.params.id;

  let waterTank = await waterTankModel.find({ 'WTKM_Fk_SubModuleId_Obj': id, "WTKM_isActive_Bool": true }).select('_id WTKM_Device_Name_Str');

  let testsubmodule = [];
  waterTank.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.WTKM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.solenoidValvefind = async (req, res) => {
  let id = req.params.id;

  let solenoidValve = await solenoidValveModel.find({ 'SOVM_Fk_SubModuleId_Obj': id, "SOVM_IsActive_Bool": true }).select('_id SOVM_Device_Name_Str');

  let testsubmodule = [];
  solenoidValve.map(data => {
    testsubmodule.push({
      id: data._id,
      name: data.SOVM_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testsubmodule
  })

}

hvacUtilityController.sitefind = async (req, res) => {
  let id = req.params.id;

  let site = await siteModel.find({ 'SM_Fk_Location_Id_Obj': id, "SM_Is_Deleted_bool": false }).select('_id SM_SiteName_Str');

  res.status(200).send({
    code: 200,
    message: "Success",
    siteData: site
  })
}

hvacUtilityController.buildingfind = async (req, res) => {
  let id = req.params.id;

  let building = await buildingModel.find({ 'BM_Fk_Site_Id_Obj': id, "BM_IsActive_bool": true }).select('_id BM_BuildingName_Str');

  console.log(building);


  res.status(200).send({
    code: 200,
    message: "Success",
    buildingData: building
  })

}

hvacUtilityController.zonefind = async (req, res) => {
  let id = req.params.id;

  let zone = await zoneModel.find({ 'ZM_PK_BuildingID_Obj': id, "ZM_IsDeleted_Bool": false }).select('_id ZM_ZoneName_Str');

  res.status(200).send({
    code: 200,
    message: "Success",
    zoneData: zone
  })

}

hvacUtilityController.hvacPanelfind = async (req, res) => {
  let id = req.params.id;
  let hvacPanel = await hvacPanelModel.find({ 'HVACP_Fk_SubModuleId_Obj': id, "HVACP_isActive_Bool": true }).select('_id HVACP_Device_Name_Str');

  let testpanelmodule = [];
  hvacPanel.map(data => {
    testpanelmodule.push({
      id: data._id,
      name: data.HVACP_Device_Name_Str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testpanelmodule
  })
}

hvacUtilityController.panelfind = async (req, res) => {
  let id = req.params.id;
  let Panel = await PanelModel.find({ 'PANLM_Fk_SubModule_Id_Obj': id, "PANLM_IsActive_bool": true }).select('_id PANLM_Name_str');

  let testpanelmodule = [];
  Panel.map(data => {
    testpanelmodule.push({
      id: data._id,
      name: data.PANLM_Name_str
    })
  })
  res.status(200).send({
    code: 200,
    message: "Success",
    result: testpanelmodule
  })
}

hvacUtilityController.subModuleFindAll = async (req, res) => {
  try {


    let subModuleFindAll = await subModuleModel.find({ 'SMM_IsActive_bool': true })
      .select('_id SMM_SubModuleDisplayName_str');
    let subModuleFindArray = [];
    subModuleFindAll.map(data => {
      subModuleFindArray.push({
        id: data._id,
        name: data.SMM_SubModuleDisplayName_str
      })
    })
    successResponse(res, "success", subModuleFindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.ahufindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let ahuFindAll = await ahuModel.find({ 'AHUM_Fk_SM_SiteID_Obj': siteId, 'AHUM_Fk_LM_LocationID_Obj': locationId, 'AHUM_Fk_BM_BuildingID_Obj': buildingId, 'AHUM_isActive_Bool': true })
      .select('_id AHUM_Device_Name_Str AHUM_DeviceId_Num');
    let ahuFindArray = [];
    ahuFindAll.map(data => {
      ahuFindArray.push({
        id: data._id,
        name: data.AHUM_Device_Name_Str,
        key: data.AHUM_DeviceId_Num
      })
    })
    successResponse(res, "success", ahuFindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.chillerfindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let chillerFindAll = await chillerModel.find({ 'CHLRM_Fk_LM_LocationID_Obj': locationId, 'CHLRM_Fk_SM_SiteID_Obj': siteId, 'CHLRM_Fk_BM_BuildingID_Obj': buildingId, 'CHLRM_IsActive_bool': true })
      .select('_id CHLRM_Device_Name_Str CHLRM_DeviceId_Num');
    let chillerFindArray = [];
    chillerFindAll.map(data => {
      chillerFindArray.push({
        id: data._id,
        name: data.CHLRM_Device_Name_Str,
        key: data.CHLRM_DeviceId_Num
      })
    })
    successResponse(res, "success", chillerFindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.compressorfindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let compressorfindAll = await compressorModel.find({ 'COMPM_Fk_LM_LocationID_Obj': locationId, 'COMPM_Fk_SM_SiteID_Obj': siteId, 'COMPM_Fk_BM_BuildingID_Obj': buildingId, 'COMPM_Is_Deleted_Bool': false })
      .select('_id COMPM_DeviceId_Num COMPM_Device_Name_Str');

    let compressorFindArray = [];
    compressorfindAll.map(data => {
      compressorFindArray.push({
        id: data._id,
        name: data.COMPM_Device_Name_Str,
        key: data.COMPM_DeviceId_Num
      })
    })
    successResponse(res, "success", compressorFindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.fanfindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let fanfindAll = await fanModel.find({
      'FANM_Fk_LM_LocationID_Obj': locationId, 'FANM_Fk_SM_SiteID_Obj': siteId,
      'FANM_Fk_BM_BuildingID_Obj': buildingId, 'FANM_IsActive_bool': true
    }).select('_id FANM_Device_Name_Str FANM_DeviceId_Str');
    let fanFindArray = [];
    fanfindAll.map(data => {
      fanFindArray.push({
        id: data._id,
        name: data.FANM_Device_Name_Str,
        key: data.FANM_DeviceId_Str
      })
    })
    successResponse(res, "success", fanFindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.zoneTemperaturefindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let zoneTempraturefindAll = await zoneTempratureModel.find({ 'ZNTM_Fk_LM_LocationID_Obj': locationId, 'ZNTM_Fk_SM_SiteID_Obj': siteId, 'ZNTM_Fk_BM_BuildingID_Obj': buildingId, 'ZNTM_IsActive_Bool': true }).select('_id ZNTM_Device_Name_Str ZNTM_DeviceId_Str');
    let zoneTempraturefindArray = [];
    zoneTempraturefindAll.map(data => {
      zoneTempraturefindArray.push({
        id: data._id,
        name: data.ZNTM_Device_Name_Str,
        key: data.ZNTM_DeviceId_Str,
      })
    })
    successResponse(res, "success", zoneTempraturefindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.pumpfindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let pumpfindAll = await pumpModel.find({ 'PUMPM_Fk_LM_LocationID_Obj': locationId, 'PUMPM_Fk_SM_SiteID_Obj': siteId, 'PUMPM_Fk_BM_BuildingID_Obj': buildingId, 'PUMPM_IsActive_bool': true }).select('_id PUMPM_Device_Name_Str PUMPM_DeviceId_Num');
    let pumpfindArray = [];
    pumpfindAll.map(data => {
      pumpfindArray.push({
        id: data._id,
        name: data.PUMPM_Device_Name_Str,
        key: data.PUMPM_DeviceId_Num
      })
    })
    successResponse(res, "success", pumpfindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.waterTankfindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let waterTankfindAll = await waterTankModel.find({
      'WTKM_Fk_LM_LocationID_Obj': locationId, 'WTKM_Fk_SM_SiteID_Obj': siteId, 'WTKM_Fk_BM_BuildingID_Obj': buildingId,
      'WTKM_isActive_Bool': true
    }).select('_id WTKM_Device_Name_Str WTKM_DeviceId_Num');
    let waterTankfindArray = [];
    waterTankfindAll.map(data => {
      waterTankfindArray.push({
        id: data._id,
        name: data.WTKM_Device_Name_Str,
        key: data.WTKM_DeviceId_Num
      })
    })
    successResponse(res, "success", waterTankfindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.solenoidValvefindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let solenoidValveFindAll = await solenoidValveModel.find({ 'SOVM_Fk_LM_LocationID_Obj': locationId, 'SOVM_Fk_SM_SiteID_Obj': siteId, 'SOVM_Fk_BM_BuildingID_Obj': buildingId, 'SOVM_IsActive_Bool': true }).select('_id SOVM_Device_Name_Str SOVM_DeviceId_Num');
    console.log(solenoidValveFindAll);

    let solenoidValveFindArray = [];
    solenoidValveFindAll.map(data => {
      solenoidValveFindArray.push({
        id: data._id,
        name: data.SOVM_Device_Name_Str,
        key: data.SOVM_DeviceId_Num
      })
    })
    successResponse(res, "success", solenoidValveFindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.sitefindAll = async (req, res) => {
  let siteAll = await siteModel.find({ 'SM_Is_Deleted_bool': false }).select('_id SM_SiteName_Str');

  res.status(200).send({
    code: 200,
    message: "Success",
    siteData: siteAll
  })
}

hvacUtilityController.buildingfindAll = async (req, res) => {

  let buildingAll = await buildingModel.find({ 'BM_IsActive_bool': true }).select('_id BM_BuildingName_Str');

  res.status(200).send({
    code: 200,
    message: "Success",
    buildingData: buildingAll
  })

}

hvacUtilityController.zonefindAll = async (req, res) => {

  let zoneAll = await zoneModel.find({ 'ZM_IsDeleted_Bool': false }).select('_id ZM_ZoneName_Str');

  res.status(200).send({
    code: 200,
    message: "Success",
    zoneData: zoneAll
  })

}


hvacUtilityController.refrigerationfindAll = async (req, res) => {
  try {
    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";
    let refrigerationfindAll = await refrigerationTemperatureModel.find({ 'REFTM_Fk_LM_LocationID_Obj': locationId, 'REFTM_Fk_SM_SiteID_Obj': siteId, 'REFTM_Fk_BM_BuildingID_Obj': buildingId, 'REFTM_IsActive_bool': true }).select('_id REFTM_Device_Name_Str REFTM_DeviceId_Num');
    let refrigerationfindArray = [];
    refrigerationfindAll.map(data => {
      refrigerationfindArray.push({
        id: data._id,
        name: data.REFTM_Device_Name_Str,
        key: data.REFTM_DeviceId_Num
      })
    })
    successResponse(res, "success", refrigerationfindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.waterDetectionfindAll = async (req, res) => {
  try {
    console.log("waterDetection begin");

    let waterDetectionfindAll = await waterDetectionModel.find({ 'WDM_IsActive_bool': true }).select('_id WDM_Device_Name_Str WDM_DeviceId_Num');
    let waterDetectionfindArray = [];
    waterDetectionfindAll.map(data => {
      waterDetectionfindArray.push({
        id: data._id,
        name: data.WDM_Device_Name_Str,
        key: data.WDM_DeviceId_Num
      })
    })
    successResponse(res, "success", waterDetectionfindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.doorStatusfindAll = async (req, res) => {
  try {

    let doorStatusfindAll = await doorStatusModel.find({ 'DSM_IsActive_bool': true }).select('_id DSM_Device_Name_Str DSM_DeviceId_Num');
    let doorStatusfindArray = [];
    doorStatusfindAll.map(data => {
      doorStatusfindArray.push({
        id: data._id,
        name: data.DSM_Device_Name_Str,
        key: data.DSM_DeviceId_Num
      })
    })
    successResponse(res, "success", doorStatusfindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}

hvacUtilityController.panelfindAll = async (req, res) => {
  try {
    let type = req.params.type;
    let panelfindAll = await energyMeterMasterModal.find({ 'EMM_Is_Deleted_bool': false, 'EMM_DeviceId_Str': type }).select('_id EMM_Device_Name_Str EMM_DeviceId_Str');
    let panelfindArray = [];
    panelfindAll.map(data => {
      panelfindArray.push({
        id: data._id,
        name: data.EMM_Device_Name_Str,
        key: data.EMM_DeviceId_Str
      })
    })
    successResponse(res, "success", panelfindArray);
  } catch (error) {
    errorResponse(res, "error");
  }
}


////* User Management*///////


hvacUtilityController.sitefindMulti = async (req, res) => {
  // let id = req.params.id;
  //console.log(req.query.vardata);
  var locationData = req.query.vardata;

  console.log(locationData);

  //locationData.map(a => a.toUpperCase())

  if (locationData != 'undefined') {
    var locationDataUpper = locationData.map(function toUpper(item) {
      return item.toUpperCase();
    });
  }

  console.log(locationDataUpper);
  //let lc=await  locationModel.find(  { LM_LocationDisplayName_str:locationDataUpper}).select('_id')
  //console.log(lc);
  //let site = await siteModel.find({SM_Fk_Location_Id_Obj:lc}).select('_id SM_SiteDisplayName_Str');

  let site = await siteModel.find({ 'SM_Is_Deleted_bool': false }).select('_id SM_SiteDisplayName_Str');

  res.status(200).send({
    code: 200,
    message: "Success",
    siteData: site
  })
}
hvacUtilityController.getSubModuleByRole = async (req, res) => {

  console.log(req.query.roleId);
  console.log(req.query.mainModuleId);
  var roleId = req.query.roleId;
  var mainModuleId = req.query.mainModuleId;
  var subModuleRole;
  var ObjectId = require('mongodb').ObjectID;
  if (roleId != "" && mainModuleId != "") {

    //subModuleRole = await entitlementModel.find({ "ENTH_IsActive_bool": true },{"ENTH_Fk_MainModule_obj":mainModuleId },{"ENTH_Fk_Role_ID_obj":roleId }).sort({ "ENTH_Created_Date": -1 }).limit(1).select('_id ENTH_Fk_Role_ID_obj ENTH_Fk_MainModule_obj ENTH_Fk_SubModule_obj ENTH_SubModuleDataIndex_obj');
    subModuleRole = await entitlementModel.find({ "ENTH_Fk_MainModule_obj": ObjectId(mainModuleId), "ENTH_Fk_Role_ID_obj": ObjectId(roleId) }).sort({ "ENTH_Created_Date": -1 }).select('_id ENTH_Fk_Role_ID_obj ENTH_Fk_MainModule_obj ENTH_Fk_SubModule_obj ENTH_SubModuleDataIndex_obj');

    console.log(subModuleRole);
  }
  else {
    subModuleRole = await entitlementModel.find({ 'ENTH_IsActive_bool': true }).sort({ "ENTH_Created_Date": -1 }).limit(1).select('_id ENTH_Fk_Role_ID_obj ENTH_Fk_MainModule_obj ENTH_Fk_SubModule_obj ENTH_SubModuleDataIndex_obj');
  }

  res.status(200).send({
    code: 200,
    message: "Success",
    subModuleRoleData: subModuleRole
  })

}




export default hvacUtilityController;