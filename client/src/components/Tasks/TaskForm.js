import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TaskForm = ({ task, onTaskAdded, onTaskUpdated }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [deadline, setDeadline] = useState(task ? task.deadline : '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDeadline(task.deadline);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const taskDeadline = new Date(deadline);

    if (taskDeadline <= now) {
      alert('Deadline must be in the future.');
      return;
    }

    const payload = { title, deadline };
    try {
      if (task) {
        const response = await api.put(`/api/tasks/${task._id}`, payload);
        onTaskUpdated(response.data.task);
      } else {
        const response = await api.post('/api/tasks/create', payload);
        onTaskAdded(response.data.task);
      }
      setTitle('');
      setDeadline('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <button type="submit">{task ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
