import { LegalLayout } from './LegalLayout';


export const CGVPage = () => {
    const sections = [
        {
            title: 'Objet',
            content: (
                <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées
                    sur le site <strong>auberge-espagnol.fr</strong> par <strong>Casa Steph Iberico</strong>,
                    micro-entreprise individuelle exploitée par MILHAU Stéphane, dont le siège social est situé
                    33 Rue des Chenevières, 57140 La Maxe (SIREN : 519 942 924), ci-après dénommé « le Vendeur »,
                    auprès de tout client particulier, ci-après dénommé « le Client ».
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
                        par le Client. Il s'agit de produits ibériques premium : charcuteries, fromages et
                        conserves. Les photographies et descriptions sont données à titre indicatif et ne sont
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
                        Les prix sont indiqués en euros (€). En tant que micro-entreprise sous le régime de
                        la franchise en base de TVA (art. 293 B du CGI), <strong>TVA non applicable</strong>.
                        Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant entendu que
                        le prix applicable à la commande est celui en vigueur au moment de sa validation.
                    </p>
                    <p className="mt-2">
                        <span className="text-gray-400">Frais de livraison :</span>
                    </p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                        <li>
                            <strong>Livraison offerte</strong> pour les codes postaux : 57000, 57050, 57070,
                            57140, 57155, 57160, 57950 (zone ≤ 7 km)
                        </li>
                        <li>
                            <strong>Frais de livraison : 5,00 €</strong> pour les codes postaux : 57130, 57170,
                            57245, 57420, 57530, 57645, 57685 (zone 7–15 km) — livraison offerte dès 100,00 €
                            d'achat dans cette zone
                        </li>
                    </ul>
                    <p className="mt-2">
                        <span className="text-gray-400">Commande minimum :</span> 30,00 €
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
                    <p className="mt-2">
                        Un montant minimum de commande de <strong>30,00 €</strong> est requis pour valider
                        toute commande.
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
                        <li>
                            <strong>Paiement à la livraison</strong> (espèces) — réservé aux clients
                            ayant déjà passé au moins une commande
                        </li>
                        <li>
                            <strong>Paiement en ligne par carte bancaire</strong> (Visa, Mastercard) via Stripe
                        </li>
                    </ul>
                    <p className="mt-3">
                        Les paiements en ligne sont sécurisés par <strong>Stripe</strong>. Les données bancaires
                        ne transitent pas par les serveurs de Casa Steph Iberico.
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
                        de Metz, aux codes postaux éligibles suivants :
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Zone 1 (livraison offerte) :</strong> 57000, 57050, 57070, 57140, 57155, 57160, 57950</li>
                        <li><strong>Zone 2 (5,00 €) :</strong> 57130, 57170, 57245, 57420, 57530, 57645, 57685</li>
                    </ul>
                    <p className="mt-3">
                        <span className="text-gray-400">Délai de livraison :</span>{' '}
                        La livraison est effectuée <strong>le jour même ou le lendemain</strong> de la confirmation
                        de la commande, selon les disponibilités du Vendeur et les préférences du Client.
                        Le créneau de livraison est convenu directement entre le Vendeur et le Client après
                        validation de la commande.
                    </p>
                    <p className="mt-2">
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
                    <p className="mt-2">
                        <strong>Exception :</strong> Le droit de rétractation ne peut être exercé pour les
                        produits alimentaires périssables ou susceptibles de se détériorer rapidement
                        (article L221-28 du Code de la consommation). Cette exception s'applique à la majorité
                        des produits proposés par Casa Steph Iberico (charcuteries, fromages frais).
                    </p>
                    <p className="mt-2">
                        Pour exercer ce droit sur les produits éligibles, le Client doit contacter le Vendeur à :
                        lauberge.espagnole.metz@gmail.com en indiquant son numéro de commande.
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
                    <p className="mt-2">
                        Pour toute réclamation, le Client peut contacter le Vendeur à :
                        lauberge.espagnole.metz@gmail.com ou par téléphone au +33 6 89 66 91 15.
                        Le Vendeur s'engage à répondre dans un délai de <strong>5 jours ouvrés</strong>.
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
                        à lauberge.espagnole.metz@gmail.com afin de trouver une solution amiable.
                    </p>
                    <p className="mt-2">
                        En cas d'échec de cette démarche amiable, le Client peut recourir gratuitement à la médiation
                        de la consommation. Médiateur compétent :
                    </p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                        <li>
                            <strong>Association des Médiateurs Européens (AME)</strong> —{' '}
                            <a href="https://www.mediationconso-ame.com" target="_blank" rel="noopener noreferrer"
                                className="text-gold hover:underline">
                                www.mediationconso-ame.com
                            </a>
                        </li>
                        <li>
                            Plateforme européenne de règlement en ligne des litiges :{' '}
                            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                                className="text-gold hover:underline">
                                ec.europa.eu/consumers/odr
                            </a>
                        </li>
                    </ul>
                    <p className="mt-2">
                        À défaut, les tribunaux français seront seuls compétents, conformément au droit français.
                    </p>
                </>
            ),
        },
    ];

    return (
        <LegalLayout
            title="Conditions Générales de Vente"
            lastUpdated="18 mars 2026"
            sections={sections}
        />
    );
};
