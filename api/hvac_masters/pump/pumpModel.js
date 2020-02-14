import mongoose from "mongoose";

let Schema = mongoose.Schema;

let pumpMasterSchema = new Schema({

    // PUMPM_DeviceId_Num: {
    //     type: Number
    // },
    PUMPM_DeviceId_Num: {
        type: String
    },
    PUMPM_Device_Name_Str: {
        type: String
    },
    PUMPM_Fk_LM_LocationID_Obj: {
        type: Schema.Types.ObjectId,
        ref: "location"
    },
    PUMPM_Fk_SM_SiteID_Obj: {
        type: Schema.Types.ObjectId,
        ref: "site"
    },
    PUMPM_Fk_BM_BuildingID_Obj: {
        type: Schema.Types.ObjectId,
        ref: "building"
    },
    PUMPM_Fk_ZM_ZoneID_Obj: {
        type: Schema.Types.ObjectId,
        ref: "zone"
    },
    PUMPM_AssetCode_Str: {
        type: String
    },
    PUMPM_PumpType_Str: {
        type: String
    },
    PUMPM_MaxRPM_Num: {
        type: String
    },
    PUMPM_Fk_SubModuleId_Obj: {
        type: Schema.Types.ObjectId,
        ref: 'subModule'
    },
    PUMPM_Brand_Str: {
        type: String
    },
    PUMPM_DataLogger_Mode_Str: {
        type: String
    },
    PUMPM_DataLogger_TCPIP_Str: {
        type: String
    },
    PUMPM_DataLogger_MacID_Str: {
        type: String
    },
    PUMPM_MODBUS_Device_ID_Num: {
        type: Number
    },
    PUMPM_MODBUS_BaudRate_Num: {
        type: Number
    },
    PUMPM_MODBUS_Parity_Num: {
        type: Number
    },
    PUMPM_RegStartAddress_Num: {
        type: Number
    },
    PUMPM_ByteLength_Num: {
        type: Number
    },
    PUMPM_CreatedbyId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    PUMPM_ModifiedbyId_obj: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    PUMPM_CreatedIP_str: {
        type: String
    },
    PUMPM_ModifiedIP_str: {
        type: String
    },
    PUMPM_IsActive_bool: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: { createdAt: "PUMPM_Created_Date", updatedAt: "PUMPM_Modified_Date" }
}
);



export default mongoose.model("pumpMaster", pumpMasterSchema);
