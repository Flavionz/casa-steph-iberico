import { LegalLayout } from './LegalLayout';

export const LivraisonPaiementPage = () => {
    const sections = [
        {
            title: 'Zone de livraison',
            content: (
                <>
                    <p>
                        La livraison est effectuée <strong>par notre équipe</strong> dans un rayon
                        de 15 km autour de Metz. Aucun transporteur tiers, vos produits arrivent directement
                        entre nos mains.
                    </p>
                    <p className="mt-3">Les codes postaux éligibles sont :</p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                            <p className="text-gold font-semibold text-sm mb-2">Zone 1 : Livraison offerte</p>
                            <p className="text-gray-400 text-xs mb-2">≤ 7 km autour de Metz</p>
                            <div className="flex flex-wrap gap-2">
                                {['57000', '57050', '57070', '57140', '57155', '57160', '57950'].map(cp => (
                                    <span key={cp} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                                        {cp}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                            <p className="text-gold font-semibold text-sm mb-2">Zone 2 : 5,00 €</p>
                            <p className="text-gray-400 text-xs mb-2">7 à 15 km, offerte dès 100,00 € d'achat</p>
                            <div className="flex flex-wrap gap-2">
                                {['57130', '57170', '57245', '57420', '57530', '57645', '57685'].map(cp => (
                                    <span key={cp} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                                        {cp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-400">
                        Votre code postal n'est pas dans la liste ?{' '}
                        <a
                            href="https://wa.me/33689669115"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline"
                        >
                            Contactez-nous sur WhatsApp
                        </a>{' '}
                        et, selon la distance, nous trouverons une solution ensemble.
                    </p>
                </>
            ),
        },
        {
            title: 'Délais et modalités de livraison',
            content: (
                <>
                    <p>
                        Une fois votre commande confirmée (email reçu), notre équipe vous contacte directement
                        pour convenir d'un <strong>créneau de livraison</strong> selon vos disponibilités.
                    </p>
                    <ul className="mt-3 space-y-2 list-disc list-inside">
                        <li>Livraison <strong>le jour même ou le lendemain</strong> en règle générale</li>
                        <li>Créneau convenu par téléphone ou WhatsApp</li>
                        <li>En cas d'absence, un nouveau rendez-vous est fixé sans frais supplémentaires</li>
                    </ul>
                    <p className="mt-3">
                        Commande minimum : <strong>30,00 €</strong>
                    </p>
                </>
            ),
        },
        {
            title: 'Paiement en ligne par carte bancaire',
            content: (
                <>
                    <p>
                        Le paiement en ligne est traité par <strong>Stripe</strong>, l'un des prestataires
                        de paiement les plus sécurisés au monde.
                    </p>
                    <ul className="mt-3 space-y-2 list-disc list-inside">
                        <li>Cartes acceptées : <strong>Visa, Mastercard</strong></li>
                        <li>
                            <strong>Aucun compte Stripe requis</strong>, vous saisissez simplement votre
                            numéro de carte, date d'expiration et cryptogramme
                        </li>
                        <li>
                            Vos données bancaires ne transitent <strong>jamais</strong> par les serveurs
                            de L'Auberge Espagnole, elles sont traitées directement et exclusivement par Stripe
                        </li>
                        <li>Connexion sécurisée HTTPS et chiffrement SSL</li>
                        <li>Le débit est effectué au moment de la validation de la commande</li>
                    </ul>
                    <p className="mt-3 text-gray-400 text-xs">
                        Stripe est certifié PCI-DSS niveau 1, le standard de sécurité le plus élevé
                        pour le traitement des paiements par carte.
                    </p>
                </>
            ),
        },
        {
            title: 'Paiement à la livraison (espèces)',
            content: (
                <>
                    <p>
                        Le paiement en espèces à la livraison est disponible, mais <strong>uniquement
                        pour les clients ayant déjà passé au moins une commande</strong> sur le site.
                    </p>
                    <p className="mt-3">
                        Pourquoi cette condition ?
                    </p>
                    <ul className="mt-2 space-y-2 list-disc list-inside">
                        <li>
                            Les produits proposés sont en grande majorité <strong>périssables</strong> (charcuteries,
                            fromages) : une commande annulée au dernier moment représente une perte sèche
                        </li>
                        <li>
                            La livraison est assurée par notre équipe et chaque trajet représente du <strong>temps
                            et des frais réels</strong>
                        </li>
                        <li>
                            Cette condition permet d'instaurer une <strong>relation de confiance mutuelle</strong>,
                            un client connu ayant déjà prouvé sa fiabilité
                        </li>
                    </ul>
                    <p className="mt-3">
                        Si vous êtes un <strong>nouveau client</strong>, votre première commande doit
                        être réglée en ligne. Dès votre deuxième commande, le paiement à la livraison
                        sera automatiquement disponible dans vos options de paiement.
                    </p>
                </>
            ),
        },
        {
            title: 'Questions fréquentes',
            content: (
                <div className="space-y-5">
                    <div>
                        <p className="font-medium text-white">Je n'ai pas reçu d'email de confirmation, que faire ?</p>
                        <p className="mt-1">
                            Vérifiez votre dossier spam. Si l'email n'y est pas,{' '}
                            <a
                                href="https://wa.me/33689669115"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline"
                            >
                                contactez-nous sur WhatsApp
                            </a>{' '}
                            avec votre nom et le montant de la commande.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-white">Mon paiement a été refusé, pourquoi ?</p>
                        <p className="mt-1">
                            Les refus courants sont dus à des fonds insuffisants, une carte expirée ou une
                            authentification 3D Secure non validée. Vérifiez votre application bancaire,
                            une notification de validation peut être en attente.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-white">Puis-je modifier ou annuler ma commande ?</p>
                        <p className="mt-1">
                            Contactez-nous <strong>le plus tôt possible</strong> après confirmation par WhatsApp
                            au +33 6 89 66 91 15. Tant que la préparation n'a pas commencé, une modification
                            ou annulation est possible.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-white">Un produit est manquant ou abîmé à la livraison ?</p>
                        <p className="mt-1">
                            Signalez-le immédiatement à notre livreur lors de la livraison, ou contactez-nous
                            à <span className="text-gold">lauberge.espagnole.metz@gmail.com</span> dans
                            les 24h. Nous trouverons une solution.
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <LegalLayout
            title="Livraison & Paiement"
            lastUpdated="30 mars 2026"
            sections={sections}
        />
    );
};
