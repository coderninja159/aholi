<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import TopProblemsSkeleton from './TopProblemsSkeleton.vue'

const { t } = useI18n()
const problemsStore = useProblemsStore()
const animatingId = ref(null)

const top5 = computed(() => {
  const cat = problemsStore.activeCategory
  let items = problemsStore.list
  if (cat) items = items.filter((p) => p.category === cat)
  return [...items]
    .sort((a, b) => b.votes - a.votes) // Eng ko'p ovoz yuqorida
    .slice(0, 12)
})

function timeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds > 86400) return Math.floor(seconds / 86400) + " kun oldin"
  if (seconds > 3600) return Math.floor(seconds / 3600) + " soat oldin"
  if (seconds > 60) return Math.floor(seconds / 60) + " daqiqa oldin"
  return "Hozirgina"
}

function tCategory(cat) {
  const map = {
    'Suv muammosi': 'water', 'Elektr energiyasi': 'electricity',
    "Yo'l ta'mirlash": 'roads', 'Internet / aloqa': 'internet',
    'Chiqindi / ekologiya': 'waste', 'Boshqa': 'other',
  }
  return t(`categories.${map[cat] || 'other'}`)
}

async function handleVote(id) {
  animatingId.value = id
  setTimeout(() => animatingId.value = null, 600)
  await problemsStore.vote(id)
}

onMounted(() => {
  problemsStore.fetchList()
  
  // AVTOMATIK YANGILANISH (Har 2 soniyada)
  // Eslatma: Google Sheets kuniga 20,000 marta so'rov cheklaydi.
  // 2 sekundda yangilsa, ~11 soatdan keyin to'xtab qolishi mumkin.
  // Agar ko'p foydalanuvchi bo'lsa, 5000 (5 soniya) qo'yish maslahat beriladi.
  const interval = setInterval(() => {
    problemsStore.fetchList()
  }, 2000) 

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <section class="py-10 px-4 min-h-screen">
    <h2 class="text-2xl font-bold mb-6 px-2 text-gray-200">Eng ko'p ovoz olgan</h2>
    
    <!-- Skeleton -->
    <TopProblemsSkeleton v-if="problemsStore.loading" />
    
    <!-- Grid Layout -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="p in top5"
        :key="p.id"
        class="group relative bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-5 hover:bg-gray-800/60 transition-all duration-300 hover:border-blue-500/30"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
            {{ p.category ? p.category.charAt(0) : 'M' }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-200 text-sm truncate">{{ tCategory(p.category) }}</h3>
            <p class="text-xs text-gray-500 truncate">📍 {{ p.region }}</p>
          </div>
          <span class="text-xs text-gray-600">{{ timeAgo(p.createdAt) }}</span>
        </div>

        <!-- Body -->
        <p class="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 h-16">
          {{ p.description }}
        </p>

        <!-- Footer: Thumb Up Like -->
        <div class="pt-3 border-t border-gray-700/50 flex justify-center">
          <button
            @click="handleVote(p.id)"
            :disabled="problemsStore.hasVoted(p.id)"
            class="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-90 disabled:opacity-50"
            :class="[
              problemsStore.hasVoted(p.id) 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-blue-400',
              animatingId === p.id ? 'scale-110 bg-blue-500 text-white' : ''
            ]"
          >
            <!-- Bosh barmoq (Thumb Up) iconi -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" 
              :class="animatingId === p.id ? 'scale-125 rotate-12' : ''" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>Yoqish</span>
            <span class="bg-gray-900/50 px-2 py-0.5 rounded text-xs text-gray-300">
              {{ p.votes }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>