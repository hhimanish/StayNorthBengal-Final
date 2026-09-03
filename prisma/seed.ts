import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample stays with rooms
  await prisma.stay.createMany({
    data: [
      {
        id: 'stay-1',
        title: 'Cozy Mountain Cabin',
        description: 'A peaceful cabin in the hills with stunning views.',
        address: 'Hillside Road, North Bengal',
        latitude: 26.7171,
        longitude: 88.4272,
        hostId: 'host-1',
      },
      {
        id: 'stay-2',
        title: 'Riverside Retreat',
        description: 'Enjoy river-side serenity and comfortable rooms.',
        address: 'Riverbank Avenue, North Bengal',
        latitude: 26.7350,
        longitude: 88.4475,
        hostId: 'host-2',
      },
    ],
    skipDuplicates: true,
  });

  // Sample host users
  await prisma.user.createMany({
    data: [
      { id: 'host-1', email: 'host1@example.com', role: 'HOST', name: 'Host One' },
      { id: 'host-2', email: 'host2@example.com', role: 'HOST', name: 'Host Two' },
    ],
    skipDuplicates: true,
  });

  // Rooms for stay-1
  await prisma.room.createMany({
    data: [
      { id: 'room-1a', stayId: 'stay-1', name: 'Cabin Room A', capacity: 2, priceCents: 8000, inventory: 5 },
      { id: 'room-1b', stayId: 'stay-1', name: 'Cabin Room B', capacity: 4, priceCents: 12000, inventory: 3 },
    ],
    skipDuplicates: true,
  });

  // Rooms for stay-2
  await prisma.room.createMany({
    data: [
      { id: 'room-2a', stayId: 'stay-2', name: 'Retreat Suite', capacity: 3, priceCents: 15000, inventory: 4 },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
