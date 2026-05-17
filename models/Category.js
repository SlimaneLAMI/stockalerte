import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String },
  bannerImage: { type: String },
  icon: { type: String, default: '🍳' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
