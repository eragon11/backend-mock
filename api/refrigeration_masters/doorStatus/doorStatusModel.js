import mongoose from "mongoose";

let Schema = mongoose.Schema;

let doorStatusSchema = new Schema({

  DSM_Device_Name_Str: {
    type: String
  },
  DSM_DeviceId_Num: {
    type: String
  },
  DSM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  DSM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  DSM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  DSM_Fk_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  DSM_Fk_RefrigerationDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'refrigerationMaster'
  },
  DSM_Fk_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  DSM_AssetCode_Str: {
    type: String
  },
  DSM_Status_bool: {
    type: Boolean,
    default: true
  },
  DSM_Brand_Str: {
    type: String
  },
  DSM_DataLogger_Mode_Str: {
    type: String
  },
  DSM_DataLogger_TCPIP_Str: {
    type: String
  },
  DSM_DataLogger_MacID_Str: {
    type: String
  },
  DSM_MODBUS_Device_ID_Num: {
    type: Number
  },
  DSM_MODBUS_BaudRate_Num: {
    type: Number
  },
  DSM_MODBUS_Parity_Num: {
    type: Number
  },
  DSM_RegStartAddress_Num: {
    type: Number
  },
  DSM_ByteLength_Num: {
    type: Number
  },
  DSM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  DSM_ModifedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  DSM_CreatedIP_str: {
    type: String
  },
  DSM_ModifiedIP_str: {
    type: String
  },
  DSM_IsActive_bool: {
    type: Boolean,
    default: true
  },
}, {
    timestamps: { createdAt: "DSM_Created_Date", updatedAt: "DSM_Modified_Date" }
  }
);

export default mongoose.model("refrigerationDoorStatusMaster", doorStatusSchema);
