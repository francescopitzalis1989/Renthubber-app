import React from 'react';
import type { Deposit } from '../../types';

interface DepositDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deposit: Deposit | null;
  onGoToChat: (bookingId: number) => void;
}

export const DepositDetailModal: React.FC<DepositDetailModalProps> = ({ isOpen, onClose, deposit, onGoToChat }) => {
  if (!isOpen || !deposit) return null;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Dettagli Deposito #{deposit.id}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm">
            <strong>Nota:</strong> Il deposito è trattenuto da Renthubber come garanzia; non confluisce nel tuo wallet.
          </div>
          <div className="flex items-center space-x-4">
            <img src={deposit.itemImageUrl} alt={deposit.itemTitle} className="w-24 h-24 object-cover rounded-lg" />
            <div>
              <p className="font-bold">{deposit.itemTitle}</p>
              <p className="text-sm text-gray-500">Noleggiato da:</p>
              <div className="flex items-center space-x-2 mt-1">
                <img src={deposit.renterAvatarUrl} alt={deposit.renterName} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-semibold">{deposit.renterName}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
            <div>
              <p className="text-gray-500">Importo</p>
              <p className="font-semibold text-lg">€{deposit.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500">Stato</p>
              <p className="font-semibold">{deposit.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Data blocco</p>
              <p className="font-semibold">{formatDate(deposit.blockedAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Rilascio stimato</p>
              <p className="font-semibold">{formatDate(deposit.estimatedReleaseAt)}</p>
            </div>
          </div>
        </div>

        <footer className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => onGoToChat(deposit.bookingId)}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Vai alla chat
          </button>
        </footer>
      </div>
    </div>
  );
};
