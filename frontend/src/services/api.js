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

const shouldAttachJsonHeader = (body, headers) => {
  if (!body) {
    return false
  }
  if (headers && headers["Content-Type"]) {
    return false
  }
  return !(body instanceof FormData)
}

const request = async (endpoint, { headers = {}, token, body, ...options } = {}) => {
  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  }

  if (shouldAttachJsonHeader(body, headers)) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (token) {
    finalHeaders.Authorization = `Token ${token}`
  }

  const response = await fetch(`${API_ROOT}${endpoint}`, {
    credentials: "include",
    headers: finalHeaders,
    body,
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

export const authApi = {
  login: (credentials, signal) =>
    request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
      signal,
    }),
  register: (payload, signal) =>
    request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
      signal,
    }),
  me: (token, signal) => request("/auth/me/", { method: "GET", token, signal }),
}
