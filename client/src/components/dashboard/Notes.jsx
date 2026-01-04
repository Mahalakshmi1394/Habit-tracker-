import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { format } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('Happy');
  const [saved, setSaved] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const moods = ['Happy', 'Calm', 'Focused', 'Tired', 'Anxious'];

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const { data } = await api.get(`/logs/${today}`);
        if(data) {
          setNotes(data.notes || '');
          setMood(data.mood || 'Happy');
        }
      } catch (error) {
        // No log found is fine
      }
    };
    fetchLog();
  }, [today]);

  const handleSave = async () => {
    try {
      await api.post('/logs', { date: today, notes, mood });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save log', error);
      alert('Failed to save note');
    }
  };

  return (
    <Card style={{ height: 'fit-content' }}>
      <h3 style={{ marginBottom: '16px' }}>Daily Reflection</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>How do you feel today?</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {moods.map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.85rem',
                backgroundColor: mood === m ? 'var(--color-blush)' : 'var(--color-soft-white)',
                border: mood === m ? '1px solid var(--color-blush)' : '1px solid #eee',
                transition: 'all 0.2s',
                opacity: mood === m ? 1 : 0.7
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What are you grateful for today? Any lessons learned?"
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #eee',
          backgroundColor: 'var(--color-soft-white)',
          resize: 'vertical',
          marginBottom: '16px',
          fontSize: '0.95rem',
          lineHeight: '1.5'
        }}
      />
      
      <Button onClick={handleSave} style={{ width: '100%' }} variant="secondary">
        {saved ? 'Saved!' : 'Save Notes'}
      </Button>
    </Card>
  );
};

export default Notes;
