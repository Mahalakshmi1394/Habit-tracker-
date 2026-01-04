import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-lavender)',
      color: 'var(--color-text-main)',
    },
    secondary: {
      backgroundColor: 'var(--color-cream)',
      color: 'var(--color-text-main)',
    },
    outline: {
      border: '2px solid var(--color-lavender)',
      color: 'var(--color-text-main)',
    }
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, filter: 'brightness(0.95)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default Button;
