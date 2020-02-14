import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ioModuleSchema = new Schema({

  IOML_Name_str: {
    type: String
  },
  IOML_DisplayName_str: {
    type: String
  },
  IOML_Description_str: {
    type: String
  },
  IOML_Assetcode_str: {
    type: String
  },
  IOML_Type_Int: {
    type: Number
  },

  IOML_Inbuilt_Sensors_Bool: {
    type: Boolean,
    default: true
  },
  IOML_IP_Address_Str: {
    type: String
  },
  IOML_IP_Mode_Int: {
    type: Number
  },
  IOML_UserName_Str: {
    type: String
  },
  IOML_Password_Str: {
    type: String
  },
  IOML_Authentication_Type_Int: {
    type: Number
  },
  IOML_SSID_Str: {
    type: String
  },
  IOML_MAC_Address_Str: {
    type: String
  },
  IOML_Gateway_Obj: {
    type: Schema.Types.ObjectId,
    ref: "gateway"
  },
  IOML_Gateway_IP_Address_Str: {
    type: String
  },
  IOML_Channel_Description_Obj: {
    type: Array,
  },
  IOML_URL_Str: {
    type: String,
  },
  IOML_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  IOML_ModifedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  IOML_CreatedIP_Str: {
    type: String
  },
  IOML_ModifiedIP_Str: {
    type: String
  },
  IOML_IsActive_bool: {
    type: Boolean,
    default: true
  },
},
  {
    timestamps: { createdAt: "IOML_Created_Date", updatedAt: "IOML_Modified_Date" }
  }
);



export default mongoose.model("ioModule", ioModuleSchema);