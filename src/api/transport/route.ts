// src/api/transport/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Create a new route (admin only in real app, omitted for brevity)
export async function POST(request: Request) {
  const { hubFrom, hubTo, priceCents, distanceKm } = await request.json();
  if (!hubFrom || !hubTo || priceCents == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const route = await prisma.route.create({
    data: { hubFrom, hubTo, priceCents, distanceKm },
  });
  return NextResponse.json(route);
}

// Get route list (optionally filter by hubs)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hubFrom = searchParams.get('hubFrom');
  const hubTo = searchParams.get('hubTo');
  const where = hubFrom || hubTo ? { AND: [] as any[] } : undefined;
  if (hubFrom) where?.AND?.push({ hubFrom });
  if (hubTo) where?.AND?.push({ hubTo });
  const routes = await prisma.route.findMany({ where });
  return NextResponse.json(routes);
}
