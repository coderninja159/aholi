import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'https://script.google.com/macros/s/AKfycbzJ90tefoRYjYHsWpowxsYBMyfC6MD6HOiqBZZWOB4u5_a-1KVBhCW0_37NwvSP8hdQ/exec'

export const useProblemsStore = defineStore('problems', () => {
  const list = ref([])
  const loading = ref(true)
  const error = ref(null)
  const activeCategory = ref(null)
  
  // MUHIM: Faqat birinchi marta yuklanganda skeleton chiqsin
  const isInitialLoad = ref(true)
  
  const votedIds = ref(new Set())

  async function fetchList() {
    // Agar dastlabki yuklanish bo'lmasa, loading ni true qilmaymiz
    if (isInitialLoad.value) {
      loading.value = true
    }
    
    error.value = null
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Network error')
      const text = await response.text()
      const data = JSON.parse(text)
      list.value = data
    } catch (err) {
      console.error(err)
      error.value = 'Ma\'lumotlarni yuklab bo\'lmadi'
    } finally {
      loading.value = false
      isInitialLoad.value = false // Endi skeleton chiqmaydi
    }
  }

  async function vote(id) {
    if (votedIds.value.has(id)) return
    const problem = list.value.find(p => p.id === id)
    if (problem) {
      problem.votes++
      votedIds.value.add(id)
    }
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', id: id })
      })
    } catch (err) { console.error(err) }
  }

  function hasVoted(id) {
    return votedIds.value.has(id)
  }

  return { list, loading, error, activeCategory, fetchList, vote, hasVoted }
})