import mongoose from "mongoose";

let Schema = mongoose.Schema;

let roleMasterSchema = new Schema({

  Role_Name_Str: {
    type: String
  },
  Role_DisplayName_Str: {
    type: String
  },
  Role_Description_Str: {
    type: String
  },

  Role_CreatedbyId_obj: {
     type: Schema.Types.ObjectId,
    ref: 'user'
   },
   Role_ModifiedbyId_obj: {
     type: Schema.Types.ObjectId,
    ref: 'user'
   },
   Role_CreatedIP_str: {
    type: String
   },
   Role_ModifiedIP_str: {
     type: String
   },
  Role_IsActive_bool: {
     type: Boolean,
     default: true
   },
 },
 {
    timestamps: { createdAt: "Role_Created_Date", updatedAt: "Role_Modified_Date" }
  }
);



export default mongoose.model("roleMaster", roleMasterSchema);
