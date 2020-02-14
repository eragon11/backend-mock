import mongoose from "mongoose";

const Schema = mongoose.Schema;

const compressorMasterSchema = new Schema({
  COMPM_DeviceId_Num: {
    type: String
  },
  COMPM_Device_Name_Str: {
    type: String
  },
  COMPM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  COMPM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  COMPM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  COMPM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  COMPM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  COMPM_AssetCode_Str: {
    type: String
  },
  COMPM_BrandName_Str: {
    type: String
  },
  COMPM_PhaseType_Str: {
    type: String
  },
  COMPM_MinVoltage_Num: {
    type: Number
  },
  COMPM_MaxVoltage_Num: {
    type: Number
  },
  COMPM_MaxCurrent_Num: {
    type: Number
  },
  COMPM_MaxPower_Num: {
    type: Number
  },
  COMPM_MaxRPM_Num: {
    type: Number
  },
  COMPM_Brand_Str: {
    type: String
  },
  COMPM_DataLogger_Mode_Str: {
    type: String
  },
  COMPM_DataLogger_TCPIP_Str: {
    type: String
  },
  COMPM_DataLogger_MacID_Str: {
    type: String
  },
  COMPM_MODBUS_Device_ID_Num: {
    type: String
  },
  COMPM_MODBUS_BaudRate_Num: {
    type: Number
  },
  COMPM_MODBUS_Parity_Num: {
    type: Number
  },
  COMPM_RegStartAddress_Num: {
    type: Number
  },
  COMPM_ByteLength_Num: {
    type: Number
  },
  COMPM_Createdby_Str: {
    type: String
  },
  COMPM_Modifiedby_Str: {
    type: String
  },
  COMPM_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: { createdAt: "COMPM_Created_Date", updatedAt: "COMPM_Modified_Date" }
  }
);



export default mongoose.model("compressorMaster", compressorMasterSchema);
