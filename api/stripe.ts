import { MOCK_BOOKINGS } from '../constants';
import type { BookingStatus } from '../types';

// Mock in-memory store for idempotency keys
const idempotencyStore = new Map<string, { response: any; timestamp: number }>();

// Clean up old idempotency keys periodically (e.g., every hour)
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of idempotencyStore.entries()) {
        if (now - value.timestamp > 3600 * 1000) { // 1 hour TTL
            idempotencyStore.delete(key);
        }
    }
}, 3600 * 1000);

/**
 * Simulates creating a Stripe Checkout Session and returning a redirect URL
 * that leads to our mock processing page. Now with idempotency.
 */
export const createStripeCheckoutSession = async (orderId: number, allowKlarna: boolean, idempotencyKey: string): Promise<{ url: string; sessionId: string }> => {
    if (idempotencyStore.has(idempotencyKey)) {
        console.log(`[IDEMPOTENCY] Returning cached response for key: ${idempotencyKey}`);
        return idempotencyStore.get(idempotencyKey)!.response;
    }

    console.log(`[MOCK API] Creating Stripe Checkout session for orderId: ${orderId}, Klarna: ${allowKlarna}`);
    await new Promise(res => setTimeout(res, 500)); // Simulate network latency
    
    const sessionId = `cs_test_stripe_${Math.random().toString(36).substring(2)}`;
    
    // In a real app, this would be a Stripe URL. Here, we redirect to a mock processing page.
    const processingUrl = `${window.location.origin}${window.location.pathname}?page=payment-processing&method=stripe&orderId=${orderId}&sessionId=${sessionId}`;
    
    const response = {
        url: processingUrl,
        sessionId: sessionId,
    };

    idempotencyStore.set(idempotencyKey, { response, timestamp: Date.now() });
    
    return response;
};

/**
 * Simulates creating a PayPal order and returning a redirect URL
 * that leads to our mock processing page. Now with idempotency.
 */
export const createPayPalOrder = async (orderId: number, idempotencyKey: string): Promise<{ url: string; paypalOrderId: string }> => {
     if (idempotencyStore.has(idempotencyKey)) {
        console.log(`[IDEMPOTENCY] Returning cached response for key: ${idempotencyKey}`);
        return idempotencyStore.get(idempotencyKey)!.response;
    }

    console.log(`[MOCK API] Creating PayPal order for orderId: ${orderId}`);
    await new Promise(res => setTimeout(res, 500));
    
    const paypalOrderId = `paypal_ord_${Math.random().toString(36).substring(2)}`;
    
    const processingUrl = `${window.location.origin}${window.location.pathname}?page=payment-processing&method=paypal&orderId=${orderId}&paypalOrderId=${paypalOrderId}`;

    const response = { url: processingUrl, paypalOrderId };

    idempotencyStore.set(idempotencyKey, { response, timestamp: Date.now() });

    return response;
};


/**
 * Simulates polling for an order's status from a backend endpoint.
 */
export const getOrderStatus = async (orderId: number): Promise<BookingStatus | null> => {
    console.log(`[MOCK API] Polling status for orderId: ${orderId}`);
    // Simulate network delay for polling
    await new Promise(res => setTimeout(res, 300));
    const booking = MOCK_BOOKINGS.find(b => b.id === orderId);
    return booking ? booking.status : null;
};


/**
 * Simulates creating a PaymentIntent for the deposit (manual authorization only).
 */
export const createDepositPaymentIntent = async (orderId: number, depositAmount: number) => {
    console.log(`[MOCK API] Creating deposit-only PaymentIntent for orderId: ${orderId}, amount: ${depositAmount}`);
    await new Promise(res => setTimeout(res, 500));
    const paymentIntentId = `pi_test_deposit_${Math.random().toString(36).substring(2)}`;
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(2)}`;
    
    // Save the PI to the mock booking
    const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === orderId);
    if(bookingIndex > -1) {
        MOCK_BOOKINGS[bookingIndex].depositPaymentIntentId = paymentIntentId;
    }

    return { clientSecret, paymentIntentId };
};


/**
 * Captures a previously authorized deposit.
 * Used when a dispute is resolved in favor of the hubber.
 */
export const captureDeposit = async (paymentIntentId: string) => {
    console.log(`[MOCK API] Capturing deposit for PaymentIntent: ${paymentIntentId}`);
    // In a real scenario, you'd call your backend which calls Stripe's capture API.
    return Promise.resolve({ success: true, paymentIntentId });
};

/**
 * Cancels a deposit authorization, releasing the funds to the renter.
 */
export const cancelDeposit = async (paymentIntentId: string) => {
    console.log(`[MOCK API] Cancelling deposit authorization for PaymentIntent: ${paymentIntentId}`);
    // In a real scenario, you'd call your backend which calls Stripe's cancel API.
    return Promise.resolve({ success: true, paymentIntentId });
};