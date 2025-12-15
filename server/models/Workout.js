import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Google sub
    date: { type: String, required: true }, // "YYYY-MM-DD"
    type: { type: String, required: true, trim: true, maxlength: 30 }, // e.g. Run, Lift, Yoga
    durationMin: { type: Number, required: true, min: 1, max: 600 },
    notes: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", WorkoutSchema);
