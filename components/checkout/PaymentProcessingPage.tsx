import React, { useEffect } from 'react';
import { MOCK_BOOKINGS, MOCK_EVENTS } from '../../constants';
import { BookingStatus, DepositBookingStatus } from '../../types';
import type { BookingEvent } from '../../types';

export const PaymentProcessingPage: React.FC = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');
        const method = params.get('method');

        if (!orderId || !method) {
            window.location.href = window.location.origin + window.location.pathname;
            return;
        }

        const bookingId = parseInt(orderId, 10);
        console.log(`[Payment Processing] Simulating payment completion & webhook for order ${bookingId} from ${method}`);

        // This setTimeout simulates the user completing the payment on the 3rd party site AND the webhook arriving at our backend.
        setTimeout(() => {
            const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
            if (bookingIndex > -1 && MOCK_BOOKINGS[bookingIndex].status === BookingStatus.PAYMENT_PENDING) {
                const booking = MOCK_BOOKINGS[bookingIndex];
                
                // 1. Webhook: Payment Success
                console.log(`[Webhook Mock] ${method === 'stripe' ? 'checkout.session.completed' : 'PAYMENT.CAPTURE.COMPLETED'} for order ${bookingId}. Status -> PAYMENT_SUCCEEDED`);
                const paymentSucceededState = BookingStatus.PAYMENT_SUCCEEDED;
                MOCK_BOOKINGS[bookingIndex].status = paymentSucceededState;
                MOCK_BOOKINGS[bookingIndex].rentalPaid = true;

                const paymentEvent: BookingEvent = {
                    bookingId, actorId: booking.renterId, action: 'PAYMENT_SUCCEEDED',
                    oldState: BookingStatus.PAYMENT_PENDING, newState: paymentSucceededState,
                    timestamp: new Date().toISOString(),
                };
                MOCK_EVENTS.push(paymentEvent);

                // 2. Webhook: Deposit Authorization (if applicable)
                if (MOCK_BOOKINGS[bookingIndex].escrowDepositCents > 0) {
                    setTimeout(() => {
                        console.log(`[Webhook Mock] payment_intent.amount_capturable_updated for order ${bookingId}. Status -> DEPOSIT_AUTHORIZED`);
                        const depositAuthorizedState = BookingStatus.DEPOSIT_AUTHORIZED;
                        MOCK_BOOKINGS[bookingIndex].status = depositAuthorizedState;
                        MOCK_BOOKINGS[bookingIndex].depositStatus = DepositBookingStatus.AUTHORIZED;

                        const depositEvent: BookingEvent = {
                            bookingId, actorId: booking.renterId, action: 'DEPOSIT_AUTHORIZED',
                            oldState: paymentSucceededState, newState: depositAuthorizedState,
                            timestamp: new Date().toISOString(),
                        };
                        MOCK_EVENTS.push(depositEvent);
                        
                        // 3. Final Confirmation
                        setTimeout(() => {
                            console.log(`[Webhook Mock] Finalizing order ${bookingId}. Status -> CONFIRMED`);
                            const confirmedState = BookingStatus.CONFIRMED;
                            MOCK_BOOKINGS[bookingIndex].status = confirmedState;

                            const confirmedEvent: BookingEvent = {
                                bookingId, actorId: booking.hubberId, action: 'CONFIRM_BOOKING',
                                oldState: depositAuthorizedState, newState: confirmedState,
                                timestamp: new Date().toISOString(),
                            };
                            MOCK_EVENTS.push(confirmedEvent);
                        }, 1500);
                    }, 2000);
                } else {
                    // No deposit, go straight to confirmed after a short delay
                    setTimeout(() => {
                        console.log(`[Webhook Mock] Finalizing order ${bookingId} (no deposit). Status -> CONFIRMED`);
                        const confirmedState = BookingStatus.CONFIRMED;
                        MOCK_BOOKINGS[bookingIndex].status = confirmedState;
                        
                        const confirmedEvent: BookingEvent = {
                            bookingId, actorId: booking.hubberId, action: 'CONFIRM_BOOKING',
                            oldState: paymentSucceededState, newState: confirmedState,
                            timestamp: new Date().toISOString(),
                        };
                        MOCK_EVENTS.push(confirmedEvent);
                    }, 1500);
                }
            }
        }, 2500); // Simulate processing and webhook delay

        // Redirect user immediately to the success page to start polling.
        const successUrl = `${window.location.origin}${window.location.pathname}?page=checkout-success&orderId=${orderId}`;
        window.location.href = successUrl;

    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
            <div>
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue mx-auto mb-4"></div>
                <h1 className="text-2xl font-bold">Stiamo processando il pagamento in modo sicuro...</h1>
                <p className="text-gray-600">Verrai reindirizzato a breve. Non chiudere questa pagina.</p>
            </div>
        </div>
    );
};