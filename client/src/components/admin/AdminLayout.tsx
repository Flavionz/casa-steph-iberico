import React, { useContext, useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AuthContext } from '../../contexts/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Overlay — mobile only */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                    <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                        {/* Hamburger — mobile only */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors p-1 shrink-0"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-2xl font-serif text-gray-800 truncate">
                                Panneau d'Administration
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                                Gestion de la boutique
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold/20 flex items-center justify-center">
                                <span className="text-gold font-bold text-sm">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
