const mongoose = require('mongoose');

// Stores daily notes, mood, etc.
const dailyReflectionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    mood: { type: String },
    notes: { type: String },
}, { timestamps: true });

dailyReflectionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyReflection', dailyReflectionSchema);
