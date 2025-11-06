

import React, { useState, useMemo } from 'react';
import type { Booking, UserRole } from '../../types';
import { BookingCard } from './BookingCard';
import { BookingStatus } from '../../types';

interface BookingsListProps {
  bookings: Booking[];
  userRole: UserRole;
  onChatClick: (bookingId: number) => void;
  onReviewClick: (booking: Booking) => void;
  onCancelClick?: (bookingId: number) => void;
}

type FilterType = 'Tutte' | 'In Attesa' | 'Confermate' | 'In Corso' | 'Completate' | 'Annullate' | 'In Disputa';

const filterCategories: FilterType[] = ['Tutte', 'In Attesa', 'Confermate', 'In Corso', 'Completate', 'Annullate', 'In Disputa'];

const statusMap: Record<FilterType, BookingStatus[] | null> = {
    'Tutte': null,
    'In Attesa': [BookingStatus.PENDING, BookingStatus.PAYMENT_PENDING, BookingStatus.PAYMENT_SUCCEEDED, BookingStatus.DEPOSIT_AUTHORIZED],
    'Confermate': [BookingStatus.CONFIRMED],
    'In Corso': [BookingStatus.PICKED_UP, BookingStatus.EXTENDED, BookingStatus.GRACE, BookingStatus.DELIVERED_BY_RENTER, BookingStatus.RETURN_CONFIRMED_BY_HUBBER],
    'Completate': [BookingStatus.COMPLETED],
    'Annullate': [BookingStatus.CANCELLED, BookingStatus.PAYMENT_FAILED],
    'In Disputa': [BookingStatus.DISPUTE_OPEN],
};

const ITEMS_PER_PAGE = 5;

export const BookingsList: React.FC<BookingsListProps> = ({ bookings, userRole, onChatClick, onReviewClick, onCancelClick }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('Tutte');
    const [currentPage, setCurrentPage] = useState(1);

    const filterCounts = useMemo(() => {
        const counts = {} as Record<FilterType, number>;
        filterCategories.forEach(cat => {
            const statuses = statusMap[cat];
            if (statuses) {
                counts[cat] = bookings.filter(b => statuses.includes(b.status)).length;
            } else {
                counts[cat] = bookings.length;
            }
        });
        return counts;
    }, [bookings]);

    const paginatedBookings = useMemo(() => {
        const relevantStatuses = statusMap[activeFilter];
        const filtered = relevantStatuses
            ? bookings.filter(b => relevantStatuses.includes(b.status))
            : bookings;

        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        const correctedCurrentPage = Math.min(currentPage, totalPages) || 1;
        
        if (currentPage !== correctedCurrentPage) {
            setCurrentPage(correctedCurrentPage);
        }
        
        const startIndex = (correctedCurrentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return {
            bookings: filtered.slice(startIndex, endIndex),
            totalPages,
            totalItems: filtered.length,
            startItem: startIndex + 1,
            endItem: Math.min(endIndex, filtered.length)
        };
    }, [bookings, activeFilter, currentPage]);
    
    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-4">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Le tue prenotazioni</h2>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                         {filterCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`${
                                    activeFilter === cat
                                        ? 'border-brand-blue text-brand-blue'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                            >
                                <span>{cat}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === cat ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    {filterCounts[cat]}
                                </span>
                            </button>
                         ))}
                    </nav>
                </div>
            </div>

            {paginatedBookings.bookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white border rounded-xl">
                    <p>Non hai nessuna prenotazione in questa sezione.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedBookings.bookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            userRole={userRole}
                            onChatClick={() => onChatClick(booking.id)}
                            onReviewClick={() => onReviewClick(booking)}
                            onCancelClick={onCancelClick ? () => onCancelClick(booking.id) : undefined}
                        />
                    ))}
                </div>
            )}
            
            {paginatedBookings.totalPages > 1 && (
                <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm" aria-label="Pagination">
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            Mostrando da <span className="font-medium">{paginatedBookings.startItem}</span> a <span className="font-medium">{paginatedBookings.endItem}</span> di{' '}
                            <span className="font-medium">{paginatedBookings.totalItems}</span> risultati
                        </p>
                    </div>
                    <div className="flex flex-1 justify-between sm:justify-end">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                        >
                            Precedente
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(paginatedBookings.totalPages, p + 1))}
                            disabled={currentPage === paginatedBookings.totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                        >
                            Successivo
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};