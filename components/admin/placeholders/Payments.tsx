

import React, { useState, useMemo } from 'react';
import { MOCK_WITHDRAWALS, MOCK_USERS } from '../../../constants';
import type { Withdrawal } from '../../../types';

const statusMap: { [key in Withdrawal['status']]: { text: string; className: string } } = {
    pending: { text: 'In attesa', className: 'bg-yellow-100 text-yellow-800' },
    completed: { text: 'Completato', className: 'bg-green-100 text-green-800' },
    failed: { text: 'Fallito', className: 'bg-red-100 text-red-800' },
};

const PayoutRequests: React.FC = () => {
    const [withdrawals, setWithdrawals] = useState(MOCK_WITHDRAWALS);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
    const usersMap = useMemo(() => new Map(MOCK_USERS.map(u => [u.id, u])), []);

    const handleApprove = (id: number) => {
        const index = MOCK_WITHDRAWALS.findIndex(w => w.id === id);
        if (index > -1) {
            MOCK_WITHDRAWALS[index].status = 'completed';
            setWithdrawals([...MOCK_WITHDRAWALS]);
        }
    };

    const filteredWithdrawals = useMemo(() => {
        const sorted = [...withdrawals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (filter === 'all') return sorted;
        return sorted.filter(w => w.status === filter);
    }, [withdrawals, filter]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Richieste di Payout</h2>
                <div className="flex items-center space-x-2">
                    <FilterButton text="In Attesa" filter="pending" activeFilter={filter} onClick={setFilter} />
                    <FilterButton text="Completate" filter="completed" activeFilter={filter} onClick={setFilter} />
                    <FilterButton text="Tutte" filter="all" activeFilter={filter} onClick={setFilter} />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Hubber</th>
                            <th scope="col" className="px-6 py-3">Importo</th>
                            <th scope="col" className="px-6 py-3">Metodo</th>
                            <th scope="col" className="px-6 py-3">Dettagli Pagamento</th>
                            <th scope="col" className="px-6 py-3">Stato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWithdrawals.map(w => {
                            const hubber = usersMap.get(w.hubberId);
                            const statusInfo = statusMap[w.status];
                            return (
                                <tr key={w.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{new Date(w.timestamp).toLocaleDateString('it-IT')}</td>
                                    <td className="px-6 py-4 font-medium">{hubber?.firstName} {hubber?.lastName}</td>
                                    <td className="px-6 py-4 font-semibold">€{w.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 capitalize">{w.method}</td>
                                    <td className="px-6 py-4 text-xs font-mono">{w.paymentDetails.iban || w.paymentDetails.paypalEmail}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {w.status === 'pending' && (
                                            <button onClick={() => handleApprove(w.id)} className="font-medium text-green-600 hover:underline">Approva</button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {filteredWithdrawals.length === 0 && (
                    <p className="text-center p-8 text-gray-500">Nessuna richiesta di payout in questa categoria.</p>
                )}
            </div>
        </div>
    );
};

const FilterButton: React.FC<{ text: string; filter: string; activeFilter: string; onClick: (filter: any) => void }> = ({ text, filter, activeFilter, onClick }) => (
    <button
        onClick={() => onClick(filter)}
        className={`px-3 py-1 text-sm font-semibold rounded-full ${activeFilter === filter ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-700'}`}
    >
        {text}
    </button>
);

export default PayoutRequests;