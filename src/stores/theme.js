import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref(localStorage.getItem('theme') || 'dark') // Default: Qora

  watch(mode, (newMode) => {
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, { immediate: true })

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return { mode, toggle }
})