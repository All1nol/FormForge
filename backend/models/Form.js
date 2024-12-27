import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  template: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Template'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Form = mongoose.model('Form', formSchema);

export default Form;
