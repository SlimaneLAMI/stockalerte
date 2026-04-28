import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import MerchantProfile from '@/models/MerchantProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page   = parseInt(searchParams.get('page') || '1');
    const limit  = parseInt(searchParams.get('limit') || '12');
    const type   = searchParams.get('type');
    const cat    = searchParams.get('category');
    const wilaya = searchParams.get('wilaya');
    const q      = searchParams.get('q');
    const lat    = parseFloat(searchParams.get('lat'));
    const lng    = parseFloat(searchParams.get('lng'));
    const radius = parseFloat(searchParams.get('radius') || '10');
    const sort   = searchParams.get('sort') || 'createdAt';

    const filter = {
      status:   'active',
      isActive: true,
      expiresAt: { $gt: new Date() },
      startsAt:  { $lte: new Date() },
    };

    if (type && type !== 'all') filter.type = type;
    if (cat)   filter.category = cat;
    if (q)     filter.$text    = { $search: q };

    let query = Offer.find(filter);

    if (!isNaN(lat) && !isNaN(lng)) {
      query = Offer.find({
        ...filter,
        location: {
          $near: {
            $geometry:    { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: radius * 1000,
          },
        },
      });
    }

    const total  = await Offer.countDocuments(filter);
    const offers = await query
      .populate('merchant', 'businessName logo slug address')
      .populate('category', 'name slug icon')
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return apiResponse({ offers, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[OFFERS GET]', err);
    return apiError('Erreur serveur', 500);
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'merchant') return apiError('Non autorisé', 401);

    await connectDB();
    const merchant = await MerchantProfile.findOne({ user: session.user.id });
    if (!merchant) return apiError('Profil commerçant introuvable', 404);
    if (!merchant.isComplete) return apiError('Complétez votre profil avant de publier', 400);

    const body = await req.json();
    const offer = await Offer.create({
      ...body,
      merchant: merchant._id,
      location: merchant.location,
    });

    await MerchantProfile.findByIdAndUpdate(merchant._id, { $inc: { offerCount: 1 } });

    return apiResponse({ offer }, 201);
  } catch (err) {
    console.error('[OFFERS POST]', err);
    return apiError('Erreur serveur', 500);
  }
}
