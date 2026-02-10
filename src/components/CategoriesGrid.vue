<script setup>
import { ref } from 'vue'
import { useProblemsStore } from '@/stores/problems'

const problemsStore = useProblemsStore()

const categories = [
  { id: 'Suv muammosi', label: 'Suv muammosi', icon: '💧', color: 'from-blue-500 to-cyan-500' },
  { id: 'Elektr energiyasi', label: 'Elektr energiyasi', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { id: "Yo'l ta'mirlash", label: "Yo'l ta'mirlash", icon: '🛣️', color: 'from-gray-500 to-gray-700' },
  { id: 'Internet / aloqa', label: 'Internet / aloqa', icon: '📡', color: 'from-purple-500 to-pink-500' },
  { id: 'Chiqindi / ekologiya', label: 'Chiqindi / ekologiya', icon: '♻️', color: 'from-green-500 to-emerald-500' },
  { id: 'Boshqa', label: 'Boshqa', icon: '⚙️', color: 'from-indigo-500 to-blue-500' },
]

function selectCategory(cat) {
  // Clicking the same category toggles it off
  if (problemsStore.activeCategory === cat) {
    problemsStore.activeCategory = null
  } else {
    problemsStore.activeCategory = cat
  }
}
</script>

<template>
  <section class="py-12 bg-gray-950 relative">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold text-white text-center mb-8">Kategoriyalar</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          class="group relative p-4 rounded-2xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          :class="[
            problemsStore.activeCategory === cat.id 
              ? 'bg-gray-800 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50' 
              : 'hover:bg-gray-800 hover:border-gray-600'
          ]"
        >
          <!-- Active Glow Effect -->
          <div v-if="problemsStore.activeCategory === cat.id" 
               class="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10 blur-md pointer-events-none"
               :class="cat.color">
          </div>

          <div class="flex flex-col items-center justify-center gap-3 relative z-10">
            <div class="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
              {{ cat.icon }}
            </div>
            <span class="text-sm font-medium text-gray-300 group-hover:text-white text-center">
              {{ cat.label }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>