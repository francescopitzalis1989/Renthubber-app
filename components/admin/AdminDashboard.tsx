import React, { useState } from 'react';
import type { User } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Overview } from './overview/Overview';
import { ListingsManagement } from './listings/ListingsManagement';
import { UsersManagement } from './users/UsersManagement';
import { BookingsManagement } from './bookings/BookingsManagement';
import Payments from './placeholders/Payments';
import Disputes from './placeholders/Disputes';
import AdminSettings from './placeholders/Settings';
import ReviewsManagement from './placeholders/ReviewsManagement';
import Catalog from './placeholders/Catalog';
import Coupons from './placeholders/Coupons';
import Content from './placeholders/Content';
import AutomatedEmails from './placeholders/Notifications';
import Reports from './placeholders/Reports';
import AuditLogs from './placeholders/AuditLogs';
import { AdminChatInterface } from './chat/AdminChatInterface';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onUserUpdate }) => {
    const [activeSection, setActiveSection] = useState('Panoramica');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSetActiveSection = (section: string) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'Panoramica': return <Overview />;
            case 'Annunci': return <ListingsManagement />;
            case 'Utenti': return <UsersManagement adminUser={user} onUserUpdate={onUserUpdate} />;
            case 'Prenotazioni': return <BookingsManagement />;
            case 'Richieste di Payout': return <Payments />;
            case 'Dispute & Ticket': return <Disputes />;
            case 'Chat': return <AdminChatInterface adminUser={user} />;
            case 'Recensioni': return <ReviewsManagement />;
            case 'Catalogo': return <Catalog />;
            case 'Coupon': return <Coupons />;
            case 'Contenuti (CMS)': return <Content />;
            case 'Email Automatiche': return <AutomatedEmails />;
            case 'Report': return <Reports />;
            case 'Impostazioni': return <AdminSettings />;
            case 'Log & Audit': return <AuditLogs />;
            default: return <Overview />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-64 bg-gray-800 text-white h-full">
                    <AdminSidebar user={user} activeSection={activeSection} setActiveSection={handleSetActiveSection} onLogout={onLogout} />
                </div>
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex-shrink-0 hidden md:flex">
                <AdminSidebar user={user} activeSection={activeSection} setActiveSection={handleSetActiveSection} onLogout={onLogout} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader 
                    user={user} 
                    onLogout={onLogout}
                    pageTitle={activeSection}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};