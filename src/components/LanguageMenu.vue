<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale } = useI18n()
const isOpen = ref(false)
const buttonRef = ref(null)
const menuRef = ref(null)

const locales = [
  { code: 'uz', label: 'Oʻz' },
  { code: 'uz_kr', label: 'Ўз' },
  { code: 'ru', label: 'Ru' },
  { code: 'en', label: 'En' },
]

const currentLabel = computed(
  () => locales.find((l) => l.code === locale.value)?.label || 'Oʻz'
)

function toggle() {
  isOpen.value = !isOpen.value
}

function select(code) {
  setLocale(code)
  isOpen.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    isOpen.value = false
    return
  }
  if (!isOpen.value) return
  const idx = locales.findIndex((l) => l.code === locale.value)
  if (e.key === 'ArrowDown' && idx < locales.length - 1) {
    e.preventDefault()
    setLocale(locales[idx + 1].code)
  } else if (e.key === 'ArrowUp' && idx > 0) {
    e.preventDefault()
    setLocale(locales[idx - 1].code)
  }
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
  <div ref="buttonRef" class="relative">
    <button
      type="button"
      class="language-menu-trigger input-focus-ring flex items-center gap-2 rounded-lg border border-white/20 dark:border-gray-600 bg-white/50 dark:bg-gray-800/80 backdrop-blur-md px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-glow transition-all duration-200 min-w-[4rem]"
      :aria-expanded="isOpen"
      aria-haspopopup="listbox"
      aria-label="Select language"
      @click="toggle"
    >
      <span>{{ currentLabel }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
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
        class="language-menu-dropdown absolute right-0 top-full mt-2 z-50 min-w-[6rem] rounded-xl border border-white/20 dark:border-gray-600 bg-white/90 dark:bg-gray-800/95 backdrop-blur-xl shadow-xl py-1"
        role="listbox"
      >
        <button
          v-for="loc in locales"
          :key="loc.code"
          type="button"
          class="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-500/10 dark:hover:bg-blue-400/10 focus:bg-blue-500/10 dark:focus:bg-blue-400/10 focus:outline-none"
          :class="
            locale === loc.code
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-700 dark:text-gray-300'
          "
          role="option"
          :aria-selected="locale === loc.code"
          @click="select(loc.code)"
        >
          {{ loc.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
