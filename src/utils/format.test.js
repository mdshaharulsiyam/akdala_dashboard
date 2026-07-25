import { describe, expect, it } from 'vitest'
import { assetUrl, formatCurrency, statusColor, titleCase } from './format'

describe('recovered helpers', () => {
  it('normalizes API asset paths', () => {
    expect(assetUrl('uploads\\logo.png')).toBe('http://localhost:5004/uploads/logo.png')
    expect(assetUrl('https://cdn.example/image.png')).toBe('https://cdn.example/image.png')
  })
  it('formats display values', () => {
    expect(formatCurrency(12.5)).toBe('$12.50')
    expect(titleCase('PAYMENT_PENDING')).toBe('Payment Pending')
    expect(statusColor('approved')).toBe('green')
    expect(statusColor('blocked')).toBe('red')
  })
})
