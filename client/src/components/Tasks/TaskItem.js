import React from 'react';

const TaskItem = ({ task, onEditClick, onDeleteClick, onStatusChange }) => {
  const handleCheckboxChange = () => {
    const newStatus = task.status === 'active' ? 'completed' : 'active';
    onStatusChange(task._id, newStatus);
  };

  return (
    <li>
      <input 
        type="checkbox" 
        checked={task.status === 'completed'} 
        onChange={handleCheckboxChange} 
      />
      <span>{task.title} - {new Date(task.deadline).toLocaleString()}</span>
      <button onClick={onEditClick}>Edit</button>
      <button onClick={onDeleteClick}>Delete</button>
    </li>
  );
};

export default TaskItem;
