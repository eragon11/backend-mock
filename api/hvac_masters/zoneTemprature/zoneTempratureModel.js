import mongoose from "mongoose";

let Schema = mongoose.Schema;

let zoneTempratureSchema = new Schema({

  ZNTM_DeviceId_Str: {
    type: String,
  },
  ZNTM_Device_Name_Str: {
    type: String,
  },
  ZNTM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  ZNTM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  ZNTM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  ZNTM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  ZNTM_AssetCode_Str: {
    type: String,
  },
  ZNTM_TemperatureUpp_Num: {
    type: Number,
  },
  ZNTM_TemperatureLow_Num: {
    type: Number,
  },
  ZNTM_HumidityUpp_Num: {
    type: Number,
  },
  ZNTM_HumidityLow_Num: {
    type: Number,
  },
  ZNTM_OccupyType_Str: {
    type: String,
  },
  ZNTM_Fk_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  ZNTM_DataLogger_Mode_Str: {
    type: String,
  },
  ZNTM_DataLogger_TCPIP_Str: {
    type: String,
  },
  ZNTM_DataLogger_MacID_Str: {
    type: String,
  },
  ZNTM_MODBUS_Device_ID_Num: {
    type: Number,
  },
  ZNTM_MODBUS_BaudRate_Num: {
    type: Number,
  },
  ZNTM_MODBUS_Parity_Num: {
    type: Number,
  },
  ZNTM_RegStartAddress_Num: {
    type: Number,
  },
  ZNTM_ByteLength_Num: {
    type: Number,
  },
  ZNTM_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  ZNTM_ModifiedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  ZNTM_CreatedIP_str: {
    type: String,
  },
  ZNTM_ModifiedIP_str: {
    type: String,
  },
  ZNTM_IsActive_Bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "ZNTM_Created_Date", updatedAt: "ZNTM_Modifed_Date" }
  }
);



export default mongoose.model("zoneTempratureMaster", zoneTempratureSchema);
