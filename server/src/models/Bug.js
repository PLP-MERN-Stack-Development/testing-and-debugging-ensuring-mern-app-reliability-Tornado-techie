import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  stepsToReproduce: [{
    type: String,
    trim: true
  }],
  expectedBehavior: {
    type: String,
    trim: true
  },
  actualBehavior: {
    type: String,
    trim: true
  },
  environment: {
    os: String,
    browser: String,
    device: String
  },
  reporter: {
    type: String,
    required: true,
    trim: true
  },
  assignee: {
    type: String,
    trim: true
  },
  tags: [String],
  attachments: [String]
}, {
  timestamps: true
});

// Add text index for search functionality
bugSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Bug', bugSchema);