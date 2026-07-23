import { useGetProfileQuery } from '../services/authApi'
import { STORAGE_KEYS } from '../constants/app.jsx'
import { readStored } from '../utils/storage'

export function useProfile() {
  const token = readStored(STORAGE_KEYS.token)
  const query = useGetProfileQuery(undefined, { skip: !token })
  return { ...query, profile: query.data?.data, token }
}
