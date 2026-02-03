<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useReducedMotion } from '@/composables/useReducedMotion'

const theme = useThemeStore()
const reducedMotion = useReducedMotion()

const isDark = computed(() => theme.mode === 'dark')

function toggle() {
  theme.toggle()
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-full"
    :aria-pressed="isDark"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <span class="theme-toggle-track" :class="{ 'reduced-motion': reducedMotion }">
      <span class="theme-toggle-thumb" :class="{ dark: isDark }">
        <!-- Sun (visible in light mode) -->
        <svg
          class="theme-toggle-icon sun"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <!-- Moon (visible in dark mode) -->
        <svg
          class="theme-toggle-icon moon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  @apply inline-flex items-center justify-center p-0.5;
}

.theme-toggle-track {
  @apply relative w-12 h-7 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 shadow-inner;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.theme-toggle-thumb {
  @apply absolute top-0.5 left-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-gray-700 text-amber-600 dark:text-blue-300 shadow;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.theme-toggle-thumb.dark {
  transform: translateX(1.25rem);
}

.theme-toggle-icon {
  @apply absolute w-4 h-4;
}

.theme-toggle-icon.sun {
  opacity: 1;
  transform: rotate(0deg);
  transition: opacity 0.2s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-thumb.dark .theme-toggle-icon.sun {
  opacity: 0;
  transform: rotate(-90deg);
}

.theme-toggle-icon.moon {
  opacity: 0;
  transform: rotate(90deg);
  transition: opacity 0.2s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-thumb.dark .theme-toggle-icon.moon {
  opacity: 1;
  transform: rotate(0deg);
}

/* Reduced motion: instant switch, no rotation */
.reduced-motion .theme-toggle-thumb,
.reduced-motion .theme-toggle-icon,
.reduced-motion .theme-toggle-icon.sun,
.reduced-motion .theme-toggle-thumb.dark .theme-toggle-icon.sun,
.reduced-motion .theme-toggle-icon.moon,
.reduced-motion .theme-toggle-thumb.dark .theme-toggle-icon.moon {
  transition: none;
}
</style>
