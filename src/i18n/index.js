import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import uz_kr from './locales/uz_kr.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

const LOCALE_KEY = 'aholi-muammolari-locale'
const saved = localStorage.getItem(LOCALE_KEY)
const fallback = 'uz'
const supported = ['uz', 'uz_kr', 'ru', 'en']
const initial = supported.includes(saved) ? saved : fallback

const i18n = createI18n({
  legacy: false,
  locale: initial,
  fallbackLocale: fallback,
  messages: { uz, uz_kr, ru, en },
})

i18n.global.locale.value = initial

export function setLocale(locale) {
  if (supported.includes(locale)) {
    i18n.global.locale.value = locale
    localStorage.setItem(LOCALE_KEY, locale)
  }
}

export default i18n
