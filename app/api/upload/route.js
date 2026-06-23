import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { requireAuth } from '@/lib/requireAuth';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE_MB = 10;

export async function POST(request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'StockAlerte';

    if (!file) return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Format non accepté. Formats autorisés : JPG, PNG, WebP, GIF, AVIF` },
        { status: 400 }
      );
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (${sizeMB.toFixed(1)} Mo). Maximum : ${MAX_SIZE_MB} Mo.` },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, folder);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
