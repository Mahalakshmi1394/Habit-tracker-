import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, name }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label 
          style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem'
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #eee',
          backgroundColor: 'var(--color-soft-white)',
          fontSize: '1rem',
          color: 'var(--color-text-main)',
        }}
      />
    </div>
  );
};

export default Input;
