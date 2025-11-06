import React, { useState, useMemo } from 'react';
import { MOCK_BOOKINGS, MOCK_USERS } from '../../constants';
import { BookingStatus } from '../../types';
import type { Deposit, DepositStatus } from '../../types';
import { DepositStats } from './DepositStats';
import { DepositTable } from './DepositTable';
import { DepositDetailModal } from './DepositDetailModal';

interface DepositsPageProps {
  navigateToChat: (bookingId: number) => void;
}

export const DepositsPage: React.FC<DepositsPageProps> = ({ navigateToChat }) => {
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

  const deposits: Deposit[] = useMemo(() => {
    const usersMap = new Map(MOCK_USERS.map(u => [u.id, u]));
    
    return MOCK_BOOKINGS
        .filter(booking => booking.item.securityDeposit && booking.item.securityDeposit > 0 && booking.status !== BookingStatus.PENDING)
        .map(booking => {
            const renter = usersMap.get(booking.renterId);
            let status: DepositStatus = 'ATTIVO';
            
            if ([BookingStatus.COMPLETED, BookingStatus.RETURN_CONFIRMED_BY_HUBBER, BookingStatus.CANCELLED].includes(booking.status)) {
                status = 'RILASCIATO';
            } else if (booking.status === BookingStatus.DISPUTE_OPEN) {
                status = 'IN DISPUTA';
            }

            return {
                id: `DEP-${booking.id}`,
                bookingId: booking.id,
                itemTitle: booking.item.title,
                itemImageUrl: booking.item.imageUrls[0],
                renterName: renter ? `${renter.firstName} ${renter.lastName}` : 'Sconosciuto',
                renterAvatarUrl: renter ? renter.avatarUrl : '',
                amount: booking.item.securityDeposit!,
                status: status,
                blockedAt: booking.startAt,
                estimatedReleaseAt: booking.endAt,
            };
        });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestione Depositi Cauzionali</h2>
      <DepositStats deposits={deposits} />
      <DepositTable deposits={deposits} onSelectDeposit={setSelectedDeposit} />
      <DepositDetailModal 
        isOpen={!!selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        deposit={selectedDeposit}
        onGoToChat={navigateToChat}
      />
    </div>
  );
};
