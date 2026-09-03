// @ts-nocheck
// @ts-nocheck
// src/api/guide/slot.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Register a guide (linked to existing user)
export async function POST(request: Request) {
  const { userId, bio } = await request.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const existing = await prisma.guide.findUnique({ where: { userId } });
  if (existing) return NextResponse.json({ error: 'Guide already exists' }, { status: 409 });
  const guide = await prisma.guide.create({ data: { userId, bio } });
  return NextResponse.json(guide);
}

// Get guide profile
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const guide = await prisma.guide.findUnique({ where: { userId }, include: { slots: true } });
  if (!guide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(guide);
}
