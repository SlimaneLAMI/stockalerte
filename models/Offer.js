import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema(
  {
    merchant:    { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, maxlength: 2000 },
    images:      [{ type: String }],
    category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    type: {
      type:    String,
      enum:   ['sale', 'promotion', 'pack', 'anti-waste', 'donation'],
      default: 'promotion',
    },
    originalPrice: { type: Number, min: 0 },
    discountPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    quantity:      { type: Number, min: 0 },
    unit:          { type: String, default: 'unité' },
    expiresAt:     { type: Date, required: true },
    startsAt:      { type: Date, default: Date.now },
    status: {
      type:    String,
      enum:   ['draft', 'active', 'paused', 'expired', 'sold_out', 'pending_moderation', 'rejected'],
      default: 'active',
    },
    isActive:      { type: Boolean, default: true },
    isFeatured:    { type: Boolean, default: false },
    rejectionNote: { type: String },
    tags:          [{ type: String }],
    views:         { type: Number, default: 0 },
    favorites:     { type: Number, default: 0 },
    donationStatus: {
      type: String,
      enum: ['available', 'reserved', 'collected'],
    },
    deliveryOptions: {
      pickup:      { type: Boolean, default: true },
      reservation: { type: Boolean, default: false },
      delivery:    { type: Boolean, default: false },
    },
    location: {
      type:        { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

OfferSchema.index({ location: '2dsphere' });
OfferSchema.index({ merchant: 1, status: 1 });
OfferSchema.index({ expiresAt: 1 });
OfferSchema.index({ type: 1 });
OfferSchema.index({ category: 1 });

OfferSchema.pre('save', function (next) {
  if (this.originalPrice && this.discountPrice) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.discountPrice) / this.originalPrice) * 100
    );
  }
  if (this.expiresAt < new Date()) {
    this.status = 'expired';
  }
  next();
});

export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
