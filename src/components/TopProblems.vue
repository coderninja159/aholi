<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import TopProblemsSkeleton from './TopProblemsSkeleton.vue'

const { t } = useI18n()
const problemsStore = useProblemsStore()
const animatingId = ref(null)

// "Muzlatuvchi" mantiq: Tartib faqat boshlang'ichda o'rnatiladi, keyin o'zgarmaydi
const initialSortDone = ref(false)

const top5 = computed(() => {
  let items = problemsStore.list
  const cat = problemsStore.activeCategory
  if (cat) items = items.filter((p) => p.category === cat)
  
  // Faqat boshida sort qilamiz
  if (!initialSortDone.value) {
    items = [...items].sort((a, b) => b.votes - a.votes)
    // Ma'lumotlar kelsa, muzlatilgan tartibda yangilanadi
    initialSortDone.value = true 
  }
  
  return items.slice(0, 12)
})

function timeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds > 86400) return Math.floor(seconds / 86400) + " kun"
  if (seconds > 3600) return Math.floor(seconds / 3600) + " soat"
  if (seconds > 60) return Math.floor(seconds / 60) + " daq"
  return "hozir"
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
  setTimeout(() => animatingId.value = null, 200) // 200ms - Juda tez
  await problemsStore.vote(id)
}

onMounted(() => {
  problemsStore.fetchList(false)
  
  // Yangilash tezligi (2s)
  const interval = setInterval(() => {
    problemsStore.fetchList(true)
  }, 2000)

  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <!-- min-h-[600px] berildi: Pastda paydo bo'lib joyiga o'tishni oldini oladi -->
  <section class="py-10 px-4 min-h-[600px] bg-transparent relative">
    
    <h2 class="text-2xl font-bold mb-8 px-2 text-white">Eng ko'p ovoz olgan</h2>
    
    <!-- Skeleton: Z-Index yuqori, foni qattiq qora -->
    <div v-if="problemsStore.loading" class="relative z-20 w-full">
      <TopProblemsSkeleton />
    </div>

    <!-- Xatolik -->
    <div v-else-if="problemsStore.error" class="text-center text-red-500 p-8">
      {{ problemsStore.error }}
    </div>

    <!-- Asosiy Ro'yxat: TransitionGroup olib tashlandi (Sakramaslik uchun) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="p in top5"
        :key="p.id"
        class="bg-gray-900 border border-gray-800 rounded-2xl p-5 transition-colors duration-200 hover:bg-gray-800"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            {{ p.category ? p.category.charAt(0) : 'M' }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white text-sm truncate">{{ tCategory(p.category) }}</h3>
            <p class="text-xs text-gray-500 truncate">📍 {{ p.region }}</p>
          </div>
          <span class="text-xs text-gray-600">{{ timeAgo(p.createdAt) }}</span>
        </div>

        <!-- Body: Aniq balandlik (h-16) -->
        <div class="h-16 mb-4">
          <p class="text-gray-300 text-sm leading-relaxed line-clamp-3 h-full">
            {{ p.description }}
          </p>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-gray-800 flex justify-center">
          <button
            @click="handleVote(p.id)"
            :disabled="problemsStore.hasVoted(p.id)"
            class="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-150 transform active:scale-95 disabled:opacity-40"
            :class="[
              problemsStore.hasVoted(p.id) 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-blue-400',
              animatingId === p.id ? 'scale-110 bg-blue-500' : ''
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>YOQISH</span>
            <span class="bg-black/30 px-2 py-0.5 rounded text-xs text-white font-mono">
              {{ p.votes }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>