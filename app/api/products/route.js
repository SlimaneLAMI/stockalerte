import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const query = {};
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    if (searchParams.get('published') !== 'all') query.published = true;

    const categories = searchParams.getAll('category');
    if (categories.length === 1) query.categoryId = categories[0];
    else if (categories.length > 1) query.categoryId = { $in: categories };

    const brands = searchParams.getAll('brand');
    if (brands.length === 1) query.brand = brands[0];
    else if (brands.length > 1) query.brand = { $in: brands };

    const availability = searchParams.getAll('availability');
    if (availability.length === 1) query.availability = availability[0];
    else if (availability.length > 1) query.availability = { $in: availability };

    if (searchParams.get('featured') === 'true') query.featured = true;

    const search = searchParams.get('search');
    if (search) query.$text = { $search: search };

    const sort = {};
    const sortParam = searchParams.get('sort');
    if (sortParam === 'price_asc') sort.price = 1;
    else if (sortParam === 'price_desc') sort.price = -1;
    else if (sortParam === 'name_asc') sort.name = 1;
    else sort.createdAt = -1;

    const [products, total] = await Promise.all([
      Product.find(query).populate('categoryId', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, pages: Math.ceil(total / limit), page });
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
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
