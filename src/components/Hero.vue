<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ParticlesBackground from './ParticlesBackground.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()
defineEmits(['open-form'])

const reducedMotion = useReducedMotion()
const heroRef = ref(null)
const ready = ref(false)

const motionClass = computed(() => (reducedMotion.value ? 'hero-no-motion' : ''))

onMounted(async () => {
  ready.value = true
  if (reducedMotion.value) return

  const { gsap } = await import('gsap')

  const el = heroRef.value
  if (!el) return

  const badge = el.querySelector('.hero-badge')
  const headline = el.querySelector('.hero-headline')
  const sub = el.querySelector('.hero-subtext')
  const cta = el.querySelector('.hero-cta')
  const stats = el.querySelectorAll('.hero-stat')

  gsap.set([badge, headline, sub, cta], { opacity: 0 })
  gsap.set(headline, { x: -40, y: 10, filter: 'blur(10px)' })
  gsap.set(sub, { x: 40, y: 10, filter: 'blur(10px)' })
  gsap.set(cta, { y: 26, scale: 0.98, filter: 'blur(8px)' })
  gsap.set(stats, { y: 18, opacity: 0 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })

  tl.to(badge, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 }, 0.08)
    .to(headline, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }, 0.18)
    .to(sub, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }, 0.28)
    .to(cta, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }, 0.40)
    .to(stats, { opacity: 1, y: 0, stagger: 0.10 }, 0.55)
})
const videoOk = ref(false)
const videoFailed = ref(false)

const showFallback = computed(() => reducedMotion.value || videoFailed.value || !videoOk.value)

function onVideoCanPlay() {
  videoOk.value = true
}
function onVideoError() {
  videoFailed.value = true
}

</script>

<template>
  <section class="hero-section" :class="motionClass">
    <!-- VIDEO BACKGROUND -->
<video
  v-if="!reducedMotion"
  class="hero-video"
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  crossorigin="anonymous"
  @canplay="onVideoCanPlay"
  @error="onVideoError"
>
  <source
    src="https://cdn.dribbble.com/userupload/46020578/file/87416ef3bd4ff93a5bb3b9303566a94c.mp4"
    type="video/mp4"
  />
</video>
<!-- Video ustiga professional effekt -->
<div class="video-fx" aria-hidden="true"></div>

<!-- Chapdagi videodagi UI'ni yashirish uchun mask -->
<div class="video-left-mask" aria-hidden="true"></div>


<!-- Fallback faqat video ishlamasa yoki reduced motion bo'lsa -->
<div v-show="showFallback" class="hero-fallback-bg" aria-hidden="true"></div>

    <div class="hero-fallback-bg" aria-hidden="true"></div>

    <!-- Overlay: dribbble vibe -->
    <div class="hero-overlay" aria-hidden="true"></div>

    <!-- Glow blobs (subtle) -->
    <div v-if="!reducedMotion" class="glow-layer" aria-hidden="true">
      <div class="glow g1"></div>
      <div class="glow g2"></div>
      <div class="glow g3"></div>
    </div>

    <!-- Particles (xohlasang o'chir) -->
    <ParticlesBackground :disabled="reducedMotion" />

    <div
      ref="heroRef"
      class="hero-content"
      :class="{ 'opacity-0': !ready && !reducedMotion }"
    >
      <!-- Badge -->
      <div class="hero-badge">
        <span class="dot"></span>
        {{ t('hero.badge') }}
      </div>

      <!-- Headline -->
      <h1 class="hero-headline">
        {{ t('hero.headline') }}
      </h1>

      <!-- Subtext -->
      <p class="hero-subtext">
        {{ t('hero.subtext') }}
      </p>

      <div class="cta-row">
        <button class="hero-cta blob-btn" @click="$emit('open-form')">
          <span class="btn-text">{{ t('hero.cta') }}</span>
          <span class="btn-arrow">→</span>

          <span class="blob-btn__inner" aria-hidden="true">
            <span class="blob-btn__blobs">
              <span class="blob-btn__blob"></span>
              <span class="blob-btn__blob"></span>
              <span class="blob-btn__blob"></span>
              <span class="blob-btn__blob"></span>
            </span>
          </span>
        </button>

        <svg class="goo-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" aria-hidden="true">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                result="goo"
              ></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo" result="mix"></feBlend>
            </filter>
          </defs>
        </svg>
      </div>

      <!-- Stats (fake bo'lmasin) -->
      <div class="stats">
        <div class="hero-stat stat-card">
          <div class="stat-value">14</div>
          <div class="stat-label">{{ t('hero.stats.regions') }}</div>
        </div>
        <div class="hero-stat stat-card">
          <div class="stat-value">6</div>
          <div class="stat-label">{{ t('hero.stats.categories') }}</div>
        </div>
        <div class="hero-stat stat-card">
          <div class="stat-value">Pilot</div>
          <div class="stat-label">Bosqich</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

.hero-section{
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 110px 16px 70px;
  min-height: 78vh;
  display: grid;
  place-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.hero-video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit: cover;
  object-position: 92% center;
  transform: scale(1.14);
  z-index:0;
  filter: saturate(1.12) contrast(1.10) brightness(1.02);
}

.video-fx{
  position:absolute;
  inset:0;
  z-index:1;
  /* video ustini biroz blur + dark + gradient qiladi => matn aniq chiqadi */
  background:
    radial-gradient(900px 520px at 60% 20%, rgba(255,255,255,0.06), transparent 60%),
    linear-gradient(180deg, rgba(6,10,18,0.35), rgba(6,10,18,0.88));
  
}
.video-left-mask{
  position:absolute;
  inset:0;
  z-index:2;
  pointer-events:none;
  background: linear-gradient(
    90deg,
    rgba(6,10,18,0.65) 0%,
    rgba(6,10,18,0.35) 22%,
    rgba(6,10,18,0.10) 42%,
    rgba(6,10,18,0.00) 60%
  );
}


.hero-fallback-bg{
  position:absolute;
  inset:0;
  z-index:-1; /* videoni yopmaydi */
}



.hero-overlay{
  position:absolute;
  inset:0;
  z-index: 3;
  background:
    radial-gradient(900px 420px at 50% 10%, rgba(255,255,255,0.08), transparent 60%),
    linear-gradient(180deg, rgba(6,10,18,0.10), rgba(6,10,18,0.90));
  backdrop-filter: blur(1px);
}

/* ====== GLOW BLOBS ====== */
.glow-layer{
  position:absolute;
  inset:0;
  z-index:4;
  pointer-events: none;
}
.glow{
  position:absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  animation: floaty 14s ease-in-out infinite;
}
.g1{ left:-160px; top:-120px; background: rgba(59,130,246,1); animation-duration: 15s; }
.g2{ right:-180px; bottom:-200px; background: rgba(99,102,241,1); animation-duration: 18s; animation-delay: 1.2s; }
.g3{ left: 35%; top: 48%; background: rgba(34,211,238,1); animation-duration: 20s; animation-delay: 2.2s; }

@keyframes floaty{
  0%{ transform: translate3d(0,0,0) scale(1); }
  50%{ transform: translate3d(22px,-18px,0) scale(1.05); }
  100%{ transform: translate3d(0,0,0) scale(1); }
}

/* ====== CONTENT ====== */
.hero-content{
  position: relative;
  z-index: 10;
  width: min(980px, 92vw);
  text-align:center;

  /* ✅ glass panel */
  padding: 34px 22px;
  border-radius: 28px;
  background: rgba(6,10,18,0.45);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 30px 120px rgba(0,0,0,0.45);
  backdrop-filter: blur(10px);
}

.hero-badge{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.92);
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 12px 50px rgba(0,0,0,0.20);
}
.dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(16,185,129,1);
  box-shadow: 0 0 0 6px rgba(16,185,129,0.16);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse{
  0%,100%{ transform: scale(1); opacity: 1; }
  50%{ transform: scale(1.15); opacity: 0.75; }
}

.hero-headline{
  margin: 18px 0 10px;
  font-size: clamp(36px, 4.8vw, 66px);
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: #fff;
  text-shadow: 0 16px 60px rgba(0,0,0,0.45);
}
.hero-subtext{
  margin: 0 auto;
  width: min(720px, 92vw);
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255,255,255,0.78);
}

/* ====== CTA ROW ====== */
.cta-row{
  margin-top: 18px;
  display:flex;
  justify-content:center;
}

/* ====== GOOEY BLOB BUTTON ====== */
.goo-svg{ position:absolute; width:0; height:0; }

.blob-btn{
  --cyan: #3b82f6;
  --cyan2:#6366f1;
  --text: #ffffff;
  --borderW: 2px;

  position: relative;
  display:inline-flex;
  align-items:center;
  gap: 12px;

  padding: 14px 22px;
  border-radius: 18px;

  cursor:pointer;
  border: none;
  background: transparent;

  color: rgba(255,255,255,0.95);
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.2px;

  transition: transform .22s ease, filter .22s ease;
  user-select: none;
}

.blob-btn::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius: 18px;
  .blob-btn::before{
.blob-btn::before{
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 18px 70px rgba(0,0,0,0.38);
}

}

}

.blob-btn:hover{
  transform: translateY(-2px);
  filter: brightness(1.03);
}

.btn-text, .btn-arrow{
  position: relative;
  z-index: 2;
}
.btn-arrow{
  transition: transform .25s ease;
}
.blob-btn:hover .btn-arrow{
  transform: translateX(6px);
}

/* inner layer */
.blob-btn__inner{
  z-index: 1;
  overflow: hidden;
  position:absolute;
  inset:0;
  border-radius: 18px;
}

/* gooey blobs container */
.blob-btn__blobs{
  position:relative;
  display:block;
  width:100%;
  height:100%;
  filter: url(#goo);
}

/* 4 blobs */
.blob-btn__blob{
  position:absolute;
  top: 2px;
  width: 25%;
  height: calc(100% - 4px);
  border-radius: 999px;
  background: linear-gradient(135deg, var(--cyan), var(--cyan2));
  transform: translate3d(0, 160%, 0) scale(1.35);
  transition: transform .48s cubic-bezier(.2,.8,.2,1);
}

/* positions + delays */
.blob-btn__blob:nth-child(1){ left: 0%;  transition-delay: 0s; }
.blob-btn__blob:nth-child(2){ left: 25%; transition-delay: .07s; }
.blob-btn__blob:nth-child(3){ left: 50%; transition-delay: .14s; }
.blob-btn__blob:nth-child(4){ left: 75%; transition-delay: .21s; }

.blob-btn:hover .blob-btn__blob{
  transform: translate3d(0, 0%, 0) scale(1.15);
}

/* ====== STATS ====== */
.stats{
  margin: 28px auto 0;
  width: min(560px, 92vw);
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat-card{
  border-radius: 16px;
  padding: 12px;
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.16);
  backdrop-filter: blur(12px);
}

.stat-value{
  font-size: 20px;
  font-weight: 900;
  color:#fff;
}
.stat-label{
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

@media (max-width: 640px){
  .stats{ grid-template-columns: 1fr; }
}
</style>

