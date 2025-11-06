
import React from 'react';
import type { Booking, UserRole } from '../../types';
import { BookingCard } from './BookingCard';

interface BookingsListProps {
  bookings: Booking[];
  userRole: UserRole;
  onChatClick: (bookingId: number) => void;
  onReviewClick: (booking: Booking) => void;
  onCancelClick?: (bookingId: number) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({ bookings, userRole, onChatClick, onReviewClick, onCancelClick }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Le tue prenotazioni</h2>
            {bookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white border rounded-xl">
                    <p>Non hai nessuna prenotazione in questa sezione.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
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
        </div>
    );
};