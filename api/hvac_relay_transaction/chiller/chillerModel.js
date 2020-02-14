import mongoose from "mongoose";

let Schema = mongoose.Schema;

let chillerRelayTransactionSchema = new Schema({

  CHLRTS_FK_CHILLERDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'chillerMaster'
  },
  CHLRTS_IoModuleID_str: {
    type: String
  },
  CHLRTS_DeviceId_str: {
    type: String
  },
  CHLRTS_DeviceType_str: {
    type: String
  },
  CHLRTS_RelayStatus_Bool: {
    type: Boolean,
    default: false
  },
  CHLRTS_RelayStatus_R_Bool : {
    type: Boolean,
    default : false
  },
  CHLRTS_RelayStatus_Y_Bool : {
    type: Boolean,
    default : false
  },
  CHLRTS_RelayStatus_B_Bool : {
    type: Boolean,
    default : false
  },
  CHLRTS_CreatedIP_str: {
    type: String
  },
  CHLRTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  CHLRTS_Anomaly_Check_int: {
    type: Number
  },

}, {
  timestamps: { createdAt: "CHLRTS_Created_Date", updatedAt: "CHLRTS_Modified_Date" }
}
);

export default mongoose.model("chillerRelayTransaction", chillerRelayTransactionSchema);