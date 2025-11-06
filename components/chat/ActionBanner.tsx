import React from 'react';
import type { Booking, UserRole } from '../../types';
import { BookingStatus } from '../../types';
import { useBookingTimer } from '../../hooks/useBookingTimer';
import { computeExtensionCost } from '../../utils/pricing';

interface ActionBannerProps {
  booking: Booking;
  userRole: UserRole;
  onPickup: () => void;
  onExtend: (minutes: number) => void;
  onStartGrace: () => void;
  onReminder: (hoursLeft: number) => void;
  onGraceEnd: () => void;
  onDeclareReturn: () => void;
  onConfirmReturn: () => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; disabled?: boolean; }> = 
    ({ onClick, children, className = '', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

export const ActionBanner: React.FC<ActionBannerProps> = ({ 
    booking, userRole, onPickup, onExtend, onStartGrace, onReminder, onGraceEnd,
    onDeclareReturn, onConfirmReturn
}) => {
    const { displayTime, isOverdue, inGrace } = useBookingTimer(booking, onReminder, onGraceEnd);

    const renderRenterActions = () => {
        switch (booking.status) {
            case BookingStatus.CONFIRMED:
                return <ActionButton onClick={onPickup} className="bg-brand-blue text-white hover:bg-teal-800">✅ Ritiro effettuato</ActionButton>;
            
            case BookingStatus.PICKED_UP:
            case BookingStatus.EXTENDED:
            case BookingStatus.GRACE:
                const canStartGrace = booking.graceEnabled && !inGrace && isOverdue;

                return (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <ActionButton onClick={() => onExtend(30)} className="bg-gray-200 hover:bg-gray-300">⏳ +30 min (€{computeExtensionCost(booking.item.price, 30).toFixed(2)})</ActionButton>
                            <ActionButton onClick={() => onExtend(60)} className="bg-gray-200 hover:bg-gray-300">➕ +1 ora (€{computeExtensionCost(booking.item.price, 60).toFixed(2)})</ActionButton>
                            <ActionButton onClick={onStartGrace} disabled={!canStartGrace} className="bg-purple-100 text-purple-700 hover:bg-purple-200">🆓 Attiva tolleranza 1h</ActionButton>
                            <ActionButton onClick={onDeclareReturn} className="bg-green-100 text-green-800 hover:bg-green-200">📦 Ho restituito l'oggetto</ActionButton>
                        </div>
                        {canStartGrace && <p className="text-xs text-gray-500 mt-1">La tolleranza è gratuita e valida per 60 minuti dopo la scadenza.</p>}
                    </div>
                );
            case BookingStatus.DELIVERED_BY_RENTER:
                return <p className="text-sm font-semibold text-gray-600">In attesa della conferma di rientro da parte dell'Hubber.</p>
            default:
                return null;
        }
    };
    
    const renderHubberActions = () => {
        switch (booking.status) {
            case BookingStatus.DELIVERED_BY_RENTER:
                return <ActionButton onClick={onConfirmReturn} className="bg-green-600 text-white hover:bg-green-700">✅ Conferma Rientro e Rilascia Deposito</ActionButton>;
            default:
                return null;
        }
    }

    const renderTimer = () => {
        if ([BookingStatus.PICKED_UP, BookingStatus.EXTENDED, BookingStatus.GRACE].includes(booking.status)) {
            const timerColor = isOverdue && !inGrace ? 'text-red-500' : 'text-gray-800';
            const graceText = inGrace ? '(Tolleranza)' : '';
            return (
                 <div>
                    <p className={`text-2xl font-bold tabular-nums ${timerColor}`}>{displayTime}</p>
                    <p className="text-xs text-gray-500 text-center">Tempo Rimanente {graceText}</p>
                </div>
            );
        }
        return null;
    }
    
    const renderExtensionInfo = () => {
        if (userRole === 'renter' && (booking.extendedMinutes || 0) > 0) {
            return (
                 <p className="text-xs text-gray-500 mt-2 text-center">
                    Estensioni acquistate: {booking.extendedMinutes} min — Totale: €{(booking.extensionCost || 0).toFixed(2)}
                </p>
            );
        }
        return null;
    }

    const actions = userRole === 'renter' ? renderRenterActions() : renderHubberActions();
    const timer = renderTimer();

    if (!actions && !timer) return null;

    return (
        <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-shrink-0">
                {timer}
            </div>
            <div className="flex flex-col items-center">
                {actions}
                {renderExtensionInfo()}
            </div>
        </div>
    );
};