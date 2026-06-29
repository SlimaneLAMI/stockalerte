import { unstable_cache } from 'next/cache';
import { connectDB } from './mongodb';
import SiteSettings from '@/models/SiteSettings';

export const getSettings = unstable_cache(
  async () => {
    try {
      await connectDB();
      const docs = await SiteSettings.find().lean();
      const s = {};
      docs.forEach(d => { s[d.key] = d.value; });
      return s;
    } catch {
      return {};
    }
  },
  ['site-settings'],
  { revalidate: 60, tags: ['site-settings'] }
);
