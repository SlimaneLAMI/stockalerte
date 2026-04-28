import { connectDB } from '@/lib/db';
import MerchantProfile from '@/models/MerchantProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse, slugify } from '@/lib/utils';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page   = parseInt(searchParams.get('page') || '1');
    const limit  = parseInt(searchParams.get('limit') || '12');
    const wilaya = searchParams.get('wilaya');
    const q      = searchParams.get('q');

    const filter = { isActive: true };
    if (wilaya) filter['address.wilaya'] = wilaya;
    if (q) filter.$or = [
      { businessName: { $regex: q, $options: 'i' } },
      { 'address.commune': { $regex: q, $options: 'i' } },
    ];

    const total     = await MerchantProfile.countDocuments(filter);
    const merchants = await MerchantProfile.find(filter)
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return apiResponse({ merchants, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'merchant') return apiError('Non autorisé', 401);

    await connectDB();
    const existing = await MerchantProfile.findOne({ user: session.user.id });
    if (existing) return apiError('Profil déjà existant', 409);

    const body = await req.json();
    const slug = slugify(body.businessName) + '-' + Date.now();

    const profile = await MerchantProfile.create({
      ...body,
      user: session.user.id,
      slug,
    });

    return apiResponse({ profile }, 201);
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
