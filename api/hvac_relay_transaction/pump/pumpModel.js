import mongoose from "mongoose";

let Schema = mongoose.Schema;

let pumpRelayTransactionSchema = new Schema({

  PUMPTS_Fk_PUMPDeviceId_object: {
    type: Schema.Types.ObjectId,
    ref: 'pumpMaster'
  },
  PUMPTS_IoModuleID_str: {
    type: String
  },
  PUMPTS_DeviceId_str: {
    type: String
  },
  PUMPTS_DeviceType_str: {
    type: String
  },
  PUMPTS_RelayStatus_Bool: {
    type: Boolean
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
  },

}, {
  timestamps: { createdAt: "PUMPTS_Created_date", updatedAt: "PUMPTS_Modified_Date" }
}
);

export default mongoose.model("pumpRelayTransaction", pumpRelayTransactionSchema);