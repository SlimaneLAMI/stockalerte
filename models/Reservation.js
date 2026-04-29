import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    offer:       { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    merchant:    { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
    type:        { type: String, enum: ['pickup', 'reservation', 'delivery'], required: true },
    clientName:  { type: String, required: true, trim: true },
    clientCity:  { type: String, required: true, trim: true },
    clientPhone: { type: String, required: true, trim: true },
    notes:       { type: String, maxlength: 500 },
    status: {
      type:    String,
      enum:   ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

ReservationSchema.index({ offer: 1 });
ReservationSchema.index({ merchant: 1, status: 1 });

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
