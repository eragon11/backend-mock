import mongoose from "mongoose";

let Schema = mongoose.Schema;

let lightIntesitySchema = new Schema({
  LITS_Fk_LightIntensityDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: "lightIntensityMaster"
  },
  LITS_IoModuleID_str: {
    type: String
  },
  LITS_DeviceId_str: {
    type: String
  },
  LITS_DeviceType_str: {
    type: String
  },
  LITS_Intensity_Num: {
    type: Number,
  },
  LITS_CreatedIP_Str: {
    type: String
  },
  LITS_ModifiedIP_str: {
    type: String
  },
  LITS_IsActive_Bool: {
    type: Boolean,
    default: true
  },
  LITS_Anomaly_Check_int:{
   type:Number
  }
},
  {
    timestamps: { createdAt: "LITS_Created_Date", updatedAt: "LITS_Modified_Date" }
  });

export default mongoose.model("lightIntesityTransaction", lightIntesitySchema);