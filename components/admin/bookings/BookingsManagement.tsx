import React, { useState, useMemo } from 'react';
import { MOCK_BOOKINGS, MOCK_USERS } from '../../../constants';
import { BookingStatus } from '../../../types';
import type { Booking } from '../../../types';

const bookingStatusMap: { [key in BookingStatus]: { text: string; className: string } } = {
    [BookingStatus.PAYMENT_PENDING]: { text: 'Pagamento in corso', className: 'bg-orange-100 text-orange-800' },
    [BookingStatus.PAYMENT_FAILED]: { text: 'Pagamento Fallito', className: 'bg-red-200 text-red-900 font-bold' },
    [BookingStatus.PAYMENT_SUCCEEDED]: { text: 'Pagamento Riuscito', className: 'bg-blue-100 text-blue-800' },
    [BookingStatus.DEPOSIT_AUTHORIZED]: { text: 'Deposito Autorizzato', className: 'bg-cyan-100 text-cyan-800' },
    [BookingStatus.PENDING]: { text: 'In Attesa', className: 'bg-yellow-100 text-yellow-800' },
    [BookingStatus.CONFIRMED]: { text: 'Confermata', className: 'bg-green-100 text-green-800' },
    [BookingStatus.PICKED_UP]: { text: 'In Corso', className: 'bg-blue-100 text-blue-800' },
    [BookingStatus.EXTENDED]: { text: 'In Corso (Esteso)', className: 'bg-cyan-100 text-cyan-800' },
    [BookingStatus.GRACE]: { text: 'In Tolleranza', className: 'bg-purple-100 text-purple-800' },
    [BookingStatus.DELIVERED_BY_RENTER]: { text: 'In Rientro', className: 'bg-indigo-100 text-indigo-800' },
    [BookingStatus.RETURN_CONFIRMED_BY_HUBBER]: { text: 'Rientrato', className: 'bg-gray-200 text-gray-800' },
    [BookingStatus.COMPLETED]: { text: 'Completata', className: 'bg-gray-400 text-white' },
    [BookingStatus.DISPUTE_OPEN]: { text: 'Disputa Aperta', className: 'bg-red-100 text-red-800 font-bold' },
    [BookingStatus.CANCELLED]: { text: 'Annullata', className: 'bg-red-200 text-red-900' },
};

interface BookingDetailModalProps {
    booking: Booking;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedBooking: Booking) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, isOpen, onClose, onSave }) => {
    const [currentStatus, setCurrentStatus] = useState(booking.status);
    const usersMap = useMemo(() => new Map(MOCK_USERS.map(u => [u.id, u])), []);
    const renter = usersMap.get(booking.renterId);
    const hubber = usersMap.get(booking.hubberId);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...booking, status: currentStatus });
    };

    const handleCancelBooking = () => {
        if (window.confirm("Sei sicuro di voler annullare questa prenotazione? L'azione è irreversibile.")) {
            onSave({ ...booking, status: BookingStatus.CANCELLED });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Dettagli Prenotazione #{booking.id}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Item Info */}
                    <div className="flex items-center space-x-4">
                        <img src={booking.item.imageUrls[0]} alt={booking.item.title} className="w-20 h-20 object-cover rounded-lg" />
                        <div>
                            <p className="font-bold">{booking.item.title}</p>
                            <p className="text-sm text-gray-500">ID Annuncio: {booking.item.id}</p>
                        </div>
                    </div>
                    {/* User Info */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Renter</h4>
                            <p>{renter?.firstName} {renter?.lastName} (#{renter?.id})</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm mb-1">Hubber</h4>
                            <p>{hubber?.firstName} {hubber?.lastName} (#{hubber?.id})</p>
                        </div>
                    </div>
                    {/* Date & Financial Info */}
                     <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Date</h4>
                            <p>{new Date(booking.startAt).toLocaleDateString('it-IT')} - {new Date(booking.endAt).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Importo Totale</h4>
                            <p className="font-bold text-lg">€{booking.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                    {/* Admin Management */}
                     <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-2">Gestione Prenotazione</h4>
                        <div className="flex items-center space-x-4">
                            <select value={currentStatus} onChange={e => setCurrentStatus(e.target.value as BookingStatus)} className="p-2 border rounded-md bg-white w-full">
                                {Object.entries(bookingStatusMap).map(([key, { text }]) => (
                                    <option key={key} value={key}>{text}</option>
                                ))}
                            </select>
                            <button onClick={handleCancelBooking} className="px-4 py-2 rounded-lg border bg-red-500 text-white whitespace-nowrap">Annulla Prenotazione</button>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Chiudi</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-blue text-white">Salva Modifiche</button>
                </div>
            </div>
        </div>
    );
};


export const BookingsManagement: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const usersMap = useMemo(() => new Map(MOCK_USERS.map(u => [u.id, u])), []);

    const handleOpenModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleSaveBooking = (updatedBooking: Booking) => {
        setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        handleCloseModal();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestione Prenotazioni</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Annuncio</th>
                            <th scope="col" className="px-6 py-3">Renter</th>
                            <th scope="col" className="px-6 py-3">Hubber</th>
                            <th scope="col" className="px-6 py-3">Importo</th>
                            <th scope="col" className="px-6 py-3">Stato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => {
                            const statusInfo = bookingStatusMap[booking.status];
                            const renter = usersMap.get(booking.renterId);
                            const hubber = usersMap.get(booking.hubberId);
                            return (
                                <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-mono text-xs text-gray-900">
                                        #{booking.id}
                                    </th>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{booking.item.title}</td>
                                    <td className="px-6 py-4">{renter ? `${renter.firstName} ${renter.lastName}` : 'N/A'}</td>
                                    <td className="px-6 py-4">{hubber ? `${hubber.firstName} ${hubber.lastName}` : 'N/A'}</td>
                                    <td className="px-6 py-4">€{booking.totalPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleOpenModal(booking)} className="font-medium text-brand-blue hover:underline">Dettagli/Gestisci</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {bookings.length === 0 && <p className="text-center p-8 text-gray-500">Nessuna prenotazione trovata.</p>}
            </div>

            {selectedBooking && (
                <BookingDetailModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    booking={selectedBooking}
                    onSave={handleSaveBooking}
                />
            )}
        </div>
    );
};