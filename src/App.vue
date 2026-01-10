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
            <button class="dropdown-item logout" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="/Status Bot Logo.png" alt="Status Bot Logo">
          </div>
        </div>
        <div class="footer-section">
          <div class="footer-links">
            <router-link to="/terms">Terms</router-link>
            <span>|</span>
            <router-link to="/privacy">Privacy Policy</router-link>
            <span>|</span>
            <router-link to="/support">Support</router-link>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        © 2025 Status-Bot.xyz. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { DISCORD_INVITE_URL } from './config'

const authStore = useAuthStore()
const router = useRouter()

const menuOpen = ref(false)
const dropdownOpen = ref(false)

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

const handleLogin = () => {
  authStore.initializeAuth()
}

const handleLogout = () => {
  authStore.logout()
  dropdownOpen.value = false
  menuOpen.value = false
}

onMounted(() => {
  authStore.initializeAuth()

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      menuOpen.value = false
      dropdownOpen.value = false
    }
  })

  // Close menu when a link is clicked
  document.querySelectorAll('nav a, .dropdown-item').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen.value = false
      dropdownOpen.value = false
    })
  })
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 50px;
  padding: 0 50px;
}

.footer-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.footer-logo {
  height: 40px;
  width: auto;
}

.footer-logo img {
  height: 100%;
  width: auto;
}

.footer-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.footer-links a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-links span {
  color: var(--text-primary);
  font-size: 14px;
}

.footer-copyright {
  text-align: center;
  color: var(--text-secondary);
  font-size: 12px;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid var(--border-color);
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
    left: auto;
    right: 0;
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

  .footer-container {
    padding: 0 20px;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .footer {
    padding: 35px 20px 25px;
  }

  .footer-links {
    gap: 18px;
    font-size: 12px;
    justify-content: center;
  }
}
</style>
