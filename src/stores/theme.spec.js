import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from './theme'

describe('theme store', () => {
  beforeEach(() => {
    vi.stubGlobal('document', {
      documentElement: { classList: { remove: vi.fn(), add: vi.fn() } },
      addEventListener: vi.fn(),
    })
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    })
    if (typeof window !== 'undefined') {
      window.matchMedia = vi.fn(() => ({ matches: false }))
    }
    setActivePinia(createPinia())
  })

  it('has mode and toggle', () => {
    const store = useThemeStore()
    expect(store.mode).toBeDefined()
    expect(store.toggle).toBeTypeOf('function')
  })

  it('toggle switches mode', () => {
    const store = useThemeStore()
    const initial = store.mode
    store.toggle()
    expect(store.mode).not.toBe(initial)
    store.toggle()
    expect(store.mode).toBe(initial)
  })
})
