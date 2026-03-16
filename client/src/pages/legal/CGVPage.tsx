import { LegalLayout } from './LegalLayout';

const Placeholder = ({ label }: { label: string }) => (
    <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded px-1.5 py-0.5 text-xs font-mono">
        [{label}]
    </span>
);

export const CGVPage = () => {
    const sections = [
        {
            title: 'Objet',
            content: (
                <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées
                    sur le site <strong>auberge-espagnol.fr</strong> par <Placeholder label="NOM DE L'ENTREPRISE" />,
                    ci-après dénommé « le Vendeur », auprès de tout client particulier, ci-après dénommé « le Client ».
                    Toute commande implique l'acceptation sans réserve des présentes CGV.
                </p>
            ),
        },
        {
            title: 'Produits',
            content: (
                <>
                    <p>
                        Les produits proposés à la vente sont ceux présentés sur le site au moment de la consultation
                        par le Client. Les photographies et descriptions sont données à titre indicatif et ne sont
                        pas contractuelles.
                    </p>
                    <p>
                        Le Vendeur se réserve le droit de modifier à tout moment son offre de produits.
                        Les produits sont proposés dans la limite des stocks disponibles.
                    </p>
                </>
            ),
        },
        {
            title: 'Prix',
            content: (
                <>
                    <p>
                        Les prix sont indiqués en euros (€), toutes taxes comprises (TTC).
                        Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant entendu que
                        le prix applicable à la commande est celui en vigueur au moment de sa validation.
                    </p>
                    <p>
                        <span className="text-gray-400">Frais de livraison :</span> La livraison est offerte pour toute
                        commande dans la zone éligible (codes postaux : 57000, 57050, 57070, 57140, 57150, 57160, 57170).
                    </p>
                </>
            ),
        },
        {
            title: 'Commande',
            content: (
                <>
                    <p>Le processus de commande se déroule comme suit :</p>
                    <ol className="mt-2 space-y-1 list-decimal list-inside">
                        <li>Ajout des produits au panier</li>
                        <li>Vérification du panier</li>
                        <li>Saisie des informations de livraison</li>
                        <li>Choix du mode de paiement</li>
                        <li>Confirmation de la commande</li>
                    </ol>
                    <p className="mt-3">
                        La vente est réputée conclue à la réception par le Client de la confirmation de commande
                        par email. Le Vendeur se réserve le droit d'annuler toute commande en cas de stock
                        insuffisant ou de suspicion de fraude.
                    </p>
                </>
            ),
        },
        {
            title: 'Paiement',
            content: (
                <>
                    <p>Les modes de paiement acceptés sont :</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Paiement à la livraison (espèces ou carte bancaire)</li>
                        <li>Paiement en ligne par carte bancaire (Visa, Mastercard) via Stripe</li>
                    </ul>
                    <p className="mt-3">
                        Les paiements en ligne sont sécurisés par <strong>Stripe</strong>. Les données bancaires
                        ne transitent pas par les serveurs de L'Auberge Espagnole.
                    </p>
                </>
            ),
        },
        {
            title: 'Livraison',
            content: (
                <>
                    <p>
                        La livraison est effectuée personnellement par le Vendeur dans un rayon de 15 km autour
                        de Metz, aux codes postaux éligibles suivants : 57000, 57050, 57070, 57140, 57150, 57160, 57170.
                    </p>
                    <p>
                        <span className="text-gray-400">Délai de livraison :</span> <Placeholder label="X à X jours ouvrés" /> après confirmation de la commande.
                        Le créneau de livraison sera communiqué par le Vendeur après validation de la commande.
                    </p>
                    <p>
                        En cas d'absence lors de la livraison, le Vendeur contactera le Client pour convenir
                        d'un nouveau créneau.
                    </p>
                </>
            ),
        },
        {
            title: 'Droit de rétractation',
            content: (
                <>
                    <p>
                        Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un
                        délai de <strong>14 jours</strong> à compter de la réception de sa commande pour exercer
                        son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
                    </p>
                    <p>
                        <strong>Exception :</strong> Le droit de rétractation ne peut être exercé pour les
                        produits alimentaires périssables ou susceptibles de se détériorer rapidement
                        (article L221-28 du Code de la consommation).
                    </p>
                    <p>
                        Pour exercer ce droit, le Client doit contacter le Vendeur à l'adresse :
                        contact@auberge-espagnol.fr en indiquant son numéro de commande.
                    </p>
                </>
            ),
        },
        {
            title: 'Garanties et réclamations',
            content: (
                <>
                    <p>
                        Tous les produits bénéficient de la garantie légale de conformité (articles L217-4 et suivants
                        du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants
                        du Code civil).
                    </p>
                    <p>
                        Pour toute réclamation, le Client peut contacter le Vendeur à l'adresse email :
                        contact@auberge-espagnol.fr. Le Vendeur s'engage à répondre dans un délai de{' '}
                        <Placeholder label="X jours ouvrés" />.
                    </p>
                </>
            ),
        },
        {
            title: 'Règlement des litiges',
            content: (
                <>
                    <p>
                        En cas de litige, le Client est invité à contacter en premier lieu le service client
                        à l'adresse contact@auberge-espagnol.fr afin de trouver une solution amiable.
                    </p>
                    <p>
                        En cas d'échec de cette démarche, le Client peut recourir à la médiation de la consommation.
                        Médiateur compétent : <Placeholder label="NOM DU MÉDIATEUR — https://www.mediateur.fr" />
                    </p>
                    <p>
                        À défaut, les tribunaux français seront seuls compétents, conformément au droit français.
                    </p>
                </>
            ),
        },
    ];

    return (
        <LegalLayout
            title="Conditions Générales de Vente"
            lastUpdated="À compléter"
            sections={sections}
        />
    );
};
