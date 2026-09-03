// src/lib/payout.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * Initiates an instant payout via Razorpay.
 * amountRupees: amount in INR (will be converted to paise).
 * vendorId: identifier for the vendor (used as receipt/reference).
 * Returns the payout response object.
 */
export async function createRazorpayPayout(amountRupees: number, receipt: string) {
  const amountPaise = amountRupees * 100;
  const payoutOptions = {
    account_number: process.env.RAZORPAY_PAYOUT_ACCOUNT || '', // placeholder; must be a verified account number
    fund_account: {
      account_type: 'bank_account',
      bank_account: {
        name: process.env.RAZORPAY_PAYOUT_ACCOUNT_NAME || 'Vendor',
        ifsc: process.env.RAZORPAY_PAYOUT_IFSC || 'XXXX0000000',
        account_number: process.env.RAZORPAY_PAYOUT_ACCOUNT || '',
      },
    },
    amount: amountPaise,
    currency: 'INR',
    mode: 'IMPS',
    purpose: 'payout',
    queue_if_low_balance: true,
    receipt,
    narration: `Instant payout for ${receipt}`,
  } as any;

  // Razorpay SDK returns a promise
  const payout = await (razorpay as any).payouts.create(payoutOptions);
  return payout;
}
