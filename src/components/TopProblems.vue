<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '@/stores/problems'
import TopProblemsSkeleton from './TopProblemsSkeleton.vue'

const { t } = useI18n()
const problemsStore = useProblemsStore()
const animatingId = ref(null)

const topList = computed(() => {
  let items = problemsStore.list
  if (problemsStore.activeCategory) items = items.filter((p) => p.category === problemsStore.activeCategory)
  return [...items].sort((a, b) => b.votes - a.votes).slice(0, 12)
})

function timeAgo(date) { /* ... */ return "12 soat oldin" /* ... */ }
function tCategory(cat) { return cat } // Soddalashtirish uchun

async function handleVote(id) {
  animatingId.value = id
  setTimeout(() => animatingId.value = null, 600)
  await problemsStore.vote(id)
}

onMounted(() => problemsStore.fetchList())
</script>

<template>
  <section class="py-16 px-4 bg-gray-950 relative">
    <div class="container mx-auto max-w-6xl">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-extrabold text-white">Eng ko'p ovoz olgan</h2>
        <span class="text-sm text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
          {{ topList.length }} natija
        </span>
      </div>

      <TransitionGroup 
        tag="div" 
        name="stagger-fade" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <!-- CARD DESIGN (New Structure) -->
        <div
          v-for="(p, index) in topList"
          :key="p.id"
          class="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-2 transition-all duration-300"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Header: Avatar + Name + Badge -->
          <div class="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {{ tCategory(p.category).charAt(0) }}
              </div>
              <div>
                <h3 class="text-white font-bold text-sm">Aholi vakili</h3>
                <p class="text-xs text-gray-500">📍 {{ p.region }}</p>
              </div>
            </div>
            <span class="px-2 py-1 rounded text-xs font-bold bg-gray-800 text-gray-400 border border-gray-700">
              #{{ index + 1 }}
            </span>
          </div>

          <!-- Meta: Category + Time -->
          <div class="px-5 py-2 flex items-center gap-3 text-xs text-gray-500">
            <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {{ tCategory(p.category) }}
            </span>
            <span>•</span>
            <span>{{ timeAgo(p.createdAt) }}</span>
          </div>

          <!-- Body -->
          <div class="px-5 py-4">
            <p class="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {{ p.description }}
            </p>
          </div>

          <!-- Footer Stats -->
          <div class="px-5 py-3 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {{ Math.floor(Math.random() * 100) + 20 }}
              </span>
              <span class="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                0
              </span>
            </div>
            
            <!-- Like Button -->
            <button
              @click="handleVote(p.id)"
              :disabled="problemsStore.hasVoted(p.id)"
              class="flex items-center gap-1.5 font-bold transition-all duration-200 active:scale-90 disabled:opacity-50"
              :class="[
                problemsStore.hasVoted(p.id) 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-red-400',
                animatingId === p.id ? 'text-red-500 scale-125' : ''
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform" :class="animatingId === p.id ? 'scale-125' : ''" :fill="problemsStore.hasVoted(p.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {{ p.votes }}
            </button>
          </div>
        </div>
      </TransitionGroup>
      
      <TopProblemsSkeleton v-if="problemsStore.loading" />
    </div>
  </section>
</template>

<style scoped>
.stagger-fade-enter-active { transition: all 0.5s ease-out; }
.stagger-fade-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }
.stagger-fade-enter-to { opacity: 1; transform: translateY(0) scale(1); }
</style>