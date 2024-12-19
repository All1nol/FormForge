import { Schema, model } from 'mongoose';

const templateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      text: { type: String, required: true },
      type: { type: String, enum: ['text', 'number', 'date', 'boolean'], required: true },
      isRequired: { type: Boolean, default: false },
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filledFormsCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default model('Template', templateSchema);
