import React, { createContext, useContext, useState } from 'react';

const CONSENT_KEY = 'ae_cookie_consent';
const CONSENT_VERSION = '1.0';

export interface ConsentPreferences {
    essential: true;   // toujours actif, non modifiable
    payment: boolean;  // Stripe — requis pour le paiement par carte
}

interface StoredConsent {
    preferences: ConsentPreferences;
    timestamp: string;
    version: string;
}

interface CookieConsentContextType {
    hasConsented: boolean;
    preferences: ConsentPreferences | null;
    showBanner: boolean;
    showModal: boolean;
    acceptAll: () => void;
    refuseAll: () => void;
    savePreferences: (payment: boolean) => void;
    openModal: () => void;
    closeModal: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType>({
    hasConsented: false,
    preferences: null,
    showBanner: true,
    showModal: false,
    acceptAll: () => { throw new Error('CookieConsentProvider non trovato'); },
    refuseAll: () => { throw new Error('CookieConsentProvider non trovato'); },
    savePreferences: () => { throw new Error('CookieConsentProvider non trovato'); },
    openModal: () => { throw new Error('CookieConsentProvider non trovato'); },
    closeModal: () => { throw new Error('CookieConsentProvider non trovato'); },
});

const loadStored = (): StoredConsent | null => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        const parsed: StoredConsent = JSON.parse(raw);
        if (parsed.version !== CONSENT_VERSION) return null;
        return parsed;
    } catch {
        return null;
    }
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const stored = loadStored();

    const [preferences, setPreferences] = useState<ConsentPreferences | null>(
        stored?.preferences ?? null
    );
    const [showBanner, setShowBanner] = useState(stored === null);
    const [showModal, setShowModal] = useState(false);

    const persist = (prefs: ConsentPreferences) => {
        const record: StoredConsent = {
            preferences: prefs,
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
        setPreferences(prefs);
        setShowBanner(false);
        setShowModal(false);
    };

    const acceptAll = () => persist({ essential: true, payment: true });
    const refuseAll = () => persist({ essential: true, payment: false });
    const savePreferences = (payment: boolean) => persist({ essential: true, payment });
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <CookieConsentContext.Provider value={{
            hasConsented: preferences !== null,
            preferences,
            showBanner,
            showModal,
            acceptAll,
            refuseAll,
            savePreferences,
            openModal,
            closeModal,
        }}>
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => useContext(CookieConsentContext);
