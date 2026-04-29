/**
 * Seed script: node scripts/seed.js
 * Creates default categories and admin user
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const CATEGORIES = [
  { slug: 'alimentation',  name: { fr: 'Alimentation',   en: 'Food',         ar: 'غذاء' },      icon: '🥖', color: '#f97316', order: 1 },
  { slug: 'hygiene-beaute', name: { fr: 'Hygiène & Beauté', en: 'Health & Beauty', ar: 'نظافة وجمال' }, icon: '🧴', color: '#06b6d4', order: 2 },
  { slug: 'mode',          name: { fr: 'Mode',            en: 'Fashion',      ar: 'أزياء' },      icon: '👗', color: '#ec4899', order: 3 },
  { slug: 'maison',        name: { fr: 'Maison',          en: 'Home',         ar: 'منزل' },       icon: '🏠', color: '#2563eb', order: 4 },
  { slug: 'tech',          name: { fr: 'Tech',            en: 'Tech',         ar: 'تقنية' },      icon: '📱', color: '#7c3aed', order: 5 },
  { slug: 'auto',          name: { fr: 'Auto',            en: 'Auto',         ar: 'سيارات' },     icon: '🚗', color: '#6b7280', order: 6 },
  { slug: 'sport',         name: { fr: 'Sport',           en: 'Sport',        ar: 'رياضة' },      icon: '⚽', color: '#0ea5e9', order: 7 },
  { slug: 'cosmetique',    name: { fr: 'Cosmétique',      en: 'Cosmetics',    ar: 'مستحضرات' },   icon: '💄', color: '#f43f5e', order: 8 },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Import models
  const { default: Category } = await import('../models/Category.js');
  const { default: User }     = await import('../models/User.js');

  // Seed categories
  for (const cat of CATEGORIES) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }
  console.log(`✅ Seeded ${CATEGORIES.length} categories`);

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@stockalerte.dz';
  const existing   = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name:       'Admin StockAlerte',
      email:      adminEmail,
      password:   process.env.ADMIN_PASSWORD || 'Admin@1234',
      role:       'admin',
      isVerified: true,
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  await mongoose.disconnect();
  console.log('🎉 Seed completed!');
}

main().catch((err) => { console.error(err); process.exit(1); });
