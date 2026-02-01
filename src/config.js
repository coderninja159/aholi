/**
 * API base URL for the Google Apps Script Web App.
 *
 * DEPLOYMENT: After deploying your Apps Script project as a Web App,
 * paste the deployment URL here (e.g. https://script.google.com/macros/s/XXXX/exec).
 *
 * Do NOT add a trailing slash.
 */
export const API_URL = import.meta.env.VITE_API_URL || ''

export const FORM = {
  RATE_LIMIT_MS: 30_000,
  DESCRIPTION_MAX_LENGTH: 2000,
}

export const PAGINATION = {
  PER_PAGE: 5,
}

export const CATEGORIES = [
  'Suv muammosi',
  'Elektr energiyasi',
  "Yo'l ta'mirlash",
  'Internet / aloqa',
  'Chiqindi / ekologiya',
  'Boshqa',
]

export const REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  "Qoraqalpog'iston Respublikasi",
  'Samarqand viloyati',
  "Farg'ona viloyati",
  'Andijon viloyati',
  'Buxoro viloyati',
  'Navoiy viloyati',
  'Namangan viloyati',
  'Jizzax viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Sirdaryo viloyati',
  'Xorazm viloyati',
]
