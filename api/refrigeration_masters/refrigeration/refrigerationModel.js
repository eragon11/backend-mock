import mongoose from "mongoose";

let Schema = mongoose.Schema;

let refrigerationSchema = new Schema({

  REFM_Device_Name_Str: {
    type: String
  },
  REFM_Device_Id_Num: {
    type: String
  },
  REFM_Description_Str: {
    type: String
  },
  REFM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  REFM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  REFM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  REFM_Fk_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'zone'
  },
  REFM_Fk_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  REFM_AssetCode_Str: {
    type: String
  },
  REFM_PhaseType_int: {
    type: Number
  },
  REFM_MaxVoltage_Num: {
    type: Number
  },
  REFM_MaxCurrent_Num: {
    type: Number
  },
  REFM_MaxPower_Num: {
    type: Number
  },
  REFM_BenchMarkEnergy_Num: {
    type: Number
  },
  REFM_StoragePurpose_Str: {
    type: String
  },
  REFM_Volume_Str: {
    type: String
  },
  REFM_imagePath_Str: {
    type: String
  },
  REFM_Brand_Str: {
    type: String
  },
  REFM_DataLogger_Mode_Str: {
    type: String
  },
  REFM_DataLogger_TCPIP_Str: {
    type: String
  },
  REFM_DataLogger_MacID_Str: {
    type: String
  },
  REFM_MODBUS_Device_ID_Num: {
    type: Number
  },
  REFM_MODBUS_BaudRate_Num: {
    type: Number
  },
  REFM_MODBUS_Parity_Num: {
    type: Number
  },
  REFM_RegStartAddress_Num: {
    type: Number
  },
  REFM_ByteLength_Num: {
    type: Number
  },
  REFM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  REFM_ModifedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  REFM_CreatedIP_str: {
    type: String
  },
  REFM_ModifiedIP_str: {
    type: String
  },
  REFM_IsActive_bool: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: { createdAt: "REFM_Created_Date", updatedAt: "REFM_Modified_Date" }
}
);

export default mongoose.model("refrigerationMaster", refrigerationSchema);
