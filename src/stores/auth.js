import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AUTH_STORAGE_KEY, DISCORD_CLIENT_ID } from '../config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isLoggedIn = computed(() => !!user.value)

  const getOAuthURL = () => {
    const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/' : 'https://status-bot-website.netlify.app/'
    const scopes = ['identify', 'guilds'].join('+')
    return `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`
  }

  const handleOAuthCallback = () => {
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      if (accessToken) {
        token.value = accessToken
        localStorage.setItem('discordToken', accessToken)
        fetchUserData(accessToken)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }

  const initializeAuth = () => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    // Check if token is stored
    const storedToken = localStorage.getItem('discordToken')
    if (storedToken) {
      token.value = storedToken
    }

    // Check for OAuth callback
    handleOAuthCallback()
  }

  const login = () => {
    window.location.href = getOAuthURL()
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
    localStorage.removeItem('discordToken')
  }

  return {
    user,
    token,
    isLoggedIn,
    initializeAuth,
    login,
    logout,
    fetchUserData
  }
})
