<script setup>
defineProps({ lines: { type: Number, default: 2 } })
</script>

<template>
  <div class="bg-gray-800/30 border border-gray-700/30 p-5 rounded-xl overflow-hidden">
    <!-- Header Skeleton -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 rounded-lg bg-gray-700/50"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3 bg-gray-700/50 rounded w-1/3"></div>
        <div class="h-2 bg-gray-700/30 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div class="space-y-2 mb-4">
      <div class="h-2 bg-gray-700/30 rounded w-full"></div>
      <div class="h-2 bg-gray-700/30 rounded w-5/6"></div>
    </div>

    <!-- Button Skeleton -->
    <div class="h-8 bg-gray-700/30 rounded-full w-24 mx-auto"></div>
  </div>
</template>

<style scoped>
/* Bu yerda "Dabdala" (porlash) animatsiyasi olib tashlandi yoki juda sekinlashtirildi */
/* Faqat juda sekin, tushkun o'tish qo'yildi */
@keyframes fade-load {
  0% { opacity: 0.6; }
  50% { opacity: 0.8; }
  100% { opacity: 0.6; }
}

div {
  animation: fade-load 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  div { animation: none; opacity: 0.7; }
}
</style>