import { describe, expect, it } from 'vitest'
import {
  authorizedDestination,
  isBusinessApproved,
  isBusinessBlocked,
  isDashboardRole,
  roleHome,
} from './auth'

describe('dashboard authorization helpers', () => {
  it('keeps admin and vendor destinations inside their own panels', () => {
    expect(authorizedDestination('SUPER_ADMIN', '/vendors')).toBe('/vendors')
    expect(authorizedDestination('SUPER_ADMIN', '/vendor/products')).toBe('/')
    expect(authorizedDestination('VENDOR', '/vendor/products')).toBe('/vendor/products')
    expect(authorizedDestination('VENDOR', '/users')).toBe('/vendor/dashboard')
  })

  it('only admits dashboard roles', () => {
    expect(isDashboardRole('ADMIN')).toBe(true)
    expect(isDashboardRole('SUPER_ADMIN')).toBe(true)
    expect(isDashboardRole('VENDOR')).toBe(true)
    expect(isDashboardRole('USER')).toBe(false)
    expect(roleHome('VENDOR')).toBe('/vendor/dashboard')
  })

  it('normalizes backend business access fields', () => {
    expect(isBusinessApproved({ is_approve: true })).toBe(true)
    expect(isBusinessApproved({ is_approve: false })).toBe(false)
    expect(isBusinessBlocked({ block: true })).toBe(true)
    expect(isBusinessBlocked({ block: false })).toBe(false)
  })
})
