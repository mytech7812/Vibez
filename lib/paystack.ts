import axios from "axios";

export function getPaystackSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error("Missing PAYSTACK_SECRET_KEY.");
  }

  return secret;
}

export async function initializePayment({
  email,
  amount,
  metadata = {},
  callbackUrl,
}: {
  email: string;
  amount: number;
  metadata?: Record<string, unknown>;
  callbackUrl: string;
}) {
  const paystackSecret = getPaystackSecret();

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo (100 = ₦1)
        metadata,
        callback_url: callbackUrl,
        channels: ['card', 'bank_transfer', 'ussd'],
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
}

export async function verifyPayment(reference: string) {
  const paystackSecret = getPaystackSecret();

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
}
