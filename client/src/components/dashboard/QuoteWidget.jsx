import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';

const quotes = [
  "Small steps every day lead to big results.",
  "Believing in yourself is the first secret to success.",
  "Your potential is endless.",
  "Grow through what you go through.",
  "Do it for your future self.",
  "Consistency is the key to success.",
  "The best time for new beginnings is now.",
  "Don't stop until you're proud."
];

const QuoteWidget = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Pick a random quote based on the day so it stays same for the day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  return (
    <Card style={{ 
      marginBottom: '24px', 
      textAlign: 'center', 
      backgroundColor: 'var(--color-text-main)', // Dark background for contrast
      color: 'white',
      backgroundImage: 'linear-gradient(135deg, var(--color-text-main) 0%, var(--color-rose) 100%)',
      padding: '32px'
    }}>
      <p style={{ 
        fontStyle: 'italic', 
        fontSize: '1.25rem', 
        lineHeight: '1.6',
        color: 'white',
        fontFamily: "Georgia, serif"
      }}>
        "{quote}"
      </p>
      <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.4)', margin: '16px auto 0' }}></div>
    </Card>
  );
};

export default QuoteWidget;
