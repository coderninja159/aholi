import { computed, onMounted, ref } from 'vue'

export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    
    const handler = (e) => prefersReducedMotion.value = e.matches
    mediaQuery.addEventListener('change', handler)
    
    // Cleanup qo'shish mumkin (lekin oddiy uchun yetarli)
  })

  return computed(() => prefersReducedMotion.value)
}