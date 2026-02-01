<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { loadSlim } from '@tsparticles/slim'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
  disabled: { type: Boolean, default: false },
})

const reducedMotion = useReducedMotion()
const containerRef = ref(null)
let initPromise = null

async function initParticles() {
  if (!containerRef.value || props.disabled || reducedMotion.value) return
  const [{ tsParticles }] = await Promise.all([import('@tsparticles/engine'), loadSlim()])
  await tsParticles.init({
    element: containerRef.value,
    options: {
      fullScreen: { enable: false },
      particles: {
        number: { value: 30 },
        color: { value: ['#3b82f6', '#60a5fa'] },
        opacity: { value: { min: 0.1, max: 0.3 } },
        size: { value: { min: 0.5, max: 1.5 } },
        move: {
          enable: true,
          speed: 0.3,
          direction: 'none',
          random: true,
        },
        links: {
          enable: true,
          distance: 120,
          color: '#3b82f6',
          opacity: 0.15,
        },
      },
      detectRetina: true,
    },
  })
}

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

onMounted(async () => {
  if (isMobile()) return
  initPromise = initParticles()
  await initPromise
})

onUnmounted(async () => {
  if (containerRef.value && initPromise) {
    const { tsParticles } = await import('@tsparticles/engine')
    const inst = tsParticles.dom().find((i) => i.canvas?.el?.parentNode === containerRef.value)
    if (inst) inst.destroy()
  }
})

watch(
  () => [props.disabled, reducedMotion],
  () => {
    if (props.disabled || reducedMotion.value) {
      if (containerRef.value) {
        import('@tsparticles/engine').then(({ tsParticles }) => {
          const dom = tsParticles.dom()
          const inst = dom?.find((i) => i.canvas?.el?.parentNode === containerRef.value)
          if (inst) inst.destroy()
        })
      }
    } else if (!isMobile()) initParticles()
  },
  { deep: true }
)
</script>

<template>
  <div
    v-if="!disabled && !reducedMotion"
    ref="containerRef"
    class="particles-container absolute inset-0 overflow-hidden pointer-events-none"
    aria-hidden="true"
  />
</template>

<style scoped>
.particles-container {
  z-index: 0;
}
</style>
