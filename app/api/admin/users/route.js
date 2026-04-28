import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return apiError('Non autorisé', 401);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const q     = searchParams.get('q');
    const role  = searchParams.get('role');

    const filter = {};
    if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }];
    if (role) filter.role = role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return apiResponse({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
