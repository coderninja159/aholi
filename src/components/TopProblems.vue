<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import TopProblemsSkeleton from './TopProblemsSkeleton.vue'

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

// Vaqtni "2 daqiqa oldin" kabi ko'rsatish uchun
function timeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " yil oldin"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " oy oldin"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " kun oldin"
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " soat oldin"
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " daqiqa oldin"
  return "Hozirgina"
}

function tCategory(cat) {
  const map = {
    'Suv muammosi': 'water',
    'Elektr energiyasi': 'electricity',
    "Yo'l ta'mirlash": 'roads',
    'Internet / aloqa': 'internet',
    'Chiqindi / ekologiya': 'waste',
    'Boshqa': 'other',
  }
  return t(`categories.${map[cat] || 'other'}`)
}

async function vote(id) {
  try {
    await problemsStore.vote(id)
  } catch {
    // Error handled in store
  }
}

onMounted(() => {
  problemsStore.fetchList()
})
</script>

<template>
  <section id="top-problems" class="py-12 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div class="container mx-auto max-w-2xl">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white px-2">
        Eng ko'p ovoz olgan
      </h2>
      
      <!-- Skeleton -->
      <TopProblemsSkeleton v-if="problemsStore.loading" />
      
      <!-- Xatolik -->
      <div v-else-if="problemsStore.error" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center text-red-500">
        <p class="font-bold mb-2">Xatolik yuz berdi</p>
        <p class="text-sm">{{ problemsStore.error }}</p>
        <button @click="problemsStore.fetchList" class="mt-4 text-blue-600 hover:underline">Qayta urinish</button>
      </div>

      <!-- Ro'yxat (Facebook Style) -->
      <div v-else class="space-y-4">
        <div
          v-for="p in top5"
          :key="p.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Header: Avatar + Name + Time -->
          <div class="p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              {{ p.category ? p.category.charAt(0) : 'A' }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
                {{ tCategory(p.category) }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                📍 {{ p.region }} · {{ timeAgo(p.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Body: Text -->
          <div class="px-4 pb-2">
            <p class="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed whitespace-pre-line">
              {{ p.description }}
            </p>
          </div>

          <!-- Footer: Actions (Like/Comment) -->
          <div class="px-2 py-2 border-t border-gray-100 dark:border-gray-700 flex gap-1">
            <button
              @click="vote(p.id)"
              :disabled="problemsStore.hasVoted(p.id)"
              class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
              :class="{ 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': problemsStore.hasVoted(p.id) }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{{ problemsStore.hasVoted(p.id) ? 'Yoqdi' : 'Yoqish' }}</span>
              <span v-if="p.votes > 0" class="bg-gray-200 dark:bg-gray-600 px-1.5 rounded text-xs">{{ p.votes }}</span>
            </button>
            
            <button class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Izoh</span>
            </button>
          </div>
        </div>
        
        <p v-if="top5.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-10">
          Hozircha ma’lumotlar yo‘q.
        </p>
      </div>
    </div>
  </section>
</template>