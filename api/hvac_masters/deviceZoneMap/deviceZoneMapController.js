import DeviceZone from "./deviceZoneMapModel";
import { findKey, hasIn } from "lodash";

import zoneTempratureMaster from '../zoneTemprature/zoneTempratureModel';
import zoneTempTransaction from '../../hvac_transaction/zoneTemprature/zoneTempratureModel';


var DeviceZoneMap = {};

DeviceZoneMap.successResponse = (res, msg, data) => {
  res.send({
    message: msg,
    deviceZoneMapMasterData: data
  });
}

DeviceZoneMap.errorResponse = (res, msg) => {
  res.send({
    message: msg,
    deviceZoneMapMasterData: []
  });
}

DeviceZoneMap.findAll = async (req, res) => {
  try {
    let deviceZoneMapDocs = await DeviceZone.find({ 'DZM_IsActive_bool': true }).populate('DZM_Fk_LM_LocationID_Obj DZM_Fk_SM_SiteID_Obj DZM_Fk_BM_BuildingID_Obj DZM_Fk_ZM_ZoneID_Obj DZM_FK_SubModuleId_Obj DZM_FK_MainModuleId_Obj DZM_Fk_ZoneId_List');
    console.log("devicezonemap");


    DeviceZoneMap.successResponse(res, "sucess", deviceZoneMapDocs);
  } catch (error) {
    console.log(error);

    DeviceZoneMap.errorResponse(res, error);
  }
}

DeviceZoneMap.find = async (req, res) => {
  try {
    let id = req.params.id;
    let deviceZoneMapDoc = await DeviceZone.findOne({ '_id': id, 'DZM_IsActive_bool': true })
      .populate('DZM_Fk_LM_LocationID_Obj DZM_Fk_SM_SiteID_Obj DZM_Fk_BM_BuildingID_Obj DZM_Fk_ZM_ZoneID_Obj DZM_FK_MainModuleId_Obj DZM_FK_SubModuleId_Obj DZM_Fk_ZoneId_List')
    DeviceZoneMap.successResponse(res, "success", deviceZoneMapDoc);
  } catch (error) {
    DeviceZoneMap.errorResponse(error);
  }
}

DeviceZoneMap.insert = function (req, res) {

  let updateDocObj = {
    DZM_DeviceId_Obj: req.body.deviceId,
    DZM_Fk_LM_LocationID_Obj: req.body.locationId,
    DZM_Fk_SM_SiteID_Obj: req.body.siteId,
    DZM_Fk_BM_BuildingID_Obj: req.body.buildingId,
    DZM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
    DZM_FK_MainModuleId_Obj: req.body.mainModuleId,
    DZM_FK_SubModuleId_Obj: req.body.subModuleId,
    DZM_Fk_ZoneId_List: req.body.zoneList,
    // DZM_CreatedbyId_Obj: req.body.createdById,
    // DZM_ModifiedbyId_Obj: req.body.modifiedById,
    // DZM_CreatedIP_str: req.body.createdIP,
    // DZM_ModifiedIP_str: req.body.modifiedIP
  }

  let deviceZoneMapObj = new DeviceZone(updateDocObj);

  deviceZoneMapObj.save().then(function (data) {
    res.send({
      data: data
    });
  });


}

DeviceZoneMap.update = async (req, res) => {
  try {
    let id = req.params.id
    let updateDocObj = {
      DZM_DeviceId_Obj: req.body.deviceId,
      DZM_Fk_LM_LocationID_Obj: req.body.locationId,
      DZM_Fk_SM_SiteID_Obj: req.body.siteId,
      DZM_Fk_BM_BuildingID_Obj: req.body.buildingId,
      DZM_Fk_ZM_ZoneID_Obj: req.body.zoneId,
      DZM_FK_MainModuleId_Obj: req.body.mainModuleId,
      DZM_FK_SubModuleId_Obj: req.body.subModuleId,
      DZM_Fk_ZoneId_List: req.body.zoneList,
      // DZM_CreatedbyId_Obj: req.body.createdById,
      // DZM_ModifiedbyId_Obj: req.body.modifiedById,
      // DZM_CreatedIP_str: req.body.createdIP,
      // DZM_ModifiedIP_str: req.body.modifiedIP
    }
    let updateDoc = await DeviceZone.findByIdAndUpdate(id, updateDocObj, { new: true });
    DeviceZoneMap.successResponse(res, "success", updateDoc);
  } catch (error) {
    DeviceZoneMap.errorResponse(error);
  }
}

DeviceZoneMap.delete = async (req, res) => {
  try {
    let id = req.params.id;
    let updateDoc = {
      DZM_IsActive_bool: false
    }

    let updatedDoc = await DeviceZone.findByIdAndUpdate(id, { $set: updateDoc }, { new: true });
    DeviceZoneMap.successResponse(res, "success", updatedDoc);
  } catch (error) {
    DeviceZoneMap.errorResponse(error);
  }

}

export default DeviceZoneMap;

