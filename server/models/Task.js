import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
