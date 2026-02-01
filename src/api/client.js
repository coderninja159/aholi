import { API_URL } from '@/config'

const DEFAULT_TIMEOUT_MS = 15_000
const MAX_RETRIES = 2

function withTimeout(promise, ms = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)),
  ])
}

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  let lastError
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await withTimeout(
        fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        }),
        options.timeout ?? DEFAULT_TIMEOUT_MS
      )
      return res
    } catch (err) {
      lastError = err
      if (i < retries) await new Promise((r) => setTimeout(r, 500 * (i + 1)))
    }
  }
  throw lastError
}

export async function apiList() {
  if (!API_URL) throw new Error('API_URL is not configured')
  const res = await fetchWithRetry(`${API_URL}?action=list`)
  if (!res.ok) throw new Error(`List failed: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function apiSubmit(body) {
  if (!API_URL) throw new Error('API_URL is not configured')
  const res = await fetchWithRetry(`${API_URL}`, {
    method: 'POST',
    body: JSON.stringify({ action: 'submit', ...body }),
  })
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`)
  return res.json()
}

export async function apiVote(id) {
  if (!API_URL) throw new Error('API_URL is not configured')
  const res = await fetchWithRetry(`${API_URL}`, {
    method: 'POST',
    body: JSON.stringify({ action: 'vote', id }),
  })
  if (!res.ok) throw new Error(`Vote failed: ${res.status}`)
  return res.json()
}
