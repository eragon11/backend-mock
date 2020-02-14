import mongoose from "mongoose";

let Schema = mongoose.Schema;
let solenoidValveTransactionSchema = new Schema({

  SOVTS_Fk_SOVDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'solenoidValveMaster'
  },
  SOVTS_IoModuleID_str: {
    type: String
  },
  SOVTS_DeviceId_str: {
    type: String
  },
  SOVTS_DeviceType_str: {
    type: String
  },
  SOVTS_Status_Bool: {
    type: Boolean,
    default: true
  },
  SOVTS_WaterFlowRate_Num: {
    type: Number
  },
  SOVTS_CreatedIP_str: {
    type: String
  },
  SOVTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: { createdAt: "SOVTS_Created_Date", updatedAt: "SOVTS_Modified_date" }
}
);

export default mongoose.model("solenoidValveTransaction", solenoidValveTransactionSchema);
