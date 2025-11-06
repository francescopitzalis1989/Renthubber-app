import React, { useState } from 'react';
import { MOCK_SITE_SETTINGS } from '../../../constants';
import type { SiteSettings } from '../../../types';

const GeneralSettings: React.FC = () => {
     const [settings, setSettings] = useState({
        renterFee: 5,
        hubberCommission: 10,
        maintenanceMode: false,
        newRegistrations: true,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        alert('Impostazioni salvate!');
    };

    return (
         <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Commissione Renter (%)</label>
                    <input type="number" name="renterFee" value={settings.renterFee} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Commissione Hubber (%)</label>
                    <input type="number" name="hubberCommission" value={settings.hubberCommission} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <p className="font-semibold">Modalità Manutenzione</p>
                        <p className="text-sm text-gray-500">Disabilita l'accesso al sito per gli utenti non amministratori.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleInputChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <p className="font-semibold">Abilita Nuove Registrazioni</p>
                        <p className="text-sm text-gray-500">Consenti a nuovi utenti di registrarsi sulla piattaforma.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="newRegistrations" checked={settings.newRegistrations} onChange={handleInputChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                </div>
                <div className="text-right">
                    <button onClick={handleSave} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg">
                        Salva Impostazioni
                    </button>
                </div>
            </div>
        </div>
    );
};

const PaymentGateways: React.FC = () => {
    const [gateways, setGateways] = useState({
        stripeSecret: '',
        stripePublic: '',
        paypalId: '',
        paypalSecret: '',
        bankDetails: 'Nome Banca: \nIBAN: \nIntestatario:'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGateways(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSave = () => {
        alert('Impostazioni Gateway di Pagamento salvate!');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <div className="space-y-8">
                {/* Stripe */}
                <div className="border-b pb-6">
                    <h3 className="text-lg font-bold">Stripe</h3>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chiave Pubblica</label>
                            <input type="text" name="stripePublic" value={gateways.stripePublic} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="pk_test_..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chiave Segreta</label>
                            <input type="password" name="stripeSecret" value={gateways.stripeSecret} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="sk_test_..." />
                        </div>
                    </div>
                </div>

                {/* PayPal */}
                <div className="border-b pb-6">
                    <h3 className="text-lg font-bold">PayPal</h3>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Client ID</label>
                            <input type="text" name="paypalId" value={gateways.paypalId} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                            <input type="password" name="paypalSecret" value={gateways.paypalSecret} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Bank Transfer */}
                <div>
                    <h3 className="text-lg font-bold">Bonifico Bancario</h3>
                     <p className="text-sm text-gray-500 mb-2">Questi dati verranno mostrati agli Hubber per i payout manuali.</p>
                    <textarea name="bankDetails" value={gateways.bankDetails} onChange={handleChange} rows={4} className="w-full mt-1 p-2 border rounded-md font-mono text-sm" />
                </div>
                 <div className="text-right">
                    <button onClick={handleSave} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg">
                        Salva Gateway
                    </button>
                </div>
            </div>
        </div>
    );
};

const BrandingAndSeo: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings>(MOCK_SITE_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setSettings(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
        setHasChanges(true);
    };
    
    // Mock file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setSettings(prev => ({ ...prev, [field]: event.target?.result as string }));
                setHasChanges(true);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = () => {
        Object.assign(MOCK_SITE_SETTINGS, settings);
        setHasChanges(false);
        alert('Impostazioni Branding & SEO salvate!');
    };
    
    const FileUploadInput: React.FC<{ label: string, field: keyof SiteSettings, currentUrl: string }> = ({ label, field, currentUrl }) => (
         <div className="flex items-center space-x-4">
            <img src={currentUrl} alt={label} className="w-16 h-16 object-contain border p-1 rounded-md bg-gray-50" />
            <div>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input type="file" onChange={(e) => handleFileChange(e, field)} className="mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl">
            <div className="space-y-8">
                {/* Branding */}
                <section>
                    <h3 className="text-lg font-bold">Branding del Sito</h3>
                    <div className="space-y-4 mt-4 border-t pt-4">
                        <FileUploadInput label="Logo del Sito" field="logoUrl" currentUrl={settings.logoUrl} />
                        <FileUploadInput label="Favicon (.ico, .svg, .png)" field="faviconUrl" currentUrl={settings.faviconUrl} />
                        <FileUploadInput label="Icona Apple Touch (.png)" field="appleTouchIconUrl" currentUrl={settings.appleTouchIconUrl} />
                    </div>
                </section>
                
                {/* Company Data */}
                 <section>
                    <h3 className="text-lg font-bold">Dati Societari</h3>
                    <div className="space-y-4 mt-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium text-gray-700">Nome Azienda</label><input name="companyName" value={settings.companyName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                             <div><label className="block text-sm font-medium text-gray-700">Partita IVA</label><input name="vatNumber" value={settings.vatNumber} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700">Indirizzo Legale Completo</label><input name="address" value={settings.address} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700">Email Legale / PEC</label><input type="email" name="legalEmail" value={settings.legalEmail} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Telefono</label><input type="tel" name="phone" value={settings.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                        </div>
                    </div>
                </section>

                {/* SEO */}
                 <section>
                    <h3 className="text-lg font-bold">SEO & Indicizzazione</h3>
                    <div className="space-y-4 mt-4 border-t pt-4">
                         <div><label className="block text-sm font-medium text-gray-700">Titolo del Sito (Meta Title)</label><input name="siteTitle" value={settings.siteTitle} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                         <div><label className="block text-sm font-medium text-gray-700">Descrizione del Sito (Meta Description)</label><textarea name="siteDescription" value={settings.siteDescription} onChange={handleChange} rows={3} className="w-full mt-1 p-2 border rounded-md" /></div>
                         <div><label className="block text-sm font-medium text-gray-700">Parole Chiave (separate da virgola)</label><input name="metaKeywords" value={settings.metaKeywords} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" /></div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">Permetti indicizzazione</p>
                                <p className="text-sm text-gray-500">Consenti ai motori di ricerca di indicizzare il sito.</p>
                            </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="allowIndexing" checked={settings.allowIndexing} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                            </label>
                        </div>
                    </div>
                </section>
                
                <div className="text-right pt-4">
                    <button onClick={handleSave} disabled={!hasChanges} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-300">
                        Salva
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const TabButton: React.FC<{ name: string; tab: string }> = ({ name, tab }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
            {name}
        </button>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Impostazioni</h2>
            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton name="Generali" tab="general" />
                    <TabButton name="Gateway di Pagamento" tab="gateways" />
                    <TabButton name="Branding & SEO" tab="branding" />
                </nav>
            </div>
            
            <div>
                {activeTab === 'general' && <GeneralSettings />}
                {activeTab === 'gateways' && <PaymentGateways />}
                {activeTab === 'branding' && <BrandingAndSeo />}
            </div>
        </div>
    );
};

export default AdminSettings;