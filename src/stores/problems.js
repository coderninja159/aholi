import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Google Script URL (doGet uchun ham, doPost uchun ham manzil bir xil)
const API_URL = 'https://script.google.com/macros/s/AKfycbyhfhYIVjHIOdkvbcC3WzD-xXxjeySW23lSnAiNbWoiNI-HFz3k4ys3KpAS99K18tWJ/exec'

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
      
      // Google ba'zida status 200 qaytarmaydi, shuni tekshiramiz
      if (!response.ok && response.status !== 200) {
        throw new Error(`Server xatosi: ${response.status}`)
      }
      
      const text = await response.text()
      // Agar response JSON bo'lmasa xatolik beradi
      try {
        const data = JSON.parse(text)
        list.value = data 
      } catch (e) {
        console.error("JSON parse xatosi:", text)
        throw new Error("Ma'lumot noto'g'ri keldi")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      error.value = 'Server bilan bog‘lanib bo‘lmadi. Internetni tekshiring.'
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