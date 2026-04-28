import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, select: false },
    image:          { type: String },
    role:           { type: String, enum: ['client', 'merchant', 'admin'], default: 'client' },
    provider:       { type: String, enum: ['credentials', 'google'], default: 'credentials' },
    isVerified:     { type: Boolean, default: false },
    isActive:       { type: Boolean, default: true },
    isSuspended:    { type: Boolean, default: false },
    suspendReason:  { type: String },
    resetToken:     { type: String, select: false },
    resetTokenExp:  { type: Date, select: false },
    language:       { type: String, enum: ['fr', 'en', 'ar'], default: 'fr' },
    theme:          { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notifications:  {
      email:  { type: Boolean, default: true },
      push:   { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
    },
    lastLogin:      { type: Date },
    onboardingDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExp;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
