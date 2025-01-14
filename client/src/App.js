import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import TaskList from './components/Tasks/TaskList';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/tasks" 
          element={
            <PrivateRoute>
              <TaskList />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
