import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_ITEMS, MOCK_USERS, CATEGORIES } from '../../../constants';
import type { Item } from '../../../types';

type ItemStatus = 'Attivo' | 'Bozza' | 'In revisione' | 'Sospeso';
const ALL_STATUSES: ItemStatus[] = ['Attivo', 'Bozza', 'In revisione', 'Sospeso'];

const defaultItem: Partial<Item> = {
    title: '',
    category: '',
    description: '',
    imageUrls: [],
    location: '',
    price: 0,
    status: 'Bozza',
    cancellationPolicy: 'Moderata',
};

interface ListingEditModalProps {
    item: Partial<Item> | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Partial<Item>) => void;
}

const ListingEditModal: React.FC<ListingEditModalProps> = ({ item, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Item>>(defaultItem);

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            setFormData(defaultItem);
        }
    }, [item, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">{item?.id ? 'Modifica Annuncio' : 'Crea Annuncio'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* General Info */}
                    <InputField label="Titolo" name="title" value={formData.title || ''} onChange={handleChange} />
                    <TextAreaField label="Descrizione" name="description" value={formData.description || ''} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Categoria" name="category" value={formData.category || ''} onChange={handleChange} options={CATEGORIES.map(c => c.name)} />
                        <InputField label="Località" name="location" value={formData.location || ''} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Stato" name="status" value={formData.status || ''} onChange={handleChange} options={ALL_STATUSES} />
                        <SelectField label="Policy Cancellazione" name="cancellationPolicy" value={formData.cancellationPolicy || ''} onChange={handleChange} options={['Flessibile', 'Moderata', 'Rigida']} />
                    </div>
                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Prezzo Giornaliero (€)" name="price" type="number" value={formData.price || ''} onChange={handlePriceChange} />
                        <InputField label="Deposito Cauzionale (€)" name="securityDeposit" type="number" value={formData.securityDeposit || ''} onChange={handlePriceChange} />
                    </div>
                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Immagini</label>
                        {formData.imageUrls?.map((url, index) => (
                             <div key={index} className="flex items-center space-x-2 mb-2">
                                <input type="text" value={url} className="w-full p-2 border rounded-md" readOnly/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border">Annulla</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-blue text-white">Salva Modifiche</button>
                </div>
            </div>
        </div>
    );
};

// Helper components for the modal form
const InputField: React.FC<any> = ({ label, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input {...props} className="w-full p-2 border rounded-md" /></div>);
const TextAreaField: React.FC<any> = ({ label, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><textarea {...props} rows={4} className="w-full p-2 border rounded-md" /></div>);
const SelectField: React.FC<any> = ({ label, options, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><select {...props} className="w-full p-2 border rounded-md bg-white">{options.map((o: string) => <option key={o} value={o}>{o}</option>)}</select></div>);


const ActionsMenu: React.FC<{ item: Item; onAction: (action: string) => void; }> = ({ item, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100">⋮</button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border">
                    <button onClick={() => { onAction('edit'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Modifica</button>
                    {item.status === 'In revisione' && <button onClick={() => { onAction('approve'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100">Approva</button>}
                    {item.status !== 'Sospeso' && <button onClick={() => { onAction('suspend'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100">Sospendi</button>}
                    <button onClick={() => { onAction('delete'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Elimina</button>
                </div>
            )}
        </div>
    );
};

export const ListingsManagement: React.FC = () => {
    const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<Item> | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, searchTerm, statusFilter]);

    const handleAction = (id: number, action: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        switch (action) {
            case 'edit':
                setCurrentItem(item);
                setIsModalOpen(true);
                break;
            case 'approve':
                handleUpdateStatus(id, 'Attivo');
                break;
            case 'suspend':
                if (window.confirm(`Sei sicuro di voler sospendere l'annuncio "${item.title}"?`)) {
                    handleUpdateStatus(id, 'Sospeso');
                }
                break;
            case 'delete':
                if (window.confirm(`Sei sicuro di voler eliminare l'annuncio "${item.title}"?`)) {
                    setItems(prev => prev.filter(i => i.id !== id));
                }
                break;
        }
    };
    
    const handleUpdateStatus = (id: number, status: ItemStatus) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    const handleSaveItem = (itemData: Partial<Item>) => {
        if (itemData.id) { // Update existing
            setItems(prev => prev.map(i => i.id === itemData.id ? { ...i, ...itemData } : i));
        } else { // Create new
            const newItem: Item = {
                ...defaultItem,
                ...itemData,
                id: Date.now(), // Mock ID
                owner: MOCK_USERS.find(u => u.isAdmin)!.billingInfo ? { ...MOCK_ITEMS[0].owner, name: 'Admin' } : MOCK_ITEMS[0].owner,
            } as Item;
            setItems(prev => [newItem, ...prev]);
        }
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Revisione Annunci</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <input type="text" placeholder="Cerca per titolo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border rounded-lg w-full md:w-48" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="p-2 border rounded-lg bg-white">
                        <option value="all">Tutti gli stati</option>
                        {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Annuncio</th>
                            <th scope="col" className="px-6 py-3">Proprietario</th>
                            <th scope="col" className="px-6 py-3">Stato</th>
                            <th scope="col" className="px-6 py-3">Prezzo/giorno</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</td>
                                <td className="px-6 py-4">{item.owner.name}</td>
                                <td className="px-6 py-4">{item.status || 'Attivo'}</td>
                                <td className="px-6 py-4">€{item.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <ActionsMenu item={item} onAction={(action) => handleAction(item.id, action)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredItems.length === 0 && <p className="text-center p-8 text-gray-500">Nessun annuncio trovato.</p>}
            </div>

            <ListingEditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={currentItem}
                onSave={handleSaveItem}
            />
        </div>
    );
};