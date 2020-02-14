import mongoose from "mongoose";

let Schema = mongoose.Schema;

let testSchema = new Schema({
  name: {
    type: String
  }
});

export default mongoose.model("test", testSchema);