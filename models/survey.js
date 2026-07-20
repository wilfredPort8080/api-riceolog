import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    role: { type: String, required: true }, // e.g. "Dean/Department Head"
    servicesReceived: [{ type: String }], // multiple services allowed
    ratings: {
      type: Map,
      of: Object, // each section contains questions with numeric ratings
      required: true,
    },
    textFeedback: {
      workedWell: { type: String },
      improvements: { type: String },
      additionalComments: { type: String },
    },
    recommendation: { type: String, enum: ["Yes", "No", "Maybe"] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("SurveyResponse", surveySchema);
