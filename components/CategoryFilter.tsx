
import React from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const categoriesWithAll: Category[] = [{ name: 'Tutte', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg> }, ...CATEGORIES];
  
  return (
    <div className="flex space-x-8 my-6 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categoriesWithAll.map((category) => {
        const isSelected = category.name === selectedCategory;
        return (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`flex flex-col items-center space-y-2 text-gray-500 hover:text-brand-blue flex-shrink-0 transition-all duration-200 pb-2 ${isSelected ? 'text-brand-blue border-b-2 border-brand-blue' : 'border-b-2 border-transparent hover:border-gray-300'}`}
          >
            {React.cloneElement(category.icon as React.ReactElement<any>, { 'aria-label': category.name })}
            <span className="text-xs font-semibold whitespace-nowrap">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};