import mongoose from "mongoose";

const Schema = mongoose.Schema;

const energyMeterMasterSchema = new Schema({
  EMM_DeviceId_Str: {
    type: String
  },
  EMM_Device_Name_Str: {
    type: String
  },
  EMM_DeviceDisplayName_Str: {
    type: String
  },
  EMM_Fk_PanelId_obj: {
    type: Schema.Types.ObjectId,
    ref: "panelMaster"
  },
  EMM_Fk_CircuitBreakerId_obj: {
    type: Schema.Types.ObjectId,
    ref: "circuitBreakerMaster"
  },
  EMM_Fk_EquipmentId_obj: {
    type: Schema.Types.ObjectId,
    ref: "equipmentMaster"
  },
  EMM_Fk_LM_LocationID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "location"
  },
  EMM_Fk_BM_BuildingID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "building"
  },
  EMM_Fk_SM_SiteID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "site"
  },
  EMM_Fk_ZM_ZoneID_Obj: {
    type: Schema.Types.ObjectId,
    ref: "zone"
  },
  EMM_Fk_MainModuleId_obj: {
    type: Schema.Types.ObjectId,
    ref: "mainModule"
  },
  EMM_AssetCode_Str: {
    type: String
  },
  EMM_PhaseType_int: {
    type: String
  },
  EMM_VoltageRupper_Num: {
    type: String
  },
  EMM_VoltageRlow_Num: {
    type: String
  },
  EMM_VoltageYupper_Num: {
    type: String
  },
  EMM_VoltageYlow_Num: {
    type: String
  },
  EMM_VoltageBupper_Num: {
    type: String
  },
  EMM_VoltageBlow_Num: {
    type: String
  },
  EMM_CurrentRupper_Num: {
    type: String
  },
  EMM_CurrentYupper_Num: {
    type: String
  },
  EMM_CurrentBupper_Num: {
    type: String
  },
  EMM_PowerRupper_Num: {
    type: String
  },
  EMM_PowerYupper_Num: {
    type: String
  },
  EMM_PowerBupper_Num: {
    type: String
  },
  EMM_PowerTupper_Num: {
    type: String
  },
  EMM_PowerTlow_Num: {
    type: String
  },
  EMM_PowerUnit_Num: {
    type: String
  },
  EMM_PFRlow_Num: {
    type: String
  },
  EMM_PFYlow_Num: {
    type: String
  },
  EMM_PFBlow_Num: {
    type: String
  },
  EMM_EnergyR_Num: {
    type: String
  },
  EMM_EnergyY_Num: {
    type: String
  },
  EMM_EnergyB_Num: {
    type: String
  },
  EMM_EnergyT_Num: {
    type: String
  },
  EMM_Energy_Unit_Num: {
    type: String
  },
  EMM_Frequency_Num: {
    type: String
  },
  EMM_Brand_Str: {
    type: String
  },
  EMM_DataLogger_Mode_Str: {
    type: String
  },
  EMM_DataLogger_TCPIP_Str: {
    type: String
  },
  EMM_DataLogger_MacID_Str: {
    type: String
  },
  EMM_MODBUS_Device_ID_Num: {
    type: String
  },
  EMM_MODBUS_BaudRate_Num: {
    type: String
  },
  EMM_MODBUS_Parity_Num: {
    type: String
  },
  EMM_RegStartAddress_Num: {
    type: String
  },
  EMM_ByteLength_Num: {
    type: String
  },
  EMM_CreatedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  EMM_ModifiedbyId_obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  EMM_CreatedIP_str: {
    type: String
  },
  EMM_ModifiedIP_str: {
    type: String
  },
  EMM_Is_Deleted_bool: {
    type: Boolean,
    default: false
  },

},
  {
    timestamps: { createdAt: "EMM_Created_Date", updatedAt: "EMM_Modifed_Date" }
  }
);



export default mongoose.model("energyMeterMaster", energyMeterMasterSchema);
