import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Reservation from '@/models/Reservation';
import Offer from '@/models/Offer';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { offerId, type, clientName, clientCity, clientPhone, notes } = body;

    if (!offerId || !type || !clientName || !clientCity || !clientPhone) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const offer = await Offer.findById(offerId).lean();
    if (!offer || offer.status !== 'active' || !offer.isActive) {
      return NextResponse.json({ error: 'Offre non disponible' }, { status: 404 });
    }

    if (type === 'reservation' && !offer.deliveryOptions?.reservation) {
      return NextResponse.json({ error: 'La réservation n\'est pas disponible pour cette offre' }, { status: 400 });
    }
    if (type === 'delivery' && !offer.deliveryOptions?.delivery) {
      return NextResponse.json({ error: 'La livraison n\'est pas disponible pour cette offre' }, { status: 400 });
    }

    const reservation = await Reservation.create({
      offer: offerId,
      merchant: offer.merchant,
      type,
      clientName,
      clientCity,
      clientPhone,
      notes,
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
