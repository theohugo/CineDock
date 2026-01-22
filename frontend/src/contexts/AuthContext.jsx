import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { authApi } from "../services/api"

const LOCAL_STORAGE_TOKEN_KEY = "cineDockToken"
const LOCAL_STORAGE_USER_KEY = "cineDockUser"

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticating: false,
  login: async () => undefined,
  register: async () => undefined,
  logout: () => undefined,
})

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
    try {
      return raw ? JSON.parse(raw) : null
    } catch (error) {
      return null
    }
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
    }
  }, [user])

  useEffect(() => {
    if (!token || user) {
      return undefined
    }

    const controller = new AbortController()
    setIsAuthenticating(true)

    authApi
      .me(token, controller.signal)
      .then((data) => {
        setUser(data?.user ?? null)
      })
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        setIsAuthenticating(false)
      })

    return () => controller.abort()
  }, [token, user])

  const login = useCallback(async ({ username, password }) => {
    setIsAuthenticating(true)
    try {
      const data = await authApi.login({ username, password })
      setToken(data.token)
      setUser(data.user)
      return data.user
    } catch (error) {
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setIsAuthenticating(true)
    try {
      const data = await authApi.register(payload)
      setToken(data.token)
      setUser(data.user)
      return data.user
    } catch (error) {
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticating,
      login,
      register,
      logout,
    }),
    [user, token, isAuthenticating, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
