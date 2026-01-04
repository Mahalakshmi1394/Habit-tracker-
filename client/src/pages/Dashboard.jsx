import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import HabitList from '../components/dashboard/HabitList';
import AddHabit from '../components/dashboard/AddHabit';
import DailyProgress from '../components/dashboard/DailyProgress';
import Notes from '../components/dashboard/Notes';
import QuoteWidget from '../components/dashboard/QuoteWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget'; // Added import

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [habitsForProgress, setHabitsForProgress] = useState([]);

  useEffect(() => {
    if (!user && localStorage.getItem('user') === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Callback to update progress when habits change
  const handleHabitUpdate = (updatedHabits) => {
    setHabitsForProgress(updatedHabits);
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '8px' }}>
             Start Your Day, <span style={{ color: 'var(--color-rose)' }}>{user.username}</span> 🌸
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Let's be productive today!</p>
        </div>
        <Button onClick={logout} variant="outline" style={{ borderColor: 'var(--color-rose)', color: 'var(--color-rose)' }}>Logout</Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left Column: Calendar & Habits */}
        <div style={{ gridColumn: 'span 2' }}>
           <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
             <div style={{ flex: 1, minWidth: '300px' }}>
                 <DailyProgress habits={habitsForProgress} />
             </div>
             <div style={{ flex: 1, minWidth: '300px' }}>
                 <CalendarWidget />
             </div>
           </div>
           
           <h2 style={{ marginBottom: '16px', color: 'var(--color-text-main)', fontSize: '1.5rem' }}>Today's Tasks</h2>
           <AddHabit onHabitAdded={(newHabit) => setHabitsForProgress([...habitsForProgress, newHabit])} />
           <HabitList onUpdate={handleHabitUpdate} />
        </div>
        
        {/* Right Column: Quotes & Notes */}
        <div style={{ minWidth: '300px' }}>
           <QuoteWidget />
           <Notes />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
