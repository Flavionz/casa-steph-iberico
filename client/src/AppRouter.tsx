import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FrontendLayout } from './App';
import { AdminRouteProtector } from './pages/auth/AdminRouteProtector';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { BoutiquePage } from './pages/shop/BoutiquePage';
import { CartPage } from './pages/shop/CartPage';
import { AddProductPage } from './pages/admin/AddProductPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ManageFeaturedPage } from './pages/admin/ManageFeaturedPage';
import { ManageProductsPage } from './pages/admin/ManageProductsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ManageOrdersPage } from './pages/admin/ManageOrdersPage';
import { UserDashboard } from './pages/user/UserDashboard';
import { UserProfile } from './pages/user/UserProfile';
import { UserOrders } from './pages/user/UserOrders';
import { OrderDetailPage } from './pages/user/OrderDetailPage';
import { UserSettings } from './pages/user/UserSettings';
import { UserAddress } from './pages/user/UserAddress';
import { CheckoutPage } from './pages/shop/CheckoutPage';
import { ProductDetailPage } from './pages/shop/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { OrderConfirmationPage } from './pages/shop/OrderConfirmationPage';
import { MentionsLegalesPage } from './pages/legal/MentionsLegalesPage';
import { CGVPage } from './pages/legal/CGVPage';
import { ConfidentialitePage } from './pages/legal/ConfidentialitePage';
import { LivraisonPaiementPage } from './pages/legal/LivraisonPaiementPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';



export const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={
                <FrontendLayout>
                    <HomePage />
                </FrontendLayout>
            } />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/boutique" element={
                <FrontendLayout>
                    <BoutiquePage />
                </FrontendLayout>
            } />

            <Route path="/boutique/:id" element={
                <FrontendLayout>
                    <ProductDetailPage />
                </FrontendLayout>
            } />

            <Route path="/cart" element={
                <FrontendLayout>
                    <CartPage />
                </FrontendLayout>
            } />

            <Route path="/order-confirmation" element={
                <OrderConfirmationPage />
            } />

            <Route path="/about" element={
                <FrontendLayout>
                    <AboutPage />
                </FrontendLayout>
            } />

            <Route path="/mentions" element={
                <FrontendLayout>
                    <MentionsLegalesPage />
                </FrontendLayout>
            } />

            <Route path="/cgv" element={
                <FrontendLayout>
                    <CGVPage />
                </FrontendLayout>
            } />

            <Route path="/privacy" element={
                <FrontendLayout>
                    <ConfidentialitePage />
                </FrontendLayout>
            } />

            <Route path="/livraison-paiement" element={
                <FrontendLayout>
                    <LivraisonPaiementPage />
                </FrontendLayout>
            } />

            <Route path="/account" element={<UserDashboard />} />
            <Route path="/account/profile" element={<UserProfile />} />
            <Route path="/account/orders" element={<UserOrders />} />
            <Route path="/account/orders/:id" element={<OrderDetailPage />} />
            <Route path="/account/settings" element={<UserSettings />} />
            <Route path="/account/address" element={<UserAddress />} />

            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/admin/dashboard" element={
                <AdminRouteProtector>
                    <AdminDashboardPage />
                </AdminRouteProtector>
            } />

            <Route path="/admin/add-product" element={
                <AdminRouteProtector>
                    <AddProductPage />
                </AdminRouteProtector>
            } />

            <Route path="/admin/products" element={
                <AdminRouteProtector>
                    <ManageProductsPage />
                </AdminRouteProtector>
            } />

            <Route path="/admin/products/edit/:id" element={
                <AdminRouteProtector>
                    <AddProductPage />
                </AdminRouteProtector>
            } />

            <Route path="/admin/featured" element={
                <AdminRouteProtector>
                    <ManageFeaturedPage />
                </AdminRouteProtector>
            } />

            <Route path="/admin/orders" element={
                <AdminRouteProtector>
                    <ManageOrdersPage />
                </AdminRouteProtector>
            } />

            <Route path="/admin/users" element={
                <AdminRouteProtector>
                    <UsersPage />
                </AdminRouteProtector>
            } />
        </Routes>
    );
};