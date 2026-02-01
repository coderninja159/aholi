<script setup>
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import { CATEGORIES } from '@/config'

const { t } = useI18n()
const problemsStore = useProblemsStore()

const categoryKeys = {
  'Suv muammosi': 'water',
  'Elektr energiyasi': 'electricity',
  "Yo'l ta'mirlash": 'roads',
  'Internet / aloqa': 'internet',
  'Chiqindi / ekologiya': 'waste',
  Boshqa: 'other',
}

function tCategory(cat) {
  const key = categoryKeys[cat] || 'other'
  return t(`categories.${key}`)
}

function setActiveCategory(cat) {
  problemsStore.activeCategory = cat
}

defineExpose({ setActiveCategory })
</script>

<template>
  <section id="categories" class="py-16 px-4 scroll-reveal">
    <div class="container mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        {{ t('categories.title') }}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          type="button"
          class="glass-card p-4 text-center font-medium text-gray-800 dark:text-gray-200 hover:border-blue-500/30 hover:shadow-glow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-xl"
          @click="setActiveCategory(cat)"
        >
          {{ tCategory(cat) }}
        </button>
      </div>
    </div>
  </section>
</template>
