<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)
const buttonRef = ref(null)
const menuRef = ref(null)

function select(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function onClickOutside(e) {
  if (
    menuRef.value &&
    !menuRef.value.contains(e.target) &&
    buttonRef.value &&
    !buttonRef.value.contains(e.target)
  ) {
    isOpen.value = false
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="buttonRef" class="region-select relative w-full">
    <button
      :id="id"
      type="button"
      class="input-focus-ring w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center justify-between gap-2"
      :class="
        error
          ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10 focus:ring-red-500/50 focus:border-red-500 shadow-glow-danger'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:shadow-glow hover:border-gray-400 dark:hover:border-gray-500'
      "
      :aria-expanded="isOpen"
      aria-haspopopup="listbox"
      :aria-invalid="!!error"
      @click="isOpen = !isOpen"
    >
      <span :class="{ 'text-gray-500 dark:text-gray-400': !modelValue }">
        {{ modelValue || placeholder }}
      </span>
      <svg
        class="w-4 h-4 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        ref="menuRef"
        class="region-select-dropdown absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-auto rounded-xl border border-white/20 dark:border-gray-600 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-xl py-1"
        role="listbox"
      >
        <button
          v-for="opt in options"
          :key="opt"
          type="button"
          class="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-500/10 dark:hover:bg-blue-400/10 focus:bg-blue-500/10 dark:focus:bg-blue-400/10 focus:outline-none"
          :class="
            modelValue === opt
              ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-500/5 dark:bg-blue-400/5'
              : 'text-gray-700 dark:text-gray-300'
          "
          role="option"
          :aria-selected="modelValue === opt"
          @click="select(opt)"
        >
          {{ opt }}
        </button>
      </div>
    </Transition>
    <p v-if="error" class="mt-1 text-sm text-red-500 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
