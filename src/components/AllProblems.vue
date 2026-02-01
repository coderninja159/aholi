<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import { PAGINATION, CATEGORIES } from '@/config'

const { t } = useI18n()
const problemsStore = useProblemsStore()
const searchQuery = ref('')
const currentPage = ref(1)

const categoryKeys = {
  'Suv muammosi': 'water',
  'Elektr energiyasi': 'electricity',
  "Yo'l ta'mirlash": 'roads',
  'Internet / aloqa': 'internet',
  'Chiqindi / ekologiya': 'waste',
  Boshqa: 'other',
}

function tCategory(cat) {
  return t(`categories.${categoryKeys[cat] || 'other'}`)
}

const filtered = computed(() => {
  let items = [...problemsStore.list]
  if (problemsStore.activeCategory) {
    items = items.filter((p) => p.category === problemsStore.activeCategory)
  }
  const q = (searchQuery.value || '').trim().toLowerCase()
  if (q) {
    items = items.filter((p) => (p.description || '').toLowerCase().includes(q))
  }
  return items.sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes
    return (b.createdAt || '').localeCompare(a.createdAt || '')
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / PAGINATION.PER_PAGE))
)

const paginated = computed(() => {
  const start = (currentPage.value - 1) * PAGINATION.PER_PAGE
  return filtered.value.slice(start, start + PAGINATION.PER_PAGE)
})

watch(
  () => [problemsStore.activeCategory, searchQuery.value],
  () => {
    currentPage.value = 1
  }
)

async function vote(id) {
  try {
    await problemsStore.vote(id)
  } catch {
    // rollback handled in store
  }
}

onMounted(() => {
  if (problemsStore.list.length === 0) problemsStore.fetchList()
})
</script>

<template>
  <section id="all-problems" class="py-16 px-4 scroll-reveal">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {{ t('problems.all') }}
      </h2>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('problems.search')"
          class="input-focus-ring flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:shadow-glow transition-shadow"
        />
        <select
          :value="problemsStore.activeCategory ?? ''"
          class="input-focus-ring rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 min-w-[180px] focus:border-blue-500"
          @change="(e) => (problemsStore.activeCategory = e.target.value || null)"
        >
          <option value="">{{ t('problems.filterByCategory') }}</option>
          <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
            {{ tCategory(cat) }}
          </option>
        </select>
      </div>
      <div v-if="problemsStore.loading" class="text-center text-gray-500 py-8">Loading…</div>
      <div v-else class="space-y-4">
        <div
          v-for="p in paginated"
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
        <p v-if="paginated.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
          {{ t('problems.noResults') }}
        </p>
      </div>
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
        <button
          type="button"
          :disabled="currentPage <= 1"
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          @click="currentPage--"
        >
          ←
        </button>
        <span class="px-4 py-2 text-gray-600 dark:text-gray-300">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          @click="currentPage++"
        >
          →
        </button>
      </div>
    </div>
  </section>
</template>
