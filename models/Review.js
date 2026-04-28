import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, maxlength: 500 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ merchant: 1, user: 1 }, { unique: true });
ReviewSchema.index({ merchant: 1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
