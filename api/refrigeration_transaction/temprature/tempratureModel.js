import mongoose from "mongoose";

let Schema = mongoose.Schema;

let tempratureSchema = new Schema({

  RFTMTS_Fk_TempratureDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'refrigerationTempratureMaster'
  },
  RFTMTS_IoModuleID_str: {
    type: String
  },
  RFTMTS_Temperature_Num: {
    type: Number
  },
  RFTMTS_Humidity_Num: {
    type: Number
  },
  RFTMTS_CreatedIP_str: {
    type: String
  },
  RFTMTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  RFTMTS_Evaporator_Num: {
    type: Number
  },
  RFTMTS_Condensor_Num: {
    type: Number
  },
  RFTMTS_Anomaly_Check_Int: {
    type: Number
  }
}, {
  timestamps: { createdAt: "RFTMTS_Created_Date", updatedAt: "RFTMTS_Modified_Date" }
}
);

export default mongoose.model("refrigerationTempratureTransaction", tempratureSchema);
