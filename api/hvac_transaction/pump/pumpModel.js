import mongoose from "mongoose";

let Schema = mongoose.Schema;
let pumpTransactionSchema = new Schema({

  PUMPTS_Fk_PUMPDeviceId_obj : { 
    type : Schema.Types.ObjectId,
    ref: 'pumpMaster' 
    },
  // PUMPTS_Fk_PUMPDeviceId_obj: {
  //   type: String
  // },
  PUMPTS_IoModuleID_str: {
    type: String
  },
  PUMPTS_DeviceId_str: {
    type: String
  },
  PUMPTS_DeviceType_str: {
    type: String
  },
  PUMPTS_Status_Bool: {
    type: Boolean,
    default: true
  },
  PUMPTS_RPM_Num: {
    type: Number
  },
  PUMPTS_CreatedIP_str: {
    type: String
  },
  PUMPTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  PUMPTS_Anomaly_Check_int: {
    type: Number
  }
}, {
  timestamps: { createdAt: "PUMPTS_Created_Date", updatedAt: "PUMPTS_Modified_date" }
}
);

export default mongoose.model("pumpTransaction", pumpTransactionSchema);
