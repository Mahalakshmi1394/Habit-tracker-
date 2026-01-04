const mongoose = require('mongoose');

// This stores a single completion event for a habit on a specific day
const habitCompletionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    completed: { type: Boolean, default: true },
}, { timestamps: true });

// Ensure unique completion per habit per day
habitCompletionSchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);
