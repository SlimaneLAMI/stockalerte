import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, apiResponse } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    const notifications = await Notification.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unread = notifications.filter((n) => !n.isRead).length;
    return apiResponse({ notifications, unread });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    await connectDB();
    await Notification.updateMany({ user: session.user.id, isRead: false }, { isRead: true });
    return apiResponse({ message: 'Notifications marquées comme lues' });
  } catch (err) {
    return apiError('Erreur serveur', 500);
  }
}
