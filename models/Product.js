import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: String, trim: true },
  shortDesc: { type: String, maxlength: 200 },
  longDesc: { type: String },
  images: [{ url: String, publicId: String }],
  pdfUrl: { type: String },
  price: { type: Number },
  priceVisible: { type: Boolean, default: true },
  availability: {
    type: String,
    enum: ['En stock', 'Sur commande'],
    default: 'En stock',
  },
  condition: {
    type: String,
    enum: ['Neuf', 'Comme neuf', 'Bonne occasion', 'Occasion'],
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  metaTitle: { type: String },
  metaDesc: { type: String },
}, { timestamps: true });

productSchema.index({ name: 'text', shortDesc: 'text', brand: 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ featured: 1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
