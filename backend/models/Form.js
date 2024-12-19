import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer: { type: mongoose.Schema.Types.Mixed, required: true }, // Mixed type for text/number/boolean
    },
  ],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissionDate: { type: Date, default: Date.now },
});

const Form = mongoose.model('Form', formSchema);
export default Form;
