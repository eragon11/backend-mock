
import Sensor from "./sensorModel";

export default {
  findAll: function (req, res) {
    Sensor.find({ 'Sensor_IsActive_bool': { $ne: false } }).exec(function (err, docs) {
      if (err) return res.send(err);
      res.send({ sensorData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    Sensor.findOne({ '_id': id, 'Sensor_IsActive_bool': { $ne: false } }).exec(function (err, doc) {
      if (err) return res.send(err);
      res.send({ sensorData: doc });
    });
  },

  insert: async function (req, res) {

    let duplicate_data = await Sensor.find({ "Sensor_Name_str": req.body.sensorName, 'Sensor_IsActive_bool': true });

    if (duplicate_data.length == 0) {
      try {

        let sensor = new Sensor({
          Sensor_Name_str: req.body.sensorName,
          Sensor_DisplayName_str: req.body.displayName,
          Sensor_Description_str: req.body.description,
          Sensor_Assetcode_str: req.body.assetcode
          // Sensor_CreatedbyId_obj: req.body.createdById,
          // Sensor_ModifiedbyId_obj: req.body.modifiedById,
          // Sensor_CreatedIP_str: req.body.createdIp,
          // Sensor_ModifiedIP_str: req.body.modifiedIp,
        });
        let sensor_data = await sensor.save();
        res.send({ code: 200, msg: "Saved Successfully", sensorData: sensor_data });
      } catch (error) {
        res.send({ code: 400, msg: "Saved Not Successfully", sensorData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", sensorData: [] });
    }
  },

  update: async function (req, res) {

    let duplicate_data = await Sensor.find({ "Sensor_Name_str": req.body.sensorName, 'Sensor_IsActive_bool': true });

    if (duplicate_data.length == 0) {
      try {
        let id = req.params.id;
        let updateDoc = {
          Sensor_Name_str: req.body.sensorName,
          Sensor_DisplayName_str: req.body.displayName,
          Sensor_Description_str: req.body.description,
          Sensor_Assetcode_str: req.body.assetcode,
          //Sensor_CreatedbyId_obj: req.body.createdById,
          //Sensor_ModifiedbyId_obj: req.body.modifiedById,
          //Sensor_CreatedIP_str: req.body.createdIp,
          //Sensor_ModifiedIP_str: req.body.modifiedIp,
        }
        let sensor_data = await Sensor.findOneAndUpdate({ _id: id }, updateDoc, { new: true });
        res.send({ code: 200, msg: "Updated Successfully", sensorData: sensor_data });
      } catch (error) {
        res.send({ code: 400, msg: "Updated Not Successfully", sensorData: [] });
      }
    } else {
      res.send({ code: 400, msg: "Duplicate Occurred", sensorData: [] });
    }
  },

  delete: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      Sensor_IsActive_bool: false
    }
    Sensor.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ sensorData: doc });
    });
  }
}