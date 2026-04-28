import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name:      { fr: String, en: String, ar: String },
    slug:      { type: String, required: true, unique: true },
    icon:      { type: String },
    color:     { type: String, default: '#f97316' },
    isActive:  { type: Boolean, default: true },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
