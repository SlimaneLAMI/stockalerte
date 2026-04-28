import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return apiError('Non autorisé', 401);

    await connectDB();
    const { action, reason } = await req.json();

    let update = {};
    if (action === 'suspend')   update = { isSuspended: true, suspendReason: reason };
    if (action === 'unsuspend') update = { isSuspended: false, suspendReason: null };
    if (action === 'verify')    update = { isVerified: true };
    if (action === 'make_admin') update = { role: 'admin' };

    const user = await User.findByIdAndUpdate(params.id, update, { new: true });
    if (!user) return apiError('Utilisateur introuvable', 404);

    return apiResponse({ user });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return apiError('Non autorisé', 401);

    await connectDB();
    await User.findByIdAndDelete(params.id);
    return apiResponse({ message: 'Utilisateur supprimé' });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
