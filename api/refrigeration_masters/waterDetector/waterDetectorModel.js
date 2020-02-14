import mongoose from "mongoose";

let Schema = mongoose.Schema;

let waterDetectorSchema = new Schema({

  WDM_Device_Name_Str: {
    type: String
  },
  WDM_DeviceId_Num: {
    type: String
  },
  WDM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  WDM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  WDM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  WDM_Fk_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  WDM_Fk_RefrigerationDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'refrigerationMaster'
  },
  WDM_Fk_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  WDM_AssetCode_Str: {
    type: String
  },
  WDM_Thresold_Num: {
    type: Number
  },
  WDM_Brand_Str: {
    type: String
  },
  WDM_DataLogger_Mode_Str: {
    type: String
  },
  WDM_DataLogger_TCPIP_Str: {
    type: String
  },
  WDM_DataLogger_MacID_Str: {
    type: String
  },
  WDM_MODBUS_Device_ID_Num: {
    type: Number
  },
  WDM_MODBUS_BaudRate_Num: {
    type: Number
  },
  WDM_MODBUS_Parity_Num: {
    type: Number
  },
  WDM_RegStartAddress_Num: {
    type: Number
  },
  WDM_ByteLength_Num: {
    type: Number
  },
  WDM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  WDM_ModifedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  WDM_CreatedIP_str: {
    type: String
  },
  WDM_ModifiedIP_str: {
    type: String
  },
  WDM_IsActive_bool: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: { createdAt: "WDM_Created_Date", updatedAt: "WDM_Modifed_Date" }
}
);
export default mongoose.model("waterDetectorMaster", waterDetectorSchema);
