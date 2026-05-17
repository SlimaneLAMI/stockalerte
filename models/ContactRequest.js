import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  productInterest: { type: String },
  read: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ContactRequest || mongoose.model('ContactRequest', contactRequestSchema);
