

import React, { useState, useMemo } from 'react';
import { BankIcon, PaypalIcon } from './Icons';

type WithdrawalMethod = 'bank' | 'paypal';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onWithdraw: (amount: number, method: WithdrawalMethod, details: { iban?: string; paypalEmail?: string; }) => void;
}


export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, balance, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<WithdrawalMethod>('bank');
  const [iban, setIban] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const numericAmount = parseFloat(amount) || 0;

  const { fee, totalReceived } = useMemo(() => {
    if (numericAmount <= 0) return { fee: 0, totalReceived: 0 };
    let calculatedFee: number;
    if (method === 'bank') {
      calculatedFee = 2;
    } else { // paypal
      calculatedFee = numericAmount * 0.05;
    }
    // Arrotonda al centesimo
    calculatedFee = Math.round(calculatedFee * 100) / 100;
    return { fee: calculatedFee, totalReceived: numericAmount - calculatedFee };
  }, [numericAmount, method]);
  
  const amountError = useMemo(() => {
    // Non mostrare errori se l'input è vuoto o zero
    if (!amount || numericAmount <= 0) return null;

    if (numericAmount > balance) {
      return "L'importo non può superare il saldo disponibile.";
    }
    if (totalReceived < 0) {
      return `L'importo minimo per il prelievo è €${fee.toFixed(2)} a causa delle commissioni.`;
    }
    return null;
  }, [amount, numericAmount, balance, totalReceived, fee]);

  if (!isOpen) return null;

  const isFormValid = numericAmount > 0 && !amountError && (method === 'bank' ? !!iban.trim() : !!paypalEmail.trim());

  const handleWithdraw = () => {
    if (!isFormValid) {
        alert("Per favore, compila correttamente tutti i campi.");
        return;
    }
    
    onWithdraw(numericAmount, method, {
        iban: method === 'bank' ? iban : undefined,
        paypalEmail: method === 'paypal' ? paypalEmail : undefined
    });

    alert(`Richiesta di prelievo inviata. Riceverai €${totalReceived.toFixed(2)} non appena verrà approvata.`);
    onClose();
  };

  const MethodButton: React.FC<{
    type: WithdrawalMethod;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = ({ type, label, icon, description }) => (
    <button
      onClick={() => setMethod(type)}
      className={`flex items-center space-x-4 p-4 rounded-lg border-2 w-full text-left transition-all ${method === type ? 'border-brand-blue bg-teal-50' : 'border-gray-200 hover:border-gray-400'}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Richiedi un Prelievo</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Saldo disponibile</p>
            <p className="text-2xl font-bold">€{balance.toFixed(2)}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Importo da prelevare</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">€</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-7"
              />
            </div>
             {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Metodo di prelievo</label>
            <div className="space-y-3">
              <MethodButton type="bank" label="Bonifico Bancario" icon={<BankIcon />} description="Commissione fissa: 2,00 €" />
              <MethodButton type="paypal" label="PayPal" icon={<PaypalIcon />} description="Commissione: 5% del totale" />
            </div>
          </div>
          
          {method === 'bank' && (
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="IT00 A000 0000 0000 0000 0000 000" className="w-full border border-gray-300 rounded-lg p-2.5" />
            </div>
          )}
          {method === 'paypal' && (
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email PayPal</label>
                <input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg p-2.5" />
            </div>
          )}

          {numericAmount > 0 && !amountError && (
             <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">Importo prelievo</span>
                    <span>€{numericAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Commissione</span>
                    <span>- €{fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Totale che riceverai</span>
                    <span>€{totalReceived.toFixed(2)}</span>
                </div>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={!isFormValid}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Conferma Prelievo
          </button>
        </div>
      </div>
    </div>
  );
};