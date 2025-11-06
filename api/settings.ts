import { MOCK_AUDIT_LOGS, MOCK_WEBHOOK_EVENTS } from '../constants';
import type { PaymentSettings, PublicPaymentSettings, WebhookEvent } from '../types';

// Simulate encryption key from .env
const SETTINGS_ENC_KEY = 'mock-secret-key-for-aes-gcm';

// Simulate encrypted storage
let MOCK_PAYMENT_SETTINGS: PaymentSettings = {
  mode: 'test',
  currency: 'EUR',
  supported_currencies: ['EUR'],
  stripe: {
    enabled: true,
    publishableKey: 'pk_test_1234567890abcdef',
    secretKey: 'enc_mock_stripe_secret_key', // Encrypted
    webhookSecret: 'enc_mock_stripe_webhook_secret', // Encrypted
    enableKlarna: true,
    klarnaAllowedCountries: ['IT', 'DE'],
  },
  paypal: {
    enabled: true,
    clientId: 'paypal_client_id_12345',
    clientSecret: 'enc_mock_paypal_client_secret', // Encrypted
    webhookId: 'wh_paypal_mock_id_123'
  },
  deposits: {
    enabled: true,
    holdMethod: 'authorization',
    autoReleaseOnReturn: true,
    maxHoldDays: 7
  },
  timers: {
    reminderHoursBeforeDue: 3,
    graceMinutes: 60,
    roundToMinutes: 15
  }
};

// --- Helper functions ---

const maskSecret = (secret: string): string => {
  if (!secret) return '';
  if (secret.startsWith('enc_')) return `****${secret.slice(-4)}`;
  if (secret.startsWith('pk_')) return `${secret.substring(0, 11)}****${secret.slice(-4)}`;
  return `****${secret.slice(-4)}`;
};

// Simulate decryption
const decrypt = (value: string): string => value.replace('enc_', '');
// Simulate encryption
const encrypt = (value: string): string => `enc_${value}`;


// --- In-memory cache for settings ---
let settingsCache: PaymentSettings | null = null;

const loadAndCacheSettings = (): PaymentSettings => {
    if (settingsCache) return settingsCache;
    
    // Simulate decrypting secrets into memory on server start
    const decryptedSettings = JSON.parse(JSON.stringify(MOCK_PAYMENT_SETTINGS));
    decryptedSettings.stripe.secretKey = decrypt(MOCK_PAYMENT_SETTINGS.stripe.secretKey);
    decryptedSettings.stripe.webhookSecret = decrypt(MOCK_PAYMENT_SETTINGS.stripe.webhookSecret);
    decryptedSettings.paypal.clientSecret = decrypt(MOCK_PAYMENT_SETTINGS.paypal.clientSecret);
    
    settingsCache = decryptedSettings;
    console.log('[SettingsService] Payment settings loaded and decrypted into memory.');
    return settingsCache;
}

// Initialize on load
loadAndCacheSettings();

export const getPaymentSettings = async (): Promise<PaymentSettings> => {
  await new Promise(res => setTimeout(res, 300)); // Simulate latency
  const settings = JSON.parse(JSON.stringify(MOCK_PAYMENT_SETTINGS)); // Deep copy
  
  // Mask secrets before sending to client
  settings.stripe.secretKey = maskSecret(settings.stripe.secretKey);
  settings.stripe.webhookSecret = maskSecret(settings.stripe.webhookSecret);
  settings.paypal.clientSecret = maskSecret(settings.paypal.clientSecret);

  return settings;
};

export const updatePaymentSettings = async (newSettings: PaymentSettings): Promise<{ success: boolean }> => {
  if (!SETTINGS_ENC_KEY) {
    throw new Error('SETTINGS_ENC_KEY is not configured on the server.');
  }
  await new Promise(res => setTimeout(res, 500));
  
  const updatedSettings = JSON.parse(JSON.stringify(newSettings));

  // Encrypt secrets if they have been changed (i.e., they are not masked placeholders)
  if (newSettings.stripe.secretKey && !newSettings.stripe.secretKey.includes('****')) {
    updatedSettings.stripe.secretKey = encrypt(newSettings.stripe.secretKey);
  } else {
    updatedSettings.stripe.secretKey = MOCK_PAYMENT_SETTINGS.stripe.secretKey;
  }
  if (newSettings.stripe.webhookSecret && !newSettings.stripe.webhookSecret.includes('****')) {
    updatedSettings.stripe.webhookSecret = encrypt(newSettings.stripe.webhookSecret);
  } else {
    updatedSettings.stripe.webhookSecret = MOCK_PAYMENT_SETTINGS.stripe.webhookSecret;
  }
  if (newSettings.paypal.clientSecret && !newSettings.paypal.clientSecret.includes('****')) {
    updatedSettings.paypal.clientSecret = encrypt(newSettings.paypal.clientSecret);
  } else {
    updatedSettings.paypal.clientSecret = MOCK_PAYMENT_SETTINGS.paypal.clientSecret;
  }

  MOCK_AUDIT_LOGS.unshift({
      id: Date.now(),
      adminId: 6,
      timestamp: new Date().toISOString(),
      action: 'SETTINGS_UPDATE_PAYMENTS',
      details: 'Impostazioni di pagamento aggiornate.'
  });

  MOCK_PAYMENT_SETTINGS = updatedSettings;
  settingsCache = null; // Invalidate cache to force hot-reload
  loadAndCacheSettings(); // Reload
  
  return { success: true };
};

export const revealPaymentSetting = async (fieldPath: string): Promise<{ value: string }> => {
  await new Promise(res => setTimeout(res, 100));
  let value = '';
  if (fieldPath === 'stripe.secretKey') value = MOCK_PAYMENT_SETTINGS.stripe.secretKey;
  if (fieldPath === 'stripe.webhookSecret') value = MOCK_PAYMENT_SETTINGS.stripe.webhookSecret;
  if (fieldPath === 'paypal.clientSecret') value = MOCK_PAYMENT_SETTINGS.paypal.clientSecret;

  MOCK_AUDIT_LOGS.unshift({
      id: Date.now(),
      adminId: 6,
      timestamp: new Date().toISOString(),
      action: 'SETTINGS_REVEAL_SECRET',
      details: `Visualizzato il segreto: ${fieldPath}`
  });

  return { value: decrypt(value) };
};

export const testStripeConnection = async (): Promise<{ success: boolean; message: string }> => {
    await new Promise(res => setTimeout(res, 1000));
    const settings = loadAndCacheSettings();
    if (settings.stripe.secretKey.includes('mock')) {
        return { success: true, message: 'Connessione a Stripe riuscita (Modalità Test).' };
    }
    return { success: false, message: 'Chiave segreta Stripe non valida.' };
};

export const testPayPalConnection = async (): Promise<{ success: boolean; message: string }> => {
    await new Promise(res => setTimeout(res, 1000));
    const settings = loadAndCacheSettings();
    if (settings.paypal.clientSecret.includes('mock')) {
        return { success: true, message: 'Connessione a PayPal riuscita (Modalità Sandbox).' };
    }
    return { success: false, message: 'Credenziali PayPal non valide.' };
};

export const getPublicPaymentSettings = async (): Promise<PublicPaymentSettings> => {
    await new Promise(res => setTimeout(res, 200));
    const settings = loadAndCacheSettings();
    return {
        mode: settings.mode,
        currency: settings.currency,
        stripe: {
            enabled: settings.stripe.enabled,
            enableKlarna: settings.stripe.enableKlarna,
        },
        paypal: {
            enabled: settings.paypal.enabled,
        },
        deposits: {
            enabled: settings.deposits.enabled,
        }
    };
};

export const getAvailableMethods = async (countryCode: string = 'IT'): Promise<('card' | 'klarna' | 'paypal')[]> => {
    await new Promise(res => setTimeout(res, 400));
    
    const available: ('card' | 'klarna' | 'paypal')[] = [];
    const settings = loadAndCacheSettings();

    // Stripe checks
    if (settings.stripe.enabled && settings.stripe.publishableKey && settings.stripe.secretKey) {
        available.push('card');
        
        // Klarna check
        if (settings.stripe.enableKlarna && settings.stripe.klarnaAllowedCountries.includes(countryCode as any)) {
            available.push('klarna');
        }
    }

    // PayPal check
    if (settings.paypal.enabled && settings.paypal.clientId && settings.paypal.clientSecret) {
        available.push('paypal');
    }

    console.log(`[API MOCK] Available payment methods for country ${countryCode}:`, available);
    return available;
};

// --- Step E: Health & Logs ---

export const getPaymentHealth = async (): Promise<{
  stripe: { status: 'ok' | 'error' | 'disabled'; message: string };
  paypal: { status: 'ok' | 'error' | 'disabled'; message: string };
}> => {
  await new Promise(res => setTimeout(res, 700));
  const settings = loadAndCacheSettings();
  
  const health = {
    stripe: { status: 'disabled' as 'ok' | 'error' | 'disabled', message: 'Stripe non è abilitato.' },
    paypal: { status: 'disabled' as 'ok' | 'error' | 'disabled', message: 'PayPal non è abilitato.' },
  };

  if (settings.stripe.enabled) {
    if (settings.stripe.secretKey.includes('mock')) {
      health.stripe = { status: 'ok', message: 'Connesso in modalità Test.' };
    } else {
      health.stripe = { status: 'error', message: 'Chiave segreta non valida.' };
    }
  }

  if (settings.paypal.enabled) {
    if (settings.paypal.clientSecret.includes('mock')) {
      health.paypal = { status: 'ok', message: 'Connesso in modalità Sandbox.' };
    } else {
      health.paypal = { status: 'error', message: 'Credenziali non valide.' };
    }
  }
  
  return health;
};

export const getWebhookEvents = async (): Promise<WebhookEvent[]> => {
    await new Promise(res => setTimeout(res, 500));
    // Return the latest 20 events, sorted by most recent first
    return [...MOCK_WEBHOOK_EVENTS].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);
};

export const downloadWebhookLogsAsCSV = async (): Promise<void> => {
    const headers = ['id', 'provider', 'eventType', 'timestamp', 'status', 'relatedId'];
    const csvRows = [
        headers.join(','),
        ...MOCK_WEBHOOK_EVENTS.map(event => 
            [event.id, event.provider, event.eventType, event.timestamp, event.status, event.relatedId].join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renthubber_webhooks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};