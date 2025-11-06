import React, { useState, useEffect, useMemo } from 'react';
import type { Booking } from '../../types';
import { BookingStatus } from '../../types';
import { getOrderStatus } from '../../api/stripe';

const getStatusInfo = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.PAYMENT_PENDING:
            return {
                title: 'Pagamento in elaborazione...',
                message: 'Stiamo attendendo la conferma del pagamento da parte del provider. Non chiudere questa pagina.',
                icon: '⏳'
            };
        case BookingStatus.PAYMENT_SUCCEEDED:
            return {
                title: 'Pagamento riuscito!',
                message: 'Stiamo autorizzando il deposito cauzionale sulla tua carta. Questo potrebbe richiedere alcuni secondi.',
                icon: '💳'
            };
        case BookingStatus.DEPOSIT_AUTHORIZED:
             return {
                title: 'Deposito autorizzato!',
                message: 'Stiamo finalizzando gli ultimi dettagli della tua prenotazione.',
                icon: '✨'
            };
        case BookingStatus.CONFIRMED:
            return {
                title: 'Prenotazione confermata!',
                message: 'Tutto è andato a buon fine. Riceverai un\'email con tutti i dettagli. Puoi ora chiudere questa pagina o tornare alla home.',
                icon: '🎉'
            };
        case BookingStatus.PAYMENT_FAILED:
        case BookingStatus.CANCELLED:
             return {
                title: 'Pagamento fallito.',
                message: 'Qualcosa è andato storto durante il processo di pagamento. Per favore, riprova.',
                icon: '❌'
            };
        default:
            return {
                title: 'In attesa...',
                message: 'Stiamo verificando lo stato della tua prenotazione.',
                icon: '...'
            }
    }
}

export const CheckoutSuccessPage: React.FC = () => {
    const [status, setStatus] = useState<BookingStatus | null>(null);
    // FIX: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout
    const pollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const orderId = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('orderId');
    }, []);
    
    useEffect(() => {
        if (!orderId) return;
        const bookingId = parseInt(orderId, 10);

        const pollStatus = async () => {
            const currentStatus = await getOrderStatus(bookingId);
            if (currentStatus) {
                setStatus(currentStatus);
                if ([BookingStatus.CONFIRMED, BookingStatus.PAYMENT_FAILED, BookingStatus.CANCELLED].includes(currentStatus)) {
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                    }
                }
            }
        };

        pollingIntervalRef.current = setInterval(pollStatus, 2000);

        pollStatus(); // Initial check

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [orderId]);

    const info = status ? getStatusInfo(status) : getStatusInfo(BookingStatus.PAYMENT_PENDING);

    const isProcessing = status !== BookingStatus.CONFIRMED && status !== BookingStatus.PAYMENT_FAILED && status !== BookingStatus.CANCELLED;

    const goHome = () => {
        window.location.href = window.location.origin + window.location.pathname;
    }

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold">ID Ordine non trovato.</h1>
                    <button onClick={goHome} className="mt-4 text-brand-blue underline">Torna alla Home</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
                <div className="text-6xl mb-4">{info.icon}</div>
                <h1 className="text-3xl font-bold mb-2">{info.title}</h1>
                <p className="text-gray-600 mb-6">{info.message}</p>
                {isProcessing && (
                     <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue mx-auto"></div>
                )}
                {!isProcessing && (
                    <button onClick={goHome} className="w-full mt-6 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors">
                        Torna alla Home
                    </button>
                )}
            </div>
        </div>
    );
};
