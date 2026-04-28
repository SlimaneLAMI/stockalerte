import { connectDB } from '@/lib/db';
import MerchantProfile from '@/models/MerchantProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const merchant = await MerchantProfile.findOne({ user: session.user.id })
      .populate('category', 'name slug');

    if (!merchant) return apiError('Profil introuvable', 404);
    return apiResponse({ merchant });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
