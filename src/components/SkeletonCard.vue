<template>
  <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden h-64 flex flex-col">
    <!-- Header -->
    <div class="p-5 border-b border-gray-800 flex items-center gap-3 bg-gray-900/50">
      <div class="w-10 h-10 rounded-full bg-gray-800 shimmer-element"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3 bg-gray-800 rounded w-1/3 shimmer-element"></div>
        <div class="h-2 bg-gray-800/50 rounded w-1/2 shimmer-element"></div>
      </div>
    </div>

    <!-- Body -->
    <div class="p-5 flex-1 space-y-3">
      <div class="h-3 bg-gray-800/50 rounded w-full shimmer-element"></div>
      <div class="h-3 bg-gray-800/50 rounded w-5/6 shimmer-element"></div>
      <div class="h-3 bg-gray-800/50 rounded w-4/6 shimmer-element"></div>
    </div>

    <!-- Footer -->
    <div class="px-5 py-3 border-t border-gray-800 flex justify-between items-center bg-gray-950">
      <div class="h-2 bg-gray-800 rounded w-16 shimmer-element"></div>
      <div class="h-6 bg-gray-800 rounded w-8 shimmer-element"></div>
    </div>
  </div>
</template>

<style scoped>
.shimmer-element {
  background: linear-gradient(
    90deg,
    #111827 0%,
    #1f2937 40%, 
    #374151 50%, 
    #1f2937 60%, 
    #111827 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>