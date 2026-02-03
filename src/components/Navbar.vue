<script setup>
import { useI18n } from 'vue-i18n'
import ThemeToggle from './ThemeToggle.vue'
import LanguageMenu from './LanguageMenu.vue'

const { t } = useI18n()
const emit = defineEmits(['open-form'])

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
        <LanguageMenu />
        <ThemeToggle />
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
