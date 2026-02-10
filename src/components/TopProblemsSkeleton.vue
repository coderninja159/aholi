<script setup>
import { ref, onMounted } from 'vue'

const skeletons = ref(9)
const isLoading = ref(true)

onMounted(() => {
  // Simulyatsiya uchun
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="i in skeletons"
      :key="i"
      class="skeleton-card group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
      :style="{ animationDelay: `${i * 50}ms` }"
    >
      <!-- Header Skeleton -->
      <div class="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div class="flex items-center gap-3 flex-1">
          <!-- Avatar Skeleton -->
          <div class="skeleton-shimmer w-10 h-10 rounded-full bg-gray-800"></div>
          
          <div class="flex-1 space-y-2">
            <!-- Name Skeleton -->
            <div class="skeleton-shimmer h-3 w-24 rounded bg-gray-800"></div>
            <!-- Region Skeleton -->
            <div class="skeleton-shimmer h-2 w-32 rounded bg-gray-800"></div>
          </div>
        </div>
        
        <!-- Badge Skeleton -->
        <div class="skeleton-shimmer w-8 h-5 rounded bg-gray-800"></div>
      </div>

      <!-- Meta Skeleton -->
      <div class="px-5 py-2 flex items-center gap-3">
        <div class="skeleton-shimmer h-5 w-20 rounded bg-gray-800"></div>
        <div class="w-1 h-1 rounded-full bg-gray-800"></div>
        <div class="skeleton-shimmer h-3 w-24 rounded bg-gray-800"></div>
      </div>

      <!-- Body Skeleton -->
      <div class="px-5 py-4 space-y-2">
        <div class="skeleton-shimmer h-3 w-full rounded bg-gray-800"></div>
        <div class="skeleton-shimmer h-3 w-full rounded bg-gray-800"></div>
        <div class="skeleton-shimmer h-3 w-3/4 rounded bg-gray-800"></div>
      </div>

      <!-- Footer Skeleton -->
      <div class="px-5 py-3 bg-gray-950 border-t border-gray-800 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- View Icon -->
          <div class="flex items-center gap-1.5">
            <div class="skeleton-shimmer w-4 h-4 rounded bg-gray-800"></div>
            <div class="skeleton-shimmer h-3 w-6 rounded bg-gray-800"></div>
          </div>
          <!-- Comment Icon -->
          <div class="flex items-center gap-1.5">
            <div class="skeleton-shimmer w-4 h-4 rounded bg-gray-800"></div>
            <div class="skeleton-shimmer h-3 w-4 rounded bg-gray-800"></div>
          </div>
        </div>
        
        <!-- Like Button Skeleton -->
        <div class="flex items-center gap-1.5">
          <div class="skeleton-shimmer w-5 h-5 rounded bg-gray-800"></div>
          <div class="skeleton-shimmer h-3 w-6 rounded bg-gray-800"></div>
        </div>
      </div>

      <!-- Shimmer Overlay -->
      <div class="skeleton-shimmer-overlay"></div>
    </div>
  </div>
</template>

<style scoped>
/* Card Entry Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skeleton-card {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

/* Shimmer Animation */
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
    #1f2937 0%,
    #374151 20%,
    #1f2937 40%,
    #1f2937 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s linear infinite;
}

/* Pulse Animation (Alternative) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton-shimmer {
  animation: shimmer 2s linear infinite, pulse 2s ease-in-out infinite;
}

/* Shimmer Overlay Effect */
.skeleton-shimmer-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.03),
    transparent
  );
  animation: shimmer-overlay 2s infinite;
}

@keyframes shimmer-overlay {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>