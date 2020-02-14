import mongoose from "mongoose";

let Schema = mongoose.Schema;

let doorStatusSchema = new Schema({

  DSTS_Fk_DoorStatusDeviceId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'refrigerationDoorStatusMaster'
  },
  DSTS_Status_Bool: {
    type: Boolean,
    default: true
  },
  DSTS_IoModuleID_str: {
    type: String
  },
  DSTS_DeviceId_str: {
    type: String
  },
  DSTS_DeviceType_str: {
    type: String
  },
  DSTS_CreatedIP_str: {
    type: String
  },
  DSTS_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  },
  DSTS_Anomaly_Check_int: {
    type: Number
  }
}, {
  timestamps: { createdAt: "DSTS_Created_Date", updatedAt: "DSTS_Modified_Date" }
}
);

export default mongoose.model("refrigerationDoorStatusTransaction", doorStatusSchema);
