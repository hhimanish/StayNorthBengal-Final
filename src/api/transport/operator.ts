// src/api/transport/operator.ts
import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

// Register a new transport operator (linked to existing user)
export async function POST(request: Request) {
  try {
    const { userId, vehiclePermit, drivingLicense, rcDocument } = await request.json();
    if (!userId || !vehiclePermit || !drivingLicense || !rcDocument) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const existing = await prisma.transportOperator.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: 'Operator already registered' }, { status: 409 });
    }
    const operator = await prisma.transportOperator.create({
      data: {
        userId,
        vehiclePermit,
        drivingLicense,
        rcDocument,
      },
    });
    return NextResponse.json(operator);
  } catch (err) {
    console.error('TransportOperator POST error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get operator profile
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const operator = await prisma.transportOperator.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!operator) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(operator);
}
