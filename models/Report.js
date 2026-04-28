import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    reporter:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['offer', 'merchant', 'user'], required: true },
    targetId:   { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetModel' },
    targetModel:{ type: String, enum: ['Offer', 'MerchantProfile', 'User'] },
    reason: {
      type: String,
      enum: ['spam', 'fake', 'inappropriate', 'wrong_info', 'expired', 'other'],
      required: true,
    },
    description: { type: String, maxlength: 500 },
    status:      { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
    adminNote:   { type: String },
    resolvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt:  { type: Date },
  },
  { timestamps: true }
);

ReportSchema.index({ status: 1 });
ReportSchema.index({ targetId: 1 });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
