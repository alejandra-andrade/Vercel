import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  streak: { type: Number, default: 0 },
  completedDates: [Date],
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;

