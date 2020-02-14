import mongoose from "mongoose";

const Schema = mongoose.Schema;

let hvacPanelMasterSchema = new Schema({
  HVACP_DeviceId_Num: {
    type: String
  },
  HVACP_Device_Name_Str: {
    type: String
  },
  HVACP_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  HVACP_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  HVACP_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  HVACP_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  HVACP_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  HVACP_AssetCode_Str: {
    type: String
  },
  HVACP_BrandName_Str: {
    type: String
  },
  HVACP_PhaseType_Str: {
    type: String
  },
  HVACP_MinVoltage_Num: {
    type: Number
  },
  HVACP_MaxVoltage_Num: {
    type: Number
  },
  HVACP_MaxCurrent_Num: {
    type: Number
  },
  HVACP_MaxPower_Num: {
    type: Number
  },
  HVACP_Brand_Str: {
    type: String
  },
  HVACP_DataLogger_Mode_Str: {
    type: String
  },
  HVACP_DataLogger_TCPIP_Str: {
    type: String
  },
  HVACP_DataLogger_MacID_Str: {
    type: String
  },
  HVACP_MODBUS_Device_ID_Num: {
    type: String
  },
  HVACP_MODBUS_BaudRate_Num: {
    type: Number
  },
  HVACP_MODBUS_Parity_Num: {
    type: Number
  },
  HVACP_RegStartAddress_Num: {
    type: Number
  },
  HVACP_ByteLength_Num: {
    type: Number
  },
  HVACP_Createdby_Str: {
    type: String
  },
  HVACP_Modifiedby_Str: {
    type: String
  },
  HVACP_isActive_Bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "HVACP_Created_Date", updatedAt: "HVACP_Modified_Date" }
  }
);



export default mongoose.model("hvacPanelMaster", hvacPanelMasterSchema);