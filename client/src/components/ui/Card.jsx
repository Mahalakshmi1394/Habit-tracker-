import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`card ${className}`}
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-soft)',
        ...props.style
      }}
    >
      {children}
    </div>
  );
};

export default Card;
