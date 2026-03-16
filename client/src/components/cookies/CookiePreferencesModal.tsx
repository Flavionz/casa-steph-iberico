import { useState } from 'react';
import { X, Lock, ShieldCheck, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useCookieConsent } from '../../contexts/CookieConsentContext';

interface CategoryProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    examples: string[];
    locked?: boolean;
    enabled: boolean;
    onToggle?: (v: boolean) => void;
}

const CookieCategory: React.FC<CategoryProps> = ({
    icon, title, description, examples, locked, enabled, onToggle,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-800/50">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    <span className="text-gold shrink-0">{icon}</span>
                    <div>
                        <p className="text-white font-medium text-sm">{title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{description}</p>
                    </div>
                    <span className="text-gray-500 ml-2 shrink-0">
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                </button>

                {/* Toggle */}
                <div className="ml-4 shrink-0">
                    {locked ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Lock size={12} />
                            <span>Toujours actif</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            role="switch"
                            aria-checked={enabled}
                            onClick={() => onToggle?.(!enabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                enabled ? 'bg-gold' : 'bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    )}
                </div>
            </div>

            {open && (
                <div className="px-4 pb-4 pt-3 bg-gray-900/30 border-t border-gray-700">
                    <p className="text-gray-400 text-xs leading-relaxed mb-2">{description}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {examples.map((ex) => (
                            <span key={ex} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded font-mono">
                                {ex}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CookiePreferencesModal: React.FC = () => {
    const { showModal, closeModal, acceptAll, refuseAll, savePreferences, preferences } = useCookieConsent();

    const [paymentEnabled, setPaymentEnabled] = useState(preferences?.payment ?? false);

    if (!showModal) return null;

    const handleSave = () => savePreferences(paymentEnabled);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />

            {/* Modal */}
            <div className="relative bg-[#1E1B18] border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div>
                        <h2 className="font-serif text-xl text-white">Préférences de cookies</h2>
                        <p className="text-gray-400 text-xs mt-0.5">Personnalisez votre consentement</p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                        aria-label="Fermer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
                    {/* Intro */}
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Nous utilisons des cookies uniquement pour le fonctionnement du site.
                        <strong className="text-white"> Vos données ne sont jamais vendues ni cédées à des tiers</strong> à des fins commerciales.
                        Les cookies essentiels sont requis pour naviguer sur le site.
                    </p>

                    {/* Categories */}
                    <CookieCategory
                        icon={<ShieldCheck size={18} />}
                        title="Cookies essentiels"
                        description="Indispensables au fonctionnement du site. Ils permettent la navigation, l'authentification et la gestion du panier. Ils ne peuvent pas être désactivés."
                        examples={['authToken', 'cart', 'session']}
                        locked
                        enabled
                    />

                    <CookieCategory
                        icon={<CreditCard size={18} />}
                        title="Cookies de paiement (Stripe)"
                        description="Utilisés uniquement lors du paiement par carte bancaire via Stripe. Ils sécurisent la transaction et préviennent la fraude. Non requis si vous choisissez le paiement à la livraison."
                        examples={['__stripe_mid', '__stripe_sid']}
                        enabled={paymentEnabled}
                        onToggle={setPaymentEnabled}
                    />

                    {/* Privacy note */}
                    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-xs text-gray-400 leading-relaxed">
                        <p>
                            Aucun cookie publicitaire, de tracking ou d'analyse n'est utilisé sur ce site.
                            Pour plus d'informations, consultez notre{' '}
                            <a href="/privacy" className="text-gold hover:underline" onClick={closeModal}>
                                Politique de Confidentialité
                            </a>.
                        </p>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="px-6 py-5 border-t border-gray-800 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => { refuseAll(); }}
                        className="flex-1 py-2.5 border border-gray-600 text-gray-300 text-sm rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Tout refuser
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2.5 border border-gold text-gold text-sm rounded-lg hover:bg-gold/10 transition-colors"
                    >
                        Enregistrer mes choix
                    </button>
                    <button
                        onClick={() => { acceptAll(); }}
                        className="flex-1 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                    >
                        Tout accepter
                    </button>
                </div>
            </div>
        </div>
    );
};
