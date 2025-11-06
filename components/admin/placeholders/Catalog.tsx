import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../../constants';
import type { Category } from '../../../types';

// Modal component for adding/editing categories and subcategories
interface CategoryModalProps {
    category: Partial<Category> | null;
    onClose: () => void;
    onSave: (category: Partial<Category>) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Category>>({ name: '', subcategories: [], icon: <></> });

    useEffect(() => {
        if (category) {
            setFormData({ ...category, subcategories: [...(category.subcategories || [])] }); // Create a copy
        } else {
            setFormData({ name: '', subcategories: [], icon: <div className="w-6 h-6 bg-gray-300 rounded" /> });
        }
    }, [category]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
    };

    const handleSubcategoryChange = (index: number, value: string) => {
        const newSubcategories = [...(formData.subcategories || [])];
        newSubcategories[index] = value;
        setFormData(prev => ({ ...prev, subcategories: newSubcategories }));
    };

    const addSubcategory = () => {
        setFormData(prev => ({ ...prev, subcategories: [...(prev.subcategories || []), ''] }));
    };

    const removeSubcategory = (index: number) => {
        const newSubcategories = [...(formData.subcategories || [])];
        newSubcategories.splice(index, 1);
        setFormData(prev => ({ ...prev, subcategories: newSubcategories }));
    };

    const handleSave = () => {
        if (!formData.name?.trim()) {
            alert("Il nome della categoria è obbligatorio.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">{category ? 'Modifica Categoria' : 'Nuova Categoria'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Categoria</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sottocategorie</label>
                        <div className="space-y-2 mt-2">
                            {(formData.subcategories || []).map((sub, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={sub}
                                        onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    <button onClick={() => removeSubcategory(index)} className="text-red-500 hover:text-red-700 p-2 rounded-md bg-red-50 hover:bg-red-100">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={addSubcategory} className="mt-2 text-sm font-semibold text-brand-blue hover:underline">
                            + Aggiungi Sottocategoria
                        </button>
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Annulla</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-blue text-white">Salva</button>
                </div>
            </div>
        </div>
    );
};

const Catalog: React.FC = () => {
    // We need state to re-render when the global MOCK is mutated
    const [localCategories, setLocalCategories] = useState(CATEGORIES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);

    const openModal = (category: Partial<Category> | null) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    };

    const handleSaveCategory = (categoryData: Partial<Category>) => {
        const categoryIndex = CATEGORIES.findIndex(c => c.name === (currentCategory?.name || ''));

        if (categoryIndex > -1) { // Editing
            CATEGORIES[categoryIndex] = { ...CATEGORIES[categoryIndex], ...categoryData } as Category;
        } else { // Adding
            CATEGORIES.push(categoryData as Category);
        }
        
        // Force re-render by updating local state
        setLocalCategories([...CATEGORIES]);
        closeModal();
    };
    
    const handleDeleteCategory = (categoryName: string) => {
        if (window.confirm(`Sei sicuro di voler eliminare la categoria "${categoryName}"?`)) {
            const index = CATEGORIES.findIndex(c => c.name === categoryName);
            if (index > -1) {
                CATEGORIES.splice(index, 1);
                setLocalCategories([...CATEGORIES]);
            }
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestione Catalogo</h2>
                <button onClick={() => openModal(null)} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg">
                    Aggiungi Categoria
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Categoria</th>
                            <th scope="col" className="px-6 py-3">Sottocategorie</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localCategories.map((cat) => (
                            <tr key={cat.name} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{cat.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {cat.subcategories?.map(sub => (
                                            <span key={sub} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{sub}</span>
                                        ))}
                                        {(!cat.subcategories || cat.subcategories.length === 0) && <span className="text-gray-400 text-xs">Nessuna</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => openModal(cat)} className="font-medium text-brand-blue hover:underline">Modifica</button>
                                    <button onClick={() => handleDeleteCategory(cat.name)} className="font-medium text-red-600 hover:underline">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <CategoryModal category={currentCategory} onClose={closeModal} onSave={handleSaveCategory} />}
        </div>
    );
};

export default Catalog;