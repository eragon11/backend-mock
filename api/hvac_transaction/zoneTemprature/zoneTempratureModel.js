import mongoose from "mongoose";

let Schema = mongoose.Schema;
let zoneTempratureTransactionSchema = new Schema({

  ZNTTS_Fk_ZoneDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'zone'
  },
  ZNTTS_IoModuleID_str: {
    type: String,
  },
  ZNTTS_DeviceId_str: {
    type: String,
  },
  ZNTTS_DeviceType_str: {
    type: String,
  },
  ZNTTS_Temperature_Num: {
    type: Number
  },
  ZNTTS_Humidity_Num: {
    type: Number
  },
  ZNTTS_CreatedIP_str: {
    type: String
  },
  ZNTTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  ZNTTS_Anomaly_Check_int: {
    type: Number,
  }
}, {
  timestamps: { createdAt: "ZNTTS_Created_date", updatedAt: "ZNTTS_Modified_date" }
}
);

export default mongoose.model("zoneTempratureTransaction", zoneTempratureTransactionSchema);
