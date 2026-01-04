import React, { useState } from 'react';
import api from '../../utils/api';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Plus, X } from 'lucide-react';

const AddHabit = ({ onHabitAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Self-care');

  const categories = ['Self-care', 'Study / Career', 'Health', 'Mindfulness', 'Personal Growth', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const { data } = await api.post('/habits', { name, category });
      onHabitAdded(data);
      setName('');
      setCategory('Self-care');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add habit', error);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        style={{ width: '100%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <Plus size={20} /> Add New Habit
      </Button>
    );
  }

  return (
    <Card style={{ marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3>New Habit</h3>
        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <Input 
          placeholder="What do you want to achieve?" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Category</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.85rem',
                  backgroundColor: category === cat ? 'var(--color-lavender)' : 'var(--color-soft-white)',
                  border: category === cat ? '1px solid var(--color-lavender)' : '1px solid #eee',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" style={{ width: '100%' }}>Create Habit</Button>
      </form>
    </Card>
  );
};

export default AddHabit;
