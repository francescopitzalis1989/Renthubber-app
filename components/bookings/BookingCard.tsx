

import React from 'react';
import type { Booking, UserRole } from '../../types';
import { BookingStatus } from '../../types';
import { useBookingTimer } from '../../hooks/useBookingTimer';

interface BookingCardProps {
    booking: Booking;
    userRole: UserRole;
    onChatClick: () => void;
    onReviewClick: () => void;
    onCancelClick?: () => void;
}

const getStatusInfo = (status: BookingStatus) => {
    const statusMap: { [key in BookingStatus]: { text: string; className: string } } = {
        [BookingStatus.PAYMENT_PENDING]: { text: 'Pagamento in corso...', className: 'bg-orange-100 text-orange-800' },
        [BookingStatus.PAYMENT_FAILED]: { text: 'Pagamento Fallito', className: 'bg-red-200 text-red-900' },
        [BookingStatus.PAYMENT_SUCCEEDED]: { text: 'In Elaborazione', className: 'bg-blue-100 text-blue-800' },
        [BookingStatus.DEPOSIT_AUTHORIZED]: { text: 'In Finalizzazione', className: 'bg-blue-100 text-blue-800' },
        [BookingStatus.PENDING]: { text: 'In attesa', className: 'bg-yellow-100 text-yellow-800' },
        [BookingStatus.CONFIRMED]: { text: 'Confermata', className: 'bg-green-100 text-green-800' },
        [BookingStatus.PICKED_UP]: { text: 'In corso', className: 'bg-blue-100 text-blue-800' },
        [BookingStatus.EXTENDED]: { text: 'In corso', className: 'bg-cyan-100 text-cyan-800' },
        [BookingStatus.GRACE]: { text: 'In Tolleranza', className: 'bg-purple-100 text-purple-800' },
        [BookingStatus.DELIVERED_BY_RENTER]: { text: 'In Rientro', className: 'bg-indigo-100 text-indigo-800' },
        [BookingStatus.RETURN_CONFIRMED_BY_HUBBER]: { text: 'Rientrato', className: 'bg-gray-200 text-gray-800' },
        [BookingStatus.COMPLETED]: { text: 'Completata', className: 'bg-gray-200 text-gray-800' },
        [BookingStatus.DISPUTE_OPEN]: { text: 'In Disputa', className: 'bg-red-100 text-red-800' },
        [BookingStatus.CANCELLED]: { text: 'Annullata', className: 'bg-red-100 text-red-800' },
    };
    return statusMap[status];
};

export const BookingCard: React.FC<BookingCardProps> = ({ booking, userRole, onChatClick, onReviewClick, onCancelClick }) => {
    const statusInfo = getStatusInfo(booking.status);
    const { displayTime, isOverdue } = useBookingTimer(booking);
    const showTimer = [BookingStatus.PICKED_UP, BookingStatus.EXTENDED, BookingStatus.GRACE].includes(booking.status);

    const canReview = booking.status === BookingStatus.COMPLETED && 
        ((userRole === 'renter' && !booking.renterReviewed) || (userRole === 'hubber' && !booking.hubberReviewed));

    const canCancel = booking.status === BookingStatus.CONFIRMED && userRole === 'renter' && onCancelClick;

    return (
        <div className="bg-white p-4 rounded-xl border flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <img src={booking.item.imageUrls[0]} alt={booking.item.title} className="w-full md:w-32 h-32 md:h-24 object-cover rounded-lg" />
            <div className="flex-grow text-center md:text-left">
                <p className="font-semibold">{booking.item.title}</p>
                <p className="text-sm text-gray-500">{booking.item.location}</p>
                <p className="text-sm text-gray-500">
                    Dal {new Date(booking.startAt).toLocaleDateString()} al {new Date(booking.endAt).toLocaleDateString()}
                </p>
            </div>
            <div className="text-center">
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                    {statusInfo.text}
                </span>
                {showTimer && (
                    <p className={`mt-1 text-sm font-bold tabular-nums ${isOverdue && !booking.status.includes('GRACE') ? 'text-red-500' : 'text-gray-700'}`}>
                        {isOverdue && !booking.status.includes('GRACE') ? `Scaduto` : `Restano ${displayTime}`}
                    </p>
                )}
            </div>
            <div className="font-semibold text-lg">€{booking.totalPrice}</div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                {showTimer && userRole === 'renter' ? (
                    <>
                        <button onClick={onChatClick} className="text-sm font-medium bg-gray-200 text-gray-800 py-2 px-4 rounded-lg w-full">
                           +30 min
                        </button>
                         <button onClick={onChatClick} className="text-sm font-medium bg-gray-200 text-gray-800 py-2 px-4 rounded-lg w-full">
                           +1 ora
                        </button>
                    </>
                ) : (
                     <button onClick={onChatClick} className="text-sm font-medium bg-gray-800 text-white py-2 px-4 rounded-lg w-full">
                        Vai alla chat
                    </button>
                )}

                {canReview && <button onClick={onReviewClick} className="text-sm font-medium bg-brand-blue text-white py-2 px-4 rounded-lg w-full">Lascia recensione</button>}
                {canCancel && <button onClick={onCancelClick} className="text-sm font-medium text-red-600 hover:underline w-full py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50">Annulla</button>}
            </div>
        </div>
    );
};