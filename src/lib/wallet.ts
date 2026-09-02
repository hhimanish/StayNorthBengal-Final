// src/lib/wallet.ts
import prisma from '@/lib/prisma';

/**
 * Retrieves the wallet for a given user. Creates one if it does not exist.
 */
export async function getOrCreateWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
  });
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, balanceCents: 0 },
    });
  }
  return wallet;
}

/**
 * Credits the user's wallet by the given amount (in cents).
 */
export async function creditWallet(userId: string, amountCents: number) {
  const wallet = await getOrCreateWallet(userId);
  return await prisma.wallet.update({
    where: { userId },
    data: { balanceCents: wallet.balanceCents + amountCents },
  });
}

/**
 * Debits the user's wallet by the given amount (in cents). Throws if insufficient balance.
 */
export async function debitWallet(userId: string, amountCents: number) {
  const wallet = await getOrCreateWallet(userId);
  if (wallet.balanceCents < amountCents) {
    throw new Error('Insufficient wallet balance');
  }
  return await prisma.wallet.update({
    where: { userId },
    data: { balanceCents: wallet.balanceCents - amountCents },
  });
}

/**
 * Retrieves the current balance (in cents) for the user.
 */
export async function getWalletBalance(userId: string) {
  const wallet = await getOrCreateWallet(userId);
  return wallet.balanceCents;
}
