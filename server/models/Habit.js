const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['Self-care', 'Study / Career', 'Health', 'Mindfulness', 'Personal Growth', 'Other'],
        default: 'Other'
    },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: String }, // YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
