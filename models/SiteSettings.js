import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
