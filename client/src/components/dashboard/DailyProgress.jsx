import React from 'react';
import Card from '../ui/Card';
import { format } from 'date-fns';

const DailyProgress = ({ habits }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const total = habits.length;
  const completed = habits.filter(h => h.completedToday).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #FFFDD0 0%, #FFD1DC 100%)' }}>
      <h3 style={{ marginBottom: '8px', color: 'var(--color-text-main)' }}>Daily Progress</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: '600' }}>{percentage}%</span>
        <span style={{ marginBottom: '6px' }}>{completed}/{total} completed</span>
      </div>
      <div style={{ 
        width: '100%', 
        height: '10px', 
        backgroundColor: 'rgba(255,255,255,0.5)', 
        borderRadius: '5px',
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          backgroundColor: 'var(--color-sage)', 
          borderRadius: '5px',
          transition: 'width 0.5s ease-out' 
        }} />
      </div>
      {percentage === 100 && total > 0 && (
        <p style={{ marginTop: '12px', fontSize: '0.9rem', textAlign: 'center' }}>🎉 Amazing job! You did it!</p>
      )}
    </Card>
  );
};

export default DailyProgress;
