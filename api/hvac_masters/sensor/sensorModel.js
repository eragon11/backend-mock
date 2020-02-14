import mongoose from "mongoose";

const Schema = mongoose.Schema;

let sensorSchema = new Schema({
  Sensor_Name_str: {
    type: String
  },
  Sensor_DisplayName_str: {
    type: String
  },
  Sensor_Description_str: {
    type: String
  },
  Sensor_Assetcode_str: {
    type: String
  },
  Sensor_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  Sensor_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  Sensor_CreatedIP_str: {
    type: String
  },
  Sensor_ModifiedIP_str: {
    type: String
  },
  Sensor_IsActive_bool: {
    type: Boolean,
    default: true
  },
},
  {
    timestamps: { createdAt: "Sensor_Created_Date", updatedAt: "Sensor_Modifed_Date" }
  }
);



export default mongoose.model("sensor", sensorSchema);