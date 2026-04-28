import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return apiError('Non autorisé', 401);

    const { status, adminNote } = await req.json();
    await connectDB();

    const report = await Report.findByIdAndUpdate(params.id, {
      status,
      adminNote,
      resolvedBy: session.user.id,
      resolvedAt: new Date(),
    }, { new: true });

    if (!report) return apiError('Signalement introuvable', 404);
    return apiResponse({ report });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
