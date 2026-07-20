import mongoose from "mongoose";

const tranferSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true }, // new field
    college: { type: String, required: true },
    date: { type: Date, required: true },
    school: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Transfer", tranferSchema);
