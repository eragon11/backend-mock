import mongoose from "mongoose";

let Schema = mongoose.Schema;

let entitlementHeaderSchema = new Schema({

  ENTH_Fk_Role_ID_obj: {
    type: Schema.Types.ObjectId,
    ref: 'roleMaster'
  },
  ENTH_Fk_MainModule_obj: {
    type: Schema.Types.ObjectId,
    ref : 'mainModule'
  },
  ENTH_Fk_SubModule_obj: {
    type: Schema.Types.Mixed,
    //ref : 'mainModule'
  },
  ENTH_SubModuleDataIndex_obj: {
    type: Schema.Types.Mixed,
    //ref : 'mainModule'
  },
  ENTH_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref : 'user'
  },
  ENTH_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref : 'user'
  },
  ENTH_CreatedIP_str: {
    type: String
  },
  ENTH_ModifiedIP_str: {
    type: String
  },
  ENTH_IsActive_bool: {
    type: Boolean,
    default : true
  },
}, {
    timestamps: { createdAt: "ENTH_Created_Date", updatedAt: "ENTH_Modified_Date" }
  }
);



export default mongoose.model("entitlementHeader", entitlementHeaderSchema);
