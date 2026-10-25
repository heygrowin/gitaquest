import { Browser } from '@capacitor/browser';

export const DONATION_URL = 'https://razorpay.me/@heygrowin';

/**
 * Opens Razorpay donation page securely via Chrome Custom Tabs or browser fallback.
 * Allows users to contribute via UPI (GPay, PhonePe, Paytm, etc.), Cards, or NetBanking.
 */
export async function openDonationPage(): Promise<void> {
  try {
    await Browser.open({
      url: DONATION_URL,
      presentationStyle: 'popover',
      toolbarColor: '#1E3A2F',
    });
  } catch (error) {
    // Web fallback if Capacitor Browser is unavailable
    window.open(DONATION_URL, '_blank', 'noopener,noreferrer');
  }
}
