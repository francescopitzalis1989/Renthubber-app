/**
 * Simulates creating a Stripe Payment Intent.
 * In a real app, this would make a call to your backend,
 * which would then call the Stripe API.
 * An Idempotency-Key header would be used in a real implementation.
 */
const createMockPaymentIntent = (bookingId: number, amountCents: number, captureMethod: 'automatic' | 'manual') => {
    console.log(
        `[API MOCK] Creating PaymentIntent for Booking #${bookingId}`,
        `Amount: ${(amountCents / 100).toFixed(2)}€`,
        `Capture Method: ${captureMethod}`
    );
    // Generate fake but realistic-looking IDs
    const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 24)}`;
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 48)}`;

    return Promise.resolve({ clientSecret, paymentIntentId });
};

/**
 * Crea un PaymentIntent per l'importo del noleggio (pagamento immediato).
 */
export const createRentalPaymentIntent = async (bookingId: number, amountCents: number) => {
    return createMockPaymentIntent(bookingId, amountCents, 'automatic');
};

/**
 * Crea un PaymentIntent per il deposito (sola autorizzazione).
 */
export const createDepositPaymentIntent = async (bookingId: number, amountCents: number) => {
    return createMockPaymentIntent(bookingId, amountCents, 'manual');
};

/**
 * [NUOVO] Simula la creazione di un unico PaymentIntent per noleggio + deposito.
 */
export const createUnifiedPaymentIntent = async (bookingId: number, totalAmountCents: number) => {
    console.log(
        `[API MOCK] Creating UNIFIED PaymentIntent for Booking #${bookingId}`,
        `Total Amount to Authorize: ${(totalAmountCents / 100).toFixed(2)}€`
    );
    return createMockPaymentIntent(bookingId, totalAmountCents, 'manual');
};


/**
 * [NUOVO] Simula la cattura parziale del solo importo del noleggio da un'autorizzazione esistente.
 */
export const captureRentalAmount = async (paymentIntentId: string, rentalAmountCents: number) => {
    console.log(
        `[API MOCK] Partially capturing rental amount for PI: ${paymentIntentId}`,
        `Amount to Capture: ${(rentalAmountCents / 100).toFixed(2)}€`
    );
    return Promise.resolve({ success: true, paymentIntentId });
};


/**
 * Cattura un'autorizzazione di deposito precedentemente creata.
 * Usato in caso di disputa risolta a favore dell'hubber.
 */
export const captureDeposit = async (paymentIntentId: string) => {
    console.log(`[API MOCK] Capturing deposit for PaymentIntent: ${paymentIntentId}`);
    // In a real scenario, you'd call your backend which calls Stripe's capture API.
    return Promise.resolve({ success: true, paymentIntentId });
};

/**
 * Annulla un'autorizzazione di deposito, rilasciando i fondi al renter.
 */
export const cancelDeposit = async (paymentIntentId: string) => {
    console.log(`[API MOCK] Cancelling deposit authorization for PaymentIntent: ${paymentIntentId}`);
    // In a real scenario, you'd call your backend which calls Stripe's cancel API.
    return Promise.resolve({ success: true, paymentIntentId });
};


/**
 * Addebita al renter il costo di un'estensione del noleggio.
 * Simula un addebito e può fallire casualmente per testare la UI.
 */
export const chargeForExtension = async (bookingId: number, renterId: number, amountCents: number): Promise<{ success: boolean; message?: string }> => {
    console.log(`[API MOCK] Charging renter #${renterId} for booking #${bookingId} an amount of ${(amountCents / 100).toFixed(2)}€ for an extension.`);
    
    // Simulate a random failure for testing purposes
    if (Math.random() < 0.1) { // 10% chance of failure
        console.error('[API MOCK] Payment for extension failed!');
        return Promise.resolve({ success: false, message: 'La tua carta è stata rifiutata.' });
    }

    console.log('[API MOCK] Payment for extension successful.');
    return Promise.resolve({ success: true });
};