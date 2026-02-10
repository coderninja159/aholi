<!-- TopProblems.vue -->
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
  if (problemsStore.activeCategory) {
    items = items.filter((p) => p.category === problemsStore.activeCategory)
  }
  return [...items].sort((a, b) => b.votes - a.votes).slice(0, 12)
})

// Real vaqtni hisoblash
function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  const intervals = {
    yil: 31536000,
    oy: 2592000,
    hafta: 604800,
    kun: 86400,
    soat: 3600,
    daqiqa: 60
  }
  
  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval)
    if (interval >= 1) {
      return `${interval} ${name} oldin`
    }
  }
  
  return 'Hozirgina'
}

function tCategory(cat) { 
  return cat 
}

// Real view count (soxta emas)
function getViewCount(problemId) {
  // Bu yerda haqiqiy view count API dan kelishi kerak
  // Hozircha localStorage dan olamiz
  const views = JSON.parse(localStorage.getItem('problemViews') || '{}')
  return views[problemId] || 0
}

// Real comments count
function getCommentsCount(problemId) {
  // Bu yerda haqiqiy comments API dan kelishi kerak
  const comments = JSON.parse(localStorage.getItem('problemComments') || '{}')
  return comments[problemId]?.length || 0
}

async function handleVote(id) {
  if (problemsStore.hasVoted(id)) return
  
  animatingId.value = id
  
  // Heart particles animation trigger
  createHeartParticles(id)
  
  setTimeout(() => {
    animatingId.value = null
  }, 600)
  
  await problemsStore.vote(id)
}

// Heart particles effect
function createHeartParticles(id) {
  // Bu funksiya DOM da particles yaratadi
  const button = document.querySelector(`[data-problem-id="${id}"]`)
  if (!button) return
  
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div')
    particle.className = 'heart-particle'
    particle.innerHTML = '👍'
    particle.style.setProperty('--angle', `${i * 60}deg`)
    button.appendChild(particle)
    
    setTimeout(() => particle.remove(), 800)
  }
}

onMounted(() => {
  problemsStore.fetchList()
})
</script>

<template>
  <section class="py-16 px-4 bg-gray-950 relative overflow-hidden">
    
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
    
    <div class="container mx-auto max-w-6xl relative z-10">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-12">
        <div class="space-y-2">
          <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Eng ko'p ovoz olgan
          </h2>
          <p class="text-gray-400">Jamiyat eng muhim deb hisoblagan muammolar</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="text-sm text-gray-500 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-800">
            <span class="text-blue-400 font-bold">{{ topList.length }}</span> muammo
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <TopProblemsSkeleton v-if="problemsStore.loading" />

      <!-- Cards Grid -->
      <TransitionGroup 
        v-else
        tag="div" 
        name="stagger-fade" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="(p, index) in topList"
          :key="p.id"
          class="problem-card group relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2 transition-all duration-500"
          :style="{ animationDelay: `${index * 80}ms` }"
        >
          
          <!-- Rank Badge (Top Corner) -->
          <div class="absolute -top-2 -right-2 w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-bl-2xl flex items-center justify-center shadow-lg z-10">
            <span class="text-white font-black text-lg">#{{ index + 1 }}</span>
          </div>

          <!-- Glow Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <!-- Header: Avatar + Name -->
          <div class="p-5 border-b border-gray-800/50 flex items-center gap-3 bg-gray-900/30 backdrop-blur-sm">
            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                {{ tCategory(p.category).charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            
            <div class="flex-1">
              <h3 class="text-white font-bold text-sm">{{ p.author || 'Aholi vakili' }}</h3>
              <p class="text-xs text-gray-500 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                {{ p.region }}
              </p>
            </div>
          </div>

          <!-- Meta: Category + Time -->
          <div class="px-5 py-3 flex items-center gap-3 text-xs">
            <span class="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold backdrop-blur-sm">
              {{ tCategory(p.category) }}
            </span>
            <span class="text-gray-600">•</span>
            <span class="text-gray-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ timeAgo(p.createdAt) }}
            </span>
          </div>

          <!-- Body -->
          <div class="px-5 py-4 min-h-[100px]">
            <p class="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors">
              {{ p.description }}
            </p>
          </div>

          <!-- Footer Stats -->
          <div class="px-5 py-4 bg-gray-950/50 backdrop-blur-sm border-t border-gray-800/50 flex items-center justify-between text-xs">
            <div class="flex items-center gap-5">
              <!-- Views -->
              <span class="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors cursor-pointer group/stat">
                <svg class="w-4 h-4 group-hover/stat:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="font-semibold">{{ getViewCount(p.id) }}</span>
              </span>
              
              <!-- Comments -->
              <span class="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors cursor-pointer group/stat">
                <svg class="w-4 h-4 group-hover/stat:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="font-semibold">{{ getCommentsCount(p.id) }}</span>
              </span>
            </div>
            
            <!-- Like Button -->
            <button
              @click="handleVote(p.id)"
              :data-problem-id="p.id"
              :disabled="problemsStore.hasVoted(p.id)"
              class="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              :class="[
                problemsStore.hasVoted(p.id) 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-gray-800 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 border border-gray-700',
                animatingId === p.id ? 'animate-vote-pulse' : ''
              ]"
            >
              <!-- Thumbs Up Icon -->
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="w-5 h-5 transition-all duration-300" 
                :class="[
                  animatingId === p.id ? 'scale-125 rotate-12' : '',
                  problemsStore.hasVoted(p.id) ? 'animate-bounce-once' : ''
                ]"
                :fill="problemsStore.hasVoted(p.id) ? 'currentColor' : 'none'" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              
              <span class="relative z-10">{{ p.votes }}</span>
              
              <!-- Ripple Effect -->
              <span v-if="animatingId === p.id" class="absolute inset-0 bg-blue-500/30 rounded-xl animate-ping"></span>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
/* Card Entry Animation */
.problem-card {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Stagger Transition */
.stagger-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.stagger-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.stagger-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Vote Button Animation */
@keyframes votePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-vote-pulse {
  animation: votePulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Bounce Once */
@keyframes bounceOnce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-once {
  animation: bounceOnce 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Heart Particles */
.heart-particle {
  position: absolute;
  font-size: 12px;
  pointer-events: none;
  animation: particleFloat 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes particleFloat {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(
      calc(cos(var(--angle)) * 40px),
      calc(sin(var(--angle)) * 40px)
    ) rotate(360deg) scale(0);
  }
}

/* Card Hover Glow */
.problem-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s;
}

.problem-card:hover::before {
  opacity: 0.5;
}
</style>