import { describe, it, expect } from 'vitest'
import { REGIONS, CATEGORIES, FORM, PAGINATION } from './config'

describe('config', () => {
  it('exports REGIONS with expected length', () => {
    expect(Array.isArray(REGIONS)).toBe(true)
    expect(REGIONS.length).toBe(14)
    expect(REGIONS).toContain('Toshkent shahri')
    expect(REGIONS).toContain('Xorazm viloyati')
  })

  it('exports CATEGORIES with 6 items and Boshqa', () => {
    expect(Array.isArray(CATEGORIES)).toBe(true)
    expect(CATEGORIES.length).toBe(6)
    expect(CATEGORIES).toContain('Boshqa')
    expect(CATEGORIES).toContain('Suv muammosi')
  })

  it('exports FORM with RATE_LIMIT_MS and DESCRIPTION_MAX_LENGTH', () => {
    expect(FORM.RATE_LIMIT_MS).toBe(30_000)
    expect(FORM.DESCRIPTION_MAX_LENGTH).toBe(2000)
  })

  it('exports PAGINATION PER_PAGE', () => {
    expect(PAGINATION.PER_PAGE).toBe(5)
  })
})
