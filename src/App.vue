
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
import { useProblemsStore } from './stores/problems'
</script>

<template>
  <!-- 
    !IMPORTANT: bg-gray-950 qo'shildi va classlar qattiq belgilandi 
    min-h-[100vh] sahifani cho'zilib ketishdan saqlaydi
  -->
  <div class="min-h-screen bg-[#020617] text-gray-100 overflow-x-hidden">
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

<style>
/* Global override: Oq fonni hech qachon chiqarmaydi */
body {
  background-color: #020617 !important;
  color: #e5e7eb !important;
}
</style>
