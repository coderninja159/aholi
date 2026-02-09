import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'https://script.google.com/macros/s/AKfycbzXEm8WTgD3TrcsM7RVmvwo0jT8E_XiW4GhFDI1i6UOmCJJBwfS_gvttIz2jcpfFG2r/exec'

export const useProblemsStore = defineStore('problems', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)
  const activeCategory = ref(null)
  
  // Qaysi IDga ovoz berilganini eslaydigan set (Frontend uchun)
  const votedIds = ref(new Set())

  async function fetchList() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL)
      const text = await response.text()
      const data = JSON.parse(text)
      list.value = data
    } catch (err) {
      console.error(err)
      error.value = 'Xatolik'
    } finally {
      loading.value = false
    }
  }

  async function vote(id) {
    if (votedIds.value.has(id)) return // Allaqachon bosilgan bo'lsa

    // 1. UI ni darhol yangilash (Optimistik)
    const problem = list.value.find(p => p.id === id)
    if (problem) {
      problem.votes++
      votedIds.value.add(id)
    }

    // 2. Serverga yuborish
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', id: id })
      })
    } catch (err) {
      // Agar xato bo'lsa, UI ni qaytarish (ixtiyoriy)
      if (problem) {
        problem.votes--
        votedIds.value.delete(id)
      }
      console.error("Vote failed", err)
    }
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