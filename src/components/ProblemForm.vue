<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/form'
import { REGIONS, CATEGORIES } from '@/config'
import RegionSelect from './RegionSelect.vue'

const { t } = useI18n()
const formStore = useFormStore()
const emit = defineEmits(['close'])

const region = ref('')
const category = ref('')
const description = ref('')
const honeypot = ref('')

const errors = ref({ region: '', category: '', description: '' })

const categoryKeys = {
  'Suv muammosi': 'water',
  'Elektr energiyasi': 'electricity',
  "Yo'l ta'mirlash": 'roads',
  'Internet / aloqa': 'internet',
  'Chiqindi / ekologiya': 'waste',
  Boshqa: 'other',
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
  else if (desc.length > formStore.DESCRIPTION_MAX_LENGTH) {
    e.description = t('form.maxLength', { max: formStore.DESCRIPTION_MAX_LENGTH })
  }
  errors.value = e
  return !e.region && !e.category && !e.description
}

async function submit() {
  if (!validate()) return
  if (!formStore.canSubmit) {
    errors.value = { ...errors.value, description: t('form.rateLimit') }
    return
  }
  try {
    await formStore.submit({
      region: region.value,
      category: category.value,
      description: description.value.trim(),
      honeypot: honeypot.value,
    })
    region.value = ''
    category.value = ''
    description.value = ''
    errors.value = { region: '', category: '', description: '' }
    setTimeout(() => {
      formStore.clearSuccess()
      emit('close')
    }, 2000)
  } catch (err) {
    if (err.message === 'RATE_LIMIT') {
      errors.value = { ...errors.value, description: t('form.rateLimit') }
    } else {
      errors.value = { ...errors.value, description: err.message || t('form.required') }
    }
  }
}

watch(
  () => [region.value, category.value, description.value],
  () => {
    errors.value = { region: '', category: '', description: '' }
  }
)
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="form-title"
    @click.self="emit('close')"
  >
    <div
      class="glass-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-600/50 p-6 animate-in"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 id="form-title" class="text-xl font-bold text-gray-900 dark:text-white">
          {{ t('form.title') }}
        </h2>
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
          aria-label="Close"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
      <form class="space-y-4" @submit.prevent="submit">
        <input
          v-model="honeypot"
          type="text"
          name="website_url"
          autocomplete="off"
          tabindex="-1"
          class="absolute opacity-0 pointer-events-none h-0 w-0"
          aria-hidden="true"
        />
        <div>
          <label
            for="form-region"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t('form.region') }} *
          </label>
          <RegionSelect
            id="form-region"
            v-model="region"
            :options="REGIONS"
            :placeholder="t('form.region')"
            :error="errors.region"
          />
        </div>
        <div>
          <label
            for="form-category"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t('form.category') }} *
          </label>
          <select
            id="form-category"
            v-model="category"
            required
            class="input-focus-ring w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 transition-shadow"
            :class="
              errors.category
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-glow-danger'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:shadow-glow'
            "
          >
            <option value="">{{ t('form.category') }}</option>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ tCategory(c) }}</option>
          </select>
          <p v-if="errors.category" class="mt-1 text-sm text-red-500 dark:text-red-400">
            {{ errors.category }}
          </p>
        </div>
        <div>
          <label
            for="form-description"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t('form.description') }} *
          </label>
          <textarea
            id="form-description"
            v-model="description"
            rows="4"
            :maxlength="formStore.DESCRIPTION_MAX_LENGTH"
            class="input-focus-ring w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 resize-y transition-shadow"
            :class="
              errors.description
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-glow-danger'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:shadow-glow'
            "
            :placeholder="t('form.description')"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ description.length }} / {{ formStore.DESCRIPTION_MAX_LENGTH }}
          </p>
          <p v-if="errors.description" class="mt-1 text-sm text-red-500 dark:text-red-400">
            {{ errors.description }}
          </p>
        </div>
        <p v-if="!formStore.canSubmit" class="text-sm text-amber-600 dark:text-amber-400">
          {{ t('form.rateLimit') }} ({{ formStore.rateLimitRemaining }}s)
        </p>
        <p v-if="formStore.success" class="text-sm text-green-600 dark:text-green-400">
          {{ t('form.success') }}
        </p>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors"
            @click="emit('close')"
          >
            {{ t('form.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="formStore.submitting || !formStore.canSubmit"
            class="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {{ formStore.submitting ? '…' : t('form.submit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
