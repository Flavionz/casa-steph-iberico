import { LegalLayout } from './LegalLayout';

const Placeholder = ({ label }: { label: string }) => (
    <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded px-1.5 py-0.5 text-xs font-mono">
        [{label}]
    </span>
);

export const ConfidentialitePage = () => {
    const sections = [
        {
            title: 'Responsable du traitement',
            content: (
                <>
                    <p>
                        Le responsable du traitement des données personnelles collectées sur le site
                        <strong> auberge-espagnol.fr</strong> est :
                    </p>
                    <ul className="mt-2 space-y-1 list-none">
                        <li><span className="text-gray-400">Identité :</span> MILHAU Stéphane — L'Auberge Espagnole</li>
                        <li><span className="text-gray-400">Adresse :</span> 33 Rue des Chenevières, 57140 La Maxe</li>
                        <li><span className="text-gray-400">Email :</span> lauberge.espagnole.metz@gmail.com</li>
                        <li><span className="text-gray-400">Téléphone :</span> +33 6 89 66 91 15</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Données collectées',
            content: (
                <>
                    <p>Dans le cadre de l'utilisation du site, nous collectons les données suivantes :</p>
                    <ul className="mt-2 space-y-2 list-disc list-inside">
                        <li>
                            <strong>Données de compte :</strong> adresse email, mot de passe (chiffré),
                            civilité, prénom, nom, numéro de téléphone
                        </li>
                        <li>
                            <strong>Données de livraison :</strong> adresse postale, code postal, ville
                        </li>
                        <li>
                            <strong>Données de commande :</strong> articles commandés, montant total,
                            méthode de paiement (sans données bancaires)
                        </li>
                        <li>
                            <strong>Données de navigation :</strong> adresse IP, type de navigateur,
                            pages consultées (via cookies techniques)
                        </li>
                    </ul>
                    <p className="mt-3 text-gray-400 text-xs">
                        Aucune donnée bancaire n'est stockée sur nos serveurs. Les paiements par carte
                        sont traités directement par Stripe (voir leur politique : stripe.com/fr/privacy).
                    </p>
                </>
            ),
        },
        {
            title: 'Finalités du traitement',
            content: (
                <>
                    <p>Vos données sont collectées pour les finalités suivantes :</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Gestion et suivi de votre compte client</li>
                        <li>Traitement et livraison de vos commandes</li>
                        <li>Envoi de confirmations et notifications par email</li>
                        <li>Communication relative à votre commande (créneau de livraison)</li>
                        <li>Respect des obligations légales et comptables</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Base légale',
            content: (
                <ul className="space-y-2 list-disc list-inside">
                    <li><strong>Exécution du contrat</strong> — traitement des commandes et livraisons</li>
                    <li><strong>Obligation légale</strong> — conservation des données comptables</li>
                    <li><strong>Intérêt légitime</strong> — amélioration du service, sécurité du site</li>
                    <li><strong>Consentement</strong> — communications marketing (si applicable)</li>
                </ul>
            ),
        },
        {
            title: 'Durée de conservation',
            content: (
                <ul className="space-y-1 list-disc list-inside">
                    <li>Données de compte : jusqu'à suppression du compte ou <strong>3 ans</strong> d'inactivité</li>
                    <li>Données de commande : <strong>10 ans</strong> (obligation comptable légale)</li>
                    <li>Cookies de navigation : <strong>13 mois</strong> maximum (recommandation CNIL)</li>
                </ul>
            ),
        },
        {
            title: 'Partage des données',
            content: (
                <>
                    <p>
                        Vos données ne sont pas vendues ni cédées à des tiers à des fins commerciales.
                        Elles peuvent être partagées uniquement avec :
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Stripe</strong> — traitement sécurisé des paiements par carte</li>
                        <li><strong><Placeholder label="Hébergeur" /></strong> — pour le fonctionnement technique du site</li>
                        <li>Les autorités compétentes, en cas d'obligation légale</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Vos droits (RGPD)',
            content: (
                <>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                        Informatique et Libertés, vous disposez des droits suivants :
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Droit d'accès</strong> — consulter vos données personnelles</li>
                        <li><strong>Droit de rectification</strong> — corriger vos données inexactes</li>
                        <li><strong>Droit à l'effacement</strong> — demander la suppression de vos données</li>
                        <li><strong>Droit d'opposition</strong> — vous opposer à certains traitements</li>
                        <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
                        <li><strong>Droit à la limitation</strong> — limiter le traitement de vos données</li>
                    </ul>
                    <p className="mt-3">
                        Pour exercer ces droits, contactez-nous à : <strong>lauberge.espagnole.metz@gmail.com</strong>
                        {' '}en joignant une copie de votre pièce d'identité.
                        Nous nous engageons à répondre dans un délai de <strong>30 jours</strong>.
                    </p>
                    <p className="mt-2">
                        En cas de litige, vous pouvez introduire une réclamation auprès de la{' '}
                        <strong>CNIL</strong> — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.cnil.fr</a>
                    </p>
                </>
            ),
        },
        {
            title: 'Cookies',
            content: (
                <>
                    <p>Le site utilise les types de cookies suivants :</p>
                    <ul className="mt-2 space-y-2">
                        <li>
                            <strong className="text-white">Cookies strictement nécessaires</strong>
                            <p className="text-gray-400 text-xs mt-0.5">
                                Session, authentification, panier. Indispensables au fonctionnement du site.
                                Ne nécessitent pas de consentement.
                            </p>
                        </li>
                        <li>
                            <strong className="text-white">Cookies de paiement (Stripe)</strong>
                            <p className="text-gray-400 text-xs mt-0.5">
                                Utilisés par Stripe pour sécuriser les transactions. Soumis à la politique
                                de confidentialité de Stripe.
                            </p>
                        </li>
                    </ul>
                    <p className="mt-3 text-gray-400 text-xs">
                        Ce site n'utilise pas de cookies de tracking ou d'analyse tiers (Google Analytics, Meta Pixel, etc.).
                    </p>
                </>
            ),
        },
        {
            title: 'Sécurité',
            content: (
                <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
                    vos données contre tout accès non autorisé, perte ou divulgation. Les mots de passe sont
                    chiffrés (bcrypt). Les communications sont sécurisées via HTTPS.
                    Aucune donnée bancaire n'est conservée sur nos serveurs.
                </p>
            ),
        },
    ];

    return (
        <LegalLayout
            title="Politique de Confidentialité"
            lastUpdated="18 mars 2026"
            sections={sections}
        />
    );
};
