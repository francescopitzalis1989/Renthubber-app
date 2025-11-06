
import React from 'react';
import type { Item } from '../types';
import { HeartIcon } from './Icons';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, isFavorite, onToggleFavorite }) => {

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the modal from opening when clicking the heart
    onToggleFavorite(item.id);
  };

  return (
    <div onClick={onClick} className="cursor-pointer group w-64 sm:w-72 flex-shrink-0">
      <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 relative">
        <img 
          src={item.imageUrls[0]} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors duration-200 
                ${isFavorite ? 'bg-brand-blue/80 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
            aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
            <HeartIcon isFilled={isFavorite} className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div className="text-sm">
          <h3 className="font-semibold text-gray-800">{item.location}</h3>
          <p className="text-gray-500">{item.title}</p>
          <p className="mt-1"><span className="font-semibold text-gray-800">€{item.price}</span> / giorno</p>
        </div>
        <div className="flex items-center space-x-1 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-800">
            <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.305-.772 1.626 0l1.838 4.442a.66.66 0 00.496.363l4.897.712c.813.118 1.138 1.116.547 1.702l-3.543 3.453a.659.659 0 00-.19.582l.837 4.878c.14.81-.71.144-1.442-.375l-4.38-2.302a.66.66 0 00-.616 0L5.135 18.66c-.732.519-1.582.455-1.442-.375l.837-4.878a.659.659 0 00-.19-.582L.797 9.803c-.59-.586-.266-1.584.547-1.702l4.897-.712a.66.66 0 00.496-.363l1.838-4.442z" clipRule="evenodd" />
          </svg>
          <span>{item.detailedRatings.overall.toFixed(2)}</span>
          <span className="text-gray-400">({item.reviewCount})</span>
        </div>
      </div>
    </div>
  );
};
