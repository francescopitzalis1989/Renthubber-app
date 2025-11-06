
import React from 'react';
import { MOCK_AUDIT_LOGS, MOCK_USERS } from '../../../constants';

const AuditLogs: React.FC = () => {
    const adminUsers = new Map(MOCK_USERS.filter(u => u.isAdmin).map(u => [u.id, u]));

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Log & Audit</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Admin</th>
                            <th scope="col" className="px-6 py-3">Azione</th>
                            <th scope="col" className="px-6 py-3">Dettagli</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_AUDIT_LOGS.map(log => (
                            <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString('it-IT')}</td>
                                <td className="px-6 py-4">{adminUsers.get(log.adminId)?.firstName || 'N/A'}</td>
                                <td className="px-6 py-4 font-mono text-xs">{log.action}</td>
                                <td className="px-6 py-4">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
