import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, offer: 1 }, { unique: true });
FavoriteSchema.index({ user: 1 });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
