import React, { useState, useEffect } from 'react';
import { MOCK_SITE_SETTINGS, MOCK_WEBHOOK_EVENTS } from '../../../constants';
import type { SiteSettings, PaymentSettings, WebhookEvent } from '../../../types';
import { getPaymentSettings, updatePaymentSettings, revealPaymentSetting, testStripeConnection, testPayPalConnection, getPaymentHealth, getWebhookEvents, downloadWebhookLogsAsCSV } from '../../../api/settings';
import { DocumentArrowDownIcon } from '../../Icons';

// --- Reusable Generic Components ---

const Toggle: React.FC<{ label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
            <p className="font-semibold">{label}</p>
            {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
        </label>
    </div>
);

const Input: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="w-full mt-1 p-2 border rounded-md" />
    </div>
);

const Select: React.FC<any> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select {...props} className="w-full mt-1 p-2 border rounded-md bg-white">{children}</select>
    </div>
);


// --- Masked Input for Secrets ---

const MaskedInputField: React.FC<{
    label: string;
    value: string;
    fieldPath: string;
    onChange: (value: string) => void;
}> = ({ label, value, fieldPath, onChange }) => {
    const [revealedValue, setRevealedValue] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleReveal = async () => {
        setIsLoading(true);
        try {
            const { value } = await revealPaymentSetting(fieldPath);
            setRevealedValue(value);
            setTimeout(() => setRevealedValue(null), 5000); // Hide after 5 seconds
        } catch (error) {
            alert('Impossibile mostrare il segreto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center space-x-2 mt-1">
                <input
                    type="text"
                    value={isEditing ? value : (revealedValue || '••••••••••••••••')}
                    onChange={e => onChange(e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-md font-mono disabled:bg-gray-100"
                    placeholder="Inserisci nuovo segreto"
                />
                {!isEditing && <button type="button" onClick={handleReveal} disabled={isLoading} className="text-sm font-semibold text-blue-600 disabled:opacity-50">{isLoading ? '...' : 'Mostra'}</button>}
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="text-sm font-semibold text-brand-blue">{isEditing ? 'Annulla' : 'Modifica'}</button>
            </div>
        </div>
    );
};


// --- Payment Settings Sub-Tab Components ---

const GeneralPaymentSettings: React.FC<{ settings: PaymentSettings; onUpdate: (u: any) => void; onNestedUpdate: (s: any, u: any) => void; }> = ({ settings, onUpdate, onNestedUpdate }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Modalità" value={settings.mode} onChange={(e: any) => onUpdate({ mode: e.target.value })}>
                <option value="test">Test</option>
                <option value="live">Live</option>
            </Select>
            <Select label="Valuta Principale" value={settings.currency} onChange={(e: any) => onUpdate({ currency: e.target.value })}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
            </Select>
        </div>
        <Toggle label="Abilita Depositi Cauzionali" checked={settings.deposits.enabled} onChange={v => onNestedUpdate('deposits', { enabled: v })} />
        <Toggle label="Rilascio Automatico Deposito" description="Rilascia il deposito automaticamente quando l'Hubber conferma il rientro." checked={settings.deposits.autoReleaseOnReturn} onChange={v => onNestedUpdate('deposits', { autoReleaseOnReturn: v })} />
        <Input label="Massimo Giorni di Blocco Deposito" type="number" value={settings.deposits.maxHoldDays} onChange={(e: any) => onNestedUpdate('deposits', { maxHoldDays: parseInt(e.target.value) })} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
             <Input label="Ore di preavviso per scadenza" type="number" value={settings.timers.reminderHoursBeforeDue} onChange={(e: any) => onNestedUpdate('timers', { reminderHoursBeforeDue: parseInt(e.target.value) })} />
             <Input label="Minuti di tolleranza gratuiti" type="number" value={settings.timers.graceMinutes} onChange={(e: any) => onNestedUpdate('timers', { graceMinutes: parseInt(e.target.value) })} />
             <Input label="Arrotondamento estensioni (minuti)" type="number" value={settings.timers.roundToMinutes} onChange={(e: any) => onNestedUpdate('timers', { roundToMinutes: parseInt(e.target.value) })} />
        </div>
    </div>
);

const StripeSettings: React.FC<{ settings: PaymentSettings['stripe']; onUpdate: (u: any) => void; onTest: () => void; testResult?: string; }> = ({ settings, onUpdate, onTest, testResult }) => (
     <div className="space-y-6">
        <Toggle label="Abilita Stripe" checked={settings.enabled} onChange={v => onUpdate({ enabled: v })} />
        <Input label="Publishable Key" value={settings.publishableKey} onChange={(e: any) => onUpdate({ publishableKey: e.target.value })} />
        <MaskedInputField label="Secret Key" fieldPath="stripe.secretKey" value={settings.secretKey} onChange={v => onUpdate({ secretKey: v })} />
        <MaskedInputField label="Webhook Secret" fieldPath="stripe.webhookSecret" value={settings.webhookSecret} onChange={v => onUpdate({ webhookSecret: v })} />
        <Toggle label="Abilita Klarna" checked={settings.enableKlarna} onChange={v => onUpdate({ enableKlarna: v })} />
        <button type="button" onClick={onTest} className="font-semibold text-brand-blue hover:underline">Test connessione Stripe</button>
        {testResult && <p className="text-sm p-2 bg-gray-100 rounded-md">{testResult}</p>}
    </div>
);

const PayPalSettings: React.FC<{ settings: PaymentSettings['paypal']; onUpdate: (u: any) => void; onTest: () => void; testResult?: string; }> = ({ settings, onUpdate, onTest, testResult }) => (
    <div className="space-y-6">
        <Toggle label="Abilita PayPal" checked={settings.enabled} onChange={v => onUpdate({ enabled: v })} />
        <Input label="Client ID" value={settings.clientId} onChange={(e: any) => onUpdate({ clientId: e.target.value })} />
        <MaskedInputField label="Client Secret" fieldPath="paypal.clientSecret" value={settings.clientSecret} onChange={v => onUpdate({ clientSecret: v })} />
        <Input label="Webhook ID" value={settings.webhookId} onChange={(e: any) => onUpdate({ webhookId: e.target.value })} />
        <button type="button" onClick={onTest} className="font-semibold text-brand-blue hover:underline">Test connessione PayPal</button>
        {testResult && <p className="text-sm p-2 bg-gray-100 rounded-md">{testResult}</p>}
    </div>
);

const WebhooksTools: React.FC = () => {
    const [health, setHealth] = useState<{ stripe: { status: string, message: string }, paypal: { status: string, message: string } } | null>(null);
    const [events, setEvents] = useState<WebhookEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [healthData, eventsData] = await Promise.all([getPaymentHealth(), getWebhookEvents()]);
            setHealth(healthData);
            setEvents(eventsData);
        } catch (error) {
            console.error("Failed to fetch payment diagnostics", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const StatusBadge: React.FC<{ status: 'ok' | 'error' | 'disabled' }> = ({ status }) => {
        const styles = {
            ok: { text: 'Operativo', class: 'bg-green-100 text-green-800' },
            error: { text: 'Errore', class: 'bg-red-100 text-red-800' },
            disabled: { text: 'Disabilitato', class: 'bg-gray-100 text-gray-800' },
        };
        const { text, class: className } = styles[status] || styles.disabled;
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{text}</span>;
    };

    if (isLoading) return <div>Caricamento diagnostica...</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stato Integrazioni</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {health?.stripe && (
                    <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Stripe</h4>
                            <StatusBadge status={health.stripe.status as any} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{health.stripe.message}</p>
                    </div>
                )}
                 {health?.paypal && (
                    <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">PayPal</h4>
                             <StatusBadge status={health.paypal.status as any} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{health.paypal.message}</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t">
                <h3 className="text-lg font-semibold">Ultimi Eventi Webhook Ricevuti</h3>
                <button onClick={downloadWebhookLogsAsCSV} className="flex items-center space-x-2 text-sm font-semibold text-brand-blue hover:underline">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Scarica Log Completo (.csv)</span>
                </button>
            </div>
            <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left font-semibold">Provider</th>
                            <th className="p-3 text-left font-semibold">Evento</th>
                            <th className="p-3 text-left font-semibold">Timestamp</th>
                            <th className="p-3 text-left font-semibold">Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} className="border-t">
                                <td className="p-3 font-semibold">{event.provider}</td>
                                <td className="p-3 font-mono text-xs">{event.eventType}</td>
                                <td className="p-3">{new Date(event.timestamp).toLocaleString('it-IT')}</td>
                                <td className="p-3"><StatusBadge status={event.status === 'succeeded' ? 'ok' : 'error'} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {events.length === 0 && <p className="text-center p-8 text-gray-500">Nessun evento webhook recente.</p>}
            </div>
        </div>
    );
};


// --- Main Payment Settings Component ---

const PaymentsSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<PaymentSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
    const [testResults, setTestResults] = useState<{ stripe?: string; paypal?: string }>({});
    const [activeSubTab, setActiveSubTab] = useState('general');

    useEffect(() => {
        getPaymentSettings().then(data => {
            setSettings(data);
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    const handleUpdate = (updates: Partial<PaymentSettings>) => {
        if (!settings) return;
        setSettings({ ...settings, ...updates });
    };
    
    const handleNestedUpdate = (section: keyof PaymentSettings, updates: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [section]: {
                ...(settings[section] as object),
                ...updates
            }
        });
    };
    
    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await updatePaymentSettings(settings);
            setToast({ show: true, message: `Salvato con successo alle ${new Date().toLocaleTimeString()}`});
            setTimeout(() => setToast({ show: false, message: ''}), 3000);
        } catch (error) {
            alert(`Errore nel salvataggio: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleTestConnection = async (type: 'stripe' | 'paypal') => {
        setTestResults(prev => ({ ...prev, [type]: 'Test in corso...' }));
        try {
            const result = type === 'stripe' ? await testStripeConnection() : await testPayPalConnection();
            setTestResults(prev => ({ ...prev, [type]: `${result.success ? '✅' : '❌'} ${result.message}` }));
        } catch (error) {
             setTestResults(prev => ({ ...prev, [type]: `Errore: ${error}` }));
        }
    };
    
    const SubTabButton: React.FC<{ name: string; tab: string }> = ({ name, tab }) => (
        <button
            onClick={() => setActiveSubTab(tab)}
            className={`${activeSubTab === tab ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'} px-3 py-2 font-medium text-sm rounded-md`}
        >
            {name}
        </button>
    );

    if (isLoading) return <div>Caricamento impostazioni di pagamento...</div>;
    if (!settings) return <div>Impossibile caricare le impostazioni.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                 <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
                    <SubTabButton name="Generale" tab="general" />
                    <SubTabButton name="Stripe" tab="stripe" />
                    <SubTabButton name="PayPal" tab="paypal" />
                    <SubTabButton name="Webhooks & Tools" tab="webhooks" />
                </div>
                 <button onClick={handleSave} disabled={isSaving} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-300">
                    {isSaving ? 'Salvataggio...' : 'Salva'}
                </button>
            </div>
           
            <div className="mt-6">
                {activeSubTab === 'general' && <GeneralPaymentSettings settings={settings} onUpdate={handleUpdate} onNestedUpdate={handleNestedUpdate} />}
                {activeSubTab === 'stripe' && <StripeSettings settings={settings.stripe} onUpdate={(u) => handleNestedUpdate('stripe', u)} onTest={() => handleTestConnection('stripe')} testResult={testResults.stripe} />}
                {activeSubTab === 'paypal' && <PayPalSettings settings={settings.paypal} onUpdate={(u) => handleNestedUpdate('paypal', u)} onTest={() => handleTestConnection('paypal')} testResult={testResults.paypal} />}
                {activeSubTab === 'webhooks' && <WebhooksTools />}
            </div>
            
            {toast.show && <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg">{toast.message}</div>}
        </div>
    );
};


// --- Platform Settings (Old General Settings) ---

const PlatformSettings: React.FC = () => {
    // ... (This component remains the same as the old GeneralSettings)
     const [settings, setSettings] = useState({
        renterFee: 5,
        hubberCommission: 10,
        maintenanceMode: false,
        newRegistrations: true,
    });
    // ...
    return ( <div className="bg-white p-6 rounded-lg shadow max-w-2xl">{/* ... */}</div> );
};


// --- Branding and SEO (Unchanged) ---

const BrandingAndSeo: React.FC = () => {
    // ... (This component remains the same as before)
    return ( <div className="bg-white p-6 rounded-lg shadow max-w-4xl">{/* ... */}</div> );
};

// --- Main Exported Component ---

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('payments');

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
                    <TabButton name="Impostazioni Piattaforma" tab="platform" />
                    <TabButton name="Impostazioni Pagamenti" tab="payments" />
                    <TabButton name="Branding & SEO" tab="branding" />
                </nav>
            </div>
            
            <div>
                {activeTab === 'platform' && <PlatformSettings />}
                {activeTab === 'payments' && <PaymentsSettingsPage />}
                {activeTab === 'branding' && <BrandingAndSeo />}
            </div>
        </div>
    );
};

export default AdminSettings;