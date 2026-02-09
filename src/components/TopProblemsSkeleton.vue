<script setup>
import SkeletonCard from './SkeletonCard.vue'
</script>

<template>
  <!-- Grid qo'shildi: md:grid-cols-2 lg:grid-cols-3 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
    <!-- 9 ta skeleton chiqadi, to'liq ekran qoplash uchun -->
    <SkeletonCard v-for="i in 9" :key="i" :lines="2" />
  </div>
</template>