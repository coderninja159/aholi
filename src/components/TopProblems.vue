<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'

const { t } = useI18n()
const problemsStore = useProblemsStore()

const top5 = computed(() => {
  const cat = problemsStore.activeCategory
  let items = problemsStore.list
  if (cat) items = items.filter((p) => p.category === cat)
  return [...items]
    .sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes
      return (b.createdAt || '').localeCompare(a.createdAt || '')
    })
    .slice(0, 5)
})

function tCategory(cat) {
  const map = {
    'Suv muammosi': 'water',
    'Elektr energiyasi': 'electricity',
    "Yo'l ta'mirlash": 'roads',
    'Internet / aloqa': 'internet',
    'Chiqindi / ekologiya': 'waste',
    Boshqa: 'other',
  }
  return t(`categories.${map[cat] || 'other'}`)
}

async function vote(id) {
  try {
    await problemsStore.vote(id)
  } catch {
    // rollback handled in store
  }
}

onMounted(() => {
  problemsStore.fetchList()
})
</script>

<template>
  <section id="top-problems" class="py-16 px-4 scroll-reveal bg-white/30 dark:bg-gray-800/30">
    <div class="container mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        {{ t('problems.top') }}
      </h2>
      <div v-if="problemsStore.loading" class="text-center text-gray-500 dark:text-gray-400 py-8">
        Loading…
      </div>
      <div v-else-if="problemsStore.error" class="text-center text-red-500 py-8">
        {{ problemsStore.error }}
      </div>
      <div v-else class="space-y-4 max-w-2xl mx-auto">
        <div
          v-for="p in top5"
          :key="p.id"
          class="glass-card p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-500/20 transition-colors"
        >
          <p class="text-gray-700 dark:text-gray-300 mb-2">{{ p.description }}</p>
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{{ tCategory(p.category) }} · {{ p.region }}</span>
            <button
              type="button"
              :disabled="problemsStore.hasVoted(p.id)"
              class="px-3 py-1 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
              :class="
                problemsStore.hasVoted(p.id)
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 cursor-default'
                  : 'bg-gray-200/80 dark:bg-gray-600/80 hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-[1.02] hover:shadow-glow'
              "
              @click="vote(p.id)"
            >
              {{ problemsStore.hasVoted(p.id) ? t('problems.liked') : t('problems.like') }} ({{
                p.votes
              }})
            </button>
          </div>
        </div>
        <p v-if="top5.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
          {{ t('problems.noResults') }}
        </p>
      </div>
    </div>
  </section>
</template>
