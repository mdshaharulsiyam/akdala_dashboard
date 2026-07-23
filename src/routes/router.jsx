import { Navigate, createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { AdminDashboardPage, VendorDashboardPage } from '../pages/DashboardPages'
import { ContactMessagesPage, FaqPage, LegalContentPage } from '../pages/ContentPages'
import ManagementPage from '../pages/ManagementPage'
import MessagesPage from '../pages/MessagesPage'
import NotificationsPage from '../pages/NotificationsPage'
import OrdersPage from '../pages/OrdersPage'
import { ProductFormPage, ProductsPage } from '../pages/ProductsPages'
import ProfilePage from '../pages/ProfilePage'
import { ProductReviewsPage, VendorReviewsPage } from '../pages/ReviewsPages'
import UsersPage from '../pages/UsersPage'
import { NewVendorPage, VendorsPage } from '../pages/VendorsPages'
import WebSettingsPage from '../pages/WebSettingsPage'
import { ForgetPasswordPage, LoginPage, OtpPage, ResetPasswordPage } from '../pages/auth/AuthPages'
import { AdminGuard, VendorGuard } from './guards'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminGuard><DashboardLayout /></AdminGuard>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'management', element: <ManagementPage /> },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'vendors/new', element: <NewVendorPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'notification', element: <NotificationsPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'about-us', element: <LegalContentPage type="about" title="About Us" /> },
      { path: 'contact-messages', element: <ContactMessagesPage /> },
      { path: 'product-reviews', element: <ProductReviewsPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'privacy-policy', element: <LegalContentPage type="privacy" title="Privacy Policy" /> },
      { path: 'terms-&-condition', element: <LegalContentPage type="terms" title="Terms & Condition" /> },
      { path: 'web-settings', element: <WebSettingsPage /> },
    ],
  },
  {
    path: '/vendor',
    element: <VendorGuard><DashboardLayout /></VendorGuard>,
    children: [
      { index: true, element: <Navigate to="/vendor/dashboard" replace /> },
      { path: 'dashboard', element: <VendorDashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'shop-profile', element: <ProfilePage /> },
      { path: 'reviews', element: <VendorReviewsPage /> },
      { path: 'messages', element: <MessagesPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/forget-password', element: <ForgetPasswordPage /> },
  { path: '/otp', element: <OtpPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
