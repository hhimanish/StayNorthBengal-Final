// src/api/guide/slot.ts
import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

// Create a guide slot (available times for booking)
export async function POST(request: Request) {
  const { guideId, startTime, endTime, maxGroupSize, priceCents, gearAddOnId } = await request.json();
  if (!guideId || !startTime || !endTime || !maxGroupSize || priceCents == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const slot = await prisma.guideSlot.create({
    data: {
      guideId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      maxGroupSize,
      priceCents,
      gearAddOnId,
    },
  });
  return NextResponse.json(slot);
}

// List slots for a guide (optionally filter by date)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guideId = searchParams.get('guideId');
  const date = searchParams.get('date'); // YYYY-MM-DD optional
  if (!guideId) return NextResponse.json({ error: 'guideId required' }, { status: 400 });
  const where: any = { guideId };
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    where.startTime = { gte: start, lt: end };
  }
  const slots = await prisma.guideSlot.findMany({ where });
  return NextResponse.json(slots);
}
