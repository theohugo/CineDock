const DEFAULT_API_BASE_URL = "http://localhost:8000"

const normalizeBaseUrl = (value) => {
  if (!value) {
    return DEFAULT_API_BASE_URL
  }
  return value.endsWith("/") ? value.slice(0, -1) : value
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL)
const API_ROOT = `${API_BASE_URL}/api`

const parseBody = (text) => {
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text)
  } catch (error) {
    return text
  }
}

const request = async (endpoint, { headers, ...options } = {}) => {
  const response = await fetch(`${API_ROOT}${endpoint}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...headers,
    },
    ...options,
  })

  const text = await response.text()
  const payload = parseBody(text)

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && payload.detail) ||
      (typeof payload === "string" && payload) ||
      `API request failed with status ${response.status}`

    throw new Error(message)
  }

  return payload
}

export const movieApi = {
  list: (signal) => request("/movies/", { signal }),
  retrieve: (id, signal) => request(`/movies/${id}/`, { signal }),
}
