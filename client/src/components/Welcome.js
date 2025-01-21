import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
    <div>
      <h1>Welcome</h1>
      <p>Please <a href="/login">Login</a> or <a href="/signup">Signup</a> to continue.</p>
    </div>
  );
};

export default Welcome;
