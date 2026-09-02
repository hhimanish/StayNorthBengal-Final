// src/api/transport/cabBooking.ts
import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';
import { acquireLock, releaseLock } from '@/src/lib/redis';
import { initiateRazorpayOrder } from '@/src/lib/payment';

// Create a cab booking (lock then payment)
export async function POST(request: Request) {
  const { routeId, passengerId } = await request.json();
  if (!routeId || !passengerId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Acquire lock for this route+passenger to avoid double booking
  const lockKey = `cabLock:${routeId}:${passengerId}`;
  const lockToken = await acquireLock(lockKey, 600); // 10 min
  if (!lockToken) {
    return NextResponse.json({ error: 'Unable to lock booking, try again' }, { status: 429 });
  }

  try {
    const route = await prisma.route.findUnique({ where: { id: routeId } });
    if (!route) return NextResponse.json({ error: 'Route not found' }, { status: 404 });

    // Create provisional cab booking (status PENDING)
    const cabBooking = await prisma.cabBooking.create({
      data: {
        routeId,
        passengerId,
        status: 'PENDING',
        lockToken,
        lockExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Initiate Razorpay order for the route price
    const order = await initiateRazorpayOrder({
      amountCents: route.priceCents,
      receipt: cabBooking.id,
    });

    // Store Razorpay order id in transaction record linked to cabBooking
    await prisma.transaction.create({
      data: {
        bookingId: null,
        userId: passengerId,
        razorpayOrderId: order.id,
        amountCents: route.priceCents,
        status: 'INITIATED',
      },
    });

    return NextResponse.json({ cabBooking, order });
  } finally {
    // Release lock; the lock is also stored in DB for later verification
    await releaseLock(lockKey, lockToken);
  }
}

// Verify payment webhook (simplified, actual webhook handled elsewhere)
export async function PATCH(request: Request) {
  const { cabBookingId, paymentStatus } = await request.json();
  const cabBooking = await prisma.cabBooking.update({
    where: { id: cabBookingId },
    data: { status: paymentStatus === 'success' ? 'CONFIRMED' : 'CANCELLED' },
    include: { route: true, passenger: true },
  });
  return NextResponse.json(cabBooking);
}
