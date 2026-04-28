import { connectDB } from '@/lib/db';
import User from '@/models/User';
import MerchantProfile from '@/models/MerchantProfile';
import Offer from '@/models/Offer';
import Report from '@/models/Report';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return apiError('Non autorisé', 401);

    await connectDB();
    const [users, merchants, offers, activeOffers, reports] = await Promise.all([
      User.countDocuments(),
      MerchantProfile.countDocuments(),
      Offer.countDocuments(),
      Offer.countDocuments({ status: 'active', isActive: true }),
      Report.countDocuments({ status: 'pending' }),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentOffers = await Offer.find()
      .populate('merchant', 'businessName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return apiResponse({ users, merchants, offers, activeOffers, reports, recentUsers, recentOffers });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
