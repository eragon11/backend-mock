import mongoose from "mongoose";

let Schema = mongoose.Schema;

let chillerMasterSchema = new Schema({

  // CHLRM_DeviceId_Num: {
  //   type: Number
  // },
  CHLRM_DeviceId_Num: {
    type: String
  },
  CHLRM_Device_Name_Str: {
    type: String
  },
  CHLRM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  CHLRM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  CHLRM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  CHLRM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  CHLRM_AssetCode_Str: {
    type: String
  },
  CHLRM_ChillerType_Str: {
    type: String
  },
  CHLRM_PhaseType_Str: {
    type: String
  },
  CHLRM_MinVoltage_Num: {
    type: Number
  },
  CHLRM_MaxVoltage_Num: {
    type: Number
  },
  CHLRM_MaxCurrent_Num: {
    type: Number
  },
  CHLRM_MaxPower_Num: {
    type: Number
  },
  CHLRM_MinOutTemp_Num: {
    type: Number
  },
  CHLRM_MaxOutTemp_Num: {
    type: Number
  },
  CHLRM_MinInletTemp_Num: {
    type: Number
  },
  CHLRM_MaxInletTemp_Num: {
    type: Number
  },
  CHLRM_Waterflowrate_Num: {
    type: Number
  },
  CHLRM_MaxRPMOfChiller_Num: {
    type: Number
  },
  CHLRM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  CHLRM_Brand_Str: {
    type: String
  },
  CHLRM_DataLogger_Mode_Str: {
    type: String
  },
  CHLRM_DataLogger_TCPIP_Str: {
    type: String
  },
  CHLRM_DataLogger_MacID_Str: {
    type: String
  },
  CHLRM_MODBUS_Device_ID_Num: {
    type: Number
  },
  CHLRM_MODBUS_BaudRate_Num: {
    type: Number
  },
  CHLRM_MODBUS_Parity_Num: {
    type: Number
  },
  CHLRM_RegStartAddress_Num: {
    type: Number
  },
  CHLRM_ByteLength_Num: {
    type: Number
  },
  CHLRM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  CHLRM_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  CHLRM_CreatedIP_str: {
    type: String
  },
  CHLRM_ModifiedIP_str: {
    type: String
  },
  CHLRM_IsActive_bool: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: { createdAt: "CHLRM_Created_Date", updatedAt: "CHLRM_Modified_Date" }
}
);



export default mongoose.model("chillerMaster", chillerMasterSchema);
