<script setup>
import { ref } from 'vue'

// Ota-komponent (App.vue) ga "close" hodisasini yuborish uchun
const emit = defineEmits(['close'])

// Form ma’lumotlari uchun o‘zgaruvchilar
const formData = ref({
  name: '',
  phone: '',
  message: ''
})

const isSubmitting = ref(false)

// SIZNING GOOGLE SCRIPT MANZILINGIZ
const scriptURL = 'https://script.google.com/macros/s/AKfycbyCPY3zu-zNl69tJcL1IvmmBiwB9rgq7F7c1NPG1XjvWzfRZkNouUrZfU-7_UD8-pqe/exec'

async function submitForm() {
  if (!formData.value.name || !formData.value.phone || !formData.value.message) {
    alert("Iltimos, barcha maydonlarni to‘ldiring.")
    return
  }

  isSubmitting.value = true

  try {
    // Google Sheetsga ma’lumot yuborish
    await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors', // Muhim: Google'ga CORS cheklovisiz yuborish
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.value.name,
        phone: formData.value.phone,
        message: formData.value.message
      })
    })

    // Muvaffaqiyatli bo‘lsa
    alert("Ma'lumotlar muvaffaqiyatli yuborildi!")
    
    // Formani tozalash
    formData.value = { name: '', phone: '', message: '' }
    
    // Modalni yopish va ro'yxatni yangilash (App.vue dagi closeForm ishlaydi)
    emit('close') 

  } catch (error) {
    console.error('Xatolik:', error)
    alert("Xatolik yuz berdi. Internetni tekshiring.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Modal fon qismi (Background) -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <!-- Modal oynasi -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
      
      <!-- Yopish tugmasi (X) -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Yangi muammo</h2>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Ism maydoni -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ism</label>
          <input 
            v-model="formData.name" 
            type="text" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
            placeholder="Ismingiz"
          >
        </div>

        <!-- Telefon maydoni -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
          <input 
            v-model="formData.phone" 
            type="tel" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
            placeholder="+998 90 123 45 67"
          >
        </div>

        <!-- Xabar/Muammo maydoni -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Muammo tafsilotlari</label>
          <textarea 
            v-model="formData.message" 
            rows="4"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
            placeholder="Muammoni qisqacha tasvirlang..."
          ></textarea>
        </div>

        <!-- Yuborish tugmasi -->
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Yuborilmoqda...' : 'Yuborish' }}
        </button>
      </form>
    </div>
  </div>
</template>