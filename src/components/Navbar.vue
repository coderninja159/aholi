<script setup>
import { useI18n } from 'vue-i18n'
import LanguageMenu from './LanguageMenu.vue'
// ThemeToggle import qilinmadi (olib tashlandi)

const { t } = useI18n()
const emit = defineEmits(['open-form'])
</script>

<template>
  <!-- 
    O'zgarishlar: 
    - bg-white dark:bg-gray-900 o'rniga -> bg-gray-950 (faqat qora)
    - border-b oq rang o'rnini -> border-gray-800
  -->
  <header class="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 text-white shadow-lg shadow-black/20">
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
      
      <!-- Logo: Oq rangda ko'rinadi -->
      <a
        href="#"
        class="text-xl font-bold tracking-tight flex items-center gap-2 group"
      >
        <div class="w-2 h-8 bg-blue-600 rounded-full group-hover:h-10 transition-all duration-300"></div>
        <span class="text-white group-hover:text-blue-400 transition-colors">{{ t('nav.logo') }}</span>
      </a>

      <div class="flex items-center gap-3">
        <!-- Til menyusi qoldirildi -->
        <LanguageMenu />
        
        <!-- ThemeToggle olib tashlandi! -->

        <button
          type="button"
          class="px-5 py-2 rounded-full text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-600/20"
          @click="emit('open-form')"
        >
          {{ t('nav.report') }}
        </button>
      </div>
    </nav>
  </header>
</template>