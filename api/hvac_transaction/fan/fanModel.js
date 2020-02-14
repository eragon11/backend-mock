import mongoose from "mongoose";

let Schema = mongoose.Schema;
let fanTransactionSchema = new Schema({

  FANTS_Fk_FANDeviceId_object: {
    type: Schema.Types.ObjectId,
    ref: 'fanMaster'
  },
  // FANTS_Fk_FANDeviceId_object: {
  //   type: String
  // },
  FANTS_IoModuleID_str: {
    type: String
  },
  FANTS_DeviceId_str: {
    type: String
  },
  FANTS_DeviceType_str: {
    type: String
  },
  FANTS_RPM_Num: {
    type: Number
  },
  FANTS_CreatedIP_str: {
    type: String
  },
  FANTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  FANTS_Anomaly_Check_int: {
    type: Number
  },
}, {
  timestamps: { createdAt: "FANTS_Created_date", updatedAt: "FANTS_Modified_date" }
}
);

export default mongoose.model("fanRpmTransaction", fanTransactionSchema);
