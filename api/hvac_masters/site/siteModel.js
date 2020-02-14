import mongoose from "mongoose";

let Schema = mongoose.Schema;

let siteSchema = new Schema({
  SM_SiteName_Str: {
    type: String
  },
  SM_SiteDisplayName_Str: {
    type: String
  },
  SM_Description_Str: {
    type: String
  },
  SM_SiteAddress_Str: {
    type: String
  },
  SM_Fk_Location_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  SM_Fk_MainModule_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  SM_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  SM_ModifiedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  SM_CreatedIP_Str: {
    type: String
  },
  SM_ModifiedIP_Str: {
    type: String
  },
  SM_Is_Deleted_bool: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: { createdAt: "SM_Created_Date", updatedAt: "SM_Modified_Date" }
  }
);



export default mongoose.model("site", siteSchema)