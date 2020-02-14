import mongoose from "mongoose";

let Schema = mongoose.Schema;

let solenoidValveRelayTransactionSchema = new Schema({

  SOVTS_Fk_SOVDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: "solenoidValveMaster",
    index: true
  },
  SOVTS_IoModuleID_str: {
    type: String,
  },
  SOVTS_DeviceId_str: {
    type: String,
  },
  SOVTS_DeviceType_str: {
    type: String,
  },
  SOVTS_RelayStatus_Bool: {
    type: Boolean,
  },
  SOVTS_CreatedIP_str: {
    type: String,
  },
  SOVTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  SOVTS_Anomaly_Check_int: {
    type: Number,
  },

}, {
  timestamps: { createdAt: "SOVTS_Created_Date", updatedAt: "SOVTS_Modified_Date" }
}
);

export default mongoose.model("solenoidValveRelayTransaction", solenoidValveRelayTransactionSchema);