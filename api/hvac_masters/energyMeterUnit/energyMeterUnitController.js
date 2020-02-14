import EnergyMeter from "./energyMeterUnitModel";

export default {
  findAll: function (req, res) {
    EnergyMeter.find({ 'EMU_Is_Deleted_bool': false }).populate('EMU_LocationId EMU_BuildingId').exec(function (err, docs) {
      if (err) {
        res.send({ err: err })
      }
      res.send({ energyMeterUnitMasterData: docs });
    });
  },

  find: function (req, res) {
    let id = req.params.id;
    EnergyMeter.findById({ '_id': id, 'EMU_Is_Deleted_bool': false }).populate('EMU_LocationId EMU_BuildingId').exec(function (err, doc) {
      if (err) {
        res.send({ err: err })
      }
      res.send({ energyMeterUnitMasterData: doc });
    });
  },

  insert: function (req, res) {
    let energyMeter = new EnergyMeter({
      EMU_LocationId: req.body.locationId,
      EMU_BuildingId: req.body.buildingId,
      EMU_ElectricalPowerDisplay: req.body.electricalPowerDisplay,
      EMU_EnergyUnitDisplay: req.body.energyUnitDisplay,
      EMU_PriceUnitDisplay: req.body.priceUnitDisplay,
      EMU_EnergyForecast: req.body.energyForecast,
      EMU_EnergyBenchMark: req.body.energyBenchMark,
      EMU_EnergyBenchMarkUnit: req.body.energyBenchMarkUnit,
      EMU_EnergyBenchMarkForecast: req.body.energyBenchMarkForecast
      // EMU_CreatedbyId_obj: req.body.createdBy,
      // EMU_ModifiedbyId_obj: req.body.modifiedBy,
      // EMU_CreatedIP_str: req.body.createdByIP,
      // EMU_ModifiedIP_str: req.body.modifiedByIP
    });

    energyMeter.save().then(data => {
      res.send({ energyMeterUnitMasterData: data });
    });
  },

  update: function (req, res) {
    let id = req.params.id;
    let updateDoc = {
      EMU_LocationId: req.body.locationId,
      EMU_BuildingId: req.body.buildingId,
      EMU_ElectricalPowerDisplay: req.body.electricalPowerDisplay,
      EMU_EnergyUnitDisplay: req.body.energyUnitDisplay,
      EMU_PriceUnitDisplay: req.body.priceUnitDisplay,
      EMU_EnergyForecast: req.body.energyForecast,
      EMU_EnergyBenchMark: req.body.energyBenchMark,
      EMU_EnergyBenchMarkUnit: req.body.energyBenchMarkUnit,
      EMU_EnergyBenchMarkForecast: req.body.energyBenchMarkForecast
      // EMU_CreatedbyId_obj: req.body.createdBy,
      // EMU_ModifiedbyId_obj: req.body.modifiedBy,
      // EMU_CreatedIP_str: req.body.createdByIP,
      // EMU_ModifiedIP_str: req.body.modifiedByIP
    }
    EnergyMeter.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ energyMeterUnitMasterData: doc });
    });
  },

  delete: function (req, res) {
    let id = req.params.id;
    EnergyMeter.findOneAndUpdate({ _id: id }, { 'EMU_Is_Deleted_bool': true }, function (err, doc) {
      if (err) {
        res.send(err);
      }
      res.send({ energyMeterUnitMasterData: doc })
    });
  }

}