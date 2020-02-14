import mongoose from "mongoose";

let Schema = mongoose.Schema;

let circuitBreakerMasterSchema = new Schema({

  CBM_CircuitBreakerName_str: {
    type: String
  },
  CBM_CircuitBreakerDispalyName_str: {
    type: String
  },
  CBM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  CBM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  CBM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  CBM_Fk_PanelId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'panelMaster'
  },
  CBM_PhaseType_int: {
    type: Number
  },
  CBM_MCBTripCurrent_Num: {
    type: Number
  },
  CBM_Description_Str: {
    type: String
  },
  CBM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  CBM_ModifedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  CBM_CreatedIP_str: {
    type: String
  },
  CBM_ModifiedIP_str: {
    type: String
  },
  CBM_IsActive_bool: {
    type: Boolean,
    default: true
  },

}, {
    timestamps: { createdAt: "CBM_Created_Date", updatedAt: "CBM_Modified_Date" }
  }
);



export default mongoose.model("circuitBreakerMaster", circuitBreakerMasterSchema);
