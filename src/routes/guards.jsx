import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from '../components/common'
import { ADMIN_ROLES, ROLES, STORAGE_KEYS } from '../constants/app.jsx'
import { useProfile } from '../hooks/useProfile'
import { clearAuthStorage, readStored } from '../utils/storage'

function Guard({ vendor, children }) {
  const location = useLocation()
  const token = readStored(STORAGE_KEYS.token)
  const { profile, isLoading, isFetching, isError } = useProfile()
  if (!token) return <Navigate to="/login" replace state={location.pathname} />
  if (isLoading || isFetching) return <Loader fullScreen />
  if (isError) {
    clearAuthStorage()
    return <Navigate to="/login" replace state={location.pathname} />
  }
  if (vendor) {
    if (profile?.role === ROLES.VENDOR) return children
    if (ADMIN_ROLES.includes(profile?.role)) return <Navigate to="/" replace />
  } else {
    if (ADMIN_ROLES.includes(profile?.role)) return children
    if (profile?.role === ROLES.VENDOR) return <Navigate to="/vendor/dashboard" replace />
  }
  clearAuthStorage()
  return <Navigate to="/login" replace />
}

export const AdminGuard = ({ children }) => <Guard>{children}</Guard>
export const VendorGuard = ({ children }) => <Guard vendor>{children}</Guard>
