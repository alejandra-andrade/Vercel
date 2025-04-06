import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    streakDays: { type: Number, default: 0 },
    goalDays: { type: Number, required: true },
    completedDates: { type: [Date], default: [] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;