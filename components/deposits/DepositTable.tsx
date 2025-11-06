import React from 'react';
import type { Deposit } from '../../types';

interface DepositTableProps {
  deposits: Deposit[];
  onSelectDeposit: (deposit: Deposit) => void;
}

const getStatusChipClass = (status: Deposit['status']) => {
  switch (status) {
    case 'ATTIVO': return 'bg-blue-100 text-blue-800';
    case 'IN DISPUTA': return 'bg-red-100 text-red-800';
    case 'RILASCIATO': return 'bg-green-100 text-green-800';
  }
};

const DepositRow: React.FC<{ deposit: Deposit; onSelect: () => void }> = ({ deposit, onSelect }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="p-4">
      <div className="flex items-center space-x-4">
        <img src={deposit.itemImageUrl} alt={deposit.itemTitle} className="w-16 h-12 object-cover rounded-md" />
        <div>
          <p className="font-semibold">{deposit.itemTitle}</p>
          <p className="text-sm text-gray-500">ID: {deposit.id}</p>
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center space-x-2">
        <img src={deposit.renterAvatarUrl} alt={deposit.renterName} className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium">{deposit.renterName}</span>
      </div>
    </td>
    <td className="p-4 font-semibold text-center">€{deposit.amount.toFixed(2)}</td>
    <td className="p-4 text-center">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(deposit.status)}`}>
        {deposit.status}
      </span>
    </td>
    <td className="p-4 text-center text-sm">{new Date(deposit.blockedAt).toLocaleDateString('it-IT')}</td>
    <td className="p-4 text-center text-sm">{new Date(deposit.estimatedReleaseAt).toLocaleDateString('it-IT')}</td>
    <td className="p-4 text-right">
      <button onClick={onSelect} className="text-sm font-medium text-brand-blue hover:underline">Dettagli</button>
    </td>
  </tr>
);

const DepositCard: React.FC<{ deposit: Deposit; onSelect: () => void }> = ({ deposit, onSelect }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
        <div className="flex items-center space-x-4">
            <img src={deposit.itemImageUrl} alt={deposit.itemTitle} className="w-16 h-12 object-cover rounded-md" />
            <div>
                <p className="font-semibold">{deposit.itemTitle}</p>
                <p className="text-sm text-gray-500">Noleggiato da {deposit.renterName}</p>
            </div>
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t">
            <span className="text-gray-500">Importo:</span>
            <span className="font-semibold text-base">€{deposit.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Stato:</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(deposit.status)}`}>{deposit.status}</span>
        </div>
        <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
            <button onClick={onSelect} className="text-sm font-medium text-brand-blue hover:underline">Vedi Dettagli</button>
        </div>
    </div>
);


export const DepositTable: React.FC<DepositTableProps> = ({ deposits, onSelectDeposit }) => {
  if (deposits.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Non ci sono depositi da visualizzare.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="md:hidden space-y-4">
        {deposits.map(d => <DepositCard key={d.id} deposit={d} onSelect={() => onSelectDeposit(d)} />)}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="p-4 font-semibold">Oggetto</th>
              <th className="p-4 font-semibold">Renter</th>
              <th className="p-4 font-semibold text-center">Importo</th>
              <th className="p-4 font-semibold text-center">Stato</th>
              <th className="p-4 font-semibold text-center">Data blocco</th>
              <th className="p-4 font-semibold text-center">Rilascio stimato</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(d => <DepositRow key={d.id} deposit={d} onSelect={() => onSelectDeposit(d)} />)}
          </tbody>
        </table>
      </div>
    </>
  );
};
