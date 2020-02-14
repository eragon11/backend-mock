import mongoose from "mongoose";

let Schema = mongoose.Schema;

let buildingSchema = new Schema({
  BM_BuildingName_Str: {
    type: String
  },
  BM_BuildingDisplayName_Str: {
    type: String
  },
  BM_BuildingAddress_Str: {
    type: String
  },
  BM_Latitude_Str: {
    type: String
  },
  BM_Longitude_Str: {
    type: String
  },
  BM_BuildingImagePath_Str: {
    type: String
  },
  BM_BuildingType_Str: {
    type: String
  },
  BM_BuildingOfficeHrs_Str: {
    type: String,
  },
  BM_BuildingTotalArea_Num: {
    type: Number
  },
  BM_BuildingFloorArea_Num: {
    type: Number
  },
  BM_ElectricityUnitPrice_Str: {
    type: String
  },
  BM_ElectricityCurrencyType_Str: {
    type: String
  },
  BM_ElectricityUnitType_Str: {
    type: String
  },
  BM_EffectDatePrice_Date: {
    type: Date
  },
  BM_PermittedPower_Num: {
    type: Number
  },
  BM_Fk_Site_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  BM_Fk_MainModule_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  BM_CreatedbyId_int: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  BM_ModifiedbyId_int: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  BM_CreatedIP_str: {
    type: String
  },
  BM_ModifiedIP_str: {
    type: String
  },
  BM_IsActive_bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "BM_Created_Date", updatedAt: "BM_Modified_Date" }
  }
);



export default mongoose.model("building", buildingSchema);
