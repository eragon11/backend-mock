import mongoose from "mongoose";

let Schema = mongoose.Schema;
let chillerTransactionSchema = new Schema({

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
  CHLRTS_VoltageR_Num: {
    type: Number
  },
  CHLRTS_VoltageY_Num: {
    type: Number
  },
  CHLRTS_VoltageB_Num: {
    type: Number
  },
  CHLRTS_CurrentR_Num: {
    type: Number
  },
  CHLRTS_CurrentY_Num: {
    type: Number
  },
  CHLRTS_CurrentB_Num: {
    type: Number
  },
  CHLRTS_PowerR_Num: {
    type: Number
  },
  CHLRTS_PowerY_Num: {
    type: Number
  },
  CHLRTS_PowerB_Num: {
    type: Number
  },
  CHLRTS_DevideIdRPM_str: {
    type: String
  },
  CHLRTS_RPM_Num: {
    type: Number
  },
  CHLRTS_InletTemprature_Num: {
    type: Number
  },
  CHLRTS_OutletTemprature_Num: {
    type: Number
  },
  CHLRTS_WaterFlowRate_Num: {
    type: Number
  },
  CHLRTS_WaterLevel_Num: {
    type: Number
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

export default mongoose.model("chillerTransaction", chillerTransactionSchema);
