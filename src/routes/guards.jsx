import { Alert, Button } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from '../components/common'
import { ROLES, STORAGE_KEYS } from '../constants/app.jsx'
import { useProfile } from '../hooks/useProfile'
import { clearAuthStorage, readStored } from '../utils/storage'
import {
  authorizedDestination,
  isAdminRole,
  isBusinessApproved,
  isBusinessBlocked,
  isDashboardRole,
} from '../utils/auth'

function VendorAccessMessage({ blocked }) {
  const logout = () => {
    clearAuthStorage()
    window.location.replace('/login')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Alert
          showIcon
          type={blocked ? 'error' : 'warning'}
          message={blocked ? 'Vendor account blocked' : 'Vendor approval pending'}
          description={blocked
            ? 'Your business has been blocked. Please contact an administrator.'
            : 'Your business must be approved by an administrator before you can access the vendor panel.'}
        />
        <Button block onClick={logout}>Sign out</Button>
      </div>
    </div>
  )
}

function Guard({ allowedRole, children }) {
  const location = useLocation()
  const token = readStored(STORAGE_KEYS.token)
  const { profile, isLoading, isFetching, isError } = useProfile()
  if (!token) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  if (isLoading || (isFetching && !profile)) return <Loader fullScreen />
  if (isError) {
    clearAuthStorage()
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  if (allowedRole === ROLES.VENDOR) {
    if (isAdminRole(profile?.role)) return <Navigate to="/" replace />
    if (profile?.role !== ROLES.VENDOR) {
      clearAuthStorage()
      return <Navigate to="/login" replace />
    }
    if (!profile?.business || !isBusinessApproved(profile.business)) return <VendorAccessMessage />
    if (isBusinessBlocked(profile.business)) return <VendorAccessMessage blocked />
    return children
  }

  if (isAdminRole(profile?.role)) return children
  if (profile?.role === ROLES.VENDOR) return <Navigate to="/vendor/dashboard" replace />

  clearAuthStorage()
  return <Navigate to="/login" replace />
}

export function PublicOnlyGuard({ children }) {
  const location = useLocation()
  const token = readStored(STORAGE_KEYS.token)
  const { profile, isLoading, isFetching, isError } = useProfile()

  if (!token) return children
  if (isLoading || (isFetching && !profile)) return <Loader fullScreen />
  if (isError || !isDashboardRole(profile?.role)) {
    clearAuthStorage()
    return children
  }

  const requested = location.state?.from
  return <Navigate to={authorizedDestination(profile.role, requested)} replace />
}

export const AdminGuard = ({ children }) => <Guard allowedRole={ROLES.ADMIN}>{children}</Guard>
export const VendorGuard = ({ children }) => <Guard allowedRole={ROLES.VENDOR}>{children}</Guard>
