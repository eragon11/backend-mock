import mongoose from "mongoose";

let Schema = mongoose.Schema;

let waterDetectorSchema = new Schema({

  WDTS_Fk_WaterDetectorDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'waterDetectorMaster'
  },
  WDTS_Status_Bool: {
    type: Boolean,
    default: true
  },
  WDTS_IoModuleID_str: {
    type: String
  },
  WDTS_DeviceId_str: {
    type: String
  },
  WDTS_DeviceType_str: {
    type: String
  },
  WDTS_CreatedIP_str: {
    type: String
  },
  WDTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  WDTS_Anomaly_Check_int:{
    type:Number
   }
}, {
    timestamps: { createdAt: "WDTS_Created_Date", updatedAt: "WDTS_Modifed_Date" }
  }
);

export default mongoose.model("waterDetectorTransaction", waterDetectorSchema);
