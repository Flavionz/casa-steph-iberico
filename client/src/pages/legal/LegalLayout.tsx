import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Section {
    title: string;
    content: React.ReactNode;
}

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    sections: Section[];
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, lastUpdated, sections }) => {
    return (
        <div className="min-h-screen bg-[#1E1B18] text-white pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm mb-8"
                >
                    <ChevronLeft size={16} />
                    Retour à l'accueil
                </Link>

                {/* Header */}
                <div className="mb-10 pb-8 border-b border-gray-800">
                    <h1 className="font-serif text-4xl text-white mb-3">{title}</h1>
                    <p className="text-gray-500 text-sm">Dernière mise à jour : {lastUpdated}</p>
                </div>

                {/* Sections */}
                <div className="space-y-10">
                    {sections.map((section, i) => (
                        <section key={i}>
                            <h2 className="text-gold font-serif text-xl mb-4">
                                {i + 1}. {section.title}
                            </h2>
                            <div className="text-gray-300 text-sm leading-relaxed space-y-3">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-16 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-600 text-xs">
                        © {new Date().getFullYear()} L'Auberge Espagnole — Tous droits réservés
                    </p>
                </div>
            </div>
        </div>
    );
};
