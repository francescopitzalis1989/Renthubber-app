import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_USERS, SUPERHUBBER_CRITERIA, MOCK_ADMIN_ROLES } from '../../../constants';
import type { User, UserRole, AdminRole } from '../../../types';

// --- Reusable Components ---

const TabButton: React.FC<{ name: string; tab: string; activeTab: string; count?: number; setActiveTab: (tab: any) => void; }> = ({ name, tab, activeTab, count, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`${
            activeTab === tab
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
    >
        <span>{name}</span>
        {count !== undefined && count > 0 && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>}
    </button>
);

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">{title}</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

// --- User Edit Modal ---

const UserEditModal: React.FC<{ user: User; adminUser: User; onClose: () => void; onSave: (user: User) => void; }> = ({ user, adminUser, onClose, onSave }) => {
    const [formData, setFormData] = useState(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role: UserRole, isChecked: boolean) => {
        const newRoles = isChecked
            ? [...(formData.roles || []), role]
            : (formData.roles || []).filter(r => r !== role);
        setFormData({ ...formData, roles: newRoles });
    };
    
    const handleAdminRoleChange = (role: AdminRole, isChecked: boolean) => {
        const newAdminRoles = isChecked
            ? [...(formData.adminRoles || []), role]
            : (formData.adminRoles || []).filter(r => r !== role);
        setFormData({ ...formData, adminRoles: newAdminRoles });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 1024 * 1024) { // 1MB limit
                alert("L'immagine è troppo grande. La dimensione massima è 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal onClose={onClose} title={`Modifica Utente: ${user.firstName} ${user.lastName}`}>
            <div className="p-6 space-y-4 overflow-y-auto">
                <div className="flex items-center space-x-4">
                    <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                    <div>
                        <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-semibold text-brand-blue hover:underline">
                            Cambia Foto
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleAvatarChange}
                        />
                        <p className="text-xs text-gray-500">PNG o JPG, max 1MB.</p>
                    </div>
                </div>
                {/* General Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Nome</label><input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Cognome</label><input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Telefono</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                
                {/* User Roles */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ruoli Piattaforma</label>
                    <div className="flex space-x-4 mt-2">
                        <label className="flex items-center space-x-2"><input type="checkbox" checked={formData.roles.includes('renter')} onChange={e => handleRoleChange('renter', e.target.checked)} /> <span>Renter</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" checked={formData.roles.includes('hubber')} onChange={e => handleRoleChange('hubber', e.target.checked)} /> <span>Hubber</span></label>
                    </div>
                </div>

                {/* Admin Roles (only for main admin) */}
                {adminUser.isAdmin && (
                    <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700">Ruoli Amministrativi</label>
                        <div className="flex space-x-4 mt-2">
                            {MOCK_ADMIN_ROLES.map(role => (
                                <label key={role} className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.adminRoles?.includes(role) || false} 
                                        onChange={e => handleAdminRoleChange(role, e.target.checked)}
                                        disabled={formData.id === adminUser.id} // Main admin can't change own roles
                                    /> 
                                    <span>{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
                <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Annulla</button>
                <button onClick={() => onSave(formData)} className="px-4 py-2 rounded-lg bg-brand-blue text-white">Salva</button>
            </div>
        </Modal>
    );
};

// --- Verification Modal ---

const VerificationModal: React.FC<{ user: User; onClose: () => void; onApprove: (userId: number) => void; }> = ({ user, onClose, onApprove }) => (
    <Modal onClose={onClose} title={`Verifica Documento: ${user.firstName} ${user.lastName}`}>
        <div className="p-6 space-y-4 overflow-y-auto">
            <h3 className="font-semibold">Dettagli Utente</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Data di Nascita:</strong> {new Date(user.dateOfBirth).toLocaleDateString('it-IT')}</p>
            <h3 className="font-semibold mt-4">Documento d'Identità (Simulato)</h3>
            <div className="bg-gray-100 border rounded-lg p-4 flex justify-center">
                <img src={`https://via.placeholder.com/400x250.png?text=Documento+ID+di+${user.firstName}`} alt="Mock ID Document" className="rounded-md" />
            </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Rifiuta</button>
            <button onClick={() => onApprove(user.id)} className="px-4 py-2 rounded-lg bg-green-600 text-white">Approva</button>
        </div>
    </Modal>
);

// --- Tab Components ---

const AllUsersTab: React.FC<{ adminUser: User; onUserUpdate: (user: User) => void }> = ({ adminUser, onUserUpdate }) => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSave = (updatedUser: User) => {
        onUserUpdate(updatedUser);
        setUsers([...MOCK_USERS]); // Re-sync local state from the mutated global mock
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Utente</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Ruoli</th>
                            <th scope="col" className="px-6 py-3">Verificato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                                    <span>{user.firstName} {user.lastName}</span>
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="capitalize">{user.roles.join(', ')}</span>
                                        {user.adminRoles && user.adminRoles.length > 0 && <span className="text-xs text-blue-600 font-semibold">{user.adminRoles.join(', ')}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{user.isVerified ? '✅' : '❌'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(user)} className="font-medium text-brand-blue hover:underline">Modifica</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && selectedUser && <UserEditModal user={selectedUser} adminUser={adminUser} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </>
    );
};

const VerificationTab: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState(() => MOCK_USERS.filter(u => !u.isVerified));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleVerifyClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleApprove = (userId: number) => {
        const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            MOCK_USERS[userIndex].isVerified = true;
        }
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                {pendingUsers.length > 0 ? (
                     <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                             <tr>
                                 <th scope="col" className="px-6 py-3">Utente</th>
                                 <th scope="col" className="px-6 py-3">Email</th>
                                 <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                             </tr>
                         </thead>
                         <tbody>
                            {pendingUsers.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{user.firstName} {user.lastName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleVerifyClick(user)} className="font-medium text-brand-blue hover:underline">Verifica</button>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                     </table>
                ) : (
                    <p className="text-center p-8 text-gray-500">Nessuna richiesta di verifica in sospeso.</p>
                )}
            </div>
            {isModalOpen && selectedUser && <VerificationModal user={selectedUser} onClose={() => setIsModalOpen(false)} onApprove={handleApprove} />}
        </>
    );
};

const SuperHubberTab: React.FC = () => {
    const [criteria, setCriteria] = useState(SUPERHUBBER_CRITERIA);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasChanges(true);
        setCriteria({ ...criteria, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSave = () => {
        Object.assign(SUPERHUBBER_CRITERIA, criteria);
        setHasChanges(false);
        alert('Criteri SuperHubber salvati!');
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm mb-6">
                <p><strong>Nota:</strong> I Superhubber vengono rivalutati automaticamente ogni 90 giorni in base a questi criteri.</p>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Valutazione media minima (1-5)</label>
                    <input type="number" name="rating" value={criteria.rating} onChange={handleChange} step="0.1" min="1" max="5" className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giorni totali di noleggio minimi</label>
                    <input type="number" name="rentalDays" value={criteria.rentalDays} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tasso di risposta minimo (%)</label>
                    <input type="number" name="responseRate" value={criteria.responseRate} onChange={handleChange} min="0" max="100" className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Numero massimo di cancellazioni</label>
                    <input type="number" name="cancellations" value={criteria.cancellations} onChange={handleChange} min="0" className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div className="text-right pt-4">
                    <button onClick={handleSave} disabled={!hasChanges} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-300">
                        Salva Criteri
                    </button>
                </div>
            </div>
        </div>
    );
};

const RolesTab: React.FC = () => {
    const [roles, setRoles] = useState(MOCK_ADMIN_ROLES);
    const [newRoleName, setNewRoleName] = useState('');

    const handleAddRole = () => {
        if (newRoleName.trim() && !roles.includes(newRoleName.trim())) {
            MOCK_ADMIN_ROLES.push(newRoleName.trim());
            setRoles([...MOCK_ADMIN_ROLES]);
            setNewRoleName('');
        }
    };

    const handleDeleteRole = (roleToDelete: string) => {
        if (window.confirm(`Sei sicuro di voler eliminare il ruolo "${roleToDelete}"?`)) {
            const index = MOCK_ADMIN_ROLES.indexOf(roleToDelete);
            if (index > -1) {
                MOCK_ADMIN_ROLES.splice(index, 1);
            }
            setRoles([...MOCK_ADMIN_ROLES]);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Gestione Ruoli Amministrativi</h3>
            <div className="flex space-x-2 mb-6">
                <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Nome nuovo ruolo"
                    className="w-full p-2 border rounded-md"
                />
                <button onClick={handleAddRole} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg whitespace-nowrap">
                    Crea Ruolo
                </button>
            </div>
            <div className="space-y-2">
                {roles.map(role => (
                    <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{role}</span>
                        <button onClick={() => handleDeleteRole(role)} className="text-red-500 hover:text-red-700 text-sm font-semibold">
                            Elimina
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Component ---

interface UsersManagementProps {
    adminUser: User;
    onUserUpdate: (user: User) => void;
}

export const UsersManagement: React.FC<UsersManagementProps> = ({ adminUser, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'verification' | 'superhubber' | 'roles'>('all');
    // Using a state to force re-render when global mock changes
    const [usersVersion, setUsersVersion] = useState(0); 

    const verificationCount = useMemo(() => MOCK_USERS.filter(u => !u.isVerified).length, [usersVersion]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestione Utenti</h2>
            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton name="Tutti gli Utenti" tab="all" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Verifica Account" tab="verification" activeTab={activeTab} setActiveTab={setActiveTab} count={verificationCount} />
                    <TabButton name="Criteri SuperHubber" tab="superhubber" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Ruoli & Permessi" tab="roles" activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>
            
            <div>
                {activeTab === 'all' && <AllUsersTab adminUser={adminUser} onUserUpdate={onUserUpdate} />}
                {activeTab === 'verification' && <VerificationTab />}
                {activeTab === 'superhubber' && <SuperHubberTab />}
                {activeTab === 'roles' && <RolesTab />}
            </div>
        </div>
    );
};