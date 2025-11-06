import React from 'react';
import { BookingStatus } from '../../types';
import type { Thread, Booking, ThreadType } from '../../types';
import { CalendarIcon, ShieldCheckIcon, TagIcon } from '../Icons';
import { formatListTimestamp } from '../../utils/systemMessages';

// Helper to get status chip styles and text
const getBookingStatusChip = (status: BookingStatus) => {
    const statusMap: { [key in BookingStatus]: { text: string; className: string } } = {
        [BookingStatus.PAYMENT_PENDING]: { text: 'Pagamento...', className: 'bg-yellow-100 text-yellow-800' },
        [BookingStatus.PAYMENT_FAILED]: { text: 'Fallito', className: 'bg-red-100 text-red-800' },
        [BookingStatus.PAYMENT_SUCCEEDED]: { text: 'Pagato', className: 'bg-blue-100 text-blue-800' },
        [BookingStatus.DEPOSIT_AUTHORIZED]: { text: 'Confermando', className: 'bg-blue-100 text-blue-800' },
        [BookingStatus.PENDING]: { text: 'Richiesta', className: 'bg-yellow-100 text-yellow-800' },
        [BookingStatus.CONFIRMED]: { text: 'Confermata', className: 'bg-green-100 text-green-800' },
        [BookingStatus.PICKED_UP]: { text: 'Ritiro Effettuato', className: 'bg-blue-100 text-blue-800' },
        [BookingStatus.EXTENDED]: { text: 'Esteso', className: 'bg-cyan-100 text-cyan-800' },
        [BookingStatus.GRACE]: { text: 'In Tolleranza', className: 'bg-purple-100 text-purple-800' },
        [BookingStatus.DELIVERED_BY_RENTER]: { text: 'In Rientro', className: 'bg-indigo-100 text-indigo-800' },
        [BookingStatus.RETURN_CONFIRMED_BY_HUBBER]: { text: 'Rientrato', className: 'bg-gray-200 text-gray-800' },
        [BookingStatus.COMPLETED]: { text: 'Completata', className: 'bg-gray-200 text-gray-800' },
        [BookingStatus.DISPUTE_OPEN]: { text: 'In Disputa', className: 'bg-red-100 text-red-800' },
        [BookingStatus.CANCELLED]: { text: 'Annullata', className: 'bg-red-100 text-red-800' },
    };
    return statusMap[status];
};

// Helper to get thread type icon
const getThreadTypeIcon = (type: ThreadType) => {
    const iconProps = { className: "w-4 h-4 text-gray-400" };
    switch (type) {
        case 'LISTING':
            return <TagIcon {...iconProps} />;
        case 'RENTAL':
        case 'BOOKING':
            return <CalendarIcon {...iconProps} />;
        case 'SUPPORT':
            return <ShieldCheckIcon {...iconProps} />;
        default:
            return null;
    }
};

interface ThreadListItemProps {
    thread: Thread;
    booking?: Booking;
    isActive: boolean;
    onClick: () => void;
}

export const ThreadListItem: React.FC<ThreadListItemProps> = ({ thread, booking, isActive, onClick }) => {
    const lastMessage = thread.messages[thread.messages.length - 1];
    const statusInfo = booking ? getBookingStatusChip(booking.status) : null;
    const typeIcon = getThreadTypeIcon(thread.type);

    return (
        <li
            onClick={onClick}
            className={`p-3 sm:p-4 cursor-pointer flex space-x-3 items-start border-b ${isActive ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
        >
            <img src={thread.participant.avatarUrl} alt={thread.participant.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm truncate flex-grow">{thread.participant.name}</p>
                    <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{lastMessage ? formatListTimestamp(lastMessage.timestamp) : ''}</p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                     <div className="flex items-center space-x-1 truncate">
                        {typeIcon}
                        <span className="truncate">{thread.item.title}</span>
                    </div>
                    {statusInfo && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.className} flex-shrink-0`}>
                            {statusInfo.text}
                        </span>
                    )}
                </div>

                <p className={`text-sm text-gray-600 truncate ${thread.isUnread ? 'font-bold' : ''}`}>
                    {lastMessage?.text || "Nessun messaggio"}
                </p>
            </div>
        </li>
    );
};