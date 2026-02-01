<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const steps = [{ key: 'step1' }, { key: 'step2' }, { key: 'step3' }]
</script>

<template>
  <section id="how-it-works" class="py-16 px-4 scroll-reveal bg-white/30 dark:bg-gray-800/30">
    <div class="container mx-auto max-w-3xl">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        {{ t('howItWorks.title') }}
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(step, i) in steps"
          :key="step.key"
          class="glass-card p-6 rounded-xl text-center border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-500/20 transition-colors"
        >
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold mb-4"
          >
            {{ i + 1 }}
          </span>
          <p class="text-gray-700 dark:text-gray-300 font-medium">
            {{ t('howItWorks.' + step.key) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
