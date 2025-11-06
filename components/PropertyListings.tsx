
import React from 'react';
import { ItemCard } from './PropertyCard';
import type { Item } from '../types';

interface ItemListingsProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  favoritedItemIds: Set<number>;
  onToggleFavorite: (itemId: number) => void;
}

export const ItemListings: React.FC<ItemListingsProps> = ({ items, onItemClick, favoritedItemIds, onToggleFavorite }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800">Nessun risultato trovato</h2>
        <p className="text-gray-500 mt-2">Prova a modificare i termini della ricerca o a selezionare un'altra categoria.</p>
      </div>
    );
  }
  
  return (
    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map(item => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onClick={() => onItemClick(item)}
          isFavorite={favoritedItemIds.has(item.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
