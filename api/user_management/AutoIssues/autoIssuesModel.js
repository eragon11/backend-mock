import mongoose from "mongoose";

let Schema = mongoose.Schema;

let autoIssueSchema = new Schema({

  Issues_Ticket_Num: {
    type: Number
  },
  Issues_Fk_User_Id_object: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  Issues_Description_Str: {
    type: String
  },
  Issues_Device_ID_Str: {
    type: String
  },
  Issues_Raised_date: {
    type: Date,
    default: Date.now
  },
  Issues_Priority_int: {
    type: Number,
    min: 0
  },
  Issues_Status_Str: {
    type: Number,
    min: 0
  },
  Issues_CreatedbyId_obj: {
    type: String
  },
  Issues_ModifiedbyId_obj: {
    type: String
  },
  Issues_CreatedIP_str: {
    type: String
  },
  Issues_ModifiedIP_str: {
    type: String
  },
  Issues_IsDeleted_bool: {
    type: Boolean,
    default: false
  },
  Issues_Service_Completed_Bool: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: "Issues_Created_Date", updatedAt: "Issues_Modified_Date" }
}
);

export default mongoose.model("autoIssue", autoIssueSchema);
