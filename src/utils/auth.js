import { ADMIN_ROLES, ROLES } from '../constants/app.jsx'

export const isAdminRole = (role) => ADMIN_ROLES.includes(role)

export const isDashboardRole = (role) =>
  isAdminRole(role) || role === ROLES.VENDOR

export const roleHome = (role) =>
  role === ROLES.VENDOR ? '/vendor/dashboard' : '/'

const isVendorPath = (path) =>
  path === '/vendor' || path.startsWith('/vendor/')

export function authorizedDestination(role, requestedPath) {
  const path = typeof requestedPath === 'string' && requestedPath.startsWith('/') && !requestedPath.startsWith('//')
    ? requestedPath
    : roleHome(role)

  if (role === ROLES.VENDOR) {
    return isVendorPath(path) ? path : roleHome(role)
  }

  if (isAdminRole(role)) {
    return isVendorPath(path) ? roleHome(role) : path
  }

  return '/login'
}

export const isBusinessApproved = (business) =>
  Boolean(business?.is_approve ?? business?.isApproved ?? business?.is_approved ?? false)

export const isBusinessBlocked = (business) =>
  Boolean(business?.block ?? business?.isBlocked ?? business?.is_blocked ?? false)
