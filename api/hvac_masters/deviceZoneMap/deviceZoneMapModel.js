import mongoose from "mongoose";

let Schema = mongoose.Schema;

let deviceZoneMapMasterSchema = new Schema({

  DZM_DeviceId_Obj: {
    type: String
  },

  DZM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  DZM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  DZM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  DZM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },

  DZM_FK_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },

  DZM_FK_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },

  DZM_Fk_ZoneId_List: [
    { 
        type: Schema.Types.ObjectId,
        ref: 'zone'
  }
],

  DZM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },

  DZM_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },

  DZM_CreatedIP_str: {
    type: String
  },

  DZM_ModifiedIP_str: {
    type: String
  },

  DZM_IsActive_bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "AHUM_Created_Date", updatedAt: "AHUM_Modified_Date" }
  }
);



export default mongoose.model("deviceZoneMapMaster", deviceZoneMapMasterSchema);
