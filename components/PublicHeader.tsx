import React from 'react';

interface PublicHeaderProps {
  onAuthClick: () => void;
}

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <svg 
      viewBox="0 0 1000 1000" 
      role="img" 
      aria-hidden="true" 
      focusable="false" 
      className="h-8 w-8 text-brand-blue"
    >
      <path 
        d="m499.3 736.7c-51-64-81-120.1-91-178.1-11-64.5 9-122.2 41-168.2 32-46 76-77.1 125-90.1 49-13 99-6 142 18 43 24 77 62.1 98 108.1 21 46 28 97.1 18 147.1-10 50-34 99.1-68 147.1-34 48-77 92.1-128 128.1-51 36-109 54-167 54s-116-18-167-54zm21-356.7c-21 0-41 6-58 18-17 12-31 29.1-40 49.1-9 20-13 42.1-12 64.1.1 22 5 43.1 14 63.1 9 20 23 37.1 40 50.1 17 13 37 20.1 58 20.1 21 0 41-7 58-20.1 17-13 31-30.1 40-50.1 9-20 14-41.1 14-63.1s-5-43.1-14-63.1c-9-20-23-37.1-40-49.1-17-12-37-18-58-18z"
        fill="currentColor"
      ></path>
    </svg>
    <span className="text-2xl font-bold text-brand-blue">renthubber</span>
  </div>
);

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onAuthClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Logo />
        <nav className="flex items-center space-x-2 sm:space-x-4">
            <a href="#" onClick={onAuthClick} className="hidden sm:inline text-sm font-medium text-gray-700 hover:text-brand-blue">Metti a noleggio</a>
            <button 
                onClick={onAuthClick}
                className="font-semibold text-sm bg-brand-blue text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-teal-800 transition-shadow whitespace-nowrap"
            >
                <span className="sm:hidden">Accedi</span>
                <span className="hidden sm:inline">Accedi / Registrati</span>
            </button>
        </nav>
      </div>
    </header>
  );
};
