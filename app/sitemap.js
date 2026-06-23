import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

export default async function sitemap() {
  try {
    await connectDB();

    const [products, categories] = await Promise.all([
      Product.find({ published: true }, 'slug updatedAt').lean(),
      Category.find({}, 'slug updatedAt').lean(),
    ]);

    const staticRoutes = [
      { url: BASE, priority: 1.0, changeFrequency: 'weekly' },
      { url: `${BASE}/catalogue`, priority: 0.9, changeFrequency: 'daily' },
      { url: `${BASE}/a-propos`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE}/contact`, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${BASE}/mentions-legales`, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${BASE}/cgv`, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${BASE}/politique-de-confidentialite`, priority: 0.3, changeFrequency: 'yearly' },
    ].map(r => ({ ...r, lastModified: new Date() }));

    const productRoutes = products.map(p => ({
      url: `${BASE}/catalogue/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryRoutes = categories.map(c => ({
      url: `${BASE}/catalogue/categorie/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch {
    return [{ url: BASE, lastModified: new Date() }];
  }
}
