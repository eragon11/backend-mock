import mongoose from "mongoose";

let Schema = mongoose.Schema;

let panelMasterSchema = new Schema({

  PANLM_Name_str: {
    type: String
  },
  PANL_DisplayName_str: {
    type: String
  },
  PANLM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  PANLM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  PANLM_Fk_BuildingId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'building'
  },
  PANLM_Mode_int: {
    type: Number
  },
  PANLM_Billable_int: {
    type: Number
  },
  PANLM_PhaseType_int: {
    type: Number
  },
  PANLM_MCBTripCurrent_Num: {
    type: Number
  },
  PANLM_Description_Str: {
    type: String
  },
  PANLM_Fk_MainModule_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  PANLM_Fk_SubModule_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  PANLM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  PANLM_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  PANLM_CreatedIP_str: {
    type: String
  },
  PANLM_ModifiedIP_str: {
    type: String
  },
  PANLM_IsActive_bool: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: { createdAt: "PANLM_Created_Date", updatedAt: "PANLM_Modified_Date" }
}
);



export default mongoose.model("panelMaster", panelMasterSchema);
