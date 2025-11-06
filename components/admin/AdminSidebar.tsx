
import React from 'react';
import type { User } from '../../types';
import { ADMIN_DASHBOARD_LINKS } from '../../constants';

interface AdminSidebarProps {
    user: User;
    activeSection: string;
    setActiveSection: (section: string) => void;
    onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, activeSection, setActiveSection, onLogout }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {ADMIN_DASHBOARD_LINKS.map(link => (
                    <button
                        key={link.name}
                        onClick={() => setActiveSection(link.name)}
                        className={`flex items-center w-full space-x-3 p-3 rounded-lg text-sm font-medium transition-colors ${activeSection === link.name ? 'bg-brand-blue text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                    >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full space-x-3 p-3 rounded-lg text-sm font-medium text-gray-300 transition-colors hover:bg-red-900/50 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                    <span>Esci</span>
                </button>
            </div>
        </div>
    );
};
