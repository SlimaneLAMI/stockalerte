import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Brand from '@/models/Brand';

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find().sort({ name: 1 }).lean();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const brand = await Brand.create(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
