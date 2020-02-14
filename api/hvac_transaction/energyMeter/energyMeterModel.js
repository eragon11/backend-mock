import mongoose from "mongoose";

let Schema = mongoose.Schema;

delete mongoose.connection.models['energyMeterTransaction'];

let energyMeterTransactionSchema = new Schema({

    ENTS_Fk_EnergyMaster_Id_obj: {
        type: Schema.Types.ObjectId,
        ref: 'energyMeterMaster'
    },
    ENTS_IoModuleID_str: {
        type: String
    },
    ENTS_DeviceId_str: {
        type: String
    },
    ENTS_DeviceType_str: {
        type: String
    },
    ENTS_Fk_MainModuleId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'mainModule'
    },
    ENTS_VoltageR_Num: {
        type: Number
    },
    ENTS_VoltageY_Num: {
        type: Number
    },
    ENTS_VoltageB_Num: {
        type: Number
    },
    ENTS_CurrentR_Num: {
        type: Number
    },
    ENTS_CurrentY_Num: {
        type: Number
    },
    ENTS_CurrentB_Num: {
        type: Number
    },
    ENTS_PowerR_Num: {
        type: Number
    },
    ENTS_PowerY_Num: {
        type: Number
    },
    ENTS_PowerB_Num: {
        type: Number
    },
    ENTS_PowerT_Num: {
        type: Number
    },
    ENTS_EnergyWhR_Num: {
        type: Number
    },
    ENTS_EnergyWhY_Num: {
        type: Number
    },
    ENTS_EnergyWhB_Num: {
        type: Number
    },
    ENTS_EnergyWhT_Num: {
        type: Number
    },
    ENTS_PFR_Num: {
        type: Number
    },
    ENTS_PFY_Num: {
        type: Number
    },
    ENTS_PFB_Num: {
        type: Number
    },
    ENTS_Frequency_Num: {
        type: Number
    },
    ENTS_CreatedIP_str: {
        type: String
    },
    ENTS_Is_Deleted_Bool: {
        type: Boolean,
        default: false
    },
    ENTS_Anomaly_Check_int: {
        type: Number
    }
}, {
    timestamps: { createdAt: "ENTS_Created_Date", updatedAt: "ENTS_ModifiedDate_Date" }
}
);



export default mongoose.model("energyMeterTransaction", energyMeterTransactionSchema);
