import { connectDB } from '@/lib/db';
import Follow from '@/models/Follow';
import MerchantProfile from '@/models/MerchantProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const follows = await Follow.find({ follower: session.user.id })
      .populate('merchant', 'businessName logo slug address rating offerCount')
      .sort({ createdAt: -1 });

    return apiResponse({ follows });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    const { merchantId } = await req.json();
    await connectDB();

    const existing = await Follow.findOne({ follower: session.user.id, merchant: merchantId });
    if (existing) {
      await existing.deleteOne();
      await MerchantProfile.findByIdAndUpdate(merchantId, { $inc: { followerCount: -1 } });
      return apiResponse({ following: false });
    }

    await Follow.create({ follower: session.user.id, merchant: merchantId });
    await MerchantProfile.findByIdAndUpdate(merchantId, { $inc: { followerCount: 1 } });
    return apiResponse({ following: true }, 201);
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
