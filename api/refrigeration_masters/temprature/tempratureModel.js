import mongoose from "mongoose";

let Schema = mongoose.Schema;

let tempratureSchema = new Schema({

  REFTM_Device_Name_Str: {
    type: String
  },
  REFTM_DeviceId_Num: {
    type: String
  },
  REFTM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  REFTM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  REFTM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  REFTM_Fk_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  REFTM_Fk_RefrigerationDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'refrigerationMaster'
  },
  REFTM_Fk_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  REFTM_AssetCode_Str: {
    type: String
  },
  REFTM_TempratureUpp_Num: {
    type: Number
  },
  REFTM_TempratureLow_Num: {
    type: Number
  },
  REFTM_HumidityUpp_Num: {
    type: Number
  },
  REFTM_HumidityLow_Num: {
    type: Number
  },
  REFTM_Brand_Str: {
    type: String
  },
  REFTM_DataLogger_Mode_Str: {
    type: String
  },
  REFTM_DataLogger_TCPIP_Str: {
    type: String
  },
  REFTM_DataLogger_MacID_Str: {
    type: String
  },
  REFTM_MODBUS_Device_ID_Num: {
    type: Number
  },
  REFTM_MODBUS_BaudRate_Num: {
    type: Number
  },
  REFTM_MODBUS_Parity_Num: {
    type: Number
  },
  REFTM_RegStartAddress_Num: {
    type: Number
  },
  REFTM_ByteLength_Num: {
    type: Number
  },
  REFTM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  REFTM_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  REFTM_CreatedIP_str: {
    type: String
  },
  REFTM_ModifiedIP_str: {
    type: String
  },
  REFTM_IsActive_bool: {
    type: Boolean,
    default: true
  }
}, {
    timestamps: { createdAt: "REFTM_Created_Date", updatedAt: "REFTM_Modified_Date" }
  }
);

export default mongoose.model("refrigerationTempratureMaster", tempratureSchema);
