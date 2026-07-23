import { STORAGE_KEYS } from '../constants/app.jsx'

export function readStored(key, fallback = '') {
  try {
    const value = localStorage.getItem(key)
    return value == null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export function writeStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function clearAuthStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}
