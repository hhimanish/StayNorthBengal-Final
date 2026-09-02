// src/lib/payment.ts
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * Creates a Razorpay order for the given amount (in rupees) and returns order ID.
 */
export async function createRazorpayOrder(amountRupees: number, receipt: string) {
  const amountPaise = amountRupees * 100; // convert to paise
  const options = {
    amount: amountPaise,
    currency: 'INR',
    receipt,
    payment_capture: 1,
  } as any;
  const order = await razorpay.orders.create(options);
  return order;
}

/**
 * Verifies Razorpay webhook signature.
 */
export function verifySignature(body: string, signature: string, secret: string): boolean {
  const crypto = require('crypto');
  const generated = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return generated === signature;
}
