import mongoose from "mongoose";

let Schema = mongoose.Schema;

let zoneSchema = new Schema({
  ZM_ZoneName_Str: {
    type: String
  },
  ZM_ZoneDisplayName_Str: {
    type: String
  },
  ZM_Floor_Str: {
    type: String
  },
  ZM_Photo_Str: {
    type: String
  },
  ZM_PK_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  ZM_Fk_MainModule_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  ZM_CreatedbyId_int: {
    type: Number
  },
  ZM_ModifiedbyId_int: {
    type: Number
  },
  ZM_CreatedIP_str: {
    type: String
  },
  ZM_ModifiedIP_str: {
    type: String
  },
  ZM_IsDeleted_Bool: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: { createdAt: "ZM_Created_Date", updatedAt: "ZM_Modified_Date" }
  }
);


export default mongoose.model("zone", zoneSchema);