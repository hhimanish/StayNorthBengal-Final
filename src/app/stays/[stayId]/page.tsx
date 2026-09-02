// src/app/stays/[stayId]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StayDetail({ params }: { params: { stayId: string } }) {
  const stay = await prisma.stay.findUnique({
    where: { id: params.stayId },
    include: { rooms: true, reviews: true },
  });

  if (!stay) notFound();

  const averageRating = (reviews: any[]) => {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{stay.title}</h1>
      <p className="text-gray-700">{stay.description}</p>
      <div className="text-primary font-medium">⭐ {averageRating(stay.reviews)}</div>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Rooms</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stay.rooms.map((room) => (
          <Card key={room.id} className="p-4 flex flex-col">
            <h3 className="font-medium mb-2">{room.name}</h3>
            <p className="text-sm mb-2">Capacity: {room.capacity}</p>
            <p className="text-sm mb-4">Price: ₹{(room.priceCents / 100).toFixed(2)}</p>
            <Link href={`/bookings/lock?roomId=${room.id}`}>
              <Button variant="primary" className="mt-auto">Book Now</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
