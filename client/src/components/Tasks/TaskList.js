import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import './Tasks.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    setSelectedTask(null);
  };

  const handleDeleteClick = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from state
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((task) => (task._id === taskId ? response.data.task : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="task-list-container">
      <h1 className="task-list-title">Your Tasks</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <TaskForm 
        task={selectedTask} 
        onTaskAdded={handleTaskAdded} 
        onTaskUpdated={handleTaskUpdated} 
      />
      <ul className="task-list">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem 
              key={task._id} 
              task={task} 
              onEditClick={() => setSelectedTask(task)}
              onDeleteClick={() => handleDeleteClick(task._id)}
              onStatusChange={handleStatusChange} 
            />
          ))
        ) : (
          <p className="no-tasks-message">No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
