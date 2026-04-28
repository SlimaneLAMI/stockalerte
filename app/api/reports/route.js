import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

const TARGET_MODEL_MAP = { offer: 'Offer', merchant: 'MerchantProfile', user: 'User' };

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    const { targetType, targetId, reason, description } = await req.json();
    await connectDB();

    const report = await Report.create({
      reporter:    session.user.id,
      targetType,
      targetId,
      targetModel: TARGET_MODEL_MAP[targetType],
      reason,
      description,
    });

    return apiResponse({ report }, 201);
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
