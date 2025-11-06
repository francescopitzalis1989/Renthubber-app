
import React, { useState } from 'react';
import type { Item, Booking } from '../../types';
import { MOCK_USERS, MOCK_BOOKINGS } from '../../constants';
import { BookingStatus, DepositBookingStatus } from '../../types';
import { createUnifiedPaymentIntent, captureRentalAmount } from '../../api/payments';
import { CreditCardIcon, PaypalIcon, KlarnaIcon, CheckCircleIcon } from '../Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  bookingDetails: {
    startDate: string;
    endDate: string;
    totalPrice: number;
    rentalDays: number;
  };
  onBookingSuccess: (newBooking: Booking) => void;
}

type PaymentMethod = 'card' | 'paypal' | 'klarna';

const PaymentMethodSelector: React.FC<{ selected: PaymentMethod; onSelect: (method: PaymentMethod) => void; }> = ({ selected, onSelect }) => {
    const methods = [
        { id: 'card' as PaymentMethod, label: 'Carta', icon: <CreditCardIcon className="w-6 h-6" /> },
        { id: 'paypal' as PaymentMethod, label: 'PayPal', icon: <PaypalIcon className="w-6 h-6" /> },
        { id: 'klarna' as PaymentMethod, label: 'Klarna', icon: <KlarnaIcon className="w-6 h-6" /> },
    ];
    return (
        <div className="flex space-x-2 rounded-lg bg-gray-100 p-1 mb-6">
            {methods.map(method => (
                <button
                    key={method.id}
                    onClick={() => onSelect(method.id)}
                    className={`w-full flex justify-center items-center space-x-2 p-2 rounded-md text-sm font-semibold transition-colors ${selected === method.id ? 'bg-white shadow' : 'text-gray-500 hover:bg-white/50'}`}
                >
                    {method.icon}
                    <span>{method.label}</span>
                </button>
            ))}
        </div>
    );
}

const MockCardForm: React.FC<{ formId: string }> = ({ formId }) => (
    <div className="space-y-4">
        <div>
            <label htmlFor={`cardNumber-${formId}`} className="block text-sm font-medium text-gray-700">Numero di carta</label>
            <input type="text" id={`cardNumber-${formId}`} placeholder="1234 5678 9101 1121" className="w-full mt-1 p-2 border rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor={`expiry-${formId}`} className="block text-sm font-medium text-gray-700">Scadenza</label>
                <input type="text" id={`expiry-${formId}`} placeholder="MM / AA" className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor={`cvc-${formId}`} className="block text-sm font-medium text-gray-700">CVC</label>
                <input type="text" id={`cvc-${formId}`} placeholder="123" className="w-full mt-1 p-2 border rounded-md" />
            </div>
        </div>
    </div>
);

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, item, bookingDetails, onBookingSuccess }) => {
    const [activeMethod, setActiveMethod] = useState<PaymentMethod>('card');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    if (!isOpen) return null;
    
    const renterServiceFee = bookingDetails.totalPrice * 0.05;
    const finalTotal = bookingDetails.totalPrice + renterServiceFee + (item.securityDeposit || 0);


    const handlePayment = async () => {
        setIsLoading(true);
        // Simulate API calls
        await new Promise(res => setTimeout(res, 1500)); // Simulate network latency

        try {
            const totalAmountCents = Math.round(finalTotal * 100);
            const captureAmountCents = Math.round((bookingDetails.totalPrice + renterServiceFee) * 100);

            const pi = await createUnifiedPaymentIntent(Date.now(), totalAmountCents);
            await captureRentalAmount(pi.paymentIntentId, captureAmountCents);

            // FIX: Find hubberId from item owner's photoUrl to satisfy the Booking type requirement.
            const hubber = MOCK_USERS.find(u => u.avatarUrl === item.owner.photoUrl);
            if (!hubber) {
                throw new Error("Could not find a matching hubber for the item.");
            }

            const hubberCommission = bookingDetails.totalPrice * 0.10;
            const hubberNetEarning = bookingDetails.totalPrice - hubberCommission;

            // Create new booking object
            const newBooking: Booking = {
                id: MOCK_BOOKINGS.length + 1,
                renterId: 2, // Assuming current user is renter@renthubber.com
                hubberId: hubber.id,
                item: item,
                startAt: new Date(bookingDetails.startDate).toISOString(),
                endAt: new Date(bookingDetails.endDate).toISOString(),
                dueAt: new Date(bookingDetails.endDate).toISOString(),
                totalPrice: bookingDetails.totalPrice,
                status: BookingStatus.CONFIRMED,
                graceEnabled: true,
                escrowDepositCents: (item.securityDeposit || 0) * 100,
                rentalPaymentIntentId: pi.paymentIntentId,
                depositPaymentIntentId: pi.paymentIntentId, // Same PI for both
                rentalPaid: true,
                depositStatus: DepositBookingStatus.AUTHORIZED,
                renterServiceFee: renterServiceFee,
                hubberCommission: hubberCommission,
                hubberNetEarning: hubberNetEarning,
            };
            
            onBookingSuccess(newBooking);
            setPaymentSuccess(true);

        } catch (error) {
            console.error("Payment simulation failed", error);
            alert("Si è verificato un errore durante il pagamento. Riprova.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSuccessView = () => (
        <div className="p-8 text-center">
             <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold">Prenotazione confermata!</h2>
             <p className="text-gray-600 mt-2">Riceverai un'email di conferma a breve. Puoi gestire la tua prenotazione dalla tua dashboard.</p>
             <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm mt-6 text-left">
                <strong>Nota sul deposito:</strong> Il deposito cauzionale è stato autorizzato sulla tua carta ma non addebitato. Verrà trattenuto da Renthubber e rilasciato automaticamente alla chiusura del noleggio, salvo dispute.
            </div>
             <button onClick={onClose} className="w-full mt-6 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors">
                Ok, ho capito
            </button>
        </div>
    );

    const renderPaymentView = () => (
        <>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
              <img src={item.imageUrls[0]} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
              <div>
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-sm text-gray-500">{bookingDetails.rentalDays} giorni: {new Date(bookingDetails.startDate).toLocaleDateString()} - {new Date(bookingDetails.endDate).toLocaleDateString()}</p>
              </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                  <span>Costo noleggio ({bookingDetails.rentalDays} giorni)</span>
                  <span>€{bookingDetails.totalPrice.toFixed(2)}</span>
              </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">Commissione di servizio (5%)</span>
                  <span className="text-gray-500">+ €{renterServiceFee.toFixed(2)}</span>
              </div>
              {item.securityDeposit && (
                  <div className="flex justify-between">
                      <span>Deposito cauzionale (autorizzato)</span>
                      <span>€{item.securityDeposit.toFixed(2)}</span>
                  </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Totale</span>
                  <span>€{finalTotal.toFixed(2)}</span>
              </div>
          </div>
          
          <PaymentMethodSelector selected={activeMethod} onSelect={setActiveMethod} />

          {activeMethod === 'card' && <MockCardForm formId="main" />}
          {activeMethod === 'paypal' && <p className="text-center text-gray-500 p-8">Verrai reindirizzato a PayPal per completare il pagamento.</p>}
          {activeMethod === 'klarna' && (
              <div>
                  <div className="text-center p-4 rounded-lg bg-pink-50 text-pink-800 mb-4">Paga in 3 comode rate senza interessi con Klarna.</div>
                  <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Passaggio 2: Autorizza il deposito</h3>
                      <p className="text-sm text-gray-500 mb-4">Klarna non supporta i depositi. Inserisci una carta di credito per la sola autorizzazione del deposito cauzionale di €{item.securityDeposit?.toFixed(2)}.</p>
                      <MockCardForm formId="klarna-deposit" />
                  </div>
              </div>
          )}

        </div>

        <footer className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>In elaborazione...</span>
                </>
            ) : `Paga e prenota`}
          </button>
        </footer>
      </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {!paymentSuccess && (
                     <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-bold">Conferma e paga</h2>
                        <button onClick={onClose} disabled={isLoading} className="p-2 rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
               
                <div className="flex-grow overflow-y-auto">
                    {paymentSuccess ? renderSuccessView() : renderPaymentView()}
                </div>
            </div>
        </div>
    );
};
