<script setup>
defineProps({
  count: {
    type: Number,
    default: 12
  }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton-card bg-gradient-to-br from-gray-900/90 to-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
      :style="{ animationDelay: `${i * 50}ms` }"
    >
      <!-- Header -->
      <div class="p-5 border-b border-gray-800/50 flex items-center gap-3 bg-gray-900/30">
        <div class="skeleton-pulse w-12 h-12 rounded-xl bg-gray-800"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton-shimmer h-3 w-24 rounded-full bg-gray-800"></div>
          <div class="skeleton-shimmer h-2 w-32 rounded-full bg-gray-800"></div>
        </div>
      </div>

      <!-- Meta -->
      <div class="px-5 py-3 flex items-center gap-3">
        <div class="skeleton-shimmer h-6 w-24 rounded-full bg-gray-800"></div>
        <div class="w-1 h-1 rounded-full bg-gray-700"></div>
        <div class="skeleton-shimmer h-3 w-28 rounded-full bg-gray-800"></div>
      </div>

      <!-- Body -->
      <div class="px-5 py-4 space-y-2.5 min-h-[100px]">
        <div class="skeleton-shimmer h-3 w-full rounded-full bg-gray-800"></div>
        <div class="skeleton-shimmer h-3 w-full rounded-full bg-gray-800"></div>
        <div class="skeleton-shimmer h-3 w-3/4 rounded-full bg-gray-800"></div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-4 bg-gray-950/50 border-t border-gray-800/50 flex items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="flex items-center gap-2">
            <div class="skeleton-shimmer w-4 h-4 rounded-full bg-gray-800"></div>
            <div class="skeleton-shimmer h-3 w-8 rounded-full bg-gray-800"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="skeleton-shimmer w-4 h-4 rounded-full bg-gray-800"></div>
            <div class="skeleton-shimmer h-3 w-6 rounded-full bg-gray-800"></div>
          </div>
        </div>
        <div class="skeleton-shimmer h-10 w-20 rounded-xl bg-gray-800"></div>
      </div>

      <!-- Wave Overlay -->
      <div class="shimmer-wave"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skeleton-card {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #1f2937 0px,
    #374151 40px,
    #1f2937 80px
  );
  background-size: 1000px 100%;
  animation: shimmer 2s linear infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.skeleton-pulse {
  animation: pulseGlow 2s ease-in-out infinite;
}

.shimmer-wave {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.04),
    transparent
  );
  animation: wave 2.5s ease-in-out infinite;
}

@keyframes wave {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}
</style>