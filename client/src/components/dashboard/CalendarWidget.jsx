import React from 'react';
import Card from '../ui/Card';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ padding: '8px', color: 'var(--color-text-main)' }}>
            <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ padding: '8px', color: 'var(--color-text-main)' }}>
            <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEE";
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} style={{ 
            flexGrow: 1, 
            textAlign: 'center', 
            fontSize: '0.85rem', 
            color: 'var(--color-text-muted)', 
            fontWeight: '500',
            textTransform: 'uppercase'
        }}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div style={{ display: 'flex', marginBottom: '8px' }}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
            style={{
              flexGrow: 1,
              width: '14.28%',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '50%',
              backgroundColor: isSelected ? 'var(--color-rose)' : 'transparent',
              color: isSelected ? 'white' : (!isCurrentMonth ? '#ccc' : 'var(--color-text-main)'),
              fontWeight: isSelected ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} style={{ display: 'flex' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <Card style={{ 
      marginBottom: '24px', 
      background: 'white',
      border: '1px solid rgba(236, 72, 153, 0.1)',
      boxShadow: '0 8px 24px rgba(236, 72, 153, 0.08)'
    }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </Card>
  );
};

export default CalendarWidget;
