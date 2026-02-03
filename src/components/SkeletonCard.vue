<script setup>
defineProps({
  lines: { type: Number, default: 2 },
})
</script>

<template>
  <div
    class="skeleton-card glass-card p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden"
  >
    <div class="skeleton-line h-4 rounded mb-2 w-full max-w-full" />
    <div
      v-for="i in lines - 1"
      :key="i"
      class="skeleton-line h-4 rounded mb-2 w-full"
      :class="{ 'max-w-[85%]': i === 1 }"
    />
    <div class="flex justify-between items-center mt-3">
      <div class="skeleton-line h-3 rounded w-32" />
      <div class="skeleton-line h-8 rounded-lg w-24" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-line {
  @apply relative overflow-hidden;
  background: linear-gradient(
    90deg,
    rgb(229 231 235) 0%,
    rgb(243 244 246) 50%,
    rgb(229 231 235) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

:global(.dark) .skeleton-line {
  background: linear-gradient(
    90deg,
    rgb(75 85 99) 0%,
    rgb(107 114 128) 50%,
    rgb(75 85 99) 100%
  );
  background-size: 200% 100%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
    background-size: 100% 100%;
  }
}
</style>
