import mongoose from "mongoose";

let Schema = mongoose.Schema;

let compressorRelayTransactionSchema = new Schema({

    COMPTS_FK_COMPDeviceId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'compressorMaster'
    },
    // COMPTS_FK_COMPDeviceId_obj: {
    //     type: String
    // },
    COMPTS_IoModuleID_str: {
        type: String
    },
    COMPTS_DeviceId_str: {
        type: String
    },
    COMPTS_DeviceType_str: {
        type: String
    },
    COMPTS_CreatedIP_str: {
        type: String
    },
    COMPTS_Is_Deleted_Bool: {
        type: Boolean,
        default: false
    },
    COMPTS_Anomaly_Check_int: {
        type: Number
    },
    COMPTS_RelayStatus_R_Bool: {
        type: Boolean,
        default: false
    },
    COMPTS_RelayStatus_Y_Bool: {
        type: Boolean,
        default: false
    },
    COMPTS_RelayStatus_B_Bool: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: { Created_date: "COMPTS_Created_date", Modified_date: "COMPTS_Modified_Date" }
}
);

export default mongoose.model("compressorRelayTransaction", compressorRelayTransactionSchema);
