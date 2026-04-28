import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadImage } from '@/lib/cloudinary';
import { apiError, apiResponse } from '@/lib/utils';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError('Non autorisé', 401);

    const formData = await req.formData();
    const file     = formData.get('file');
    const folder   = formData.get('folder') || 'stockalerte';

    if (!file) return apiError('Fichier requis', 400);

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) return apiError('Format non supporté', 400);

    if (file.size > 5 * 1024 * 1024) return apiError('Fichier trop volumineux (max 5MB)', 400);

    const result = await uploadImage(file, folder);
    return apiResponse(result, 201);
  } catch (err) {
    console.error('[UPLOAD]', err);
    return apiError('Erreur upload', 500);
  }
}
