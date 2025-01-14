import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new task
router.post('/create', protect, createTask);

// Route to get all tasks for the logged-in user
router.get('/', protect, getTasks);

// Route to update a task (e.g., change status, deadline)
router.put('/:taskId', protect, updateTask);

// Route to delete a task
router.delete('/:taskId', protect, deleteTask);

export default router;
