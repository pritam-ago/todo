import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.post('/api/auth/verify', { token })
        .then(() => {
          navigate('/tasks');
        })
        .catch((error) => {
          console.error('Token verification failed', error);
        });
    }
  }, [navigate]);

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome</h1>
      <button className="welcome-button" onClick={() => navigate('/login')}>Login</button>
      <button className="welcome-button" onClick={() => navigate('/signup')}>Signup</button>
    </div>
  );
};

export default Welcome;
