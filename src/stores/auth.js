import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AUTH_STORAGE_KEY } from '../config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isLoggedIn = computed(() => !!user.value)

  const initializeAuth = () => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }

    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      if (accessToken) {
        token.value = accessToken
        fetchUserData(accessToken)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }

  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (response.ok) {
        const userData = await response.json()
        user.value = userData
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return {
    user,
    token,
    isLoggedIn,
    initializeAuth,
    logout,
    fetchUserData
  }
})
