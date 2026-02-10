import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'https://script.google.com/macros/s/AKfycbxf_IJWO3_9YTjIgJQCgRBKIt-c-7bcTWup7BTQg3tCv6vadHRDptnn31svb95oatPp/exec'

export const useProblemsStore = defineStore('problems', () => {
  const list = ref([])
  const loading = ref(false) // Faqat boshlang'ich yuklash uchun
  const error = ref(null)
  const activeCategory = ref(null)
  const votedIds = ref(new Set())

  // Ma'lumotlarni olish
  async function fetchList(isBackground = false) {
    // Faqat boshida loading true bo'ladi, fonda esa yo'q
    if (!isBackground) {
      loading.value = true
      error.value = null
    }

    try {
      const response = await fetch(API_URL)
      const text = await response.text()
      const data = JSON.parse(text)
      
      // Optimizatsiya: Agar ma'lumotlar o'zgarmagan bo'lsa, hech narsa qilmaymiz
      // (Bu DOMni yangilashdan saqlaydi)
      if (JSON.stringify(data) === JSON.stringify(list.value)) return

      list.value = data
    } catch (err) {
      console.error(err)
      if (!isBackground) error.value = 'Xatolik'
    } finally {
      if (!isBackground) loading.value = false
    }
  }

  // Ovoz berish
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
    } catch (err) {
      if (problem) {
        problem.votes--
        votedIds.value.delete(id)
      }
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