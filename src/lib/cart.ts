// src/lib/cart.ts
import prisma from '@/lib/prisma';
import redisClient from '@/lib/redis';
import { CartItem } from '@prisma/client';
// Define CartItemType locally as string enum
export enum CartItemType {
  STAY = "STAY",
  CAB = "CAB",
  ACTIVITY = "ACTIVITY",
}

const CART_TTL_SECONDS = 24 * 60 * 60; // 24h expiration

/**
 * Retrieves or creates a cart for a given user.
 */
export async function getOrCreateCart(userId: string) {
  // Try Redis first
  const cached = await redisClient.get(`cart:${userId}`);
  if (cached) return JSON.parse(cached);

  // If not in Redis, fetch from DB or create empty
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId }, include: { items: true } });
  }
  await redisClient.setex(`cart:${userId}`, CART_TTL_SECONDS, JSON.stringify(cart));
  return cart;
}

/** Add an item to the user's cart */
export async function addItemToCart(params: {
  userId: string;
  type: CartItemType;
  referenceId: string;
  quantity?: number;
  priceCents: number;
}) {
  const { userId, type, referenceId, quantity = 1, priceCents } = params;
  const cart = await getOrCreateCart(userId);
  // Check if item already exists
  const existing = cart.items.find((i: CartItem) => i.type === type && i.referenceId === referenceId);
  let cartItem;
  if (existing) {
    cartItem = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity, priceCents },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: { cartId: cart.id, type, referenceId, quantity, priceCents },
    });
  }
  // Refresh Redis cache
  await redisClient.del(`cart:${userId}`);
  return cartItem;
}

/** Remove an item from the cart */
export async function removeItemFromCart(params: { userId: string; cartItemId: string }) {
  const { userId, cartItemId } = params;
  await prisma.cartItem.delete({ where: { id: cartItemId } });
  await redisClient.del(`cart:${userId}`);
}

/** Compute total price for a cart */
export async function calculateCartTotal(userId: string) {
  const cart = await getOrCreateCart(userId);
  const total = cart.items.reduce((sum: number, item: CartItem) => sum + item.priceCents * item.quantity, 0);
  return total;
}
