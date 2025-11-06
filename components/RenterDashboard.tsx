


import React, { useState } from 'react';
import type { User, BillingInfo, Booking, Review, Item } from '../types';
import { Header } from './Header';
// FIX: Import MOCK_THREADS to resolve 'Cannot find name' error.
import { RENTER_DASHBOARD_LINKS, MOCK_ALL_REVIEWS, MOCK_USERS, MOCK_ITEMS, MOCK_THREADS } from '../constants';
import { SearchAndBook } from './SearchAndBook';
import { ChatInterface } from './ChatInterface';
import { BookingsList } from './bookings/BookingsList';
import { ReviewModal } from './reviews/ReviewModal';
import { BookingStatus } from '../types';
import { ItemDetailModal } from './PropertyModal';
import { FavoritesPage } from './favorites/FavoritesPage';

interface RenterDashboardProps {
  user: User;
  bookings: Booking[];
  favoritedItemIds: Set<number>;
  onToggleFavorite: (itemId: number) => void;
  onBookingSuccess: (booking: Booking) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

const Payments: React.FC = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Pagamenti</h2>
        <div className="bg-white p-6 rounded-xl border">
            <p>Qui troverai la cronologia dei tuoi pagamenti e le ricevute digitali.</p>
            <p className="text-center mt-4 text-sm text-gray-500">La sezione pagamenti non è implementata in questa demo.</p>
        </div>
    </div>
);

const Reviews: React.FC<{user: User}> = ({user}) => {
    const reviewsLeft = MOCK_ALL_REVIEWS.filter(r => r.reviewerId === user.id);
    const usersMap = new Map(MOCK_USERS.map(u => [u.id, u]));

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Recensioni Lasciate</h2>
             {reviewsLeft.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-center text-sm text-gray-500">Non hai ancora lasciato nessuna recensione.</p>
                </div>
             ) : (
                <div className="space-y-6">
                    {reviewsLeft.map(review => {
                        const reviewee = usersMap.get(review.revieweeId);
                        return (
                            <div key={review.id} className="bg-white p-4 rounded-xl border">
                                <div className="flex items-start space-x-4">
                                    <img src={reviewee?.avatarUrl} alt={reviewee?.firstName} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-semibold">Recensione per {reviewee?.firstName} {reviewee?.lastName}</h4>
                                        </div>
                                         <div className="flex items-center space-x-1 my-1">
                                            <div className="flex">
                                                {[...Array(review.rating)].map((_, i) => '⭐')}
                                            </div>
                                            <p className="text-sm text-gray-500 ml-2">{new Date(review.timestamp).toLocaleDateString('it-IT')}</p>
                                        </div>
                                        <p className="mt-2 text-gray-700">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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
                                <label htmlFor="id-upload-renter" className="cursor-pointer">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto w-10 h-10 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" /></svg>
                                    <p className="mt-2 font-semibold text-brand-blue">Clicca per caricare un file</p>
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG (max 5MB)</p>
                                </label>
                                <input type="file" id="id-upload-renter" className="hidden" onChange={handleIdUpload} accept=".pdf,.png,.jpg,.jpeg"/>
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
            Renter
        </div>
        <nav className="flex-grow p-4 flex flex-col justify-between">
            <ul>
                {RENTER_DASHBOARD_LINKS.map(link => (
                    <React.Fragment key={link.name}>
                        {link.name === 'Impostazioni' && user.roles.includes('hubber') && (
                            <li>
                                <button
                                    onClick={onSwitchRole}
                                    className="flex items-center w-full space-x-3 p-3 rounded-lg text-sm font-semibold mb-1 transition-colors hover:bg-gray-100 text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" /></svg>
                                    <span>Passa a Hubber</span>
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

export const RenterDashboard: React.FC<RenterDashboardProps> = ({ user, bookings, favoritedItemIds, onToggleFavorite, onBookingSuccess, onLogout, onSwitchRole }) => {
    const [activeSection, setActiveSection] = useState('Cerca e prenota');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [initialThreadId, setInitialThreadId] = useState<number | null>(null);
    const [localBookings, setLocalBookings] = useState(bookings);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const [reviewModal, setReviewModal] = useState<{isOpen: boolean, booking: Booking | null}>({isOpen: false, booking: null});

    const handleSetActiveSection = (section: string) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
    };
    
    const handleNavigateToChat = (bookingId: number) => {
        const thread = MOCK_THREADS.find(t => t.bookingId === bookingId);
        if (thread) {
            setInitialThreadId(thread.id);
            setActiveSection('Messaggi');
        } else {
            alert("Conversazione non trovata per questa prenotazione.");
        }
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
            revieweeId: reviewModal.booking.hubberId,
            rating,
            comment,
            timestamp: new Date().toISOString(),
            userName: `${user.firstName} ${user.lastName}`,
            userPhotoUrl: user.avatarUrl,
        };
        MOCK_ALL_REVIEWS.push(newReview);

        setLocalBookings(prevBookings => 
            prevBookings.map(b => 
                b.id === reviewModal.booking!.id ? { ...b, renterReviewed: true } : b
            )
        );

        setReviewModal({ isOpen: false, booking: null });
        alert('Recensione inviata con successo!');
    };
    
    const handleCancelBooking = (bookingId: number) => {
        const bookingToCancel = localBookings.find(b => b.id === bookingId);
        const item = MOCK_ITEMS.find(i => i.id === bookingToCancel?.item.id);

        if (!bookingToCancel || !item) {
            alert("Impossibile trovare la prenotazione o l'oggetto.");
            return;
        }
        
        if (!window.confirm(`Sei sicuro di voler annullare la prenotazione per "${item.title}"?`)) {
            return;
        }

        let updatedBooking: Booking;

        // "Flessibile" policy: full refund, no fees.
        if (item.cancellationPolicy === 'Flessibile') {
            updatedBooking = {
                ...bookingToCancel,
                status: BookingStatus.CANCELLED,
                renterServiceFee: 0,
                hubberCommission: 0,
                hubberNetEarning: 0,
            };
            alert("Prenotazione annullata. Riceverai un rimborso completo.");
        } else { // 'Moderata' or 'Rigida'
            // Renter's service fee is refunded. Hubber's commission is applied to their payout.
            // Assuming a 50% payout for simplicity for non-flexible policies.
            const payout = (bookingToCancel.totalPrice / 2);
            const newCommission = payout * 0.10;
            const newNetEarning = payout - newCommission;

            updatedBooking = {
                ...bookingToCancel,
                status: BookingStatus.CANCELLED,
                renterServiceFee: 0, // Fee refunded to renter
                hubberCommission: newCommission,
                hubberNetEarning: newNetEarning,
            };
            alert(`Prenotazione annullata. Verrà applicata una penale come da termini. La commissione di servizio ti sarà rimborsata.`);
        }

        setLocalBookings(prev => prev.map(b => (b.id === bookingId ? updatedBooking : b)));
    };


    const renderDashboardSection = () => {
        const renterBookings = localBookings.filter(b => b.renterId === user.id);
        switch (activeSection) {
            case 'Cerca e prenota': return <SearchAndBook favoritedItemIds={favoritedItemIds} onToggleFavorite={onToggleFavorite} onBookingSuccess={onBookingSuccess} />;
            case 'Prenotazioni': return <BookingsList bookings={renterBookings} userRole="renter" onChatClick={handleNavigateToChat} onReviewClick={handleOpenReviewModal} onCancelClick={handleCancelBooking} />;
            case 'Preferiti': return <FavoritesPage items={MOCK_ITEMS} favoritedItemIds={favoritedItemIds} onToggleFavorite={onToggleFavorite} onItemClick={setSelectedItem} />;
            case 'Messaggi': return <ChatInterface user={user} initialThreadId={initialThreadId} onThreadOpened={() => setInitialThreadId(null)} />;
            case 'Pagamenti': return <Payments />;
            case 'Recensioni lasciate': return <Reviews user={user}/>;
            case 'Impostazioni': return <Settings user={user} />;
            default: return <SearchAndBook favoritedItemIds={favoritedItemIds} onToggleFavorite={onToggleFavorite} onBookingSuccess={onBookingSuccess} />;
        }
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
                    pageTitle={activeSection} 
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
             {selectedItem && (
                <ItemDetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    isFavorite={favoritedItemIds.has(selectedItem.id)}
                    onToggleFavorite={onToggleFavorite}
                    onBookingSuccess={onBookingSuccess}
                />
            )}
        </div>
    );
};