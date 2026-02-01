<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import CategoriesGrid from './components/CategoriesGrid.vue'
import TopProblems from './components/TopProblems.vue'
import AllProblems from './components/AllProblems.vue'
import HowItWorks from './components/HowItWorks.vue'
import Footer from './components/Footer.vue'
import ProblemForm from './components/ProblemForm.vue'
import { useProblemsStore } from '@/stores/problems'

const showFormModal = ref(false)
const problemsStore = useProblemsStore()

function openForm() {
  showFormModal.value = true
}

function closeForm() {
  showFormModal.value = false
  problemsStore.fetchList()
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray('.scroll-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%' },
          y: 24,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        })
      })
    })
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Navbar @open-form="openForm" />
    <main>
      <Hero @open-form="openForm" />
      <CategoriesGrid />
      <TopProblems />
      <AllProblems />
      <HowItWorks />
      <Footer />
    </main>
    <ProblemForm v-if="showFormModal" @close="closeForm" />
  </div>
</template>
