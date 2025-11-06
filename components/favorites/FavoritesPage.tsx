
import React from 'react';
import type { Item } from '../../types';
import { ItemCard } from '../PropertyCard';

interface FavoritesPageProps {
  items: Item[];
  favoritedItemIds: Set<number>;
  onToggleFavorite: (itemId: number) => void;
  onItemClick: (item: Item) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ items, favoritedItemIds, onToggleFavorite, onItemClick }) => {
  const favoritedItems = items.filter(item => favoritedItemIds.has(item.id));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">I tuoi preferiti</h2>
      {favoritedItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mx-auto w-16 h-16 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">Nessun preferito ancora</h3>
          <p className="mt-1 text-sm text-gray-500">Clicca sul cuore sugli annunci per salvarli qui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritedItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
              isFavorite={true} // It's always true on this page
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
