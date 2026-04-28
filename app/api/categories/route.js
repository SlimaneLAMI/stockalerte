import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
    return apiResponse({ categories });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
