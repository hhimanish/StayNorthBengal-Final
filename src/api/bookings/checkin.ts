// src/api/bookings/checkin.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getToken } from '@/lib/auth-token';
import { creditWallet } from '@/lib/wallet';

/**
 * POST /api/bookings/checkin
 * Body: { bookingId: string }
 *
 * Validates the booking belongs to the authenticated user, ensures it is in a
 * PENDING state, marks it as CONFIRMED (or CHECKED_IN) and credits the vendor's
 * wallet with the total amount paid.
 */
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  const userId = token.sub;
  const { bookingId } = await req.json();
  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId required' }, { status: 400 });
  }

  // Fetch booking with related room and stay (host)
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: { include: { stay: true } } },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  // Ensure the caller is the guest who made the booking
  if (booking.guestId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (booking.status !== 'PENDING') {
    return NextResponse.json({ error: 'Booking already processed' }, { status: 400 });
  }

  // Update booking status to CONFIRMED (or you may define a CHECKED_IN enum)
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' },
  });

  // Credit the host's wallet – the host is the stay owner
  const hostId = booking.room.stay.hostId;
  const amountCents = booking.totalCents;
  await creditWallet(hostId, amountCents);

  return NextResponse.json({
    message: 'Check‑in successful, host wallet credited',
    creditedAmountCents: amountCents,
    hostId,
  });
}
