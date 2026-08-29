function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!url) {
    throw new Error(
      'Missing VITE_API_BASE_URL. Copy .env.example to .env and set the API base URL.',
    )
  }

  return url.replace(/\/$/, '')
}

export const API_BASE_URL = getApiBaseUrl()
