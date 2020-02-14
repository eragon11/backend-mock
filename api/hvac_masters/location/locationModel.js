import mongoose from "mongoose";

const Schema = mongoose.Schema;

var locationSchema = new Schema({

  LM_LocationName_Str: {
    type: String
  },
  LM_LocationDisplayName_str: {
    type: String
  },
  LM_Description_str: {
    type: String
  },
  LM_Fk_MainModule_Id_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  LM_CreatedbyId_int: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  LM_ModifiedbyId_int: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  LM_CreatedIP_str: {
    type: String
  },
  LM_ModifiedIP_str: {
    type: String
  },
  LM_Is_Deleted_Bool: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: { createdAt: "LM_Created_Date", updatedAt: "LM_Modified_Date" }
  }
);

locationSchema.set('timestamps', true);

export default mongoose.model("location", locationSchema);
