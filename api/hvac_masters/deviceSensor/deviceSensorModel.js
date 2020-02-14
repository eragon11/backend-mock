import mongoose from "mongoose";

const Schema = mongoose.Schema;

let deviceSensorSchema = new Schema({
  DSCNF_FK_MainModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'mainModule'
  },
  DSCNF_FK_SubModuleId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'subModule'
  },
  // DSCNF_Fk_LM_LocationID_Obj: {
  //   type: Schema.Types.ObjectId,
  //   ref: "location"
  // },
  // DSCNF_Fk_SM_SiteID_Obj: {
  //   type: Schema.Types.ObjectId,
  //   ref: "site"
  // },
  // DSCNF_Fk_BM_BuildingID_Obj: {
  //   type: Schema.Types.ObjectId,
  //   ref: "building"
  // },
  // DSCNF_Fk_ZM_ZoneID_Obj: {
  //   type: Schema.Types.ObjectId,
  //   ref: "zone"
  // },
  DSCNF_FK_Device_Id_Obj: {
    type: Schema.Types.ObjectId,
  },
  DSCNF_Fk_SensorId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'sensor'
  },
  DSCNF_Fk_SensorId_List: [
    {
      type: Schema.Types.ObjectId,
      ref: 'sensor'
    }
  ],
  DSCNF_FK_IOModule_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'ioModule'
  },
  DSCNF_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  DSCNF_ModifiedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  DSCNF_CreatedIP_str: {
    type: String,
  },
  DSCNFr_ModifiedIP_str: {
    type: String,
  },
  DSCNF_IsActive_bool: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: { createdAt: "DSCNF_Created_Date", updatedAt: "DSCNF_Modifed_Date" }
  }
);



export default mongoose.model("deviceSensor", deviceSensorSchema);


