<script setup>
import SkeletonCard from './SkeletonCard.vue'
</script>

<template>
  <div class="space-y-4 max-w-2xl mx-auto">
    <SkeletonCard v-for="i in 5" :key="i" :lines="2" />
  </div>
</template>
