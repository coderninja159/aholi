<script setup>
import { ref, computed } from 'vue'
import { useProblemsStore } from '@/stores/problems'
import { CATEGORIES } from '@/config'

const problemsStore = useProblemsStore()
const searchText = ref('')
const selectedCategory = ref('')

const filteredList = computed(() => {
  let items = problemsStore.list
  if (searchText.value) items = items.filter(p => p.description.toLowerCase().includes(searchText.value.toLowerCase()))
  if (selectedCategory.value) items = items.filter(p => p.category === selectedCategory.value)
  return items
})
</script>

<template>
  <section class="py-16 px-4 bg-gray-950 min-h-screen">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-3xl font-bold text-white mb-10 text-center">Barcha muammolar</h2>
      
      <!-- Modern Search Bar -->
      <div class="relative group mb-12">
        <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
        <div class="relative flex items-center bg-gray-900 border border-gray-700 rounded-xl p-1 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-shadow">
          <!-- Search Icon -->
          <div class="pl-4 text-gray-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <!-- Input -->
          <input 
            v-model="searchText" 
            type="text" 
            placeholder="Muammoni qidiring..." 
            class="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-gray-500 text-lg"
          >
          
          <!-- Dropdown -->
          <select v-model="selectedCategory" class="bg-gray-800 text-gray-300 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none cursor-pointer hover:bg-gray-700 transition">
            <option value="">Barchasi</option>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <!-- List -->
      <div class="space-y-4">
        <div v-for="p in filteredList" :key="p.id" class="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-all group">
           <div class="flex justify-between items-start">
             <div class="flex-1">
               <div class="flex gap-2 mb-2">
                 <span class="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{{ p.category }}</span>
                 <span class="text-xs text-gray-500">📍 {{ p.region }}</span>
               </div>
               <p class="text-gray-300">{{ p.description }}</p>
             </div>
             <span class="text-gray-500 font-bold ml-4 text-lg">{{ p.votes }} 👍</span>
           </div>
        </div>
        <p v-if="filteredList.length === 0" class="text-center text-gray-500 py-12 text-lg">Hech narsa topilmadi</p>
      </div>
    </div>
  </section>
</template>