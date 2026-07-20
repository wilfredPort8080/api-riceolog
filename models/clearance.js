import mongoose from "mongoose";

const clearanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true }, // new field
    college: { type: String, required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Clearance", clearanceSchema);
