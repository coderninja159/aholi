<script setup>
// App.vue'dan emit olishimiz shart bo'lmaydi, props yoki direktiv orqali ishlashimiz mumkin.
// Bu yerda oddiy qilib qoldiramiz.
defineProps({
  onOpenForm: Function
})
</script>

<template>
  <section class="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-950">
    <!-- Animated Gradient Background -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-950 to-gray-950 z-0"></div>
    <div class="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse z-0"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse z-0" style="animation-delay: 1s"></div>

    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div class="inline-block mb-4 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
        <span class="text-indigo-400 text-sm font-medium tracking-wide animate-pulse">🚀 Aholi muammolarini birgalikda hal qilamiz</span>
      </div>
      
      <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
        Ovozingiz <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">O‘zgarishni yaratadi</span>
      </h1>
      
      <p class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        Muhokamalar, ovozlar va qarorlar. Jamiyat muammolarini hal qilish uchun professional platforma.
      </p>

      <!-- Live Stats -->
      <div class="flex flex-wrap justify-center gap-8 mb-12 text-gray-400">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="font-semibold text-white">1000+ Hal qilingan</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style="animation-delay: 0.5s"></div>
          <span class="font-semibold text-white">500+ Faol a'zo</span>
        </div>
      </div>

      <button 
        @click="$emit('open-form')" 
        class="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
      >
        <span class="relative z-10 flex items-center gap-2">
          Muammo yuborish
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>
    </div>
  </section>
</template>

<style scoped>
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s ease infinite;
}
</style>