import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String, required: true },
  priority: { type: String, required: true },
  templateTitle: { type: String },
  link: { type: String },
  status: { type: String, default: 'Open' },
  createdAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket; 