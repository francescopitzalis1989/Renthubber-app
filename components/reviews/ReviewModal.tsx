import React, { useState } from 'react';
import type { Booking } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  booking: Booking;
}

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    className="text-4xl transition-transform transform hover:scale-125"
                >
                    <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                </button>
            ))}
        </div>
    );
};

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, booking }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        alert("Per favore, seleziona una valutazione a stelle.");
        return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Lascia una recensione</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">Stai recensendo il noleggio di <strong>{booking.item.title}</strong>.</p>
            
            <div className="mb-6">
                 <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Valutazione complessiva</label>
                 <StarRating rating={rating} setRating={setRating} />
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-1">Il tuo commento</label>
              <textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-2.5"
                placeholder={`Com'è stata la tua esperienza?`}
              />
            </div>
          </div>
        </form>

        <footer className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Invia recensione
          </button>
        </footer>
      </div>
    </div>
  );
};