import Task from '../models/Task.js';
import User from '../models/User.js';
import moment from 'moment';

// Create a new task
export const createTask = async (req, res) => {
  const { title, deadline } = req.body;

  try {
    // Create the task
    const task = await Task.create({
      title,
      deadline,
      createdBy: req.user._id,
    });

    // Update the user's tasksCreated array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { tasksCreated: task._id } },
      { new: true }
    );

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message,
        errors: error.errors,
      });
    }
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Update a task (e.g., change status, deadline, etc.)
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, status, deadline } = req.body;

  try {
    // If we are updating the status to 'completed', validate that it's not already completed
    if (status && status === 'completed') {
      const task = await Task.findOne({ _id: taskId, createdBy: req.user._id });

      if (!task) {
        return res.status(404).json({ message: 'Task not found or not authorized' });
      }

      // Update the task's status to 'completed'
      task.status = 'completed';
      await task.save();

      return res.status(200).json({ message: 'Task marked as completed', task });
    }

    // Check if the deadline is valid
    if (deadline && moment(deadline).isBefore(moment())) {
      return res.status(400).json({ message: 'Deadline must be a future date.' });
    }

    // Update task's title, status, or deadline if provided
    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user._id },
      { title, status, deadline },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', msg: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, createdBy: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { tasksCreated: taskId } },
      { new: true }
    );

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Mark a task as completed (using checkbox)
export const markTaskAsCompleted = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Mark the task as completed
    task.status = 'completed';
    await task.save();

    res.status(200).json({ message: 'Task marked as completed', task });
  } catch (error) {
    res.status(500).json({ message: 'Error completing task' });
  }
};
