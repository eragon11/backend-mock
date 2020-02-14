import mongoose from "mongoose";

let Schema = mongoose.Schema;

let equipmentMasterSchema = new Schema({

  EQPTM_EquipmentName_str: {
    type: String
  },
  EQPTM_EquipmentDisplayName_str: {
    type: String
  },
  EQPTM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  EQPTM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  EQPTM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  EQPTM_Fk_CircuitBreakerId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'circuitBreakerMaster'
  },
  EQPTM_PhaseType_int: {
    type: Number
  },
  EQPTM_Current_Num: {
    type: Number
  },
  EQPTM_Description_Str: {
    type: String
  },
  EQPTM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  EQPTM_ModifedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  EQPTM_CreatedIP_str: {
    type: String
  },
  EQPTM_ModifiedIP_str: {
    type: String
  },
  EQPTM_IsActive_bool: {
    type: Boolean,
    default: true
  },

}, {
    timestamps: { createdAt: "EQPTM_Created_Date", updatedAt: "EQPTM_Modified_Date" }
  }
);



export default mongoose.model("equipmentMaster", equipmentMasterSchema);
