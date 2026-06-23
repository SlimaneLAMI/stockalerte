import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Brand from '@/models/Brand';
import { requireAuth } from '@/lib/requireAuth';

export async function PUT(request, { params }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const brand = await Brand.findByIdAndUpdate(id, body, { new: true });
    if (!brand) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  try {
    await connectDB();
    const { id } = await params;
    await Brand.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
