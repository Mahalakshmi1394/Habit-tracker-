const express = require('express');
const DailyReflection = require('../models/DailyReflection');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/logs/:date (Keeping URL same for frontend compat, logic changed)
// @desc    Get reflection for date
// @access  Private
router.get('/:date', protect, async (req, res) => {
    try {
        const log = await DailyReflection.findOne({
            user: req.user.id,
            date: req.params.date,
        });
        res.json(log || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/logs
// @desc    Upsert reflection
// @access  Private
router.post('/', protect, async (req, res) => {
    const { date, mood, notes } = req.body;
    try {
        let log = await DailyReflection.findOne({ user: req.user.id, date });

        if (log) {
            log.mood = mood;
            log.notes = notes;
            await log.save();
        } else {
            log = await DailyReflection.create({
                user: req.user.id,
                date,
                mood,
                notes
            });
        }
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
