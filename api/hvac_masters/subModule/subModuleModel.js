import mongoose from "mongoose";


let Schema = mongoose.Schema;

let subModuleSchema = new Schema({

    SMM_SubModuleName_str: {
        type: String
    },
    SMM_SubModuleDisplayName_str: {
        type: String
    },
    SMM_Description_str: {
        type: String
    },
    SMM_Fk_MainModule_Id_obj: {
        type: Schema.Types.ObjectId,
        ref: 'mainModule'
    },
    SMM_CreatedbyId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    SMM_ModifiedbyId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    SMM_CreatedIP_str: {
        type: String
    },
    SMM_ModifiedIP_str: {
        type: String
    },
    SMM_IsActive_bool: {
        type: Boolean,
        default: true
    },

}, {
        timestamps: { createdAt: "SMM_Created_Date", updatedAt: "SMM_Modifed_Date" }
    }
);



export default mongoose.model("subModule", subModuleSchema);
