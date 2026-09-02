// src/lib/notification.ts
/**
 * Simple notification utilities. In production you would replace these with real email/SMS services.
 */
export async function sendEmailOtp(email: string, otp: string): Promise<void> {
  // Placeholder: integrate with SendGrid, Mailgun, etc.
  console.log(`Sending OTP ${otp} to email ${email}`);
  // Example using nodemailer could be added later.
}

export async function sendSmsOtp(phone: string, otp: string): Promise<void> {
  // Placeholder: integrate with Twilio, MSG91, etc.
  console.log(`Sending OTP ${otp} to phone ${phone}`);
}
