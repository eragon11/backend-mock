import mongoose from "mongoose";

let Schema = mongoose.Schema;

let entitlementDetailsSchema = new Schema({

  ENTD_Fk_Ent_Header_Id_object : { 
    type : Schema.Types.ObjectId,
    ref : 'entitlementHeader'
    },
  ENTD_Fk_SubModuleId_object : { 
    type : Schema.Types.ObjectId,
    ref : 'subModule'
    },
  ENTD_Technician_object : { 
    type : String 
    },
  ENTD_CreatedbyId_obj : { 
    type : Schema.Types.ObjectId,
    ref: 'user' 
    },
  ENTD_ModifiedbyId_obj : { 
    type : Schema.Types.ObjectId,
    ref: 'user' 
    },
  ENTD_CreatedIP_str : { 
    type : String 
    },
  ENTD_ModifiedIP_str : { 
    type : String 
    },
}, {
    timestamps: { createdAt: "ENTD_Created_Date", updatedAt: "ENTD_Modified_Date" }
  }
);

export default mongoose.model("entitlementDetails", entitlementDetailsSchema);
