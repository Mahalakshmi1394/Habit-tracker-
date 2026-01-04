import React, { useEffect, useState } from 'react';
import { Check, Trash2, Flame } from 'lucide-react';
import api from '../../utils/api';
import Card from '../ui/Card';
import { format } from 'date-fns';
import clsx from 'clsx';

const HabitList = ({ onUpdate }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchHabits = async () => {
    try {
      const { data } = await api.get('/habits');
      setHabits(data);
      if(onUpdate) onUpdate(data);
    } catch (error) {
      console.error('Failed to fetch habits', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const toggleHabit = async (id, isCompleted) => {
    // Optimistic Update
    const oldHabits = [...habits];
    setHabits(habits.map(h => {
      if (h._id === id) {
        return { 
           ...h, 
           completedToday: !isCompleted,
           // Optimistically increment streak if ticking, strictly this might be off by 1 if backend logic is complex, 
           // but visually it gives instant feedback. 
           // If completedToday was false -> true: streak + 1 (unless we just unticked it earlier, which is hard to track without backend)
           // Let's just trust the backend return value for accurate streak, but toggle the checkbox instantly.
        };
      }
      return h;
    }));

    try {
      const { data } = await api.post('/habits/toggle', { habitId: id, date: today });
      
      // Update with real data from backend
      setHabits(current => current.map(h => h._id === id ? data : h));
      
      // Trigger update for parent components (like progress bar)
      // We need to pass the full list with the updated item
      const newHabits = habits.map(h => h._id === id ? data : h);
      if(onUpdate) onUpdate(newHabits);

    } catch (error) {
      console.error('Failed to toggle habit', error);
      setHabits(oldHabits); // Revert
    }
  };

  const deleteHabit = async (id) => {
    if(!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await api.delete(`/habits/${id}`);
      const newHabits = habits.filter(h => h._id !== id);
      setHabits(newHabits);
      if(onUpdate) onUpdate(newHabits);
    } catch (error) {
      console.error('Failed to delete habit', error);
    }
  };

  if (loading) return <div>Loading habits...</div>;

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {habits.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
          <p>No habits yet. Start small today! 🌱</p>
        </Card>
      )}
      {habits.map(habit => {
        const isCompleted = habit.completedToday;
        return (
          <Card key={habit._id} className="habit-item" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => toggleHabit(habit._id, isCompleted)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: `2px solid ${isCompleted ? 'var(--color-sage)' : '#ddd'}`,
                  backgroundColor: isCompleted ? 'var(--color-sage)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {isCompleted && <Check size={18} />}
              </button>
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '500',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                  marginBottom: '4px'
                }}>
                  {habit.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ 
                    backgroundColor: 'var(--color-lavender)', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    color: 'var(--color-text-main)'
                  }}>
                    {habit.category}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <Flame size={14} color={habit.currentStreak > 0 ? "#FF8080" : "#ddd"} fill={habit.currentStreak > 0 ? "#FF8080" : "#none"} /> 
                   {habit.currentStreak} day streak
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => deleteHabit(habit._id)} style={{ color: '#ffadad', opacity: 0.6 }} className="delete-btn">
              <Trash2 size={18} />
            </button>
          </Card>
        );
      })}
    </div>
  );
};

export default HabitList;
