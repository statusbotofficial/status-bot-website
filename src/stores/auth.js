import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AUTH_STORAGE_KEY, DISCORD_CLIENT_ID } from '../config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isLoggedIn = computed(() => !!user.value)

  const getOAuthURL = () => {
    const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/redirect' : 'https://status-bot.xyz/redirect'
    const scopes = ['identify', 'guilds'].join('+')
    console.log('🔐 OAuth URL being generated:')
    console.log('  Client ID:', DISCORD_CLIENT_ID)
    console.log('  Redirect URI:', redirectUri)
    console.log('  Scopes:', scopes)
    const url = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`
    console.log('  Full URL:', url.substring(0, 100) + '...')
    return url
  }

  const handleOAuthCallback = () => {
    const hash = window.location.hash
    console.log('🔄 OAuth callback detected')
    console.log('  Hash:', hash.substring(0, 100))
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      console.log('  Extracted token:', accessToken ? accessToken.substring(0, 30) + '...' : 'MISSING')
      if (accessToken) {
        token.value = accessToken
        localStorage.setItem('discordToken', accessToken)
        console.log('✅ Token stored in localStorage')
        fetchUserData(accessToken)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }

  const initializeAuth = () => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    const storedToken = localStorage.getItem('discordToken')
    if (storedToken) {
      token.value = storedToken
    }

    handleOAuthCallback()
  }

  const login = () => {
    const url = getOAuthURL()
    console.log('🔓 FULL OAuth URL:', url)
    window.location.href = url
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

  const setUser = (userData) => {
    user.value = userData
    if (userData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
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
    fetchUserData,
    setUser
  }
})
