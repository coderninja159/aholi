import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'aholi-muammolari-theme'

function getInitial() {
  if (typeof document === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref(getInitial())

  watch(
    mode,
    (val) => {
      if (typeof document === 'undefined') return
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(val)
      localStorage.setItem(STORAGE_KEY, val)
    },
    { immediate: true }
  )

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return { mode, toggle }
})
