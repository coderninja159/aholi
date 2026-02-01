<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()
const theme = useThemeStore()
const emit = defineEmits(['open-form'])

const locales = [
  { code: 'uz', label: 'Oʻz' },
  { code: 'uz_kr', label: 'Ўз' },
  { code: 'ru', label: 'Ru' },
  { code: 'en', label: 'En' },
]

const currentLocale = computed(
  () => locales.find((l) => l.code === useI18n().locale.value)?.code || 'uz'
)

function openForm() {
  emit('open-form')
}
</script>

<template>
  <header
    class="sticky top-0 z-50 glass-card border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
  >
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <a
        href="#"
        class="text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-90 transition-opacity"
      >
        {{ t('nav.logo') }}
      </a>
      <div class="flex items-center gap-3">
        <div class="relative" role="group">
          <select
            :value="currentLocale"
            class="input-focus-ring bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:border-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 appearance-none pr-8"
            aria-label="Language"
            @change="(e) => setLocale(e.target.value)"
          >
            <option v-for="loc in locales" :key="loc.code" :value="loc.code">
              {{ loc.label }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500/50 hover:shadow-glow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          :aria-label="theme.mode === 'dark' ? 'Light mode' : 'Dark mode'"
          @click="theme.toggle()"
        >
          <span v-if="theme.mode === 'dark'" class="text-lg">☀️</span>
          <span v-else class="text-lg">🌙</span>
        </button>
        <button
          type="button"
          class="btn-cta px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          @click="openForm"
        >
          {{ t('nav.report') }}
        </button>
      </div>
    </nav>
  </header>
</template>
