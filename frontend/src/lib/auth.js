import { useEffect, useState } from 'react'

export function getStoredAuth() {
  const token = localStorage.getItem('token') || ''
  const userRaw = localStorage.getItem('user')
  let user = null
  try { user = userRaw ? JSON.parse(userRaw) : null } catch { user = null }
  return { token, user }
}

export function dispatchAuthChanged() {
  window.dispatchEvent(new Event('auth-changed'))
}

export function useAuth() {
  const [{ token, user }, setState] = useState(getStoredAuth())

  useEffect(() => {
    const onChange = () => setState(getStoredAuth())
    window.addEventListener('storage', onChange)
    window.addEventListener('auth-changed', onChange)
    return () => {
      window.removeEventListener('storage', onChange)
      window.removeEventListener('auth-changed', onChange)
    }
  }, [])

  const isAuthenticated = Boolean(token)
  const role = user?.role || null

  return { isAuthenticated, token, user, role }
}
