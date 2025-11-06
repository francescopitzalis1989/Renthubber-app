
import React, { useState, useMemo } from 'react';
import type { User, Item } from '../types';
import { mockDetailedRatings } from '../constants';
import { Step1, Step2, Step3, Step4, Step5 } from './AddListingSteps';

interface AddListingFlowProps {
  user: User;
  onExit: () => void;
  itemToEdit?: Item | null;
  onSave: (itemData: Item) => void;
}

const STEPS = [
  { id: 1, title: 'Dettagli' },
  { id: 2, title: 'Prezzo' },
  { id: 3, title: 'Regole' },
  { id: 4, title: 'Media' },
  { id: 5, title: 'Anteprima' },
];

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="px-4 sm:px-8">
        <ol className="flex items-center w-full">
            {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                    <li key={step.id} className={`flex w-full items-center ${index !== STEPS.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block " : ''} ${isCompleted ? 'after:border-brand-blue' : 'after:border-gray-200'}`}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: isCurrent || isCompleted ? '#005F6B' : '#E5E7EB', color: 'white' }}>
                           {isCompleted ? (
                             <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/></svg>
                           ) : (
                             <span>{step.id}</span>
                           )}
                        </div>
                    </li>
                );
            })}
        </ol>
    </div>
);


export const AddListingFlow: React.FC<AddListingFlowProps> = ({ user, onExit, itemToEdit, onSave }) => {
  const [step, setStep] = useState(1);
  const [listingData, setListingData] = useState<Partial<Item>>(
    itemToEdit || {
        title: '',
        category: '',
        subcategory: '',
        description: '',
        imageUrls: [],
        location: '',
        price: 0,
        weeklyPrice: undefined,
        monthlyPrice: undefined,
        securityDeposit: undefined,
        unavailableDates: [],
        usageRules: { custom: ''},
        cancellationPolicy: 'Moderata',
        requireId: false,
        deliveryOption: { enabled: false, details: ''},
        videoUrl: '',
        technicalDescription: {},
        condition: 'Usato',
        status: 'Bozza',
    }
  );

  const updateData = (newData: Partial<Item>) => {
    setListingData(prev => ({ ...prev, ...newData }));
  };

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!listingData.title && !!listingData.description && !!listingData.category && !!listingData.location && listingData.imageUrls && listingData.imageUrls.length > 0;
      case 2:
        return listingData.price !== undefined && listingData.price > 0;
      case 3:
      case 4:
        return true; // No strict validation for these steps for now
      default:
        return false;
    }
  }, [step, listingData]);
  
  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);
  
  const handlePublish = (status: 'Attivo' | 'Bozza') => {
      const isEditing = !!itemToEdit;
      
      const baseNewItem: Item = {
          id: Date.now(), // Use timestamp for unique ID in mock
          title: '',
          location: '',
          locationDetails: '',
          price: 0,
          imageUrls: [],
          category: '',
          description: '',
          spaceDescription: '',
          tagline: '',
          maxQuantity: 1,
          owner: {
              name: `${user.firstName} ${user.lastName}`,
              photoUrl: user.avatarUrl,
              isSuperhubber: false,
              yearsHosting: 0,
              reviewCount: 0,
              rating: 0,
              rentalDays: 0,
              responseRate: 100,
              cancellations: 0,
              detailedRatingsCount: {},
          },
          reviewCount: 0,
          detailedRatings: mockDetailedRatings,
          features: [],
          rules: {
              houseRules: { title: 'Regole del proprietario', items: [] },
              safety: { title: 'Sicurezza', items: [] },
              cancellation: { title: 'Cancellazione', items: [listingData.cancellationPolicy || ''] }
          },
      };

      const baseItem = isEditing ? itemToEdit : baseNewItem;
      
      const finalListing: Item = {
          ...baseItem,
          ...listingData,
          status: status,
      };

      onSave(finalListing);
      alert(`Annuncio "${finalListing.title}" ${isEditing ? 'aggiornato' : (status === 'Attivo' ? 'pubblicato' : 'salvato come bozza')} con successo!`);
      onExit();
  };

  const renderStep = () => {
    const props = { data: listingData, updateData };
    switch (step) {
      case 1: return <Step1 {...props} />;
      case 2: return <Step2 {...props} />;
      case 3: return <Step3 {...props} />;
      case 4: return <Step4 {...props} />;
      case 5: return <Step5 data={listingData} goToStep={goToStep} user={user} />;
      default: return <div>Step non trovato</div>;
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-8 border-b">
        <h1 className="text-xl font-bold text-brand-blue">{itemToEdit ? 'Modifica annuncio' : 'Crea un nuovo annuncio'}</h1>
        <button onClick={onExit} className="font-semibold text-sm py-2 px-4 rounded-lg border hover:bg-gray-100">
          Salva ed esci
        </button>
      </header>
      
      <div className="py-6 border-b">
        <ProgressBar currentStep={step} />
      </div>

      <main className="flex-grow overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-8">
            {renderStep()}
        </div>
      </main>

      <footer className="flex-shrink-0 h-20 flex items-center justify-between px-4 sm:px-8 border-t bg-white">
        <button onClick={handleBack} disabled={step === 1} className="font-semibold text-sm py-2 px-6 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          Indietro
        </button>
        {step < STEPS.length ? (
          <button onClick={handleNext} disabled={!isStepValid} className="font-bold text-sm text-white py-2 px-6 rounded-lg bg-brand-blue hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Avanti
          </button>
        ) : (
          <div className="space-x-4">
             <button onClick={() => handlePublish('Bozza')} className="font-semibold text-sm py-2 px-6 rounded-lg border hover:bg-gray-100">
                Salva come bozza
            </button>
             <button onClick={() => handlePublish('Attivo')} className="font-bold text-sm text-white py-2 px-6 rounded-lg bg-brand-blue hover:bg-teal-800">
                Pubblica annuncio
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};
