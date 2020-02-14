import mongoose from "mongoose";

let Schema = mongoose.Schema;

let mainModuleSchema = new Schema({

    MMM_MainModuleName_str: {
        type: String
    },
    MMM_MainModuleDisplayName_str: {
        type: String
    },
    MMM_Description_str: {
        type: String
    },
    MMM_CreatedbyId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    MMM_ModifiedbyId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    MMM_CreatedIP_str: {
        type: String
    },
    MMM_ModifiedIP_str: {
        type: String
    },
    MMM_IsActive_bool: {
        type: Boolean,
        default: true
    },

}, {
        timestamps: { createdAt: "MMM_Created_Date", updatedAt: "MMM_Modified_Date" }
    }
);



export default mongoose.model("mainModule", mainModuleSchema);
