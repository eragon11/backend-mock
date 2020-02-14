import mongoose from "mongoose";

let Schema = mongoose.Schema;

let lightIntensitySchema = new Schema({

  LIM_Device_Name_Str: {
    type: String
  },
  LIM_DeviceId_Num: {
    type: String
  },
  LIM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  LIM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  LIM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  LIM_Fk_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'zone'
  },
  LIM_Fk_RefrigerationDeviceId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'refrigerationMaster'
  },
  LIM_Fk_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  LIM_AssetCode_Str: {
    type: String
  },
  LIM_Intensity_Num: {
    type: Number
  },
  LIM_Brand_Str: {
    type: String
  },
  LIM_DataLogger_Mode_Str: {
    type: String
  },
  LIM_DataLogger_TCPIP_Str: {
    type: String
  },
  LIM_DataLogger_MacID_Str: {
    type: String
  },
  LIM_MODBUS_Device_ID_Num: {
    type: Number
  },
  LIM_MODBUS_BaudRate_Num: {
    type: Number
  },
  LIM_MODBUS_Parity_Num: {
    type: Number
  },
  LIM_RegStartAddress_Num: {
    type: Number
  },
  LIM_ByteLength_Num: {
    type: Number
  },
  LIM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  LIM_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  LIM_CreatedIP_str: {
    type: String
  },
  LIM_ModifiedIP_str: {
    type: String
  },
  LIM_IsActive_bool: {
    type: Boolean,
    default: true
  }
}, {
    timestamps: { createdAt: "LIM_Created_Date", updatedAt: "LIM_Modified_Date" }
  }
);

export default mongoose.model("lightIntensityMaster", lightIntensitySchema);
