import React from 'react';
import type { UserRole, ChatTab } from '../../types';

interface ChatTabsProps {
  role: UserRole;
  active: ChatTab;
  counts: Record<ChatTab, number>;
  onChange: (tab: ChatTab) => void;
}

const TABS_CONFIG: { id: ChatTab; label: string; roles: UserRole[] }[] = [
    { id: 'all', label: 'Tutti', roles: ['hubber', 'renter'] },
    { id: 'listings', label: 'Annunci', roles: ['hubber'] },
    { id: 'rentals', label: 'Noleggi', roles: ['hubber'] },
    { id: 'bookings', label: 'Prenotazioni', roles: ['hubber', 'renter'] },
    { id: 'support', label: 'Supporto', roles: ['hubber', 'renter'] },
];

export const ChatTabs: React.FC<ChatTabsProps> = ({ role, active, counts, onChange }) => {

    const tabsToShow = TABS_CONFIG.filter(tab => tab.roles.includes(role));

    return (
        <div className="flex space-x-2 overflow-x-auto pb-1 -mx-2 px-2 pt-2">
            {tabsToShow.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0
                        ${active === tab.id 
                            ? 'bg-brand-blue text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`
                    }
                >
                    <span>{tab.label}</span>
                    {counts[tab.id] > 0 && (
                        <span className={`absolute -top-1 -right-1 flex justify-center items-center w-5 h-5 text-xs font-bold rounded-full
                            ${active === tab.id
                                ? 'bg-white text-brand-blue'
                                : 'bg-brand-blue text-white'
                            }`
                        }>
                            {counts[tab.id]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};