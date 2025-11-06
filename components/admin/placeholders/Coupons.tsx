import React, { useState, useEffect } from 'react';
import { MOCK_COUPONS } from '../../../constants';
import type { Coupon } from '../../../types';

// Modal for adding/editing coupons
interface CouponModalProps {
    coupon: Partial<Coupon> | null;
    onClose: () => void;
    onSave: (coupon: Partial<Coupon>) => void;
}

const defaultCoupon: Partial<Coupon> = {
    code: '',
    type: 'percentage',
    value: 10,
    maxUsage: 100,
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    singleUsePerUser: true,
    isStackable: false,
};

const CouponModal: React.FC<CouponModalProps> = ({ coupon, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Coupon>>(defaultCoupon);

    useEffect(() => {
        setFormData(coupon ? { ...coupon } : { ...defaultCoupon });
    }, [coupon]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        
        let processedValue: any = value;
        if (type === 'number') {
            processedValue = value === '' ? null : parseFloat(value);
        } else if (type === 'checkbox') {
            processedValue = checked;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.value) {
            alert("Codice e valore sono obbligatori.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSave} className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">{coupon?.id ? 'Modifica Coupon' : 'Crea Coupon'}</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Codice</label>
                        <input name="code" value={formData.code || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                <option value="percentage">Percentuale (%)</option>
                                <option value="fixed">Fisso (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valore</label>
                            <input type="number" name="value" value={formData.value || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Utilizzi massimi</label>
                        <input type="number" name="maxUsage" value={formData.maxUsage || ''} onChange={handleChange} placeholder="Lascia vuoto per illimitato" className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data Inizio</label>
                            <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data Fine</label>
                            <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-semibold">Uso singolo per utente</p>
                                <p className="text-xs text-gray-500">Il coupon può essere usato solo una volta.</p>
                            </div>
                            <input type="checkbox" name="singleUsePerUser" checked={formData.singleUsePerUser} onChange={handleChange} className="h-5 w-5 rounded text-brand-blue focus:ring-brand-blue" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-semibold">Cumulabile</p>
                                <p className="text-xs text-gray-500">Può essere usato con altri sconti.</p>
                            </div>
                            <input type="checkbox" name="isStackable" checked={formData.isStackable} onChange={handleChange} className="h-5 w-5 rounded text-brand-blue focus:ring-brand-blue" />
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Annulla</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-brand-blue text-white">Salva Coupon</button>
                </div>
            </form>
        </div>
    );
};


const Coupons: React.FC = () => {
    const [coupons, setCoupons] = useState(MOCK_COUPONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState<Partial<Coupon> | null>(null);

    const handleOpenModal = (coupon: Partial<Coupon> | null = null) => {
        setCurrentCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCoupon(null);
    };

    const handleSaveCoupon = (couponData: Partial<Coupon>) => {
        if (couponData.id) { // Update
            const index = MOCK_COUPONS.findIndex(c => c.id === couponData.id);
            if (index > -1) MOCK_COUPONS[index] = { ...MOCK_COUPONS[index], ...couponData } as Coupon;
        } else { // Create
            const newCoupon: Coupon = {
                id: Date.now(),
                usageCount: 0,
                createdAt: new Date().toISOString(),
                ...defaultCoupon,
                ...couponData,
            } as Coupon;
            MOCK_COUPONS.push(newCoupon);
        }
        setCoupons([...MOCK_COUPONS]);
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questo coupon?')) {
            const index = MOCK_COUPONS.findIndex(c => c.id === id);
            if (index > -1) MOCK_COUPONS.splice(index, 1);
            setCoupons([...MOCK_COUPONS]);
        }
    };

    const handleToggleActive = (id: number) => {
        const index = MOCK_COUPONS.findIndex(c => c.id === id);
        if (index > -1) MOCK_COUPONS[index].isActive = !MOCK_COUPONS[index].isActive;
        setCoupons([...MOCK_COUPONS]);
    };
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('it-IT');
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestione Coupon</h2>
                <button onClick={() => handleOpenModal()} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg">
                    Aggiungi Coupon
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Codice</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Valore</th>
                            <th scope="col" className="px-6 py-3">Utilizzi</th>
                            <th scope="col" className="px-6 py-3">Validità</th>
                            <th scope="col" className="px-6 py-3">Stato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono font-bold">{coupon.code}</td>
                                <td className="px-6 py-4">{coupon.type === 'percentage' ? 'Percentuale' : 'Fisso'}</td>
                                <td className="px-6 py-4">{coupon.type === 'percentage' ? `${coupon.value}%` : `€${coupon.value}`}</td>
                                <td className="px-6 py-4">{coupon.usageCount} / {coupon.maxUsage || '∞'}</td>
                                <td className="px-6 py-4">{formatDate(coupon.startDate)} - {coupon.endDate ? formatDate(coupon.endDate) : 'Senza Scadenza'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {coupon.isActive ? 'Attivo' : 'Inattivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                    <button onClick={() => handleOpenModal(coupon)} className="font-medium text-blue-600 hover:underline">Modifica</button>
                                    <button onClick={() => handleToggleActive(coupon.id)} className="font-medium text-brand-blue hover:underline">
                                        {coupon.isActive ? 'Disattiva' : 'Attiva'}
                                    </button>
                                     <button onClick={() => handleDelete(coupon.id)} className="font-medium text-red-600 hover:underline">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <CouponModal coupon={currentCoupon} onClose={handleCloseModal} onSave={handleSaveCoupon} />}
        </div>
    );
};

export default Coupons;