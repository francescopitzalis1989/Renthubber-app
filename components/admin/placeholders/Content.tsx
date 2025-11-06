import React, { useState, useMemo } from 'react';
import { MOCK_CMS_PAGES } from '../../../constants';
import type { CMSPage, CMSPagePlacement } from '../../../types';

const defaultPage: Omit<CMSPage, 'id'> = {
    title: '',
    content: '',
    format: 'text',
    placement: 'none',
};

const placementOptions: { value: CMSPagePlacement, label: string }[] = [
    { value: 'none', label: 'Nessuno (Non visualizzato)' },
    { value: 'footer-support', label: 'Supporto (Footer)' },
    { value: 'footer-community', label: 'Community (Footer)' },
    { value: 'footer-hosting', label: 'Offri a noleggio (Footer)' },
    { value: 'footer-info', label: 'Informazioni (Footer)' },
];

interface ContentModalProps {
    page: Partial<CMSPage> | null;
    onClose: () => void;
    onSave: (page: Partial<CMSPage>) => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ page, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<CMSPage>>(page || defaultPage);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
     const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as 'text' | 'html' }));
    };

    const handleSave = () => {
        if (!formData.title) {
            alert('Il titolo è obbligatorio.');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">{page?.id ? 'Modifica Pagina' : 'Crea Nuova Pagina'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titolo Pagina</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Posizionamento</label>
                            <select name="placement" value={formData.placement} onChange={handleChange} className="w-full p-2 border rounded-md bg-white">
                                {placementOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Formato Contenuto</label>
                             <div className="flex items-center space-x-4 mt-2">
                                <label><input type="radio" name="format" value="text" checked={formData.format === 'text'} onChange={handleRadioChange} /> Testo Semplice</label>
                                <label><input type="radio" name="format" value="html" checked={formData.format === 'html'} onChange={handleRadioChange} /> HTML</label>
                             </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows={12} className="w-full p-2 border rounded-md font-mono text-sm" />
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Annulla</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-blue text-white">Salva Pagina</button>
                </div>
            </div>
        </div>
    );
};


const Content: React.FC = () => {
    const [pages, setPages] = useState(MOCK_CMS_PAGES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Partial<CMSPage> | null>(null);

    const handleOpenModal = (page: Partial<CMSPage> | null = null) => {
        setCurrentPage(page);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPage(null);
    };

    const handleSavePage = (pageData: Partial<CMSPage>) => {
        if (pageData.id) { // Update
            const index = MOCK_CMS_PAGES.findIndex(p => p.id === pageData.id);
            if (index > -1) MOCK_CMS_PAGES[index] = pageData as CMSPage;
        } else { // Create
            const newPage: CMSPage = { ...defaultPage, ...pageData, id: Date.now() };
            MOCK_CMS_PAGES.push(newPage);
        }
        setPages([...MOCK_CMS_PAGES]);
        handleCloseModal();
    };

    const handleDeletePage = (pageId: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questa pagina?')) {
            const index = MOCK_CMS_PAGES.findIndex(p => p.id === pageId);
            if (index > -1) MOCK_CMS_PAGES.splice(index, 1);
            setPages([...MOCK_CMS_PAGES]);
        }
    };

    const getPlacementLabel = (placement: CMSPagePlacement) => {
        return placementOptions.find(p => p.value === placement)?.label || 'N/A';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestione Contenuti (CMS)</h2>
                 <button onClick={() => handleOpenModal()} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg">
                    Crea Nuova Pagina
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Titolo</th>
                            <th scope="col" className="px-6 py-3">Posizionamento</th>
                            <th scope="col" className="px-6 py-3">Formato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map(page => (
                            <tr key={page.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{page.title}</td>
                                <td className="px-6 py-4">{getPlacementLabel(page.placement)}</td>
                                <td className="px-6 py-4 uppercase font-mono text-xs">{page.format}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => handleOpenModal(page)} className="font-medium text-brand-blue hover:underline">Modifica</button>
                                    <button onClick={() => handleDeletePage(page.id)} className="font-medium text-red-600 hover:underline">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {isModalOpen && <ContentModal page={currentPage} onClose={handleCloseModal} onSave={handleSavePage} />}
        </div>
    );
};

export default Content;