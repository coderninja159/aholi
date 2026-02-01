import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiList, apiVote } from '@/api/client'
import { CATEGORIES } from '@/config'

const VOTED_IDS_KEY = 'aholi-muammolari-voted'

function getVotedIds() {
  try {
    const raw = localStorage.getItem(VOTED_IDS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveVotedIds(set) {
  localStorage.setItem(VOTED_IDS_KEY, JSON.stringify([...set]))
}

export const useProblemsStore = defineStore('problems', () => {
  const rawList = ref([])
  const votedIds = ref(getVotedIds())
  const loading = ref(false)
  const error = ref(null)
  const activeCategory = ref(null)

  const list = computed(() => rawList.value)

  function normalizeCategory(cat) {
    if (!cat || !CATEGORIES.includes(cat)) return 'Boshqa'
    return cat
  }

  async function fetchList() {
    loading.value = true
    error.value = null
    try {
      const data = await apiList()
      rawList.value = (data || []).map((row) => ({
        id: row.id,
        region: row.region || '',
        category: normalizeCategory(row.category),
        description: row.description || '',
        votes: Number(row.votes) || 0,
        createdAt: row.createdAt || row.created_at || '',
      }))
    } catch (e) {
      error.value = e.message || 'Failed to load'
      rawList.value = []
    } finally {
      loading.value = false
    }
  }

  function hasVoted(id) {
    return votedIds.value.has(String(id))
  }

  function addVotedId(id) {
    const next = new Set(votedIds.value)
    next.add(String(id))
    votedIds.value = next
    saveVotedIds(next)
  }

  function removeVotedId(id) {
    const next = new Set(votedIds.value)
    next.delete(String(id))
    votedIds.value = next
    saveVotedIds(next)
  }

  async function vote(id) {
    if (hasVoted(id)) return
    const item = rawList.value.find((p) => p.id === id)
    if (!item) return
    const prevVotes = item.votes
    item.votes += 1
    addVotedId(id)
    try {
      await apiVote(id)
    } catch {
      item.votes = prevVotes
      removeVotedId(id)
      throw new Error('Vote failed')
    }
  }

  return {
    list,
    loading,
    error,
    activeCategory,
    fetchList,
    vote,
    hasVoted,
    normalizeCategory,
  }
})
