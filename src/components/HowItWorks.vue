<script setup>
import { ref, onMounted } from 'vue'

const steps = [
  {
    number: '01',
    title: 'Muammoingizni yozing',
    desc: "Savol yoki muammongizni batafsil tasvirlang. Tegishli kategoriyani tanlang va rasmlar qo'shing.",
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    iconBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: 'pencil',
   
  },
  {
    number: '02',
    title: 'Jamiyat ovoz beradi',
    desc: "Muhim muammolar ko'proq ovoz to'playdi va mas'ul organlar e'tiborini tortadi.",
    gradient: 'from-emerald-500 via-green-600 to-teal-600',
    iconBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: 'vote',
   
  },
  {
    number: '03',
    title: 'Yechim topiladi',
    desc: "Mas'ul organlar muammoni ko'rib chiqadi, javob beradi va yechim topadi.",
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
    iconBg: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    icon: 'check',
 
  }
]

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section class="relative py-32 px-4 bg-gray-950 overflow-hidden">
    
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
    </div>

    <div class="container mx-auto max-w-7xl relative z-10">
      
      <!-- Header Section -->
      <div class="text-center mb-24 space-y-6" :class="isVisible ? 'animate-fade-in' : 'opacity-0'">
        
       

        <!-- Title -->
        <div class="space-y-4">
          <h2 class="text-5xl md:text-7xl font-black">
            <span class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              Qanday ishlaydi?
            </span>
          </h2>
          
        </div>

        
      </div>

      <!-- Steps -->
      <div class="relative">
        
      

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-card group relative"
            :class="isVisible ? 'animate-slide-up' : 'opacity-0'"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            
            <!-- Main Card -->
            <div class="relative h-full">
              
              <!-- Card Background -->
              <div class="absolute inset-0 bg-gradient-to-br from-gray-800/40 via-gray-800/20 to-gray-900/40 rounded-3xl backdrop-blur-xl border transition-all duration-700 group-hover:scale-[1.02] group-hover:border-gray-600/50"
                   :class="step.borderColor">
              </div>

              <!-- Glow Effect -->
              <div class="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur-2xl transition-all duration-700 -z-10"
                   :class="step.gradient">
              </div>

              <!-- Content -->
              <div class="relative p-10 space-y-6">
                
                <!-- Top Section -->
                <div class="flex items-start justify-between">
                  
                  <!-- Number Badge -->
                  <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r rounded-2xl blur-lg opacity-50"
                         :class="step.gradient">
                    </div>
                    <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                         :class="step.gradient">
                      <span class="text-3xl font-black text-white">{{ step.number }}</span>
                    </div>
                  </div>

                 
                </div>

                <!-- Icon -->
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                     :class="step.iconBg">
                  
                  <!-- Pencil Icon -->
                  <svg v-if="step.icon === 'pencil'" class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>

                  <!-- Vote Icon -->
                  <svg v-if="step.icon === 'vote'" class="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>

                  <!-- Check Icon -->
                  <svg v-if="step.icon === 'check'" class="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <!-- Text Content -->
                <div class="space-y-3">
                  <h3 class="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-500"
                      :class="step.gradient">
                    {{ step.title }}
                  </h3>
                  <p class="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {{ step.desc }}
                  </p>
                </div>

                <!-- Progress Bar -->
                <div class="pt-4">
                  <div class="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r rounded-full transition-all duration-1000 group-hover:w-full"
                         :class="step.gradient"
                         :style="{ width: '0%' }">
                    </div>
                  </div>
                </div>

                <!-- Bottom Arrow -->
                <div class="flex items-center justify-between pt-2">
                  <span class="text-sm font-semibold text-gray-500 group-hover:text-gray-400 transition-colors">
                    Qadam {{ step.number }}
                  </span>
                  <div class="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-gradient-to-r transition-all duration-500 group-hover:translate-x-1"
                       :class="step.gradient">
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

            <!-- Arrow Between Cards (Desktop) -->
            <div v-if="index < steps.length - 1" class="hidden lg:flex absolute top-32 -right-3 z-20">
              <div class="w-6 h-6 text-gray-600 animate-bounce-x">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-30px) translateX(-15px); }
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-x {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(8px);
    opacity: 1;
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-delayed {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
}

.animate-bounce-x {
  animation: bounce-x 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Progress bar animation on hover */
.step-card:hover .h-full {
  width: 100% !important;
}
</style>