import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ahuMasterSchema = new Schema({
  AHUM_DeviceId_Num: {
    type: String
  },
  AHUM_Device_Name_Str: {
    type: String
  },
  AHUM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  AHUM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  AHUM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  AHUM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  AHUM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  AHUM_AssetCode_Str: {
    type: String
  },
  AHUM_BrandName_Str: {
    type: String
  },
  AHUM_PhaseType_Str: {
    type: String
  },
  AHUM_MinVoltage_Num: {
    type: Number
  },
  AHUM_MaxVoltage_Num: {
    type: Number
  },
  AHUM_MaxCurrent_Num: {
    type: Number
  },
  AHUM_MaxPower_Num: {
    type: Number
  },
  AHUM_Brand_Str: {
    type: String
  },
  AHUM_DataLogger_Mode_Str: {
    type: String
  },
  AHUM_DataLogger_TCPIP_Str: {
    type: String
  },
  AHUM_DataLogger_MacID_Str: {
    type: String
  },
  AHUM_MODBUS_Device_ID_Num: {
    type: String
  },
  AHUM_MODBUS_BaudRate_Num: {
    type: Number
  },
  AHUM_MODBUS_Parity_Num: {
    type: Number
  },
  AHUM_RegStartAddress_Num: {
    type: Number
  },
  AHUM_ByteLength_Num: {
    type: Number
  },
  AHUM_Createdby_Str: {
    type: String
  },
  AHUM_Modifiedby_Str: {
    type: String
  },
  AHUM_isActive_Bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "AHUM_Created_Date", updatedAt: "AHUM_Modified_Date" }
  }
);



export default mongoose.model("ahuMaster", ahuMasterSchema);