import React from 'react';

const TaskItem = ({ task, onEditClick, onDeleteClick, onStatusChange }) => {
  const handleCheckboxChange = () => {
    const newStatus = task.status === 'active' ? 'completed' : 'active';
    onStatusChange(task._id, newStatus);
  };

  return (
    <li className="task-item">
      <input 
        type="checkbox" 
        checked={task.status === 'completed'} 
        onChange={handleCheckboxChange} 
        className="task-checkbox"
      />
      <span className="task-title">{task.title} - {new Date(task.deadline).toLocaleString()}</span>
      <button onClick={() => onEditClick(task._id)} className="task-edit-button">Edit</button>
      <button onClick={() => onDeleteClick(task._id)} className="task-delete-button">Delete</button>
    </li>
  );
};

export default TaskItem;
