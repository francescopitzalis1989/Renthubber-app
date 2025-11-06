
import React, { useState } from 'react';
import type { Booking, UserRole, DisputeType } from '../../types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (disputeData: {
    bookingId: number;
    openedBy: UserRole;
    disputeType: DisputeType;
    description: string;
    requestedAmount?: number;
    mediaUrls?: string[];
  }) => void;
  booking: Booking;
  userRole: UserRole;
}

const DISPUTE_TYPES: DisputeType[] = ['Danno', 'Mancata restituzione', 'Ritardo', 'Altro'];
const MIN_DESC_LENGTH = 20;

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, onSubmit, booking, userRole }) => {
  const [disputeType, setDisputeType] = useState<DisputeType | ''>('');
  const [description, setDescription] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  if (!isOpen) return null;

  const isFormValid = disputeType && description.length >= MIN_DESC_LENGTH && declarationChecked;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const amount = parseFloat(requestedAmount);
    // In a real app, you would upload the file and get a URL. Here we mock it.
    const mediaUrls = mediaFile ? [`https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`] : undefined;

    onSubmit({
      bookingId: booking.id,
      openedBy: userRole,
      disputeType: disputeType as DisputeType,
      description,
      requestedAmount: isNaN(amount) ? undefined : amount,
      mediaUrls,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Apri una contestazione</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">Stai aprendo una contestazione per il noleggio di <strong>{booking.item.title}</strong>. Il nostro team di supporto interverrà per mediare.</p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo della contestazione</label>
              <div className="grid grid-cols-2 gap-2">
                {DISPUTE_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDisputeType(type)}
                    className={`p-3 rounded-lg border text-sm text-left ${disputeType === type ? 'border-brand-blue bg-teal-50 font-semibold' : 'hover:border-gray-400'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="requestedAmount" className="block text-sm font-semibold text-gray-700 mb-1">Importo richiesto (€) <span className="text-xs font-normal text-gray-500">(Opzionale)</span></label>
              <input
                id="requestedAmount"
                type="number"
                value={requestedAmount}
                onChange={e => setRequestedAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5"
                placeholder="Es. 50.00"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Descrivi il problema</label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5"
                placeholder={`Descrivi in dettaglio l'accaduto (min. ${MIN_DESC_LENGTH} caratteri)`}
              />
              <p className={`text-xs text-right mt-1 ${description.length < MIN_DESC_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                {description.length}/{MIN_DESC_LENGTH}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Carica prove (foto/documenti)</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-brand-blue">
                <label htmlFor="media-upload" className="cursor-pointer">
                  <p className="font-semibold text-brand-blue">
                    {mediaFile ? `File selezionato: ${mediaFile.name}` : 'Clicca per caricare'}
                  </p>
                  <p className="text-xs text-gray-500">Opzionale, max 10MB</p>
                </label>
                <input type="file" id="media-upload" className="hidden" onChange={e => setMediaFile(e.target.files ? e.target.files[0] : null)} />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="declaration"
                type="checkbox"
                checked={declarationChecked}
                onChange={e => setDeclarationChecked(e.target.checked)}
                className="h-4 w-4 text-brand-blue border-gray-300 rounded mt-1"
              />
              <label htmlFor="declaration" className="ml-2 text-sm text-gray-600">
                Dichiaro che le informazioni fornite sono veritiere e corrette.
              </label>
            </div>
          </div>
        </form>

        <footer className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Invia contestazione
          </button>
        </footer>
      </div>
    </div>
  );
};
