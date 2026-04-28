import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:    {
      type: String,
      enum: ['new_offer', 'offer_expiring', 'offer_sold_out', 'merchant_verified', 'system', 'follow'],
      required: true,
    },
    title:   { type: String, required: true },
    message: { type: String },
    data:    { type: mongoose.Schema.Types.Mixed },
    isRead:  { type: Boolean, default: false },
    link:    { type: String },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
