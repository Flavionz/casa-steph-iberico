import { Cookie } from 'lucide-react';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export const CookieBanner: React.FC = () => {
    const { showBanner, acceptAll, refuseAll, openModal } = useCookieConsent();

    return (
        <>
            {/* Preferences modal */}
            <CookiePreferencesModal />

            {/* Banner */}
            {showBanner && (
                <div
                    role="dialog"
                    aria-label="Gestion des cookies"
                    className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-[#1a1714] border border-gray-700 rounded-xl shadow-2xl">
                        <div className="p-5 sm:p-6">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <Cookie size={22} className="text-gold shrink-0 mt-0.5" />
                                <div>
                                    <h2 className="text-white font-semibold text-base">
                                        Ce site utilise des cookies
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                                        Nous utilisons des cookies <strong className="text-gray-200">uniquement pour le fonctionnement du site</strong> —
                                        authentification, panier et paiement sécurisé.
                                        Vos données <strong className="text-gray-200">ne sont jamais vendues ni cédées à des tiers</strong>.
                                        Aucun cookie publicitaire ou de tracking n'est utilisé.{' '}
                                        <a href="/privacy" className="text-gold hover:underline text-sm">
                                            En savoir plus
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Buttons — même poids visuel pour Refuser et Accepter (CNIL) */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                                <button
                                    onClick={refuseAll}
                                    className="px-5 py-2.5 border border-gray-600 text-gray-300 text-sm rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Tout refuser
                                </button>
                                <button
                                    onClick={openModal}
                                    className="px-5 py-2.5 border border-gray-500 text-gray-200 text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Personnaliser
                                </button>
                                <button
                                    onClick={acceptAll}
                                    className="px-5 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                                >
                                    Tout accepter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
