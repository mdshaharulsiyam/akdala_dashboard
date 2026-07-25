import {
  AppstoreOutlined,
  CommentOutlined,
  DashboardOutlined,
  ProductOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL

export const STORAGE_KEYS = Object.freeze({
  token: 'token',
  email: 'email',
  resetToken: 'resetToken',
})

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  VENDOR: 'VENDOR',
  USER: 'USER',
  RIDER: 'RIDER',
  PROFESSIONAL: 'PROFESSIONAL',
})

export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN]

export const ROUTES = Object.freeze({
  login: '/login',
  forgetPassword: '/forget-password',
  otp: '/otp',
  resetPassword: '/reset-password',
  dashboard: '/',
  management: '/management',
  vendors: '/vendors',
  newVendor: '/vendors/new',
  users: '/users',
  products: '/products',
  newProduct: '/products/new',
  editProduct: '/products/:id/edit',
  profile: '/profile',
  orders: '/orders',
  notifications: '/notification',
  faq: '/faq',
  about: '/about-us',
  contacts: '/contact-messages',
  reviews: '/product-reviews',
  messages: '/messages',
  privacy: '/privacy-policy',
  terms: '/terms-&-condition',
  webSettings: '/web-settings',
  vendorDashboard: '/vendor/dashboard',
  vendorProducts: '/vendor/products',
  vendorNewProduct: '/vendor/products/new',
  vendorEditProduct: '/vendor/products/:id/edit',
  vendorOrders: '/vendor/orders',
  vendorProfile: '/vendor/shop-profile',
  vendorReviews: '/vendor/reviews',
  vendorMessages: '/vendor/messages',
})

export const adminNavigation = [
  { path: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { path: '/vendors', label: 'Vendors', icon: <ShopOutlined /> },
  { path: '/users', label: 'User', icon: <TeamOutlined /> },
  { path: '/products', label: 'Product', icon: <ProductOutlined /> },
  { path: '/orders', label: 'Orders', icon: <ShoppingCartOutlined /> },
  { path: '/product-reviews', label: 'Reviews', icon: <StarOutlined /> },
  { path: '/messages', label: 'Messages', icon: <CommentOutlined /> },
  { path: '/management', label: 'Management', icon: <AppstoreOutlined /> },
]

export const adminSettingsNavigation = [
  { path: '/profile', label: 'Profile' },
  { path: '/faq', label: 'FAQ' },
  { path: '/about-us', label: 'About Us' },
  { path: '/contact-messages', label: 'Contact Messages' },
  { path: '/privacy-policy', label: 'Privacy Policy' },
  { path: '/terms-&-condition', label: 'Terms & Condition' },
  { path: '/web-settings', label: 'Web Settings' },
]

export const vendorNavigation = [
  { path: '/vendor/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { path: '/vendor/products', label: 'Products', icon: <ProductOutlined /> },
  { path: '/vendor/orders', label: 'Orders', icon: <ShoppingCartOutlined /> },
  { path: '/vendor/reviews', label: 'Reviews', icon: <StarOutlined /> },
  { path: '/vendor/messages', label: 'Messages', icon: <CommentOutlined /> },
  { path: '/vendor/shop-profile', label: 'Profile', icon: <UserOutlined /> },
]

export const API_TAGS = [
  'auth', 'category', 'Subcategory', 'Coupon', 'Product', 'attributes', 'user',
  'shop', 'dashboard', 'faq', 'settings', 'web-settings', 'contact', 'review',
  'Orders', 'Conversation', 'Message', 'notification', 'banner',
]

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']
export const CONTACT_STATUSES = ['all', 'open', 'resolve', 'reject']
export const USER_ROLES = ['USER', 'ADMIN', 'VENDOR', 'RIDER', 'PROFESSIONAL', 'SUPER_ADMIN']
export const MANAGEMENT_TABS = [
  { key: 'category', label: 'Category' },
  { key: 'subcategory', label: 'Subcategory' },
  { key: 'attributes', label: 'Attributes' },
  { key: 'banner', label: 'Banner' },
  { key: 'coupon', label: 'Coupon' },
]

export const settingsIcon = <SettingOutlined />
