import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { requireAuth } from '@/lib/requireAuth';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.find().lean();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  try {
    await connectDB();
    const body = await request.json();
    const ops = Object.entries(body).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value } },
        upsert: true,
      },
    }));
    await SiteSettings.bulkWrite(ops);
    revalidateTag('site-settings');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
