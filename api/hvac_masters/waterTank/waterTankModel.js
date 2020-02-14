import mongoose from "mongoose";

const Schema = mongoose.Schema;

let waterTankMasterSchema = new Schema({
  WTKM_DeviceId_Num: {
    type: String
  },
  WTKM_Device_Name_Str: {
    type: String
  },
  WTKM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  WTKM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  WTKM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  WTKM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  WTKM_AssetCode_Str: {
    type: String
  },
  WTKM_MaxVolume_Num: {
    type: Number
  },
  WTKM_MinLevel_Num: {
    type: Number
  },
  WTKM_Shape_Str: {
    type: String
  },
  WTKM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  WTKM_DataLogger_Mode_Str: {
    type: String
  },
  WTKM_DataLogger_TCPIP_Str: {
    type: String
  },
  WTKM_DataLogger_MacID_Str: {
    type: Number
  },
  WTKM_MODBUS_Device_ID_Num: {
    type: Number
  },
  WTKM_MODBUS_BaudRate_Num: {
    type: Number
  },
  WTKM_MODBUS_Parity_Num: {
    type: Number
  },
  WTKM_RegStartAddress_Num: {
    type: Number
  },
  WTKM_ByteLength_Num: {
    type: Number
  },
  // WTKM_CreatedbyId_Obj: {
  //   type: Schema.Types.ObjectId
  // },
  // WTKM_ModifiedbyId_Obj: {
  //   type: Schema.Types.ObjectId
  // },
  // WTKM_CreatedIP_str: {
  //   type: String
  // },
  // WTKM_ModifiedIP_str: {
  //   type: String
  // },
  // },
  WTKM_isActive_Bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "WTKM_Created_Date", updatedAt: "WTKM_Modified_Date" }
  }
);

export default mongoose.model("waterTankMaster", waterTankMasterSchema);