<template>
  <div id="app">
    <header class="header">
      <button class="hamburger" id="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="logo">
        <img src="/Status Bot Logo.png" alt="Status Bot Logo">
      </div>
      <nav class="nav" :class="{ show: menuOpen }">
        <ul class="nav-menu">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/commands">Commands</router-link></li>
          <li><router-link to="/premium">Premium</router-link></li>
          <li><router-link to="/support">Support</router-link></li>
          <li><a :href="DISCORD_INVITE_URL" target="_blank">Invite</a></li>
          <li><router-link to="/status">Status</router-link></li>
        </ul>
      </nav>
      <div class="auth-container">
        <button v-if="!isLoggedIn" class="login-btn" @click="handleLogin">Login</button>
        <div v-else class="user-btn-wrapper">
          <button class="notification-bell" :class="{ 'has-notification': notificationCount > 0 }" @click="toggleNotifications" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
          </button>
          <div v-if="showNotifications" class="notifications-panel">
            <div class="notifications-header">
              <h3>Notifications</h3>
              <div class="notifications-header-buttons">
                <button v-if="notificationCount > 0" @click="markAllAsRead" class="mark-read-btn" title="Mark all as read">
                  Mark as Read
                </button>
                <button @click="toggleNotifications" class="close-btn">✕</button>
              </div>
            </div>
            <div v-if="notifications.length > 0" class="notifications-list">
              <div v-for="(notif, index) in notifications" :key="index" class="notification-item" :class="{ 'is-read': notif.read }">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-message">{{ notif.message }}</div>
                <div class="notif-time">{{ formatTime(notif.timestamp) }}</div>
              </div>
            </div>
            <div v-else class="empty-notifications">
              <p>No notifications</p>
            </div>
          </div>
          <button class="user-btn" @click="toggleDropdown">
            <div class="user-avatar" :style="{ backgroundImage: `url('${userAvatar}')` }"></div>
            <span>{{ userName }}</span>
            <svg class="user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="dropdown-menu" :class="{ show: dropdownOpen }">
            <router-link to="/servers" class="dropdown-item">Dashboard</router-link>
            <router-link to="/settings" class="dropdown-item">Settings</router-link>
            <div class="dropdown-divider"></div>
            <router-link to="/staff/applications" class="dropdown-item">Staff Applications</router-link>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout" @click="handleLogout" :disabled="isLoggingOut">
              <span v-if="isLoggingOut" class="spinner logout-spinner"></span>
              {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <!-- Page Progress Bar -->
      <div v-if="isNavigating" class="page-progress-bar" :style="{ width: progressWidth + '%' }"></div>

      <!-- Page Content -->
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section footer-brand">
          <h3>Status Bot</h3>
          <p>A powerful Discord bot with status tracking, XP systems, and more.</p>
        </div>
        <div class="footer-section footer-links-section">
          <h3>Links</h3>
          <div class="footer-links">
            <router-link to="/docs">Docs</router-link>
            <a :href="DISCORD_SERVER_URL" target="_blank">Discord Server</a>
          </div>
        </div>
        <div class="footer-section footer-legal">
          <h3>Legal</h3>
          <div class="legal-content">
            <router-link to="/terms">Terms</router-link>
            <router-link to="/privacy">Privacy</router-link>
            <p class="copyright-text">© Status-Bot.xyz. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { DISCORD_INVITE_URL } from './config'

const authStore = useAuthStore()
const router = useRouter()

// UI state
const menuOpen = ref(false)
const dropdownOpen = ref(false)
const showNotifications = ref(false)
const notifications = ref([])

const isNavigating = ref(false)
const progressWidth = ref(0)
let progressInterval = null
const isLoggingOut = ref(false)

const notificationCount = computed(() => notifications.value.filter(n => !n.read).length)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userName = computed(() => authStore.user?.username || '')
const userAvatar = computed(() => {
  if (authStore.user?.id && authStore.user?.avatar) {
    return `https://cdn.discordapp.com/avatars/${authStore.user.id}/${authStore.user.avatar}.png?size=32`
  }
  return ''
})

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    loadNotifications()
  }
}

const handleLogin = () => {
  authStore.login()
}

const handleLogout = async () => {
  isLoggingOut.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  authStore.logout()
  dropdownOpen.value = false
  menuOpen.value = false
  isLoggingOut.value = false
}

const markNotificationsAsRead = async () => {
  notifications.value = notifications.value.map(n => ({
    ...n,
    read: true
  }))
  saveNotifications()

  try {
    if (authStore.user?.id) {
      const SECRET_KEY = 'status-bot-stats-secret-key'
      await fetch(`https://status-bot-backend.onrender.com/api/user/${authStore.user.id}/notifications/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
      })
    }
  } catch (err) {
  }
}

const markAllAsRead = async () => {
  await markNotificationsAsRead()
}

const addNotification = (title, message) => {
  notifications.value.unshift({
    title,
    message,
    timestamp: new Date()
  })

  if (notifications.value.length > 10) {
    notifications.value.pop()
  }
}

const formatTime = (timestamp) => {
  try {
    let ts = timestamp
    if (!ts) ts = new Date()
    if (typeof ts === 'string') ts = new Date(ts)
    if (!(ts instanceof Date)) ts = new Date(ts)

    if (isNaN(ts.getTime())) return 'Recently'

    const now = new Date()
    const diff = now - ts
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return ts.toLocaleDateString()
  } catch (e) {
    return 'Recently'
  }
}

const loadNotifications = async () => {
  try {
    const storedNotifs = localStorage.getItem('siteNotifications')
    const readStateMap = new Map()

    if (storedNotifs) {
      try {
        const parsed = JSON.parse(storedNotifs)
        parsed.forEach(n => {
          if (n.id) readStateMap.set(n.id, n.read === true)
        })
      } catch (e) {
      }
    }

    if (authStore.user?.id) {
      const SECRET_KEY = 'status-bot-stats-secret-key'
      const response = await fetch(`https://status-bot-backend.onrender.com/api/user/${authStore.user.id}/notifications`, {
        headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
      })
      if (response.ok) {
        const data = await response.json()
        const backendNotifs = (data.notifications || []).map(n => ({
          ...n,
          timestamp: new Date(n.createdAt || Date.now()),
          read: readStateMap.has(n.id) ? readStateMap.get(n.id) : false
        }))

        let allNotifs = [...backendNotifs]

        if (storedNotifs) {
          try {
            const parsed = JSON.parse(storedNotifs)
            parsed.forEach(stored => {
              if (!backendNotifs.find(b => b.id === stored.id)) {
                allNotifs.push({
                  ...stored,
                  read: stored.read !== undefined ? stored.read : false,
                  timestamp: stored.timestamp instanceof Date ? stored.timestamp : new Date(stored.timestamp || Date.now())
                })
              }
            })
          } catch (e) {
          }
        }

        allNotifs.sort((a, b) => {
          const aTime = typeof a.createdAt === 'number' ? a.createdAt : a.timestamp?.getTime?.() || 0
          const bTime = typeof b.createdAt === 'number' ? b.createdAt : b.timestamp?.getTime?.() || 0
          return bTime - aTime
        })

        notifications.value = allNotifs
        saveNotifications()
        return
      }
    }
  } catch (err) {
  }

  try {
    const storedNotifs = localStorage.getItem('siteNotifications')
    if (storedNotifs) {
      const notifs = JSON.parse(storedNotifs)
      notifications.value = notifs.map(n => ({
        ...n,
        read: n.read !== undefined ? n.read : false,
        timestamp: n.timestamp instanceof Date ? n.timestamp : new Date(n.timestamp || Date.now())
      }))
    }
  } catch (err) {
  }
}

const saveNotifications = () => {
  const notificationsToSave = notifications.value.map(n => ({
    ...n,
    timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp
  }))
  localStorage.setItem('siteNotifications', JSON.stringify(notificationsToSave))
}

const startProgressBar = () => {
  isNavigating.value = true
  progressWidth.value = 10

  if (progressInterval) clearInterval(progressInterval)

  progressInterval = setInterval(() => {
    if (progressWidth.value < 90) {
      progressWidth.value += Math.random() * (90 - progressWidth.value) * 0.15
    }
  }, 200)
}

const completeProgressBar = () => {
  if (progressInterval) clearInterval(progressInterval)

  progressWidth.value = 100

  setTimeout(() => {
    isNavigating.value = false
    progressWidth.value = 0
  }, 300)
}

onMounted(() => {
  authStore.initializeAuth()
  loadNotifications()

  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      startProgressBar()
    }
    next()
  })

  router.afterEach(() => {
    completeProgressBar()
  })

  watch(() => authStore.isLoggedIn, (newVal) => {
    if (newVal) {
      loadNotifications()
    }
  })

  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      menuOpen.value = false
      dropdownOpen.value = false
      showNotifications.value = false
    }
  })

  document.querySelectorAll('nav a, .dropdown-item').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen.value = false
      dropdownOpen.value = false
    })
  })

  window.addEventListener('beforeunload', saveNotifications)
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  z-index: 10;
}

.logo {
  height: 40px;
  width: auto;
}

.logo img {
  height: 100%;
  width: auto;
}

.nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-menu {
  display: flex;
  gap: 40px;
  list-style: none;
}

.nav-menu a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 5px;
  position: relative;
  transition: color 0.3s ease;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-menu a:hover::after {
  width: 100%;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  width: 24px;
  height: 2px;
  background-color: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.auth-container {
  display: flex;
  gap: 15px;
  align-items: center;
}

.notification-bell {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.notification-bell:hover {
  background: rgba(80, 80, 80, 0.15);
  color: #5170ff;
  transform: scale(1.1);
}

.notification-bell.has-notification:hover {
  background: rgba(255, 94, 94, 0.15);
  color: #ff5e5e;
}

.notification-bell svg {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.notification-bell:hover svg {
  transform: rotate(15deg);
}

.notification-bell.has-notification {
  color: #ff5e5e;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ff5e5e, #ff4444);
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  border: 2px solid var(--bg-primary);
  box-shadow: 0 4px 12px rgba(255, 94, 94, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(255, 94, 94, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 94, 94, 0.6);
  }
  100% {
    box-shadow: 0 4px 12px rgba(255, 94, 94, 0.4);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background-color: var(--bg-tertiary);
}

.notifications-header h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.notifications-header-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.mark-read-btn {
  background: rgba(80, 80, 80, 0.2);
  border: 1px solid #5170ff;
  color: #5170ff;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background: rgba(80, 80, 80, 0.35);
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.notification-item:hover {
  background-color: rgba(81, 112, 255, 0.1);
}

.notification-item.is-read {
  opacity: 0.6;
}

.notif-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
  margin-bottom: 4px;
}

.notif-message {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 6px;
}

.notif-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.empty-notifications {
  padding: 30px 16px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.login-btn {
  color: #fff;
  padding: 10px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 48px;
  display: flex;
  align-items: center;
}

.user-btn {
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  height: 48px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.user-btn-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-bell {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease;
  margin-right: 8px;
}

.notification-bell:hover {
  transform: scale(1.1);
  color: var(--primary-color);
}

.notification-bell svg {
  width: 20px;
  height: 20px;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-width: 300px;
  max-width: 400px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.notifications-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: rgba(81, 112, 255, 0.1);
}

.notif-title {
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.notif-message {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.notif-time {
  font-size: 12px;
  color: #666;
}

.empty-notifications {
  text-align: center;
  padding: 30px 20px;
  color: var(--text-secondary);
  font-style: italic;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-width: 200px;
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.dropdown-menu.show {
  display: flex;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 4px 0;
}

.dropdown-item {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;
}

.dropdown-item:hover {
  background-color: rgba(81, 112, 255, 0.2);
}

.dropdown-item.logout:hover {
  background-color: rgba(255, 94, 94, 0.2);
  color: #ff5e5e;
}

.dropdown-item.logout:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.logout-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border: 2px solid rgba(255, 94, 94, 0.3);
  border-top-color: #ff5e5e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

.user-chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.user-btn.active .user-chevron {
  transform: rotate(180deg);
}

main {
  flex: 1;
  position: relative;
  z-index: 5;
}

.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 50px 50px 40px;
  margin-top: auto;
  position: relative;
  z-index: 10;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 100px;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding: 0 50px;
}

.footer-section h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.footer-brand p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 250px;
}

.footer-links-section .footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.footer-links-section .footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.footer-links-section .footer-links a:hover {
  color: var(--primary-color);
}

.legal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legal-content a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.legal-content a:hover {
  color: var(--primary-color);
}

.copyright-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 8px;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }

  .hamburger {
    display: flex;
  }

  .logo {
    display: none;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: auto;
    transform: none;
    background-color: var(--bg-secondary);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 12px;
    margin-top: 8px;
    display: none;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }

  .nav.show {
    display: block;
  }

  .nav-menu {
    gap: 6px;
    flex-direction: column;
  }

  .nav-menu a {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 6px;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 100%;
    margin: 0 auto;
    margin-bottom: 40px;
    padding: 0 20px;
  }

  .footer-section h3 {
    font-size: 1rem;
  }

  .footer {
    padding: 35px 20px 25px;
  }

  .footer-links-section .footer-links {
    gap: 12px;
  }

  .legal-content {
    gap: 8px;
  }
}

/* Page Progress Bar */
.page-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), rgba(81, 112, 255, 0.8));
  width: 0%;
  transition: width 0.3s ease;
  z-index: 999;
  box-shadow: 0 0 10px rgba(81, 112, 255, 0.6);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(81, 112, 255, 0.5);
  border-radius: 5px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(81, 112, 255, 0.8);
}

/* Firefox Scrollbar */
* {
  scrollbar-color: rgba(81, 112, 255, 0.5) transparent;
  scrollbar-width: thin;
}
</style>
