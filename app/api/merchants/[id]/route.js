import { connectDB } from '@/lib/db';
import MerchantProfile from '@/models/MerchantProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const merchant = await MerchantProfile.findById(params.id)
      .populate('user', 'name email image')
      .populate('category', 'name slug');

    if (!merchant) return apiError('Commerçant introuvable', 404);
    await MerchantProfile.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    return apiResponse({ merchant });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const merchant = await MerchantProfile.findById(params.id);
    if (!merchant) return apiError('Introuvable', 404);

    const isOwner = merchant.user.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin';
    if (!isOwner && !isAdmin) return apiError('Accès refusé', 403);

    const body = await req.json();

    // check profile completeness
    const updated = await MerchantProfile.findByIdAndUpdate(params.id, body, { new: true });
    const isComplete = !!(
      updated.businessName &&
      updated.phone &&
      updated.address?.wilaya &&
      updated.location?.coordinates?.length === 2
    );
    updated.isComplete = isComplete;
    await updated.save();

    return apiResponse({ merchant: updated });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
