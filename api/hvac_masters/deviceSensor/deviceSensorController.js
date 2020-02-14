
import DeviceSensor from "./deviceSensorModel";

export default {
  findAll: function (req, res) {
    DeviceSensor.find({ 'DSCNF_IsActive_bool': { $ne: false } }).populate('DSCNF_FK_MainModuleId_Obj DSCNF_FK_SubModuleId_Obj DSCNF_FK_IOModule_Obj DSCNF_Fk_SensorId_Obj DSCNF_Fk_SensorId_List').exec(function (err, docs) {
      if (err) return res.send(err);
      res.send({ deviceSensorMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    DeviceSensor.findOne({ '_id': id, 'DSCNF_IsActive_bool': { $ne: false } })
    .populate(
      //{path:
       'DSCNF_Fk_SensorId_List',
      // populate: { 
      //   path: 'DSCNF_Fk_SensorId_Obj'
      // }
   // }
    ).exec(function (err, doc) {
      if (err) return res.send(err);
      res.send({ deviceSensorMasterData: doc });
    });
  },

  insert: function (req, res) {
    console.log(req.body);
    let deviceSensor = new DeviceSensor({
      DSCNF_FK_MainModuleId_Obj: req.body.mainModuleId,
      DSCNF_FK_SubModuleId_Obj: req.body.subModuleId,
      DSCNF_FK_Device_Id_Obj: req.body.deviceId,
      DSCNF_Fk_SensorId_Obj: req.body.sensorId,
      DSCNF_Fk_SensorId_List: req.body.sensorList,
      DSCNF_FK_IOModule_Obj: req.body.ioModule,
      // DSCNF_Fk_LM_LocationID_Obj: req.body.locationId,
      // DSCNF_Fk_SM_SiteID_Obj: req.body.siteId,
      // DSCNF_Fk_BM_BuildingID_Obj: req.body.buildingId,
      // DSCNF_Fk_ZM_ZoneID_Obj: req.body.zoneId,
      // DSCNF_CreatedbyId_Obj: req.body.createdById,
      // DSCNF_ModifiedbyId_Obj: req.body.modifiedById,
      // DSCNF_CreatedIP_str: req.body.createdIP,
      // DSCNFr_ModifiedIP_str: req.body.modifiedIP,

    });

    deviceSensor.save({ new: true }, function (err, doc) {
      if(err)
      res.send(err)
      res.send({ deviceSensorMasterData: doc });
    });
  },

  update: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      DSCNF_FK_MainModuleId_Obj: req.body.mainModuleId,
      DSCNF_FK_SubModuleId_Obj: req.body.subModuleId,
      DSCNF_FK_Device_Id_Obj: req.body.deviceId,
      DSCNF_Fk_SensorId_Obj: req.body.sensorId,
      DSCNF_Fk_SensorId_List: req.body.sensorList,
      DSCNF_FK_IOModule_Obj: req.body.ioModule,
      // DSCNF_CreatedbyId_Obj: req.body.createdById,
      // DSCNF_ModifiedbyId_Obj: req.body.modifiedById,
      // DSCNF_CreatedIP_str: req.body.createdIP,
      // DSCNFr_ModifiedIP_str: req.body.modifiedIP,
    }
    DeviceSensor.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ deviceSensorMasterData: doc });
    });
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      DSCNF_IsActive_bool: false
    }

    DeviceSensor.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      res.send({ deviceSensorMasterData: doc });
    });
  }


}