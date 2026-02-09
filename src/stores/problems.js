import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Google Script URL (doGet uchun ham, doPost uchun ham manzil bir xil)
const API_URL = 'https://script.google.com/macros/s/AKfycbxd3YLVuE4QtERXNEwY9axi5E7Kvo-1ZEo_yce1d7t1tHKA28Ub0oS2mFZ03sabz0Kv/exec'

export const useProblemsStore = defineStore('problems', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)
  const activeCategory = ref(null)

  // Ma’lumotlarni olish (Fetch)
  async function fetchList() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Ma\'lumotlarni olishda xatolik')
      
      const data = await response.json()
      list.value = data // Google Sheetsdan kelgan ma’lumotlar
    } catch (err) {
      console.error(err)
      error.value = 'Server bilan bog‘lanib bo‘lmadi'
    } finally {
      loading.value = false
    }
  }

  // Ovoz berish (Hozircha frontendda ko‘rsatish uchun, aslida backendda bo‘lishi kerak)
  // Simple uchun xotirada oshirib qo‘yamiz
  const votedIds = ref(new Set())

  async function vote(id) {
    if (votedIds.value.has(id)) return
    
    // Optimistik update (UI tezda yangilanadi)
    const problem = list.value.find(p => p.id === id)
    if (problem) {
      problem.votes++
      votedIds.value.add(id)
    }
    
    // Agar backendda ovoz saqlash bo'lsa, shu yerga fetch qo'shiladi
  }

  function hasVoted(id) {
    return votedIds.value.has(id)
  }

  return {
    list,
    loading,
    error,
    activeCategory,
    fetchList,
    vote,
    hasVoted
  }
})