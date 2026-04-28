import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
  },
  { timestamps: true }
);

FollowSchema.index({ follower: 1, merchant: 1 }, { unique: true });
FollowSchema.index({ merchant: 1 });

export default mongoose.models.Follow || mongoose.model('Follow', FollowSchema);
