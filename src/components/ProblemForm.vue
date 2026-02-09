<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { REGIONS, CATEGORIES } from '@/config'
import RegionSelect from './RegionSelect.vue'

const { t } = useI18n()
const emit = defineEmits(['close'])

const region = ref('')
const category = ref('')
const description = ref('')
const honeypot = ref('')

const errors = ref({ region: '', category: '', description: '' })
const isSubmitting = ref(false)
const showSuccess = ref(false) // Yashil taxta uchun

const categoryKeys = {
  'Suv muammosi': 'water',
  'Elektr energiyasi': 'electricity',
  "Yo'l ta'mirlash": 'roads',
  'Internet / aloqa': 'internet',
  'Chiqindi / ekologiya': 'waste',
  'Boshqa': 'other',
}

function tCategory(cat) {
  return t(`categories.${categoryKeys[cat] || 'other'}`)
}

function validate() {
  const e = { region: '', category: '', description: '' }
  if (!region.value) e.region = t('form.required')
  if (!category.value) e.category = t('form.required')
  const desc = (description.value || '').trim()
  if (!desc) e.description = t('form.required')
  errors.value = e
  return !e.region && !e.category && !e.description
}

async function submit() {
  if (!validate()) return
  if (honeypot.value) return

  isSubmitting.value = true
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxd3YLVuE4QtERXNEwY9axi5E7Kvo-1ZEo_yce1d7t1tHKA28Ub0oS2mFZ03sabz0Kv/exec'

  try {
    await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hudud: region.value,
        kategoriya: category.value,
        sharh: description.value
      })
    })

    // MUVAFFAQIYATLI
    showSuccess.value = true
    
    // 2 soniyadan keyin modalni yopish
    setTimeout(() => {
      region.value = ''
      category.value = ''
      description.value = ''
      errors.value = { region: '', category: '', description: '' }
      showSuccess.value = false
      emit('close')
    }, 2000)

  } catch (error) {
    console.error(error)
    alert("Xatolik yuz berdi.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Yashil Taxta (Notification) -->
  <Transition name="slide-fade">
    <div v-if="showSuccess" class="fixed bottom-5 right-5 z-[200] bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
      <div class="bg-white/20 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p class="font-bold text-lg">Jonatildi!</p>
        <p class="text-sm opacity-90">Sizning muammolaringiz qabul qilindi.</p>
      </div>
    </div>
  </Transition>

  <!-- Modal Fon -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="emit('close')">
    <div class="bg-gray-900/95 text-gray-300 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-700 p-6 relative overflow-hidden">
      <!-- Decorative blur -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">{{ t('form.title') }}</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-white transition-colors">✕</button>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <input v-model="honeypot" type="text" class="hidden" aria-hidden="true">
        
        <!-- Inputs -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Hudud *</label>
          <RegionSelect v-model="region" :options="REGIONS" :placeholder="t('form.region')" :error="errors.region" class="bg-gray-800 border-gray-700 text-gray-200" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Kategoriya *</label>
          <select v-model="category" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:outline-none">
            <option value="">Tanlang...</option>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ tCategory(c) }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Sharh *</label>
          <textarea v-model="description" rows="4" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:outline-none" placeholder="Muammoni yozing..."></textarea>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" @click="emit('close')" class="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition">Bekor qilish</button>
          <button type="submit" :disabled="isSubmitting" class="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all transform active:scale-95 disabled:opacity-50">
            {{ isSubmitting ? 'Yuborilmoqda...' : 'Yuborish' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Taxta Animatsiyasi */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>