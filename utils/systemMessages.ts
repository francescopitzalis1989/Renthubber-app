import type { BookingEvent, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { formatChatTimestamp as formatTimestamp, addMinutes } from './datetime';

const usersMap = new Map(MOCK_USERS.map(u => [u.id, u]));

export const getMessageForEvent = (event: BookingEvent, viewerRole: UserRole): { icon: string; text: string } | null => {
    const actor = usersMap.get(event.actorId);
    const actorName = actor?.firstName || (viewerRole === 'renter' ? 'L\'hubber' : 'Il renter');

    switch (event.action) {
        case 'BOOKING_REQUESTED':
            return { icon: '📩', text: `${actorName} ha richiesto di noleggiare questo articolo.` };
        case 'BOOKING_PREAPPROVED':
            return { icon: '✅', text: 'Hai pre-approvato la richiesta. In attesa della conferma del renter.' };
        case 'BOOKING_APPROVED':
        case 'CONFIRM_BOOKING':
            return { icon: '🟢', text: 'Prenotazione confermata.' };
        case 'BOOKING_DECLINED':
            return { icon: '⛔', text: 'Richiesta rifiutata.' };
        case 'PICKED_UP':
             return { icon: '🚚', text: `Ritiro confermato alle ${formatTimestamp(event.timestamp, true)}. Il timer per la restituzione è partito.` };
        case 'EXTEND_BOOKING':
            const { minutes, cost, newDueAt } = event.metadata || {};
            return { icon: '⏳', text: `Proroga di ${minutes} minuti acquistata. Costo: ${cost.toFixed(2)}€. Nuova scadenza: ${formatTimestamp(newDueAt || event.timestamp, true)}.` };
        case 'START_GRACE':
            const graceEndTime = addMinutes(event.timestamp, 60);
            return { icon: '🆓', text: `Attivata tolleranza di 60 minuti. Nessun costo se riconsegni entro le ${formatTimestamp(graceEndTime, true)}.` };
        case 'REMINDER_DUE':
            const { hoursLeft } = event.metadata || {};
            return { icon: '🔔', text: `Promemoria: la consegna è prevista tra circa ${hoursLeft} ore.` };
        case 'GRACE_ENDED':
            return { icon: '⚠️', text: 'La tolleranza è terminata. Puoi estendere il noleggio a pagamento.' };
        case 'DELIVERED_BY_RENTER':
            return { icon: '📦', text: 'Consegna dichiarata dal renter.' };
        case 'RETURN_CONFIRMED_BY_HUBBER':
            return { icon: '🟢', text: 'Rientro confermato. Noleggio completato.' };
        case 'DISPUTE_OPEN':
            return { icon: '⚠️', text: 'Disputa aperta. Il deposito cauzionale è stato bloccato.' };
        case 'REVIEW_WINDOW_OPEN':
            return { icon: '⭐', text: 'Ora puoi lasciare una recensione (hai 14 giorni di tempo).' };
        default:
            return null;
    }
};

export const formatChatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
};

export const formatListTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    if (date >= startOfToday) {
        return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }
    if (date >= startOfYesterday) {
        return `Ieri`;
    }

    const diffDays = Math.ceil((startOfToday.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
        return `${diffDays}gg fa`;
    }

    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};