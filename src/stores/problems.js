import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

const API_URL = 'https://script.google.com/macros/s/AKfycbzJ90tefoRYjYHsWpowxsYBMyfC6MD6HOiqBZZWOB4u5_a-1KVBhCW0_37NwvSP8hdQ/exec'

export const useProblemsStore = defineStore('problems', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)
  const activeCategory = ref(null)
  const isInitialLoad = ref(true)
  
  // LocalStorage xavfsiz o'qish
  const getInitialVotes = () => {
    try {
      return JSON.parse(localStorage.getItem('voted_problems') || '[]')
    } catch { return [] }
  }

  const votedIds = ref(getInitialVotes())

  // LocalStorage-ga yozish (votedIds massiv bo'lgani uchun watch ishlaydi)
  watch(votedIds, (newVal) => {
    localStorage.setItem('voted_problems', JSON.stringify(newVal))
  }, { deep: true })

  async function fetchList() {
    if (isInitialLoad.value) loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Tarmoq xatosi')
      const data = await response.json() // .text() va JSON.parse() o'rniga
      list.value = data
    } catch (err) {
      error.value = 'Ma’lumotlarni yuklab bo‘lmadi'
      console.error(err)
    } finally {
      loading.value = false
      isInitialLoad.value = false
    }
  }

  async function vote(id) {
    if (hasVoted(id)) return
    
    // Optimistik update (Serverdan javob kutmasdan UI-ni yangilash)
    const problem = list.value.find(p => p.id === id)
    if (problem) {
      problem.votes++
      votedIds.value.push(id)
    }

    try {
      // Google Apps Script uchun 'no-cors' ba'zan kerak, lekin POST mantiqiyligini tekshiring
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', id: id })
      })
    } catch (err) {
      // Xatolik bo'lsa ovozni qaytarib olish (Rollback)
      if (problem) {
        problem.votes--
        votedIds.value = votedIds.value.filter(vId => vId !== id)
      }
      console.error("Ovoz berishda xatolik:", err)
    }
  }

  const hasVoted = (id) => votedIds.value.includes(id)

  return {
    list, loading, error, activeCategory,
    fetchList, vote, hasVoted
  }
})