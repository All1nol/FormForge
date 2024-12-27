import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'number', 'boolean', 'date']
  },
  isRequired: {
    type: Boolean,
    default: false
  }
});

const templateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  accessType: {
    type: String,
    enum: ['all', 'specific'],
    default: 'all'
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Template = mongoose.model('Template', templateSchema);

export default Template;