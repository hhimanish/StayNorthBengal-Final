// src/api/payments/razorpay.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payment';
import prisma from '@/lib/prisma';
import { getToken } from '@/lib/auth-token';

/**
 * POST /api/payments/razorpay
 * Body: { bookingId: string, amountRupees: number }
 * Returns Razorpay order details.
 */
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const userId = token.sub;
  const { bookingId, amountRupees } = await req.json();
  if (!bookingId || !amountRupees) {
    return NextResponse.json({ error: 'bookingId and amountRupees required' }, { status: 400 });
  }

  // Verify booking belongs to user and is in PENDING state
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (!booking || booking.guestId !== userId) {
    return NextResponse.json({ error: 'Invalid booking' }, { status: 403 });
  }
  if (booking.status !== 'PENDING') {
    return NextResponse.json({ error: 'Booking already processed' }, { status: 400 });
  }

  // Create Razorpay order
  const order = await createRazorpayOrder(amountRupees, bookingId);

  // Persist Transaction record
  await prisma.transaction.create({
    data: {
      bookingId,
      userId,
      razorpayOrderId: order.id,
      amountCents: order.amount,
      status: 'INITIATED',
    },
  });

  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
}
