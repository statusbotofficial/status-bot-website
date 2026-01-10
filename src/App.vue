<template>
  <div class="app">
    <header>
      <button class="hamburger" @click="toggleMenu" :class="{ active: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <router-link to="/" class="logo">
        <img src="/Status%20Bot%20Logo.png" alt="Status Bot Logo">
      </router-link>
      <nav :class="{ active: menuOpen }">
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
        <button v-if="!authStore.isLoggedIn" class="login-btn" @click="login">Login</button>
        <div v-else class="user-section">
          <button class="notification-bell" @click="toggleNotifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div v-if="showNotifications" class="notification-popup">
            <div class="notification-header">Notifications</div>
            <div class="notifications-list">
              <p v-if="notifications.length === 0" class="empty">No notifications</p>
            </div>
          </div>
          <div class="user-btn-wrapper">
            <button class="user-btn" @click="toggleUserMenu">
              <div class="user-avatar"></div>
              <span>User</span>
              <svg class="user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <router-link to="/servers" class="dropdown-item">Dashboard</router-link>
              <router-link to="/settings" class="dropdown-item">Settings</router-link>
              <button class="dropdown-item logout" @click="logout">Logout</button>
            </div>
          </div>
        </div>
        <div class="theme-switcher">
          <button 
            v-for="theme in availableThemes" 
            :key="theme.id"
            class="swatch"
            :title="theme.name"
            @click="themeStore.applyTheme(theme.id)"
            :class="{ active: themeStore.currentTheme === theme.id }"
          >
            {{ theme.name.substring(0, 1) }}
          </button>
        </div>
      </div>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-section">
          <h3>Status Bot</h3>
          <p>A powerful Discord bot with status tracking, XP systems, economy, and more.</p>
        </div>
        <div class="footer-section">
          <h3>Links</h3>
          <ul>
            <li><router-link to="/privacy">Privacy Policy</router-link></li>
            <li><router-link to="/terms">Terms of Service</router-link></li>
            <li><a :href="DISCORD_SERVER_URL" target="_blank">Discord Server</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Legal</h3>
          <p>&copy; 2026 Status Bot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { DISCORD_INVITE_URL, DISCORD_SERVER_URL } from './config'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const menuOpen = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notifications = ref([])

const availableThemes = computed(() => themeStore.getAvailableThemes())

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const login = () => {
  const scopes = ['identify', 'guilds'].join('+')
  const redirectUri = new URL(window.location).origin
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`
  window.location.href = authUrl
}

const logout = () => {
  authStore.logout()
  showUserMenu.value = false
}

onMounted(() => {
  authStore.initializeAuth()
  themeStore.initializeTheme()
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.auth-container')) {
      showNotifications.value = false
      showUserMenu.value = false
    }
  })
})
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  z-index: 10;
  background-color: var(--bg-primary);
}

.hamburger {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  gap: 6px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background-color: var(--text-primary);
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(10px, 10px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.logo {
  height: 40px;
  display: flex;
  align-items: center;
}

.logo img {
  height: 100%;
  width: auto;
}

nav {
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
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  border-bottom-color: var(--primary-color);
}

.auth-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-btn {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.user-btn-wrapper {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--bg-tertiary);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  z-index: 100;
  min-width: 150px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.dropdown-item {
  display: block;
  padding: 12px 15px;
  color: var(--text-primary);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: var(--bg-secondary);
}

.theme-switcher {
  display: flex;
  gap: 8px;
}

.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  background-color: var(--primary-color);
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
}

.swatch.active {
  border-color: var(--text-primary);
}

main {
  flex: 1;
  position: relative;
  z-index: 2;
}

footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 40px 50px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
}

.footer-section a {
  color: var(--primary-color);
  text-decoration: none;
}

@media (max-width: 768px) {
  header {
    padding: 15px 20px;
  }

  .hamburger {
    display: flex;
  }

  nav {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    display: none;
    z-index: 5;
  }

  nav.active {
    display: block;
  }

  .nav-menu {
    flex-direction: column;
    gap: 0;
    padding: 20px;
  }

  .nav-menu a {
    padding: 12px 0;
    border-bottom: none;
    border-left: 3px solid transparent;
    padding-left: 10px;
  }

  .nav-menu a:hover,
  .nav-menu a.router-link-active {
    border-left-color: var(--primary-color);
    border-bottom: none;
  }

  footer {
    padding: 30px 20px;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
