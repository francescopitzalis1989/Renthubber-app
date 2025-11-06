import React from 'react';
import type { Thread, Booking, User } from '../../types';
import { ThreadListItem } from './ThreadListItem';

interface ThreadListProps {
    threads: Thread[];
    activeThreadId: number | null;
    onThreadSelect: (id: number) => void;
    user: User; // May need this later
    bookings: Booking[];
}

export const ThreadList: React.FC<ThreadListProps> = ({ threads, activeThreadId, onThreadSelect, bookings }) => {
    
    // Create a map for quick booking lookup
    const bookingsMap = new Map(bookings.map(b => [b.id, b]));

    return (
        <ul>
            {threads.length > 0 ? (
                threads.map(thread => (
                    <ThreadListItem
                        key={thread.id}
                        thread={thread}
                        booking={thread.bookingId ? bookingsMap.get(thread.bookingId) : undefined}
                        isActive={activeThreadId === thread.id}
                        onClick={() => onThreadSelect(thread.id)}
                    />
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">
                    <p>Nessuna conversazione in questa categoria.</p>
                </div>
            )}
        </ul>
    );
};