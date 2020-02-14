import mongoose from "mongoose";

let Schema = mongoose.Schema;

let gatewayMasterSchema = new Schema({

  GTWM_GatewayName_Str: {
    type: String
  },
  GTWM_GatewayID_Str: {
    type: String
  },
  GTWM_Gateway_IP_Str: {
    type: String
  },
  GTWM_Gateway_MAC_str: {
    type: String
  },
  GTWM_Gateway_Model_Str: {
    type: String
  },
  GTWM_CreatedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  GTWM_ModifiedbyId_Obj: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  GTWM_CreatedIP_str: {
    type: String
  },
  GTWM_ModifiedIP_str: {
    type: String
  },
  GTWM_IsActive_bool: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: { createdAt: "GTWM_Created_Date", updatedAt: "GTWM_Modified_Date" }
}
);

export default mongoose.model("gatewayMaster", gatewayMasterSchema);
