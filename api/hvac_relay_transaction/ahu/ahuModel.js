import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ahuRelayTransactionSchema = new Schema({

    AHUTS_FK_AHUDeviceId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'ahuMaster'
    },
    // AHUTS_FK_AHUDeviceId_obj: {
    //     type: String
    // },
    AHUTS_IoModuleID_str: {
        type: String
    },
    AHUTS_DeviceId_str: {
        type: String
    },
    AHUTS_DeviceType_str: {
        type: String
    },
    AHUTS_RelayStatus_R_Bool: {
        type: Boolean,
        default: false
    },
    AHUTS_RelayStatus_Y_Bool: {
        type: Boolean,
        default: false
    },
    AHUTS_RelayStatus_B_Bool: {
        type: Boolean,
        default: false
    },
    AHUTS_CreatedIP_str: {
        type: String
    },
    AHUTS_Is_Deleted_Bool: {
        type: Boolean,
        default: false
    },
    AHUTS_Anomaly_Check_int: {
        type: Number
    },

}, {
    timestamps: { createdAt: "AHUTS_Created_Date", updatedAt: "AHUTS_Modified_Date" }
}
);



export default mongoose.model("ahuRelayTransaction", ahuRelayTransactionSchema);
