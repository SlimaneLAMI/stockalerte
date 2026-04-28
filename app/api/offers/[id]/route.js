import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import MerchantProfile from '@/models/MerchantProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const offer = await Offer.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('merchant', 'businessName logo slug address phone schedule rating reviewCount')
      .populate('category', 'name slug icon');

    if (!offer) return apiError('Offre introuvable', 404);
    return apiResponse({ offer });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const offer = await Offer.findById(params.id).populate('merchant');

    if (!offer) return apiError('Offre introuvable', 404);

    const isOwner = offer.merchant.user.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin';
    if (!isOwner && !isAdmin) return apiError('Accès refusé', 403);

    const body   = await req.json();
    const updated = await Offer.findByIdAndUpdate(params.id, body, { new: true });

    return apiResponse({ offer: updated });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const offer = await Offer.findById(params.id).populate('merchant');
    if (!offer) return apiError('Offre introuvable', 404);

    const isOwner = offer.merchant.user.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin';
    if (!isOwner && !isAdmin) return apiError('Accès refusé', 403);

    await offer.deleteOne();
    await MerchantProfile.findByIdAndUpdate(offer.merchant._id, { $inc: { offerCount: -1 } });

    return apiResponse({ message: 'Offre supprimée' });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
