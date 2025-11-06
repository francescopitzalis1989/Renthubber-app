import React, { useMemo } from 'react';
import type { Deposit } from '../../types';
import { WalletIcon, ShieldCheckIcon, StarIcon } from '../Icons';

interface DepositStatsProps {
  deposits: Deposit[];
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4">
        <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export const DepositStats: React.FC<DepositStatsProps> = ({ deposits }) => {
  const stats = useMemo(() => {
    return deposits.reduce((acc, deposit) => {
      if (deposit.status === 'ATTIVO') acc.active++;
      if (deposit.status === 'IN DISPUTA') acc.disputed++;
      if (deposit.status === 'RILASCIATO') acc.released++;
      return acc;
    }, { active: 0, disputed: 0, released: 0 });
  }, [deposits]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Depositi attivi" value={stats.active} icon={<WalletIcon className="w-6 h-6"/>} />
        <StatCard title="Depositi in disputa" value={stats.disputed} icon={<ShieldCheckIcon className="w-6 h-6"/>} />
        <StatCard title="Depositi rilasciati" value={stats.released} icon={<StarIcon className="w-6 h-6"/>} />
    </div>
  );
};
