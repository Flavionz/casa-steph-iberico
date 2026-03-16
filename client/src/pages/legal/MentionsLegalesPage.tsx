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
                        <li><span className="text-gray-400">Raison sociale :</span> <Placeholder label="NOM DE L'ENTREPRISE ou NOM PRÉNOM" /></li>
                        <li><span className="text-gray-400">Forme juridique :</span> <Placeholder label="SARL / SAS / Auto-entrepreneur / etc." /></li>
                        <li><span className="text-gray-400">Siège social :</span> <Placeholder label="ADRESSE COMPLÈTE" /></li>
                        <li><span className="text-gray-400">SIRET :</span> <Placeholder label="XXX XXX XXX XXXXX" /></li>
                        <li><span className="text-gray-400">Numéro de TVA intracommunautaire :</span> <Placeholder label="FR XX XXXXXXXXX" /></li>
                        <li><span className="text-gray-400">Email :</span> lauberge.espagnole.metz@gmail.com</li>
                        <li><span className="text-gray-400">Téléphone :</span> <Placeholder label="+33 X XX XX XX XX" /></li>
                        <li><span className="text-gray-400">Directeur de publication :</span> <Placeholder label="NOM PRÉNOM" /></li>
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
                    exclusive de L'Auberge Espagnole, sauf mention contraire. Toute reproduction, distribution ou
                    utilisation sans autorisation écrite préalable est strictement interdite et constitue une
                    contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
            ),
        },
        {
            title: 'Limitation de responsabilité',
            content: (
                <p>
                    L'Auberge Espagnole s'efforce de maintenir les informations publiées sur ce site à jour et exactes.
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
            lastUpdated="À compléter"
            sections={sections}
        />
    );
};
