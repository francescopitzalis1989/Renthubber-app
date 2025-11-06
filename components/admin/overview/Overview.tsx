

import React from 'react';
import { StatCard } from './StatCard';
import { InboxIcon, CalendarIcon, WalletIcon, UserGroupIcon } from '../../Icons';
import { MOCK_ITEMS, MOCK_BOOKINGS, MOCK_USERS } from '../../../constants';
import { BookingStatus } from '../../../types';

export const Overview: React.FC = () => {
    // Statistiche Generali
    const totalListings = MOCK_ITEMS.length;
    const totalBookings = MOCK_BOOKINGS.length;
    const totalTransactionVolume = MOCK_BOOKINGS.filter(b => b.status === BookingStatus.COMPLETED).reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const totalUsers = MOCK_USERS.length;
    
    // Calcoli per i guadagni della piattaforma Renthubber
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const completedBookings = MOCK_BOOKINGS.filter(b => b.status === BookingStatus.COMPLETED);

    const getRenthubberEarning = (booking: (typeof MOCK_BOOKINGS)[0]) => (booking.renterServiceFee || 0) + (booking.hubberCommission || 0);

    const dailyEarnings = completedBookings
        .filter(b => {
            const endDate = new Date(b.endAt);
            return endDate.getDate() === today && endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
        })
        .reduce((acc, b) => acc + getRenthubberEarning(b), 0);

    const monthlyEarnings = completedBookings
        .filter(b => {
            const endDate = new Date(b.endAt);
            return endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
        })
        .reduce((acc, b) => acc + getRenthubberEarning(b), 0);

    const yearlyEarnings = completedBookings
        .filter(b => {
            const endDate = new Date(b.endAt);
            return endDate.getFullYear() === currentYear;
        })
        .reduce((acc, b) => acc + getRenthubberEarning(b), 0);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Annunci Totali" 
                    value={totalListings.toString()} 
                    icon={<InboxIcon className="w-6 h-6 text-blue-500" />}
                />
                <StatCard 
                    title="Prenotazioni Totali" 
                    value={totalBookings.toString()} 
                    icon={<CalendarIcon className="w-6 h-6 text-green-500" />}
                />
                <StatCard 
                    title="Volume Transato" 
                    value={`€${totalTransactionVolume.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<WalletIcon className="w-6 h-6 text-yellow-500" />}
                />
                <StatCard 
                    title="Utenti Registrati" 
                    value={totalUsers.toString()}
                    icon={<UserGroupIcon className="w-6 h-6 text-purple-500" />}
                />
            </div>

            {/* Sezione Guadagni Piattaforma */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Guadagni Piattaforma</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Oggi" 
                        value={`€${dailyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        icon={<WalletIcon className="w-6 h-6 text-teal-500" />}
                    />
                    <StatCard 
                        title="Questo Mese" 
                        value={`€${monthlyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        icon={<WalletIcon className="w-6 h-6 text-teal-500" />}
                    />
                    <StatCard 
                        title="Quest'Anno" 
                        value={`€${yearlyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        icon={<WalletIcon className="w-6 h-6 text-teal-500" />}
                    />
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mt-12">
                <h3 className="text-lg font-semibold mb-4">Grafico (placeholder)</h3>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Qui verrà visualizzato un grafico delle prenotazioni/guadagni.</p>
                </div>
            </div>
        </div>
    );
};
