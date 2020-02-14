import mongoose from "mongoose";

let Schema = mongoose.Schema;
let compressorTransactionSchema = new Schema({

  COMPTS_Fk_COMPDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'compressorMaster'
  },
  COMPTS_IoModuleID_str: {
    type: String
  },
  COMPTS_DeviceId_str: {
    type: String
  },
  COMPTS_DeviceType_str: {
    type: String
  },
  COMPTS_VoltageR_Num: {
    type: Number
  },
  COMPTS_VoltageY_Num: {
    type: Number
  },
  COMPTS_VoltageB_Num: {
    type: Number
  },
  COMPTS_CurrentR_Num: {
    type: Number
  },
  COMPTS_CurrentY_Num: {
    type: Number
  },
  COMPTS_CurrentB_Num: {
    type: Number
  },
  COMPTS_PowerR_Num: {
    type: Number
  },
  COMPTS_PowerY_Num: {
    type: Number
  },
  COMPTS_PowerB_Num: {
    type: Number
  },
  COMPTS_RelayStatus_R_Bool: {
    type: Boolean
  },
  COMPTS_RelayStatus_Y_Bool: {
    type: Boolean
  },
  COMPTS_RelayStatus_B_Bool: {
    type: Boolean
  },
  COMPTS_DevideIdRPM_str: {
    type: String
  },
  COMPTS_RPM_Num: {
    type: Number
  },
  COMPTS_CreatedIP_str: {
    type: String
  },
  COMPTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  COMPTS_Anomaly_Check_int: {
    type: Number
  }
}, {
  timestamps: { createdAt: "COMPTS_Created_date", updatedAt: "COMPTS_Modified_date" }
}
);

export default mongoose.model("compressorenergyrpmTransaction", compressorTransactionSchema);
