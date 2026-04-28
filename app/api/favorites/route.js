import { connectDB } from '@/lib/db';
import Favorite from '@/models/Favorite';
import Offer from '@/models/Offer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const favorites = await Favorite.find({ user: session.user.id })
      .populate({
        path:     'offer',
        populate: { path: 'merchant', select: 'businessName logo slug' },
      })
      .sort({ createdAt: -1 });

    return apiResponse({ favorites });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    const { offerId } = await req.json();
    await connectDB();

    const existing = await Favorite.findOne({ user: session.user.id, offer: offerId });
    if (existing) {
      await existing.deleteOne();
      await Offer.findByIdAndUpdate(offerId, { $inc: { favorites: -1 } });
      return apiResponse({ favorited: false });
    }

    await Favorite.create({ user: session.user.id, offer: offerId });
    await Offer.findByIdAndUpdate(offerId, { $inc: { favorites: 1 } });
    return apiResponse({ favorited: true }, 201);
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
