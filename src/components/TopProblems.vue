<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import TopProblemsSkeleton from './TopProblemsSkeleton.vue'

const { t } = useI18n()
const problemsStore = useProblemsStore()

// Animatsiya uchun momental state
const animatingId = ref(null)

const top5 = computed(() => {
  const cat = problemsStore.activeCategory
  let items = problemsStore.list
  if (cat) items = items.filter((p) => p.category === cat)
  return [...items]
    .sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes
      return (b.createdAt || '').localeCompare(a.createdAt || '')
    })
    .slice(0, 12) // Ko'proq ko'rsatish uchun 12 taga oshirdim
})

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

async function handleVote(id) {
  // Animatsiyani ishga tushirish
  animatingId.value = id
  setTimeout(() => animatingId.value = null, 600) // 0.6s dan keyin to'xtaydi
  
  await problemsStore.vote(id)
}

onMounted(() => {
  problemsStore.fetchList()
})
</script>

<template>
  <section id="top-problems" class="py-12 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="container mx-auto max-w-6xl">
      <h2 class="text-2xl font-bold mb-8 text-gray-900 dark:text-white px-2">
        Eng ko'p ovoz olgan
      </h2>
      
      <!-- Skeleton -->
      <TopProblemsSkeleton v-if="problemsStore.loading" />
      
      <!-- Xatolik -->
      <div v-else-if="problemsStore.error" class="text-center text-red-500 p-8">
        {{ problemsStore.error }}
        <button @click="problemsStore.fetchList" class="ml-4 text-blue-600 underline">Qayta</button>
      </div>

      <!-- 3 Ustunli Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="p in top5"
          :key="p.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Header -->
          <div class="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-sm text-sm">
              {{ p.category ? p.category.charAt(0) : 'M' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 dark:text-white text-sm truncate">
                {{ tCategory(p.category) }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                📍 {{ p.region }}
              </p>
            </div>
            <div class="text-xs text-gray-400">
              {{ timeAgo(p.createdAt) }}
            </div>
          </div>

          <!-- Body -->
          <div class="p-4 min-h-[80px] flex items-center">
            <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed line-clamp-3">
              {{ p.description }}
            </p>
          </div>

          <!-- Footer: Only Like -->
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-center">
            <button
              @click="handleVote(p.id)"
              :disabled="problemsStore.hasVoted(p.id)"
              class="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-90 disabled:opacity-60 disabled:grayscale"
              :class="[
                problemsStore.hasVoted(p.id) 
                  ? 'bg-red-500 text-white shadow-red-500/30' 
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200',
                animatingId === p.id ? 'scale-110 bg-red-500 text-white' : ''
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" 
                :class="[
                  animatingId === p.id ? 'scale-125' : '',
                  problemsStore.hasVoted(p.id) ? 'fill-current' : ''
                ]" 
                viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {{ problemsStore.hasVoted(p.id) ? 'Yoqildi' : 'Yoqish' }}
              <span class="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-200 font-bold">
                {{ p.votes }}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="top5.length === 0 && !loading" class="text-center py-12 text-gray-400">
        Ma'lumotlar yo'q
      </div>
    </div>
  </section>
</template>