import mongoose from "mongoose";

let Schema = mongoose.Schema;
let waterTankTransactionSchema = new Schema({

  WTKTS_Fk_WaterTankDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'waterTankMaster'
  },
  WTKTS_IoModuleID_str: {
    type: String
  },
  WTKTS_DeviceId_str: {
    type: String
  },
  WTKTS_DeviceType_str: {
    type: String
  },
  WTKTS_WaterLevel_Num: {
    type: Number
  },
  WTKTS_CreatedIP_str: {
    type: String
  },
  WTKTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  WTKTS_Anomaly_Check_int: {
    type: Number
  }
}, {
  timestamps: { createdAt: "WTKTS_Created_Date", updatedAt: "WTKTS_Modified_date" }
}
);

export default mongoose.model("waterTankTransaction", waterTankTransactionSchema);
