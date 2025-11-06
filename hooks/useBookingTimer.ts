import { useState, useEffect, useRef } from 'react';
import { diffMinutes } from '../utils/datetime';
import type { Booking } from '../types';
import { BookingStatus } from '../types';

interface UseBookingTimerResult {
  minutesLeft: number;
  inGrace: boolean;
  isOverdue: boolean;
  displayTime: string;
}

const formatTime = (minutes: number): string => {
    if (minutes <= 0) return "00:00";
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const useBookingTimer = (
    booking: Booking,
    onReminder?: (hoursLeft: number) => void,
    onGraceEnd?: () => void
): UseBookingTimerResult => {
    const [now, setNow] = useState(() => new Date().toISOString());
    const reminderSentRef = useRef<Set<number>>(new Set());
    const graceEndSentRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().toISOString());
        }, 1000); // Update every second for a smooth countdown

        return () => clearInterval(interval);
    }, []);

    const totalMinutesLeft = diffMinutes(now, booking.dueAt);
    const graceMinutesLeft = booking.status === BookingStatus.GRACE ? diffMinutes(now, new Date(new Date(booking.dueAt).getTime() + 60 * 60 * 1000).toISOString()) : -1;
    
    const minutesLeft = graceMinutesLeft > 0 ? graceMinutesLeft : totalMinutesLeft;
    const inGrace = booking.status === BookingStatus.GRACE;
    const isOverdue = minutesLeft <= 0;

    // Effect for sending reminders
    useEffect(() => {
        if (onReminder) {
            const hoursLeft = Math.round(totalMinutesLeft / 60);
            [3, 1].forEach(threshold => {
                if (hoursLeft <= threshold && !reminderSentRef.current.has(threshold)) {
                    onReminder(threshold);
                    reminderSentRef.current.add(threshold);
                }
            });
        }
        
        if (onGraceEnd && inGrace && graceMinutesLeft <= 0 && !graceEndSentRef.current) {
            onGraceEnd();
            graceEndSentRef.current = true;
        }

    }, [totalMinutesLeft, graceMinutesLeft, inGrace, onReminder, onGraceEnd]);

    return {
        minutesLeft,
        inGrace,
        isOverdue,
        displayTime: formatTime(minutesLeft),
    };
};