import mongoose from "mongoose";

const Schema = mongoose.Schema;

let solenoidValveMasterSchema = new Schema({
  SOVM_DeviceId_Num: {
    type: String
  },
  SOVM_Device_Name_Str: {
    type: String
  },
  SOVM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  SOVM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  SOVM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  SOVM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  SOVM_AssetCode_Str: {
    type: String
  },
  SOVM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: "subModule"
  },
  SOVM_Waterflowrate_Num: {
    type: Number
  },
  SOVM_DataLogger_Mode_Str: {
    type: String
  },
  SOVM_DataLogger_TCPIP_Str: {
    type: String
  },
  SOVM_DataLogger_MacID_Str: {
    type: String
  },
  SOVM_MODBUS_Device_ID_Num: {
    type: Number
  },
  SOVM_MODBUS_BaudRate_Num: {
    type: Number
  },
  SOVM_MODBUS_Parity_Num: {
    type: Number
  },
  SOVM_RegStartAddress_Num: {
    type: Number
  },
  SOVM_ByteLength_Num: {
    type: Number
  },
  SOVM_Createdby_Str: {
    type: String
  },
  SOVM_Modifiedby_Str: {
    type: String
  },
  SOVM_IsActive_Bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "SOVM_Created_Date", updatedAt: "SOVM_Modified_Date" }
  }
);

export default mongoose.model("solenoidValveMaster", solenoidValveMasterSchema);