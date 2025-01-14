import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tasksCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const User = mongoose.model('User', UserSchema);

export default User;
