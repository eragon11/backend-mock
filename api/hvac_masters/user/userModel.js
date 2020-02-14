import mongoose from "mongoose"
let Schema = mongoose.Schema;

let userSchema = new Schema({
  User_Name_Str: {
    type: String,
    // required: true
  },
  User_Password: {
    type: String
  },
  User_Fk_Role_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: "roleMaster"
  },
  User_Fk_LM_LocationID_Obj: {
    type: Schema.Types.Mixed,
    // ref: "location"
  },
  User_Fk_SM_SiteID_Obj: {
    type: Schema.Types.Mixed,
    // ref: "site"
  },
  User_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.Mixed,
    //ref: "building"
  },
  User_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.Mixed,
    //ref: "zone"
  },
  User_Firstname_Str: {
    type: String,
    //required: true
  },
  User_Lastname_Str: {
    type: String,
    //required: true
  },
  User_Profile_Images_path_Str: {
    type: String,
    //required: true
  },
  User_Gender_Str: {
    type: String,
    //required: true
  },
  User_DOB_Date: {
    type: Date,
    //required: true
  },
  User_Mobile_No_Int: {
    type: String,
    //required: true
  },
  User_Alternate_Mobile_No_Int: {
    type: String,
    //required: true
  },
  User_Email_Id_Str: {
    type: String,
    //required: true
  },
  User_Alternate_Email_Id_Str: {
    type: String,
    //required: true
  },
  User_Address_Str: {
    type: String,
    //required: true
  },
  User_City_Str: {
    type: String,
    //required: true
  },
  User_Pincode_Str: {
    type: Number,
    //required: true
  },
  User_Validity_From_Str: {
    type: Date,
  },
  User_Validity_To_Str: {
    type: Date,
  },
  User_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  User_ModifedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  User_CreatedIP_Str: {
    type: String
  },
  User_ModifiedIP_Str: {
    type: String
  },
  User_IsTechnician_bool: {
    type: Boolean,
    default: false
  },
  User_IsActive_Bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "User_Created_Date", updatedAt: "User_Modifed_Date" }
  }
);

export default mongoose.model("user", userSchema);