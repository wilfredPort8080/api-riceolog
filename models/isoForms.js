import mongoose from "mongoose";

const isoFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    college: { type: String, required: true },
    date: { type: Date, required: true },
    iso: { type: [String], required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("IsoForms", isoFormSchema);
