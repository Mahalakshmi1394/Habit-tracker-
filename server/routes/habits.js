const express = require('express');
const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');
const { protect } = require('../middleware/auth');
const router = express.Router();
const { format, subDays, isSameDay, parseISO } = require('date-fns');

// Helper to calculate streak
const recalculateStreak = async (habitId, userId) => {
    const habit = await Habit.findById(habitId);
    const completions = await HabitCompletion.find({ habit: habitId, user: userId }).sort({ date: -1 });

    if (completions.length === 0) {
        habit.currentStreak = 0;
        habit.lastCompletedDate = null;
        await habit.save();
        return 0;
    }

    // Sort dates descending
    const dates = completions.map(c => c.date);

    let streak = 0;
    // Start from the most recent date
    // If the most recent date is NOT today or yesterday, streak is broken effectively (though we might store the old streak until next view)
    // But for "currentStreak", we usually count backward from "last completed". 
    // However, "streak" implies consecutive days up to NOW.

    // Let's count consecutive days from the latest completion backwards
    let currentDate = parseISO(dates[0]);
    streak = 1;

    for (let i = 1; i < dates.length; i++) {
        const prevDate = parseISO(dates[i]);
        const expectedPrev = subDays(currentDate, 1);

        if (isSameDay(prevDate, expectedPrev)) {
            streak++;
            currentDate = prevDate;
        } else {
            break;
        }
    }

    // Check if strict streak is broken (i.e., didn't do it today or yesterday)
    // If last completed date < yesterday, current streak is 0 visually, but let's persist the "chain length" so far 
    // and handle reset on view or let the number be the "last chain".
    // User Requirement: "If a day is missed: Streak resets to 0".
    // So if last date < yesterday, streak = 0.
    const today = new Date();
    const yesterday = subDays(today, 1);
    const lastDate = parseISO(dates[0]);

    // Note: Dates are in UTC usually or string YYYY-MM-DD. Simple string comparison works for ISO dates.
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    const lastDateStr = dates[0]; // stored as YYYY-MM-DD

    if (lastDateStr !== todayStr && lastDateStr !== yesterdayStr) {
        habit.currentStreak = 0;
    } else {
        habit.currentStreak = streak;
    }

    habit.lastCompletedDate = lastDateStr;

    // Update best streak
    if (habit.currentStreak > habit.bestStreak) {
        habit.bestStreak = habit.currentStreak;
    }

    await habit.save();
    return habit.currentStreak;
};

// @route   GET /api/habits
// @desc    Get all habits with today's status
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const habits = await Habit.find({ user: req.user.id });

        // Get completions for today
        const completions = await HabitCompletion.find({
            user: req.user.id,
            date: today
        });

        const completedIds = new Set(completions.map(c => c.habit.toString()));

        const habitsWithStatus = await Promise.all(habits.map(async (habit) => {
            // Auto-reset streak on view if missed (optional, but good for accuracy)
            // We can just rely on the stored streak + lastCompletedDate check

            let effectiveStreak = habit.currentStreak;
            // If last completed date was before yesterday, streak is 0
            if (habit.lastCompletedDate) {
                const last = parseISO(habit.lastCompletedDate);
                const yesterday = subDays(new Date(), 1);
                // Simple string compare for "before yesterday" logic
                const lastStr = habit.lastCompletedDate;
                const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
                const todayStr = today;

                if (lastStr < yesterdayStr) {
                    effectiveStreak = 0;
                    // Update DB lazily
                    if (habit.currentStreak !== 0) {
                        habit.currentStreak = 0;
                        await habit.save();
                    }
                }
            }

            return {
                ...habit.toObject(),
                completedToday: completedIds.has(habit._id.toString()),
                currentStreak: effectiveStreak
            };
        }));

        res.json(habitsWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/habits
// @desc    Create habit
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, category } = req.body;
    try {
        const habit = await Habit.create({
            user: req.user.id,
            name,
            category
        });
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/habits/toggle
// @desc    Toggle habit completion
// @access  Private
router.post('/toggle', protect, async (req, res) => {
    const { habitId, date } = req.body;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit || habit.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if completed
        const existing = await HabitCompletion.findOne({
            habit: habitId,
            date: date
        });

        if (existing) {
            // Untick
            await HabitCompletion.deleteOne({ _id: existing._id });
        } else {
            // Tick
            await HabitCompletion.create({
                user: req.user.id,
                habit: habitId,
                date: date
            });
        }

        // Recalculate streak
        await recalculateStreak(habitId, req.user.id);

        // Return updated habit
        const updatedHabit = await Habit.findById(habitId);

        // Check if completed today (the date passed)
        const isCompleted = !existing; // If it existed, we deleted it (false). If not, we created it (true).

        res.json({
            ...updatedHabit.toObject(),
            completedToday: isCompleted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/habits/:id
// @desc    Delete habit
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit || habit.user.toString() !== req.user.id) return res.status(404).json({ message: 'Not found' });

        await habit.deleteOne();
        await HabitCompletion.deleteMany({ habit: req.params.id });

        res.json({ message: 'Removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
