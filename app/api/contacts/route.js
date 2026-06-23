import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ContactRequest from '@/models/ContactRequest';
import SiteSettings from '@/models/SiteSettings';
import { sendContactNotification } from '@/lib/email';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = {};
    if (searchParams.get('archived') === 'true') query.archived = true;
    else query.archived = { $ne: true };

    const contacts = await ContactRequest.find(query).sort({ createdAt: -1 }).lean();
    const unreadCount = await ContactRequest.countDocuments({ read: false, archived: { $ne: true } });
    return NextResponse.json({ contacts, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const contact = await ContactRequest.create(body);

    const setting = await SiteSettings.findOne({ key: 'contact_notification_email' }).lean();
    const notifEmail = setting?.value;
    if (notifEmail) {
      sendContactNotification({ to: notifEmail, contact: body }).catch(() => {});
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
