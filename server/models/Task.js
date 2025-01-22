import mongoose from 'mongoose';
import moment from 'moment'; 

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true 
  },
  deadline: { 
    type: Date, 
    required: [true, 'Deadline is required'],
    validate: {
      validator: function (v) {
        return moment(v).isAfter(moment());
      },
      message: 'Deadline must be a future date.'
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'completed'], 
    default: 'active' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
