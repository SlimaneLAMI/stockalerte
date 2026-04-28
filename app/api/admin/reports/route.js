import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return apiError('Non autorisé', 401);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter = {};
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return apiResponse({ reports });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
