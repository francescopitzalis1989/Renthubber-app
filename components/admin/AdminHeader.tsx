
import React, { useState } from 'react';
import type { User } from '../../types';

interface AdminHeaderProps {
  user: User;
  onLogout: () => void;
  pageTitle: string;
  onMenuClick: () => void;
}

const UserMenu: React.FC<{ user: User; onLogout: () => void; }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullName = `${user.firstName} ${user.lastName}`;
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
          <img src={user.avatarUrl} alt={fullName} className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-sm hidden sm:inline">{fullName}</span>
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

export const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onLogout, pageTitle, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center">
           <button onClick={onMenuClick} className="md:hidden mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
           <h1 className="text-xl font-bold text-gray-800 truncate">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar Placeholder */}
          <div className="relative hidden md:block">
            <input type="text" placeholder="Cerca..." className="w-64 p-2 border rounded-lg pl-10" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </div>
          </div>
         <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};
