<script setup>
import { useI18n } from 'vue-i18n'
import ParticlesBackground from './ParticlesBackground.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()
defineEmits(['open-form'])
const reducedMotion = useReducedMotion()
</script>

<template>
  <section
    class="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16 px-4"
  >
    <ParticlesBackground :disabled="reducedMotion" />
    <div class="relative z-10 max-w-3xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm">
        {{ t('hero.headline') }}
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
        {{ t('hero.subtext') }}
      </p>
      <button
        type="button"
        class="btn-cta px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        @click="$emit('open-form')"
      >
        {{ t('hero.cta') }}
      </button>
    </div>
  </section>
</template>
