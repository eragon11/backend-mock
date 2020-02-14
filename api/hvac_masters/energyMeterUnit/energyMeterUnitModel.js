import mongoose from "mongoose";

const Schema = mongoose.Schema;

const energyMeterUnitMasterSchema = new Schema({
  EMU_LocationId: {
    type: Schema.Types.ObjectId,
    ref: 'location'
  },
  EMU_BuildingId: {
    type: Schema.Types.ObjectId,
    ref: 'building'
  },
  EMU_ElectricalPowerDisplay: {
    type: String,
  },
  EMU_EnergyUnitDisplay: {
    type: String,
  },
  EMU_PriceUnitDisplay: {
    type: String,
  },
  EMU_EnergyForecast: {
    type: Number,
  },
  EMU_EnergyBenchMark: {
    type: Number,
  },
  EMU_EnergyBenchMarkUnit: {
    type: String,
  },
  EMU_EnergyBenchMarkForecast: {
    type: Number,
  },
  EMU_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  EMU_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  EMU_CreatedIP_str: {
    type: String
  },
  EMU_ModifiedIP_str: {
    type: String
  },
  EMU_Is_Deleted_bool: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: { createdAt: "EMU_Created_Date", updatedAt: "EMU_Modifed_Date" }
  }
);

export default mongoose.model("energyMeterUnitMaster", energyMeterUnitMasterSchema);
