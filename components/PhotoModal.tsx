
import React, { useEffect } from 'react';

interface PhotoModalProps {
  imageUrls: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ imageUrls, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {/* Previous Button */}
        <button 
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
          aria-label="Immagine precedente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        {/* Image Display */}
        <div className="relative max-w-4xl max-h-[90vh]">
          <img 
            src={imageUrls[currentIndex]} 
            alt={`Immagine ${currentIndex + 1} di ${imageUrls.length}`}
            className="object-contain w-full h-full rounded-lg"
          />
        </div>
        
        {/* Next Button */}
        <button 
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
          aria-label="Immagine successiva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Close Button & Counter */}
        <div className="absolute top-4 right-4 flex flex-col items-end space-y-2 text-white">
            <button 
                onClick={onClose}
                className="bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                aria-label="Chiudi galleria"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="bg-black bg-opacity-50 text-sm px-3 py-1 rounded-full">
                {currentIndex + 1} / {imageUrls.length}
            </div>
        </div>
      </div>
    </div>
  );
};
