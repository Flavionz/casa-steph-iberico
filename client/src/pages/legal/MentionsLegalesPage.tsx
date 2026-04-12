import { LegalLayout } from './LegalLayout';

const Placeholder = ({ label }: { label: string }) => (
    <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded px-1.5 py-0.5 text-xs font-mono">
        [{label}]
    </span>
);

export const MentionsLegalesPage = () => {
    const sections = [
        {
            title: 'Éditeur du site',
            content: (
                <>
                    <p>Le site <strong>auberge-espagnol.fr</strong> est édité par :</p>
                    <ul className="mt-2 space-y-1 list-none">
                        <li><span className="text-gray-400">Nom commercial :</span> Casa Steph Iberico</li>
                        <li><span className="text-gray-400">Titulaire :</span> MILHAU Stéphane, Maurice, Robert</li>
                        <li><span className="text-gray-400">Forme juridique :</span> Micro-entreprise (entreprise individuelle)</li>
                        <li><span className="text-gray-400">Siège social :</span> 33 Rue des Chenevières, 57140 La Maxe</li>
                        <li><span className="text-gray-400">SIREN :</span> 519 942 924</li>
                        <li><span className="text-gray-400">N° RCS :</span> 519 942 924 R.C.S. Metz</li>
                        <li><span className="text-gray-400">TVA :</span> TVA non applicable — art. 293 B du CGI</li>
                        <li><span className="text-gray-400">Email :</span> lauberge.espagnole.metz@gmail.com</li>
                        <li><span className="text-gray-400">Téléphone :</span> +33 6 89 66 91 15</li>
                        <li><span className="text-gray-400">Directeur de publication :</span> MILHAU Stéphane</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Hébergement',
            content: (
                <>
                    <p>Ce site est hébergé par :</p>
                    <ul className="mt-2 space-y-1 list-none">
                        <li><span className="text-gray-400">Hébergeur :</span> <Placeholder label="NOM DE L'HÉBERGEUR (ex: OVH, Vercel, etc.)" /></li>
                        <li><span className="text-gray-400">Adresse :</span> <Placeholder label="ADRESSE DE L'HÉBERGEUR" /></li>
                        <li><span className="text-gray-400">Site web :</span> <Placeholder label="https://www.hebergeur.fr" /></li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Propriété intellectuelle',
            content: (
                <p>
                    L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos) sont la propriété
                    exclusive de Casa Steph Iberico, sauf mention contraire. Toute reproduction, distribution ou
                    utilisation sans autorisation écrite préalable est strictement interdite et constitue une
                    contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
            ),
        },
        {
            title: 'Limitation de responsabilité',
            content: (
                <p>
                    Casa Steph Iberico s'efforce de maintenir les informations publiées sur ce site à jour et exactes.
                    Cependant, elle ne peut garantir l'exactitude, la complétude ou l'actualité des informations
                    diffusées. L'utilisation des informations et contenus du site est effectuée sous la responsabilité
                    exclusive de l'utilisateur.
                </p>
            ),
        },
        {
            title: 'Droit applicable',
            content: (
                <p>
                    Le présent site et les présentes mentions légales sont soumis au droit français.
                    En cas de litige, les tribunaux français seront seuls compétents.
                </p>
            ),
        },
    ];

    return (
        <LegalLayout
            title="Mentions Légales"
            lastUpdated="18 mars 2026"
            sections={sections}
        />
    );
};
