import Task from '../models/Task.js';
import User from '../models/User.js';
import moment from 'moment';


export const createTask = async (req, res) => {
  const { title, deadline } = req.body;

  try {
    
    const task = await Task.create({
      title,
      deadline,
      createdBy: req.user._id,
    });

    
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { tasksCreated: task._id } },
      { new: true }
    );

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message,
        errors: error.errors,
      });
    }
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};


export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, status, deadline } = req.body;

  try {
    if (status && status === 'completed') {
      const task = await Task.findOne({ _id: taskId, createdBy: req.user._id });

      if (!task) {
        return res.status(404).json({ message: 'Task not found or not authorized' });
      }
      task.status = 'completed';
      await task.save();

      return res.status(200).json({ message: 'Task marked as completed', task });
    }

    if (deadline && moment(deadline).isBefore(moment())) {
      return res.status(400).json({ message: 'Deadline must be a future date.' });
    }

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

export const markTaskAsCompleted = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    task.status = 'completed';
    await task.save();

    res.status(200).json({ message: 'Task marked as completed', task });
  } catch (error) {
    res.status(500).json({ message: 'Error completing task' });
  }
};
