import { Schema, model } from "mongoose";

const responseSchema = new Schema({
    template: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
      {
        questionLabel: { type: String, required: true },
        answer: { type: Schema.Types.Mixed, required: true }, // Mixed type to allow text, numbers, etc.
      },
    ],
    submittedAt: { type: Date, default: Date.now },
  });

  export default model('Response', responseSchema); 