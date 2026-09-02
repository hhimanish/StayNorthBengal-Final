// src/api/payments/payout.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth-token';
import prisma from '@/lib/prisma';
import { getWalletBalance, debitWallet } from '@/lib/wallet';
import { createRazorpayPayout } from '@/lib/payout';

/**
 * POST /api/payments/payout
 * Body: { amountRupees: number }
 * Authenticated vendor (host) can request an instant payout of available balance.
 */
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  const userId = token.sub; // assuming vendor's userId

  // Verify user is a host (has stays) – optional but recommended
  const hostStays = await prisma.stay.findFirst({ where: { hostId: userId } });
  if (!hostStays) {
    return NextResponse.json({ error: 'Only hosts can request payouts' }, { status: 403 });
  }

  const { amountRupees, accountNumber, ifsc } = await req.json();
  const minPayout = Number(process.env.PAYOUT_MIN_RUPEES) || 10;
  const maxPayout = Number(process.env.PAYOUT_MAX_RUPEES) || 10000;
  if (!amountRupees || amountRupees <= 0) {
    return NextResponse.json({ error: 'Invalid payout amount' }, { status: 400 });
  }
  if (amountRupees < minPayout || amountRupees > maxPayout) {
    return NextResponse.json({ error: `Payout amount must be between ${minPayout} and ${maxPayout} rupees` }, { status: 400 });
  }

  const balanceCents = await getWalletBalance(userId);
  const amountCents = amountRupees * 100;
  if (amountCents > balanceCents) {
    return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
  }

  // Initiate Razorpay payout
  const receipt = `payout_${userId}_${Date.now()}`;
  try {
    const payout = await createRazorpayPayout(amountRupees, receipt);
    // Debit wallet after successful payout creation
    await debitWallet(userId, amountCents);
    return NextResponse.json({
      message: 'Payout initiated',
      payoutId: payout.id,
      amountRupees,
      remainingBalanceCents: balanceCents - amountCents,
    });
  } catch (err: any) {
    console.error('Razorpay payout error', err);
    return NextResponse.json({ error: 'Payout failed', details: err.message }, { status: 500 });
  }
}
