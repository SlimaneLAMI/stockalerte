import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  day:   { type: String, enum: ['mon','tue','wed','thu','fri','sat','sun'] },
  open:  { type: String },
  close: { type: String },
  closed: { type: Boolean, default: false },
}, { _id: false });

const MerchantProfileSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    slug:         { type: String, unique: true },
    description:  { type: String, maxlength: 1000 },
    category:     { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    logo:         { type: String },
    coverImage:   { type: String },
    phone:        { type: String },
    address:      {
      street:  { type: String },
      commune: { type: String },
      wilaya:  { type: String },
      country: { type: String, default: 'DZ' },
    },
    location: {
      type:        { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [3.0588, 36.7538] }, // Algiers default
    },
    schedule:      [ScheduleSchema],
    website:       { type: String },
    socialLinks: {
      facebook:  { type: String },
      instagram: { type: String },
    },
    isVerified:    { type: Boolean, default: false },
    isComplete:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:   { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    offerCount:    { type: Number, default: 0 },
    qrCode:        { type: String },
    views:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

MerchantProfileSchema.index({ location: '2dsphere' });
MerchantProfileSchema.index({ slug: 1 });
MerchantProfileSchema.index({ 'address.wilaya': 1 });

export default mongoose.models.MerchantProfile ||
  mongoose.model('MerchantProfile', MerchantProfileSchema);
