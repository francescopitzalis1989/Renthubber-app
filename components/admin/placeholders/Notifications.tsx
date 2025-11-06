import React, { useState, useEffect } from 'react';
import { MOCK_AUTOMATED_EMAILS } from '../../../constants';
import type { AutomatedEmail } from '../../../types';

const defaultNewEmail: Partial<AutomatedEmail> = {
    name: '',
    description: '',
    subject: '',
    recipientType: 'new_user',
    format: 'html',
    body: `<!DOCTYPE html>
<html>
<head>
<style> body { font-family: sans-serif; } </style>
</head>
<body>
  <h1>{{subject}}</h1>
  <p>Contenuto della tua email qui...</p>
</body>
</html>`,
    includeLogo: true,
    isActive: false,
    availableVariables: ['{{user_name}}', '{{item_title}}']
};


interface EmailEditorModalProps {
    email: Partial<AutomatedEmail> | null;
    onClose: () => void;
    onSave: (email: Partial<AutomatedEmail>) => void;
}

const EmailEditorModal: React.FC<EmailEditorModalProps> = ({ email, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<AutomatedEmail>>(
        () => email ? { ...email } : { ...defaultNewEmail }
    );

    useEffect(() => {
        setFormData(email ? { ...email } : { ...defaultNewEmail });
    }, [email]);

    if (!formData) return null;

    const isCreating = !email?.id;
    const isSystemEmail = email?.id && !email.id.startsWith('custom_');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => prev ? { ...prev, [name]: isCheckbox ? checked : value } : null);
    };

    const handleSave = () => {
        if (formData && formData.name && formData.subject) {
            onSave(formData);
        } else {
            alert("Nome e oggetto sono obbligatori.");
        }
    };
    
    const recipientMap: Record<AutomatedEmail['recipientType'], string> = { 'new_user': 'Nuovo Utente', 'renter': 'Renter', 'hubber': 'Hubber' };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">{isCreating ? 'Crea Nuovo' : 'Modifica'} Template Email</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome Template</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Destinatario</label>
                            <select name="recipientType" value={formData.recipientType} onChange={handleChange} disabled={isSystemEmail} className="w-full mt-1 p-2 border rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed">
                                {Object.entries(recipientMap).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            {isSystemEmail && <p className="text-xs text-gray-500 mt-1">Il destinatario non può essere modificato per i template di sistema.</p>}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Descrizione</label>
                        <input name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                    <hr/>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Oggetto Email</label>
                        <input name="subject" value={formData.subject} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center"><input type="radio" name="format" value="text" checked={formData.format === 'text'} onChange={handleChange} className="mr-2" /> Testo Semplice</label>
                            <label className="flex items-center"><input type="radio" name="format" value="html" checked={formData.format === 'html'} onChange={handleChange} className="mr-2" /> HTML</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Corpo del Messaggio</label>
                        <textarea name="body" value={formData.body} onChange={handleChange} rows={15} className="w-full mt-1 p-2 border rounded-md font-mono text-xs" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Variabili Disponibili</label>
                            <p className="text-xs text-gray-500">Separare le variabili con una virgola (es. `{"{{user_name}}"}, {"{{booking_id}}"})</p>
                            <input
                                type="text"
                                value={formData.availableVariables?.join(', ') || ''}
                                onChange={e => {
                                    const vars = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
                                    setFormData(prev => prev ? { ...prev, availableVariables: vars } : null);
                                }}
                                disabled={isSystemEmail}
                                className="w-full mt-1 p-2 border rounded-md font-mono text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                             {isSystemEmail && <p className="text-xs text-gray-500 mt-1">Le variabili non possono essere modificate per i template di sistema.</p>}
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Opzioni</label>
                             <div className="mt-2 space-y-2">
                                 <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" name="includeLogo" checked={formData.includeLogo} onChange={handleChange} className="h-4 w-4 rounded text-brand-blue focus:ring-brand-blue"/>
                                    <span className="text-sm">Includi logo in testata</span>
                                 </label>
                             </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border bg-white">Annulla</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-blue text-white">
                        {isCreating ? 'Crea Template' : 'Salva Modifiche'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AutomatedEmailsManagement: React.FC = () => {
    const [emails, setEmails] = useState(MOCK_AUTOMATED_EMAILS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmail, setCurrentEmail] = useState<Partial<AutomatedEmail> | null>(null);

    const handleOpenModal = (email: Partial<AutomatedEmail> | null) => {
        setCurrentEmail(email);
        setIsModalOpen(true);
    };

    const handleSaveEmail = (updatedEmailData: Partial<AutomatedEmail>) => {
        if (updatedEmailData.id) { // Update existing email
            const index = MOCK_AUTOMATED_EMAILS.findIndex(e => e.id === updatedEmailData.id);
            if (index > -1) {
                MOCK_AUTOMATED_EMAILS[index] = { ...MOCK_AUTOMATED_EMAILS[index], ...updatedEmailData } as AutomatedEmail;
            }
        } else { // Create new email
            const newEmail: AutomatedEmail = {
                ...defaultNewEmail,
                ...updatedEmailData,
                id: `custom_${Date.now()}`, // Create a unique ID
            } as AutomatedEmail;
            MOCK_AUTOMATED_EMAILS.push(newEmail);
        }
        setEmails([...MOCK_AUTOMATED_EMAILS]);
        setIsModalOpen(false);
        setCurrentEmail(null);
    };

    const handleToggleActive = (id: string, isActive: boolean) => {
        const index = MOCK_AUTOMATED_EMAILS.findIndex(e => e.id === id);
        if (index > -1) {
            MOCK_AUTOMATED_EMAILS[index].isActive = isActive;
        }
        setEmails([...MOCK_AUTOMATED_EMAILS]);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Email Automatiche</h2>
                    <p className="text-gray-600">Modifica i template per le email transazionali e creane di nuovi.</p>
                </div>
                 <button onClick={() => handleOpenModal(null)} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg whitespace-nowrap self-start sm:self-center">
                    Crea Nuovo Template
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome Template</th>
                            <th scope="col" className="px-6 py-3">Oggetto</th>
                            <th scope="col" className="px-6 py-3">Destinatario</th>
                            <th scope="col" className="px-6 py-3">Stato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails.map(email => (
                            <tr key={email.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{email.name}</td>
                                <td className="px-6 py-4">{email.subject}</td>
                                <td className="px-6 py-4 capitalize">{email.recipientType.replace('_', ' ')}</td>
                                <td className="px-6 py-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={email.isActive} onChange={(e) => handleToggleActive(email.id, e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModal(email)} className="font-medium text-brand-blue hover:underline">Modifica</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <EmailEditorModal
                    email={currentEmail}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEmail}
                />
            )}
        </div>
    );
};

export default AutomatedEmailsManagement;