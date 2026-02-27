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
import { UserSettings } from './pages/user/UserSettings';
import { UserAddress } from './pages/user/UserAddress';
import { CheckoutPage } from './pages/shop/CheckoutPage';
import { AboutPage } from './pages/AboutPage';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={
                <FrontendLayout>
                    <HomePage />
                </FrontendLayout>
            } />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/boutique" element={
                <FrontendLayout>
                    <BoutiquePage />
                </FrontendLayout>
            } />

            <Route path="/cart" element={
                <FrontendLayout>
                    <CartPage />
                </FrontendLayout>
            } />

            <Route path="/about" element={
                <FrontendLayout>
                    <AboutPage />
                </FrontendLayout>
            } />

            <Route path="/account" element={<UserDashboard />} />
            <Route path="/account/profile" element={<UserProfile />} />
            <Route path="/account/orders" element={<UserOrders />} />
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