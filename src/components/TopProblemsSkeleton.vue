<script setup>
import SkeletonCard from './SkeletonCard.vue'
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    <!-- 9 ta element -->
    <SkeletonCard v-for="i in 9" :key="i" :lines="2" />
  </div>
</template>