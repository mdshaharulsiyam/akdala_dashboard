import moment from 'moment'
import { API_BASE_URL } from '../constants/app.jsx'

export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '').replace(/\\/g, '/')}`
}

export const formatDate = (value, pattern = 'MMM DD, YYYY') =>
  value ? moment(value).format(pattern) : 'N/A'

export const formatDateTime = (value) =>
  value ? moment(value).format('MMM DD, YYYY h:mm A') : 'N/A'

export const formatCurrency = (value, symbol = '$') =>
  `${symbol}${Number(value || 0).toFixed(2)}`

export const titleCase = (value = '') =>
  String(value).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

export function statusColor(status) {
  const value = String(status || '').toLowerCase()
  if (['active', 'approved', 'paid', 'delivered', 'resolve', 'resolved'].includes(value)) return 'green'
  if (['blocked', 'rejected', 'reject', 'failed', 'cancelled'].includes(value)) return 'red'
  if (['pending', 'processing'].includes(value)) return 'orange'
  if (['shipped', 'open'].includes(value)) return 'blue'
  return 'default'
}

export function toFormData(values, fileKeys = []) {
  const data = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (value == null) return
    if (fileKeys.includes(key)) {
      const files = Array.isArray(value) ? value : [value]
      files.forEach((file) => {
        const raw = file?.originFileObj || file
        if (raw instanceof Blob) data.append(key, raw)
      })
    } else if (Array.isArray(value) || typeof value === 'object') {
      data.append(key, JSON.stringify(value))
    } else {
      data.append(key, value)
    }
  })
  return data
}
