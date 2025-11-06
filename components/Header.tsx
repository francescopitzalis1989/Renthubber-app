import React, { useState } from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  pageTitle: string;
  actionComponent?: React.ReactNode;
  onMenuClick?: () => void;
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


const UserMenu: React.FC<{ user: User; onLogout: () => void; }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullName = `${user.firstName} ${user.lastName}`;
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 border border-gray-200 rounded-full p-1 pr-3 hover:shadow-md transition-shadow">
          <img src={user.avatarUrl} alt={fullName} className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-sm hidden sm:inline">{fullName}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1 border">
          <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Esci
          </button>
        </div>
      )}
    </div>
  );
};


export const Header: React.FC<HeaderProps> = ({ user, onLogout, pageTitle, actionComponent, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="w-1/3 flex items-center">
           {/* Hamburger Menu for Mobile */}
           {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden mr-2 p-2 rounded-md text-gray-500 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
           )}
           <div className="hidden md:block">
            <Logo />
           </div>
        </div>

        <div className="w-1/3 text-center hidden md:block">
            <h1 className="text-xl font-bold text-gray-800 truncate">{pageTitle}</h1>
        </div>
        
        <div className="w-1/3 flex justify-end items-center space-x-2 sm:space-x-4">
         {actionComponent}
         <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};