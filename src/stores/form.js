import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiSubmit } from '@/api/client'
import { FORM, CATEGORIES, REGIONS } from '@/config'

const HONEYPOT_NAME = 'website_url'

export const useFormStore = defineStore('form', () => {
  const lastSubmitAt = ref(0)
  const submitting = ref(false)
  const success = ref(false)
  const error = ref(null)

  const canSubmit = computed(() => {
    return Date.now() - lastSubmitAt.value >= FORM.RATE_LIMIT_MS
  })

  const rateLimitRemaining = computed(() => {
    const elapsed = Date.now() - lastSubmitAt.value
    if (elapsed >= FORM.RATE_LIMIT_MS) return 0
    return Math.ceil((FORM.RATE_LIMIT_MS - elapsed) / 1000)
  })

  async function submit({ region, category, description, honeypot }) {
    if (honeypot) return
    if (!canSubmit.value) {
      throw new Error('RATE_LIMIT')
    }
    const cat = CATEGORIES.includes(category) ? category : 'Boshqa'
    if (!REGIONS.includes(region)) throw new Error('Invalid region')
    if (!description || typeof description !== 'string') throw new Error('Description required')
    const desc = description.slice(0, FORM.DESCRIPTION_MAX_LENGTH).trim()
    if (!desc) throw new Error('Description required')

    submitting.value = true
    success.value = false
    error.value = null
    try {
      await apiSubmit({ region, category: cat, description: desc })
      lastSubmitAt.value = Date.now()
      success.value = true
    } catch (e) {
      error.value = e.message || 'Submit failed'
      throw e
    } finally {
      submitting.value = false
    }
  }

  function clearSuccess() {
    success.value = false
    error.value = null
  }

  return {
    lastSubmitAt,
    submitting,
    success,
    error,
    canSubmit,
    rateLimitRemaining,
    submit,
    clearSuccess,
    HONEYPOT_NAME,
    DESCRIPTION_MAX_LENGTH: FORM.DESCRIPTION_MAX_LENGTH,
  }
})
