import mongoose from "mongoose";

let Schema = mongoose.Schema;

let fanMasterSchema = new Schema({
  FANM_DeviceId_Str: {
    type: String,
  },
  FANM_Device_Name_Str: {
    type: String,
  },
  FANM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  FANM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  FANM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  FANM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  FANM_AssetCode_Str: {
    type: String,
  },
  FANM_MaxRPM_Num: {
    type: Number,
  },
  FANM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  FANM_Brand_Str: {
    type: String,
  },
  FANM_DataLogger_Mode_Str: {
    type: String,
  },
  FANM_DataLogger_TCPIP_Str: {
    type: String,
  },
  FANM_DataLogger_MacID_Str: {
    type: String,
  },
  FANM_MODBUS_Device_ID_Num: {
    type: Number,
  },
  FANM_MODBUS_BaudRate_Num: {
    type: Number,
  },
  FANM_MODBUS_Parity_Num: {
    type: Number,
  },
  FANM_RegStartAddress_Num: {
    type: Number,
  },
  FANM_ByteLength_Num: {
    type: Number,
  },
  FANM_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  FANM_ModifiedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  FANM_CreatedIP_str: {
    type: String,
  },
  FANM_ModifiedIP_str: {
    type: String,
  },
  FANM_IsActive_bool: {
    type: Boolean,
    default: true
  }

},
  {
    timestamps: { createdAt: "FANM_Created_Date", updatedAt: "FANM_Modified_Date" }
  }
);



export default mongoose.model("fanMaster", fanMasterSchema);
