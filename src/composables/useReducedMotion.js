import { ref, onMounted } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    mq.addEventListener('change', (e) => {
      reduced.value = e.matches
    })
  })

  return reduced
}
