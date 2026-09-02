// src/app/stays/page.tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic'; // always fetch fresh data

export default async function StaysPage() {
  const stays = await prisma.stay.findMany({
    include: { reviews: true },
    orderBy: { createdAt: 'desc' },
  });

  const averageRating = (reviews: any[]) => {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stays.map((stay) => (
        <Card key={stay.id} className="p-4 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-2">{stay.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{stay.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-primary font-medium">⭐ {averageRating(stay.reviews)}</span>
            <Link href={`/stays/${stay.id}`}>
              <Button variant="secondary">View</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
