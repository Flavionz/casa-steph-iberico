import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { CookieBanner } from './components/cookies/CookieBanner';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);
    return null;
};

export const FrontendLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark text-white">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <CartProvider>
                    <CookieConsentProvider>
                        <AppRouter />
                        <CookieBanner />
                    </CookieConsentProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}