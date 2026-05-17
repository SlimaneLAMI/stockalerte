import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String },
  website: { type: String },
}, { timestamps: true });

export default mongoose.models.Brand || mongoose.model('Brand', brandSchema);
