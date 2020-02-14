import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ahuTransactionSchema = new Schema({

  AHUTS_FK_AHUDeviceId_obj: {
    type: Schema.Types.ObjectId,
   // ref: 'ahuMaster'
  },
  // AHUTS_FK_AHUDeviceId_obj: {
  //   type: String
  // },
  AHUTS_IoModuleID_str: {
    type: String
  },
  AHUTS_DeviceId_str: {
    type: String
  },
  AHUTS_DeviceType_str: {
    type: String
  },
  AHUTS_VoltageR_Num: {
    type: Number
  },
  AHUTS_VoltageY_Num: {
    type: Number
  },
  AHUTS_VoltageB_Num: {
    type: Number
  },
  AHUTS_CurrentR_Num: {
    type: Number
  },
  AHUTS_CurrentY_Num: {
    type: Number
  },
  AHUTS_CurrentB_Num: {
    type: Number
  },
  AHUTS_PowerR_Num: {
    type: Number
  },
  AHUTS_PowerY_Num: {
    type: Number
  },
  AHUTS_PowerB_Num: {
    type: Number
  },
  AHUTS_RelayStatus_R_Bool: {
    type: Boolean,
    default: false
},
AHUTS_RelayStatus_Y_Bool: {
    type: Boolean,
    default: false
},
AHUTS_RelayStatus_B_Bool: {
    type: Boolean,
    default: false
},
  AHUTS_CreatedIP_str: {
    type: String
  },
  AHUTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  AHUTS_Anomaly_Check_int: {
    type: Number
  }
}, {
  timestamps: { createdAt: "AHUTS_Created_Date", updatedAt: "AHUTS_Modified_Date" }
}
);



export default mongoose.model("ahuEnergyTransaction", ahuTransactionSchema);
