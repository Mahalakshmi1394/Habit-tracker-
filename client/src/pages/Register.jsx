import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#B2AC88' }}>Join our Journey</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <Input 
            label="Username" 
            name="username"
            value={username} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            name="email"
            value={email} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            name="password"
            value={password} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            name="confirmPassword"
            value={confirmPassword} 
            onChange={handleChange} 
            required 
          />
          <Button type="submit" style={{ width: '100%', marginTop: '8px' }}>Sign Up</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#B2AC88' }}>Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
