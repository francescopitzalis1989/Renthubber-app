import React, { useEffect, useMemo } from 'react';
import { MOCK_BOOKINGS } from '../../constants';
import { BookingStatus } from '../../types';

export const CheckoutCancelPage: React.FC = () => {
    const orderId = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('orderId');
    }, []);
    
    useEffect(() => {
        if (orderId) {
            const bookingId = parseInt(orderId, 10);
            const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
            if (bookingIndex > -1 && MOCK_BOOKINGS[bookingIndex].status === BookingStatus.PAYMENT_PENDING) {
                MOCK_BOOKINGS[bookingIndex].status = BookingStatus.CANCELLED;
            }
        }
    }, [orderId]);

    const goHome = () => {
        window.location.href = window.location.origin + window.location.pathname;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
                 <div className="text-6xl mb-4">😢</div>
                 <h1 className="text-3xl font-bold mb-2">Pagamento Annullato</h1>
                 <p className="text-gray-600 mb-6">La tua prenotazione non è stata completata. Puoi tornare indietro e riprovare quando vuoi.</p>
                 <button onClick={goHome} className="w-full mt-6 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors">
                    Torna alla Home
                </button>
            </div>
        </div>
    );
};
