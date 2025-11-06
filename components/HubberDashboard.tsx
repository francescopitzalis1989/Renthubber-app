

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { User, Item, Review, BillingInfo, Booking, Withdrawal } from '../types';
import { Header } from './Header';
import { HUBBER_DASHBOARD_LINKS, MOCK_ALL_REVIEWS, MOCK_USERS, MOCK_THREADS, MOCK_ITEMS, MOCK_WITHDRAWALS, MOCK_BOOKINGS } from '../constants';
import { PlusIcon, WalletIcon, InboxIcon, ChatBubbleLeftRightIcon, StarIcon } from './Icons';
import { ChatInterface } from './ChatInterface';
import { WithdrawalModal } from './WithdrawalModal';
import { AddListingFlow } from './AddListingFlow';
import { BookingStatus, DepositBookingStatus } from '../types';
import { DepositsPage } from './deposits/DepositsPage';
import { BookingsList } from './bookings/BookingsList';
import { ReviewModal } from './reviews/ReviewModal';

interface HubberDashboardProps {
  user: User;
  bookings: Booking[];
  onLogout: () => void;
  onSwitchRole: () => void;
}

const StatCard: React.FC<{ 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    change?: string; 
    changeType?: 'increase' | 'decrease';
    periodSelector?: React.ReactNode;
}> = ({ title, value, icon, change, changeType, periodSelector }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-start space-x-4">
        <div className="bg-teal-100 text-brand-blue p-3 rounded-full flex-shrink-0 mt-1">
            {icon}
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                {periodSelector}
            </div>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
                <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {change} vs. periodo precedente
                </p>
            )}
        </div>
    </div>
);

const PeriodSelector: React.FC<{
  period: string;
  setPeriod: (period: string) => void;
}> = ({ period, setPeriod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const periods = {
    'current_month': 'Questo mese',
    'last_month': 'Mese scorso',
    'current_year': 'Quest\'anno',
    'last_year': 'Anno scorso',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const selectPeriod = (p: string) => {
    setPeriod(p);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-800">
        <span>{periods[period as keyof typeof periods]}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-20 py-1 border"
        >
          {Object.entries(periods).map(([key, value]) => (
            <button
              key={key}
              onClick={() => selectPeriod(key)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const RecentRequests: React.FC<{bookings: Booking[]}> = ({bookings}) => {
    const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING).slice(0, 3);
    const usersMap = useMemo(() => new Map(MOCK_USERS.map(user => [user.id, user])), []);

    if (pendingBookings.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-center text-center text-gray-500 min-h-[150px] lg:min-h-full">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <p className="mt-2 text-sm">Nessuna richiesta in sospeso.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-4">Richieste Recenti</h3>
            <ul className="space-y-4">
                {pendingBookings.map((booking) => {
                    const renter = usersMap.get(booking.renterId);
                    if (!renter) return null;
                    return (
                        <li key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <img src={renter.avatarUrl} alt={renter.firstName} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-sm">{renter.firstName} {renter.lastName}</p>
                                    <p className="text-xs text-gray-500">ha richiesto "{booking.item.title}"</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 self-end sm:self-center">
                                <button className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">Approva</button>
                                <button className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200">Rifiuta</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

const LatestMessages: React.FC<{ setActiveSection: (section: string) => void; }> = ({ setActiveSection }) => {
    const unreadThreads = MOCK_THREADS.filter(t => t.isUnread).slice(0, 3);
    
    if (unreadThreads.length === 0) {
        return (
             <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-center text-center text-gray-500 min-h-[150px] lg:min-h-full">
                <div>
                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2 text-sm">Nessun nuovo messaggio.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Ultimi Messaggi</h3>
                <button onClick={() => setActiveSection('Messaggi e richieste')} className="text-sm font-semibold text-brand-blue hover:underline">Vedi tutti</button>
            </div>
            <ul className="space-y-4">
                {unreadThreads.map(thread => {
                    const lastMessage = thread.messages[thread.messages.length - 1];
                    return (
                        <li key={thread.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setActiveSection('Messaggi e richieste')}>
                            <img src={thread.participant.avatarUrl} alt={thread.participant.name} className="w-10 h-10 rounded-full" />
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-sm truncate">{thread.participant.name}</p>
                                    <p className="text-xs text-gray-400 flex-shrink-0">{lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'}) : ''}</p>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{lastMessage?.text}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

const DashboardView: React.FC<{ user: User; setActiveSection: (section: string) => void; bookings: Booking[]; }> = ({ user, setActiveSection, bookings }) => {
    const MOCK_EARNINGS = {
        'current_month': { value: 845, change: '+15.2%', type: 'increase' as const },
        'last_month': { value: 733.50, change: '-5.1%', type: 'decrease' as const },
        'current_year': { value: 9870, change: '+45.8%', type: 'increase' as const },
        'last_year': { value: 6770, change: '+22.0%', type: 'increase' as const },
    };

    const [earningsPeriod, setEarningsPeriod] = useState('current_month');
    const currentEarnings = MOCK_EARNINGS[earningsPeriod as keyof typeof MOCK_EARNINGS];
    
    return (
        <>
            <p className="text-2xl font-bold mb-2">Bentornato nel tuo hub, {user.firstName}!</p>
            <p className="text-gray-500 mb-8">Ecco un riepilogo della tua attività recente.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Guadagni" 
                    value={`€${currentEarnings.value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    icon={<WalletIcon className="w-6 h-6"/>} 
                    change={currentEarnings.change} 
                    changeType={currentEarnings.type}
                    periodSelector={<PeriodSelector period={earningsPeriod} setPeriod={setEarningsPeriod} />}
                />
                <StatCard title="Annunci Attivi" value="12" icon={<InboxIcon className="w-6 h-6"/>} />
                <StatCard title="Richieste Ricevute" value="8" icon={<ChatBubbleLeftRightIcon className="w-6 h-6"/>} />
                <StatCard title="Valutazione Media" value="4.94" icon={<StarIcon className="w-6 h-6"/>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentRequests bookings={bookings}/>
                <LatestMessages setActiveSection={setActiveSection} />
            </div>
        </>
    );
};

const ListingRow: React.FC<{ item: Item, onAction: (action: 'edit' | 'duplicate' | 'delete', item: Item) => void }> = ({ item, onAction }) => {
    const statusMap: { [key: string]: string } = {
        'Attivo': 'bg-green-100 text-green-800',
        'Bozza': 'bg-yellow-100 text-yellow-800',
        'In revisione': 'bg-blue-100 text-blue-800',
    };
    const status = item.status || 'Attivo';

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-4">
                <div className="flex items-center space-x-4">
                    <img src={item.imageUrls[0]} alt={item.title} className="w-16 h-12 object-cover rounded-md" />
                    <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 text-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>
                    {status}
                </span>
            </td>
            <td className="p-4 text-center font-medium">€{item.price}</td>
            <td className="p-4 text-center">{(Math.random() * 1000).toFixed(0)}</td>
            <td className="p-4 text-right">
                <div className="flex justify-end space-x-2">
                    <button onClick={() => onAction('edit', item)} className="text-sm font-medium text-brand-blue hover:underline">Modifica</button>
                    <button onClick={() => onAction('duplicate', item)} className="text-sm font-medium text-gray-600 hover:underline">Duplica</button>
                    <button onClick={() => onAction('delete', item)} className="text-sm font-medium text-red-600 hover:underline">Elimina</button>
                </div>
            </td>
        </tr>
    );
};

const ListingCard: React.FC<{item: Item, onAction: (action: 'edit' | 'duplicate' | 'delete', item: Item) => void}> = ({item, onAction}) => {
    const statusMap: { [key: string]: string } = {
        'Attivo': 'bg-green-100 text-green-800',
        'Bozza': 'bg-yellow-100 text-yellow-800',
        'In revisione': 'bg-blue-100 text-blue-800',
    };
    const status = item.status || 'Attivo';

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center space-x-4">
                <img src={item.imageUrls[0]} alt={item.title} className="w-16 h-12 object-cover rounded-md" />
                <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.location}</p>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Stato:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>{status}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Prezzo/giorno:</span>
                <span className="font-medium">€{item.price}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Visualizzazioni:</span>
                <span>{(Math.random() * 1000).toFixed(0)}</span>
            </div>
            <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
                <button onClick={() => onAction('edit', item)} className="text-sm font-medium text-brand-blue hover:underline">Modifica</button>
                <button onClick={() => onAction('duplicate', item)} className="text-sm font-medium text-gray-600 hover:underline">Duplica</button>
                <button onClick={() => onAction('delete', item)} className="text-sm font-medium text-red-600 hover:underline">Elimina</button>
            </div>
        </div>
    );
}

const MyListings: React.FC<{onEdit: (item: Item) => void, items: Item[], onItemsChange: (items: Item[]) => void}> = ({ onEdit, items, onItemsChange }) => {
    
    const handleAction = (action: 'edit' | 'duplicate' | 'delete', item: Item) => {
        if (action === 'edit') {
            onEdit(item);
        } else if (action === 'duplicate') {
            const newItem = { ...item, id: Math.max(...items.map(i => i.id)) + 1, title: `${item.title} (Copia)`, status: 'Bozza' as const };
            onItemsChange([newItem, ...items]);
            alert('Annuncio duplicato!');
        } else if (action === 'delete') {
            if (window.confirm(`Sei sicuro di voler eliminare l'annuncio "${item.title}"?`)) {
                onItemsChange(items.filter(i => i.id !== item.id));
                alert('Annuncio eliminato!');
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">I miei annunci</h2>
            </div>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                 {items.map(item => <ListingCard key={item.id} item={item} onAction={handleAction} />)}
            </div>
            {/* Desktop View */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="p-4 font-semibold">Annuncio</th>
                            <th className="p-4 font-semibold text-center">Stato</th>
                            <th className="p-4 font-semibold text-center">Prezzo/giorno</th>
                            <th className="p-4 font-semibold text-center">Visualizzazioni</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => <ListingRow key={item.id} item={item} onAction={handleAction}/>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Wallet: React.FC<{ 
    user: User; 
    bookings: Booking[]; 
    withdrawals: Withdrawal[];
    onAddTestFunds: () => void; 
    onWithdraw: (amount: number, method: 'bank' | 'paypal', details: { iban?: string; paypalEmail?: string; }) => void;
}> = ({ user, bookings, withdrawals, onAddTestFunds, onWithdraw }) => {
    const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

    const hubberBookings = useMemo(() => bookings.filter(b => b.hubberId === user.id), [user.id, bookings]);

    const totalEarnings = useMemo(() => 
        hubberBookings
            .filter(b => b.status === BookingStatus.COMPLETED)
            .reduce((acc, b) => acc + (b.hubberNetEarning || 0), 0)
    , [hubberBookings]);
    
    const totalWithdrawn = useMemo(() => 
        withdrawals
            .filter(w => w.hubberId === user.id && w.status === 'completed')
            .reduce((acc, w) => acc + w.amount, 0)
    , [withdrawals, user.id]);

    const pendingWithdrawals = useMemo(() =>
        withdrawals
            .filter(w => w.hubberId === user.id && w.status === 'pending')
            .reduce((acc, w) => acc + w.amount, 0)
    , [withdrawals, user.id]);
    
    const availableBalance = totalEarnings - totalWithdrawn - pendingWithdrawals;
    
    const pendingBalance = 380.00; // Placeholder
    
    const transactions = useMemo(() => {
        const earnings = hubberBookings
            .filter(b => b.status === BookingStatus.COMPLETED)
            .map(b => ({
                id: `B-${b.id}`,
                date: b.endAt,
                description: `Guadagno da "${b.item.title}"`,
                amount: b.hubberNetEarning || 0,
                type: 'credit' as const,
                status: 'completed' as Withdrawal['status'] | 'completed',
            }));
        
        const userWithdrawals = withdrawals
            .filter(w => w.hubberId === user.id)
            .map(w => ({
                id: `W-${w.id}`,
                date: w.timestamp,
                description: `Prelievo su ${w.method === 'bank' ? 'conto bancario' : 'PayPal'}`,
                amount: -w.amount,
                type: 'debit' as const,
                status: w.status,
            }));
        
        return [...earnings, ...userWithdrawals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    }, [hubberBookings, withdrawals, user.id]);

    const statusInfo = {
        pending: { text: 'In attesa', className: 'bg-yellow-100 text-yellow-800' },
        completed: { text: 'Completato', className: 'bg-green-100 text-green-800' },
        failed: { text: 'Fallito', className: 'bg-red-100 text-red-800' },
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Guadagni e Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Saldo Disponibile</h3>
                    <p className="text-4xl font-bold text-brand-blue my-2">€ {availableBalance.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <button 
                        onClick={() => setWithdrawalModalOpen(true)}
                        disabled={availableBalance <= 0}
                        className="w-full bg-brand-blue text-white font-bold py-2.5 rounded-lg hover:bg-teal-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        Richiedi Prelievo
                    </button>
                     <button 
                        onClick={onAddTestFunds}
                        className="w-full mt-2 bg-yellow-400 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-500 transition-colors">
                        Aggiungi 100€ (Test)
                    </button>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Pagamenti in Sospeso (Escrow)</h3>
                    <p className="text-4xl font-bold text-gray-600 my-2">€ {pendingBalance.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-sm text-gray-500">Saranno disponibili al termine dei noleggi.</p>
                </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Cronologia Transazioni</h3>
            <div className="bg-white rounded-xl border">
                {transactions.length > 0 ? (
                    <ul className="divide-y">
                        {transactions.map(t => (
                            <li key={t.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${t.type === 'credit' ? 'text-green-600' : 'text-gray-800'}`}>
                                        {t.type === 'credit' ? '+' : ''}€{t.amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    {t.type === 'debit' && (
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo[t.status].className}`}>
                                            {statusInfo[t.status].text}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center p-8 text-sm text-gray-500">Nessuna transazione da mostrare.</p>
                )}
            </div>

            <WithdrawalModal 
                isOpen={isWithdrawalModalOpen}
                onClose={() => setWithdrawalModalOpen(false)}
                balance={availableBalance}
                onWithdraw={onWithdraw}
            />
        </div>
    );
};

const Reviews: React.FC<{user: User}> = ({user}) => {
    const reviewsReceived = MOCK_ALL_REVIEWS.filter(r => r.revieweeId === user.id);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Recensioni Ricevute</h2>
             {reviewsReceived.length === 0 ? (
                <p className="text-center mt-4 text-sm text-gray-500">Non hai ancora ricevuto nessuna recensione.</p>
             ) : (
                <div className="space-y-6">
                    {reviewsReceived.map(review => (
                        <div key={review.id} className="bg-white p-4 rounded-xl border">
                            <div className="flex items-start space-x-4">
                                <img src={review.userPhotoUrl} alt={review.userName} className="w-12 h-12 rounded-full" />
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-semibold">{review.userName}</h4>
                                        <div className="flex">
                                            {[...Array(review.rating)].map((_, i) => '⭐')}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleDateString('it-IT')}</p>
                                    <p className="mt-2 text-gray-700">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
    );
};

const Settings: React.FC<{ user: User; }> = ({ user }) => {
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [billingInfo, setBillingInfo] = useState<BillingInfo>(user.billingInfo || {
        billingType: 'Privato',
        address: '',
        city: '',
        zipCode: '',
        country: 'Italia',
        taxCode: '',
        companyName: '',
        vatNumber: '',
        sdiCode: '',
    });
    const [idFile, setIdFile] = useState<File | null>(null);

    const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("Il file è troppo grande. La dimensione massima è 5MB.");
                return;
            }
            setIdFile(file);
        }
    };

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
    };

    const handleBillingTypeChange = (type: 'Privato' | 'Azienda') => {
        setBillingInfo(prev => ({
            ...prev,
            billingType: type
        }));
    };

    const fullName = `${user.firstName} ${user.lastName}`;
    const formattedDateOfBirth = new Date(user.dateOfBirth).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const VerifiedBadge: React.FC = () => (
         <div className="flex items-center space-x-2 bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
            <span>Utente Verificato</span>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Impostazioni Profilo</h2>
            <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-start sm:items-center space-x-4 mb-8 pb-8 border-b flex-col sm:flex-row">
                    <img src={user.avatarUrl} alt={fullName} className="w-24 h-24 rounded-full" />
                    <div className="mt-4 sm:mt-0">
                        <h3 className="text-2xl font-bold">{fullName}</h3>
                        <p className="text-gray-500">{user.email}</p>
                         {user.isVerified && <div className="mt-2"><VerifiedBadge /></div>}
                    </div>
                </div>

                {/* Informazioni Personali */}
                <div className="mb-8">
                    <h4 className="text-lg font-bold mb-4">Informazioni Personali</h4>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Nome</label>
                                <input type="text" value={user.firstName} disabled className="w-full mt-1 p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-500">Cognome</label>
                                <input type="text" value={user.lastName} disabled className="w-full mt-1 p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Data di nascita</label>
                            <input type="text" value={formattedDateOfBirth} disabled className="w-full md:w-1/2 mt-1 p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefono</label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                        </div>
                        <div className="text-right">
                             <button onClick={() => alert('Informazioni salvate!')} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-800 transition-colors">Salva modifiche</button>
                        </div>
                    </div>
                </div>
                
                {/* Modifica Password */}
                <div className="mb-8 pt-8 border-t">
                     <h4 className="text-lg font-bold mb-4">Modifica Password</h4>
                     <div className="space-y-4">
                        <input type="password" placeholder="Password attuale" className="w-full md:w-1/2 p-2 border rounded-md" />
                        <input type="password" placeholder="Nuova password" className="w-full md:w-1/2 p-2 border rounded-md" />
                        <input type="password" placeholder="Conferma nuova password" className="w-full md:w-1/2 p-2 border rounded-md" />
                         <div className="text-right">
                             <button onClick={() => alert('Password cambiata!')} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">Cambia password</button>
                        </div>
                     </div>
                </div>

                 {/* Verifica Identità */}
                <div className="pt-8 border-t">
                     <h4 className="text-lg font-bold mb-2">Verifica Identità</h4>
                     {user.isVerified ? (
                        <div className="flex items-center space-x-2 text-green-700">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                           <p className="text-sm font-semibold">Il tuo profilo è già stato verificato. Grazie!</p>
                        </div>
                     ) : idFile ? (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            <div>
                                <p className="font-semibold">Documento in fase di revisione</p>
                                <p>File caricato: <strong>{idFile.name}</strong>. Ti avviseremo non appena la verifica sarà completata.</p>
                            </div>
                        </div>
                     ) : (
                        <div>
                            <p className="text-sm text-gray-600 mb-4">Aumenta l'affidabilità del tuo profilo. Carica una foto del tuo documento d'identità. Il documento sarà visibile solo all'amministrazione.</p>
                             <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-brand-blue hover:bg-teal-50 transition-colors">
                                <label htmlFor="id-upload" className="cursor-pointer">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto w-10 h-10 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" /></svg>
                                    <p className="mt-2 font-semibold text-brand-blue">Clicca per caricare un file</p>
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG (max 5MB)</p>
                                </label>
                                <input type="file" id="id-upload" className="hidden" onChange={handleIdUpload} accept=".pdf,.png,.jpg,.jpeg"/>
                            </div>
                        </div>
                     )}
                </div>

                 {/* Informazioni per la Fatturazione */}
                 <div className="pt-8 border-t">
                    <h4 className="text-lg font-bold mb-4">Informazioni per la Fatturazione</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo di Profilo</label>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => handleBillingTypeChange('Privato')}
                                    className={`p-4 rounded-lg border w-full text-left transition-colors ${billingInfo.billingType === 'Privato' ? 'border-brand-blue bg-teal-50' : 'hover:border-gray-400'}`}
                                >
                                    <span className="font-semibold">👤 Privato</span>
                                    <p className="text-xs text-gray-500">Per persone fisiche.</p>
                                </button>
                                <button
                                    onClick={() => handleBillingTypeChange('Azienda')}
                                    className={`p-4 rounded-lg border w-full text-left transition-colors ${billingInfo.billingType === 'Azienda' ? 'border-brand-blue bg-teal-50' : 'hover:border-gray-400'}`}
                                >
                                    <span className="font-semibold">🏢 Azienda</span>
                                    <p className="text-xs text-gray-500">Per società o ditte individuali.</p>
                                </button>
                            </div>
                        </div>

                        {billingInfo.billingType === 'Privato' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Codice Fiscale</label>
                                    <input type="text" name="taxCode" value={billingInfo.taxCode || ''} onChange={handleBillingChange} className="w-full md:w-1/2 mt-1 p-2 border rounded-md" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome Azienda</label>
                                    <input type="text" name="companyName" value={billingInfo.companyName || ''} onChange={handleBillingChange} className="w-full mt-1 p-2 border rounded-md" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Partita IVA</label>
                                        <input type="text" name="vatNumber" value={billingInfo.vatNumber || ''} onChange={handleBillingChange} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Codice SDI / PEC</label>
                                        <input type="text" name="sdiCode" value={billingInfo.sdiCode || ''} onChange={handleBillingChange} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Common Address Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Indirizzo di Fatturazione</label>
                            <input type="text" name="address" value={billingInfo.address || ''} onChange={handleBillingChange} placeholder="Via, Piazza, ecc." className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Città</label>
                                <input type="text" name="city" value={billingInfo.city || ''} onChange={handleBillingChange} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CAP</label>
                                <input type="text" name="zipCode" value={billingInfo.zipCode || ''} onChange={handleBillingChange} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Paese</label>
                                <input type="text" name="country" value={billingInfo.country || ''} onChange={handleBillingChange} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                        </div>

                        <div className="text-right">
                             <button onClick={() => alert('Informazioni di fatturazione salvate!')} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-800 transition-colors">Salva Fatturazione</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Sidebar: React.FC<{
    user: User;
    activeSection: string;
    setActiveSection: (section: string) => void;
    onSwitchRole: () => void;
    onLogout: () => void;
}> = ({ user, activeSection, setActiveSection, onSwitchRole, onLogout }) => (
    <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center border-b font-bold text-xl text-brand-blue">
            Hubber
        </div>
        <nav className="flex-grow p-4 flex flex-col justify-between">
            <ul>
                {HUBBER_DASHBOARD_LINKS.map(link => (
                    <React.Fragment key={link.name}>
                        {link.name === 'Impostazioni' && (
                            <li>
                                <button
                                    onClick={onSwitchRole}
                                    className="flex items-center w-full space-x-3 p-3 rounded-lg text-sm font-semibold mb-1 transition-colors hover:bg-gray-100 text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" /></svg>
                                    <span>Passa a Renter</span>
                                </button>
                            </li>
                        )}
                        <li>
                            <button
                                onClick={() => setActiveSection(link.name)}
                                className={`flex items-center w-full space-x-3 p-3 rounded-lg text-sm font-semibold mb-1 transition-colors ${activeSection === link.name ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <link.icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </button>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
             <div>
                <button
                    onClick={onLogout}
                    className="flex items-center w-full space-x-3 p-3 rounded-lg text-sm font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                    <span>Esci</span>
                </button>
            </div>
        </nav>
    </div>
);


export const HubberDashboard: React.FC<HubberDashboardProps> = ({ user, bookings, onLogout, onSwitchRole }) => {
    const [activeSection, setActiveSection] = useState('Dashboard');
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'add-listing'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [initialThreadId, setInitialThreadId] = useState<number | null>(null);
    const [items, setItems] = useState(MOCK_ITEMS);
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
    const [localBookings, setLocalBookings] = useState(bookings);
    const [withdrawals, setWithdrawals] = useState(MOCK_WITHDRAWALS);
    const localBookingsRef = useRef(localBookings);


    const [reviewModal, setReviewModal] = useState<{isOpen: boolean, booking: Booking | null}>({isOpen: false, booking: null});

    useEffect(() => {
        setLocalBookings(bookings);
    }, [bookings]);

    // Polling for real-time updates
    useEffect(() => {
        localBookingsRef.current = localBookings;
    }, [localBookings]);

    useEffect(() => {
        const pollInterval = setInterval(() => {
            // In a real app, this would be an API call.
            // Here, we sync with the global mock array which is mutated by "webhooks".
            if (JSON.stringify(localBookingsRef.current) !== JSON.stringify(MOCK_BOOKINGS)) {
                console.log("Polling (Hubber): Detected booking changes. Updating dashboard state.");
                setLocalBookings([...MOCK_BOOKINGS]);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
    }, []); // Empty dependency array ensures this runs only once on mount


    const handleSetActiveSection = (section: string) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
    };

     const navigateToChat = (bookingId: number) => {
        const thread = MOCK_THREADS.find(t => t.bookingId === bookingId);
        if (thread) {
            setInitialThreadId(thread.id);
            handleSetActiveSection('Messaggi e richieste');
        } else {
            alert("Conversazione non trovata per questa prenotazione.");
        }
    };

    const handleEditListing = (item: Item) => {
        setItemToEdit(item);
        setView('add-listing');
    };
    
    const handleExitFlow = () => {
        setView('dashboard');
        setItemToEdit(null);
    }
    
    const handleSaveListing = (savedItem: Item) => {
        const itemIndex = items.findIndex(i => i.id === savedItem.id);
        if (itemIndex > -1) {
            // Update existing item
            const updatedItems = [...items];
            updatedItems[itemIndex] = savedItem;
            setItems(updatedItems);
        } else {
            // Add new item
            setItems([savedItem, ...items]);
        }
        setView('dashboard');
        setItemToEdit(null);
    };

    const handleOpenReviewModal = (booking: Booking) => {
        setReviewModal({ isOpen: true, booking });
    };

    const handleReviewSubmit = (rating: number, comment: string) => {
        if (!reviewModal.booking) return;

        const newReview: Review = {
            id: MOCK_ALL_REVIEWS.length + 1,
            bookingId: reviewModal.booking.id,
            reviewerId: user.id,
            revieweeId: reviewModal.booking.renterId,
            rating,
            comment,
            timestamp: new Date().toISOString(),
            userName: `${user.firstName} ${user.lastName}`,
            userPhotoUrl: user.avatarUrl,
        };
        MOCK_ALL_REVIEWS.push(newReview);

        setLocalBookings(prevBookings => 
            prevBookings.map(b => 
                b.id === reviewModal.booking!.id ? { ...b, hubberReviewed: true } : b
            )
        );

        setReviewModal({ isOpen: false, booking: null });
        alert('Recensione inviata con successo!');
    };

    const handleAddTestFunds = () => {
        const testBooking: Booking = {
            id: Math.round(Math.random() * 100000),
            renterId: 2,
            hubberId: user.id,
            item: { ...MOCK_ITEMS[0], title: "Noleggio di Prova" },
            startAt: new Date().toISOString(),
            endAt: new Date().toISOString(),
            dueAt: new Date().toISOString(),
            totalPrice: 111.11,
            status: BookingStatus.COMPLETED,
            graceEnabled: true,
            escrowDepositCents: 0,
            rentalPaid: true,
            depositStatus: DepositBookingStatus.RELEASED,
            renterReviewed: true,
            hubberReviewed: true,
            renterServiceFee: 5.56,
            hubberCommission: 11.11,
            hubberNetEarning: 100.00,
        };
        MOCK_BOOKINGS.push(testBooking);
        setLocalBookings(prev => [...prev, testBooking]);
        alert('Aggiunti 100€ al tuo saldo disponibile.');
    };

    const handleWithdrawalRequest = (amount: number, method: 'bank' | 'paypal', paymentDetails: { iban?: string; paypalEmail?: string; }) => {
        const newWithdrawal: Withdrawal = {
            id: Date.now(),
            hubberId: user.id,
            amount,
            method,
            timestamp: new Date().toISOString(),
            status: 'pending',
            paymentDetails,
        };
        MOCK_WITHDRAWALS.push(newWithdrawal);
        setWithdrawals([...MOCK_WITHDRAWALS]);
    };

    const renderDashboardSection = () => {
        const hubberBookings = localBookings.filter(b => b.hubberId === user.id);
        switch (activeSection) {
            case 'Dashboard': return <DashboardView user={user} setActiveSection={handleSetActiveSection} bookings={hubberBookings} />;
            case 'I miei annunci': return <MyListings onEdit={handleEditListing} items={items} onItemsChange={setItems} />;
            case 'Prenotazioni': return <BookingsList bookings={hubberBookings} userRole="hubber" onChatClick={navigateToChat} onReviewClick={handleOpenReviewModal} />;
            case 'Messaggi e richieste': return <ChatInterface user={user} initialThreadId={initialThreadId} onThreadOpened={() => setInitialThreadId(null)} />;
            case 'Depositi': return <DepositsPage navigateToChat={navigateToChat} />;
            case 'Guadagni e Wallet': return <Wallet user={user} bookings={localBookings} withdrawals={withdrawals} onAddTestFunds={handleAddTestFunds} onWithdraw={handleWithdrawalRequest} />;
            case 'Recensioni ricevute': return <Reviews user={user}/>;
            case 'Impostazioni': return <Settings user={user} />;
            default: return <DashboardView user={user} setActiveSection={handleSetActiveSection} bookings={hubberBookings} />;
        }
    }

    const renderAddListingButton = () => (
        <button
            onClick={() => {
                setItemToEdit(null);
                setView('add-listing');
            }}
            className="flex items-center justify-center bg-brand-blue text-white font-bold rounded-lg hover:bg-teal-800 transition-colors md:space-x-1 md:px-2 md:py-1 p-1.5"
            aria-label="Aggiungi Annuncio"
            title="Aggiungi Annuncio"
        >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Aggiungi Annuncio</span>
        </button>
    );

    if (view === 'add-listing') {
        return <AddListingFlow user={user} onExit={handleExitFlow} itemToEdit={itemToEdit} onSave={handleSaveListing} />;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-64 bg-white h-full border-r">
                    <Sidebar user={user} activeSection={activeSection} setActiveSection={handleSetActiveSection} onSwitchRole={onSwitchRole} onLogout={onLogout} />
                </div>
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r flex-shrink-0 hidden md:flex">
                <Sidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} onSwitchRole={onSwitchRole} onLogout={onLogout} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    user={user} 
                    onLogout={onLogout} 
                    pageTitle="" 
                    actionComponent={renderAddListingButton()}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderDashboardSection()}
                </main>
            </div>
            
            {reviewModal.isOpen && reviewModal.booking && (
                <ReviewModal 
                    isOpen={reviewModal.isOpen}
                    onClose={() => setReviewModal({isOpen: false, booking: null})}
                    onSubmit={handleReviewSubmit}
                    booking={reviewModal.booking}
                />
            )}
        </div>
    );
};