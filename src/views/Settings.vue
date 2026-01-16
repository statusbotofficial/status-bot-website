<template>
  <div class="settings-wrapper">
    <div class="settings-container">
      <div class="settings-header">
        <h1>Settings</h1>
        <p>Manage your account, preferences, and Status Bot experience</p>
        <hr>
      </div>

      <div class="settings-main">
        <aside class="settings-sidebar">
          <nav class="sidebar-nav">
            <div class="sidebar-title">Settings</div>
            <ul>
              <li>
                <button
                  class="nav-link"
                  :class="{ active: activeSection === 'account' }"
                  @click="activeSection = 'account'"
                >
                  Account Info
                </button>
              </li>
              <li>
                <button
                  class="nav-link"
                  :class="{ active: activeSection === 'premium' }"
                  @click="activeSection = 'premium'"
                >
                  Premium
                </button>
              </li>
              <li>
                <button
                  class="nav-link"
                  :class="{ active: activeSection === 'notifications' }"
                  @click="activeSection = 'notifications'"
                >
                  Notifications
                </button>
              </li>
              <li>
                <button
                  class="nav-link"
                  :class="{ active: activeSection === 'appearance' }"
                  @click="activeSection = 'appearance'"
                >
                  Appearance
                </button>
              </li>
              <li>
                <button
                  class="nav-link"
                  :class="{ active: activeSection === 'gifts' }"
                  @click="activeSection = 'gifts'"
                >
                  Gifts & Rewards
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="settings-content">
          <!-- Account Info Section -->
          <section v-show="activeSection === 'account'" class="settings-section">
            <h2>Account Info</h2>
            <p class="section-subtitle">Manage your Discord account information and security settings</p>

            <div class="section-panel">
              <div class="panel-header">Discord Account Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <label>Username</label>
                  <div class="info-value">{{ discordUser?.username || 'Loading...' }}</div>
                </div>
                <div class="info-item">
                  <label>User ID</label>
                  <div class="info-value copy-able" @click="copyToClipboard(discordUser?.id)">
                    {{ discordUser?.id || 'Loading...' }}
                    <span class="copy-icon">📋</span>
                  </div>
                </div>
                <div class="info-item">
                  <label>Account Created</label>
                  <div class="info-value">{{ accountCreatedDate }}</div>
                </div>
                <div class="info-item">
                  <label>Email</label>
                  <div class="info-value">{{ discordUser?.email || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Premium Section -->
          <section v-show="activeSection === 'premium'" class="settings-section">
            <h2>Premium Membership</h2>
            <p class="section-subtitle">Unlock exclusive features and benefits</p>

            <div class="section-panel" :class="{ 'premium-active': hasPremium }">
              <div class="premium-header">
                <div class="premium-status">
                  <span v-if="hasPremium" class="status-badge premium">Active</span>
                  <span v-else class="status-badge inactive">Inactive</span>
                </div>
              </div>

              <div v-if="hasPremium" class="premium-info">
                <div class="info-item">
                  <label>Status</label>
                  <div class="info-value">✓ Premium Member</div>
                </div>
                <div class="info-item">
                  <label>Expiry Date</label>
                  <div class="info-value">{{ formatExpiryDate(premiumExpiryDate) }}</div>
                </div>
                <div class="info-item">
                  <label>Days Remaining</label>
                  <div class="info-value">{{ daysUntilExpiry }} days</div>
                </div>
              </div>

              <div v-else class="premium-cta">
                <h3>Upgrade to Premium</h3>
                <p>Unlock exclusive features and support the development of Status Bot</p>
                <router-link to="/premium" class="btn btn-primary">View Premium Plans</router-link>
              </div>
            </div>

            <div class="section-panel">
              <div class="panel-header">Premium Features</div>
              <div class="features-grid">
                <div class="feature-card" :class="{ 'unlocked': hasPremium }">
                  <div class="feature-icon">2️⃣</div>
                  <div class="feature-name">2x XP Multiplier</div>
                  <div class="feature-desc">Earn double XP on messages and voice chat</div>
                </div>
                <div class="feature-card" :class="{ 'unlocked': hasPremium }">
                  <div class="feature-icon">✨</div>
                  <div class="feature-name">Exclusive Items</div>
                  <div class="feature-desc">Access premium cosmetics and rewards</div>
                </div>
                <div class="feature-card" :class="{ 'unlocked': hasPremium }">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-name">Priority Support</div>
                  <div class="feature-desc">Get faster responses to your questions</div>
                </div>
                <div class="feature-card" :class="{ 'unlocked': hasPremium }">
                  <div class="feature-icon">📈</div>
                  <div class="feature-name">Enhanced Limits</div>
                  <div class="feature-desc">Higher limits on tracked users and settings</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Notification Preferences Section -->
          <section v-show="activeSection === 'notifications'" class="settings-section">
            <h2>Notification Preferences</h2>
            <p class="section-subtitle">Choose what notifications you want to receive</p>

            <div class="section-panel">
              <div class="preference-item">
                <div class="preference-info">
                  <div class="preference-name">Updates & Announcements</div>
                  <div class="preference-desc">Get notified about new features and important updates</div>
                </div>
                <label class="toggle">
                  <input v-model="notificationPrefs.updates" type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="preference-item">
                <div class="preference-info">
                  <div class="preference-name">Gifts & Rewards</div>
                  <div class="preference-desc">Notifications when you receive gifts or rewards</div>
                </div>
                <label class="toggle">
                  <input v-model="notificationPrefs.gifts" type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="preference-item">
                <div class="preference-info">
                  <div class="preference-name">Trial Offers</div>
                  <div class="preference-desc">Premium trial offers and special promotions</div>
                </div>
                <label class="toggle">
                  <input v-model="notificationPrefs.trials" type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="preference-item">
                <div class="preference-info">
                  <div class="preference-name">Community News</div>
                  <div class="preference-desc">News about community events and activities</div>
                </div>
                <label class="toggle">
                  <input v-model="notificationPrefs.community" type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <button class="btn btn-primary" style="margin-top: 20px" @click="saveNotificationPrefs">
                Save Preferences
              </button>
            </div>
          </section>

          <!-- Appearance Section -->
          <section v-show="activeSection === 'appearance'" class="settings-section">
            <h2>Appearance</h2>
            <p class="section-subtitle">Customize how Status Bot looks</p>

            <div class="section-panel">
              <div class="panel-header">Color Themes</div>
              <div class="swatches-grid">
                <div
                  v-for="(theme, name) in themes"
                  :key="name"
                  class="swatch-wrapper"
                  @click="selectTheme(name)"
                >
                  <div
                    class="swatch"
                    :class="{ 'active': currentTheme === name }"
                    :style="{ background: theme.preview }"
                  ></div>
                  <div class="swatch-label">{{ theme.name }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Gifts & Rewards Section -->
          <section v-show="activeSection === 'gifts'" class="settings-section">
            <h2>Gifts & Rewards</h2>
            <p class="section-subtitle">Claim your available gifts and rewards, or send premium gifts to friends</p>

            <!-- Premium Credits Section -->
            <div class="section-panel credits-panel">
              <div class="panel-header">Your Premium Credits</div>
              <div class="credits-display">
                <div class="credits-amount">{{ userCredits }}</div>
                <div class="credits-label">Credits Available</div>
                <p class="credits-info">💡 Server boost to earn credits, then gift premium to others!</p>
              </div>
              <button v-if="userCredits > 0" class="gift-button" @click="showGiftModal = true">
                🎁 Send Premium Gift
              </button>
              <button v-else class="gift-button disabled" disabled>
                No Credits Available
              </button>
            </div>

            <!-- Gift Modal -->
            <div v-if="showGiftModal" class="modal-overlay" @click="showGiftModal = false">
              <div class="gift-modal" @click.stop>
                <div class="modal-header">
                  <h3>Send Premium Gift</h3>
                  <button class="close-btn" @click="showGiftModal = false">✕</button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label>Recipient User ID</label>
                    <input 
                      v-model="giftForm.recipientId" 
                      type="text" 
                      placeholder="Enter Discord User ID"
                      class="form-input"
                    />
                    <small>💡 You can find a user's ID by enabling Developer Mode in Discord settings, then right-clicking their profile</small>
                  </div>
                  <div class="form-group">
                    <label>Gift Details</label>
                    <div class="gift-details-info">
                      <div class="detail-item">
                        <strong>Cost:</strong> 1 Premium Credit
                      </div>
                      <div class="detail-item">
                        <strong>Duration:</strong> 30 Days Premium
                      </div>
                      <div class="detail-item">
                        <strong>After Gift:</strong> They get all perks of <a href="https://status-bot.xyz/premium">premium</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="cancel-btn" @click="showGiftModal = false">Cancel</button>
                  <button 
                    class="confirm-btn" 
                    @click="sendGift"
                    :disabled="!giftForm.recipientId || sendingGift"
                  >
                    {{ sendingGift ? 'Sending...' : 'Send Gift' }}
                  </button>
                </div>
              </div>
            </div>

            <hr style="margin: 30px 0;">

            <!-- Available Gifts Section -->
            <div class="section-panel">
              <div class="panel-header">Available Gifts</div>

              <div v-if="loadingGifts" class="loading-state">
                <div class="spinner"></div>
                <p>Loading gifts...</p>
              </div>

              <div v-else-if="gifts.length > 0" class="gifts-container">
                <div v-for="gift in gifts" :key="gift.id" class="gift-entry">
                  <div class="gift-icon-container">🎁</div>
                  <div class="gift-details">
                    <div class="gift-name">{{ gift.name }}</div>
                    <div class="gift-expiry" v-if="gift.dashboardExpiresAt || gift.expiresAt">Expires: {{ formatDate(gift.dashboardExpiresAt || gift.expiresAt) }}</div>
                  </div>
                  <button
                    :disabled="gift.claimed"
                    :class="{ 'claimed': gift.claimed }"
                    class="claim-btn"
                    @click="claimGift(gift.id)"
                  >
                    {{ gift.claimed ? 'Claimed' : 'Claim' }}
                  </button>
                </div>
              </div>

              <div v-else class="empty-state">
                <div class="empty-icon">🎁</div>
                <p>No gifts available right now</p>
                <p class="empty-hint">Check back later or claim gifts from special events</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const activeSection = ref('account')
const discordUser = ref(null)
const hasPremium = ref(false)
const premiumExpiryDate = ref(null)
const loadingGifts = ref(false)
const gifts = ref([])
const currentTheme = ref('default')
const userCredits = ref(0)
const showGiftModal = ref(false)
const sendingGift = ref(false)
const giftForm = ref({
  recipientId: ''
})

const notificationPrefs = ref({
  updates: true,
  gifts: true,
  trials: true,
  community: true
})

const themes = {
  default: {
    name: 'Default',
    preview: 'linear-gradient(135deg, #ffffff 0%, #2630b6 100%)'
  },
  dark: { name: 'Dark', preview: 'linear-gradient(135deg, #0b0b0b 0%, #2b2b2b 100%)' },
  light: { name: 'Light', preview: '#ffffff' },
  sunset: { name: 'Sunset', preview: 'linear-gradient(135deg, #ffb86b 0%, #7e4bb8 100%)' },
  obsidian: { name: 'Obsidian', preview: 'linear-gradient(135deg, #0b0b0b 0%, #4d4d4d 100%)' },
  saphire: { name: 'Sapphire', preview: 'linear-gradient(135deg, #00b0ff 0%, #0b3cff 100%)' },
  parrot: { name: 'Parrot', preview: 'linear-gradient(135deg, #69f0ae 0%, #00bcd4 100%)' },
  icicle: { name: 'Icicle', preview: 'linear-gradient(135deg, #e0f7fa 0%, #8ec5ff 100%)' },
  lime: { name: 'Lime', preview: 'linear-gradient(135deg, #b0ff6d 0%, #7be35a 100%)' }
}

const BACKEND_URL = 'https://status-bot-backend.onrender.com'
const SECRET_KEY = 'status-bot-stats-secret-key'

// Computed properties
const accountCreatedDate = computed(() => {
  if (!discordUser.value?.id) return 'Loading...'
  const timestamp = BigInt(discordUser.value.id)
  const createdAt = new Date((Number(timestamp >> BigInt(22)) + 1420070400000))
  return createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
})

const currentSessionTime = computed(() => {
  return 'Active now'
})

const daysUntilExpiry = computed(() => {
  if (!premiumExpiryDate.value) return 0
  const expiry = new Date(premiumExpiryDate.value)
  const now = new Date()
  const diff = expiry - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

// Methods
const fetchDiscordUser = async () => {
  const token = localStorage.getItem('discordToken')
  if (!token) return

  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.ok) {
      discordUser.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching Discord user:', err)
  }
}

const fetchPremiumStatus = async () => {
  if (!discordUser.value?.id) return

  try {
    const response = await fetch(`${BACKEND_URL}/api/user-premium/${discordUser.value.id}`)
    if (response.ok) {
      const data = await response.json()
      hasPremium.value = data.hasPremium || false
      if (data.expiryDate) {
        premiumExpiryDate.value = data.expiryDate
      }
    }
  } catch (err) {
    console.error('Error fetching premium status:', err)
  }
}

const loadGifts = async () => {
  if (!discordUser.value?.id) return

  loadingGifts.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/${discordUser.value.id}/gifts`, {
      headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
    })
    if (response.ok) {
      const data = await response.json()
      gifts.value = data.gifts || []
    }
  } catch (err) {
    console.error('Error loading gifts:', err)
  } finally {
    loadingGifts.value = false
  }
}

const claimGift = async (giftId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/gifts/claim`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: discordUser.value.id,
        giftId
      })
    })

    if (response.ok) {
      loadGifts()
    }
  } catch (err) {
    console.error('Error claiming gift:', err)
  }
}

const loadUserCredits = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/premium-credits/${authStore.user.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      userCredits.value = data.credits || 0
    }
  } catch (err) {
    console.error('Error loading credits:', err)
  }
}

const sendGift = async () => {
  if (!giftForm.value.recipientId) {
    alert('Please enter a recipient User ID')
    return
  }

  sendingGift.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/gift-premium`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipientId: giftForm.value.recipientId
      })
    })

    const data = await response.json()

    if (response.ok) {
      alert('✨ Gift sent successfully! The recipient will receive their premium gift shortly.')
      showGiftModal.value = false
      giftForm.value.recipientId = ''
      await loadUserCredits()
    } else {
      alert(`❌ Error: ${data.error || 'Failed to send gift'}`)
    }
  } catch (err) {
    console.error('Error sending gift:', err)
    alert('❌ An error occurred while sending the gift')
  } finally {
    sendingGift.value = false
  }
}

const saveNotificationPrefs = async () => {
  localStorage.setItem('notificationPrefs', JSON.stringify(notificationPrefs.value))
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/${discordUser.value.id}/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationPrefs.value)
    })
    
    if (response.ok) {
      alert('✓ Notification preferences saved')
      
      if (notificationPrefs.value.updates || notificationPrefs.value.gifts || notificationPrefs.value.trials || notificationPrefs.value.community) {
        requestNotificationPermission()
      }
    }
  } catch (err) {
    console.error('Error saving notification preferences:', err)
    alert('Error saving preferences')
  }
}

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return
  }
  
  if (Notification.permission === 'granted') {
    new Notification('Status Bot', {
      body: 'Notifications enabled for Status Bot!',
      icon: '/Status Bot Logo.png'
    })
    return
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      new Notification('Status Bot', {
        body: 'Notifications enabled for Status Bot!',
        icon: '/Status Bot Logo.png'
      })
    }
  }
}

const selectTheme = (themeName) => {
  currentTheme.value = themeName
  localStorage.setItem('site_theme', themeName)
  applyTheme(themeName)
}

const applyTheme = (themeName) => {
  const theme = themes[themeName]
  if (!theme) return
  
  const root = document.documentElement
  const colors = {
    default: { primary: '#5170ff', bg: '#0d0d0d', text: '#ffffff' },
    dark: { primary: '#4d4d4d', bg: '#000000', text: '#cccccc' },
    light: { primary: '#0066cc', bg: '#ffffff', text: '#000000' },
    sunset: { primary: '#ff7f50', bg: '#1a0f0a', text: '#fff5e6' },
    obsidian: { primary: '#708090', bg: '#0b0b0b', text: '#e8e8e8' },
    saphire: { primary: '#0b3cff', bg: '#0a0a1a', text: '#e0e8ff' },
    parrot: { primary: '#00bcd4', bg: '#0a1a1a', text: '#e0fff5' },
    icicle: { primary: '#00bfff', bg: '#0f1a2e', text: '#e0f7ff' },
    lime: { primary: '#7be35a', bg: '#0a1a00', text: '#e8ffe0' }
  }
  
  const themeColors = colors[themeName] || colors.default
  root.style.setProperty('--primary-color', themeColors.primary)
  root.style.setProperty('--bg-primary', themeColors.bg)
  root.style.setProperty('--text-primary', themeColors.text)
}

const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  alert('✓ Copied to clipboard')
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatExpiryDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  document.title = 'Settings | Status Bot'
  
  const storedUser = localStorage.getItem('discordUser')
  if (storedUser) {
    discordUser.value = JSON.parse(storedUser)
  }
  
  await fetchDiscordUser()
  await fetchPremiumStatus()
  await loadGifts()
  await loadUserCredits()
  
  const savedTheme = localStorage.getItem('site_theme') || 'default'
  currentTheme.value = savedTheme
  applyTheme(savedTheme)
  
  const savedPrefs = localStorage.getItem('notificationPrefs')
  if (savedPrefs) {
    notificationPrefs.value = JSON.parse(savedPrefs)
  }

  // Check for tab parameter in URL
  const urlParams = new URLSearchParams(window.location.search)
  const tab = urlParams.get('tab')
  if (tab) {
    activeSection.value = tab
  }
})
</script>

<style scoped>
.settings-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.settings-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 60px;
}

.settings-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  color: #fff;
}

.settings-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.settings-header hr {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  border: none;
  margin-top: 20px;
}

.settings-main {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.settings-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-nav {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.sidebar-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #5170ff;
  margin-bottom: 15px;
  letter-spacing: 0.5px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 15px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 3px;
  text-align: left;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(81, 112, 255, 0.1);
  color: #5170ff;
  transform: translateX(4px);
}

.nav-link.active {
  background: rgba(81, 112, 255, 0.2);
  color: #5170ff;
  font-weight: 600;
}

.nav-link .icon {
  font-size: 18px;
}

.settings-content {
  width: 100%;
}

.settings-section {
  margin-bottom: 50px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.settings-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.section-panel {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.section-panel.danger-panel {
  background: rgba(255, 94, 94, 0.05);
  border: 1px solid rgba(255, 94, 94, 0.2);
}

.section-panel.premium-active {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(81, 112, 255, 0.08));
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.panel-header {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  color: #fff;
  word-break: break-all;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-value.copy-able {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.info-value.copy-able:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: rgba(81, 112, 255, 0.3);
}

.copy-icon {
  font-size: 14px;
  opacity: 0.6;
  margin-left: 8px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.session-name {
  font-weight: 600;
  color: #fff;
}

.session-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.session-badge {
  padding: 6px 12px;
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.4);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #4ade80;
}

.danger-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.danger-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.premium-status {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.status-badge.premium {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.4);
}

.status-badge.inactive {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.premium-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.premium-cta {
  text-align: center;
  padding: 20px 0;
}

.premium-cta h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.premium-cta p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.feature-card.unlocked {
  opacity: 1;
  background: rgba(81, 112, 255, 0.08);
  border-color: rgba(81, 112, 255, 0.3);
}

.feature-icon {
  font-size: 32px;
}

.feature-name {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.feature-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(81, 112, 255, 0.08);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-icon {
  font-size: 32px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.history-time {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.history-details {
  font-size: 13px;
  color: var(--text-secondary);
}

.history-note {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  padding: 10px;
  margin-top: 10px;
}

.servers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.server-card {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.2s ease;
}

.server-card:hover {
  background: rgba(81, 112, 255, 0.08);
  border-color: rgba(81, 112, 255, 0.3);
  transform: translateY(-4px);
}

.server-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.server-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  flex: 1;
  word-break: break-word;
}

.server-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.server-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.server-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.stat .label {
  color: var(--text-secondary);
}

.stat .value {
  color: #fff;
  font-weight: 600;
}

.stat .value.online {
  color: #4ade80;
}

.stat .value.offline {
  color: #ef4444;
}

.server-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(81, 112, 255, 0.2);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 6px;
  color: #8a9fff;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 10px;
}

.empty-hint {
  font-size: 13px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.preference-name {
  font-weight: 600;
  color: #fff;
  font-size: 15px;
}

.preference-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  margin-left: 20px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.3s;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 22px;
  width: 22px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: rgba(81, 112, 255, 0.6);
  border-color: rgba(81, 112, 255, 0.8);
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

.swatches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
}

.swatch-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.swatch {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.swatch:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.4);
}

.swatch.active {
  border-color: #5170ff;
  box-shadow: 0 0 0 3px rgba(81, 112, 255, 0.3);
}

.swatch-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
}

.gifts-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.gift-entry {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  gap: 15px;
  transition: all 0.3s ease;
}

.gift-entry:hover {
  background: rgba(81, 112, 255, 0.08);
  border-color: rgba(81, 112, 255, 0.4);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(81, 112, 255, 0.15);
}

.gift-icon-container {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  flex-shrink: 0;
  font-size: 32px;
  border: 1px solid rgba(81, 112, 255, 0.2);
}

.gift-details {
  flex: 1;
}

.gift-name {
  font-size: 16px;
  font-weight: 700;
  color: #4bffb7;
  margin-bottom: 4px;
}

.gift-code {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.gift-code span {
  font-weight: 600;
  color: #fff;
  font-family: monospace;
}

.gift-expiry {
  font-size: 12px;
  color: var(--text-secondary);
}

.claim-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  color: white;
  border: 1px solid rgba(81, 112, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.claim-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5170ff, #3d5dd4);
  border-color: rgba(81, 112, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.3);
}

.claim-btn:disabled,
.claim-btn.claimed {
  background: linear-gradient(135deg, rgba(114, 118, 125, 0.6), rgba(114, 118, 125, 0.4));
  border-color: rgba(114, 118, 125, 0.3);
  cursor: not-allowed;
  opacity: 0.7;
}

.privacy-item {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.privacy-item:last-child {
  border-bottom: none;
}

.privacy-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.privacy-name {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.privacy-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.policy-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.policy-link {
  padding: 10px 16px;
  background: rgba(81, 112, 255, 0.1);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 8px;
  color: #5170ff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.policy-link:hover {
  background: rgba(81, 112, 255, 0.2);
  border-color: rgba(81, 112, 255, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.modal-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  color: var(--text-secondary);
  font-size: 14px;
}

.modal-content p {
  margin-bottom: 10px;
}

.modal-content strong {
  color: #fff;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(81, 112, 255, 0.2);
  border-top-color: #5170ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Button Styles */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 2px solid #5170ff;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.3);
  transform: translateY(-2px);
}

.btn-danger {
  background: linear-gradient(135deg, rgba(255, 68, 68, 0.8), rgba(255, 68, 68, 0.5));
  border: 2px solid #ff4444;
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 68, 68, 1), rgba(255, 68, 68, 0.8));
  box-shadow: 0 8px 20px rgba(255, 68, 68, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, rgba(255, 94, 94, 0.8), rgba(255, 94, 94, 0.5));
  border: 2px solid #ff5e5e;
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 94, 94, 1), rgba(255, 94, 94, 0.8));
  box-shadow: 0 8px 20px rgba(255, 94, 94, 0.3);
  transform: translateY(-2px);
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

/* Responsive Design */
@media (max-width: 1023px) {
  .settings-wrapper {
    padding: 40px 30px;
  }

  .settings-main {
    grid-template-columns: 200px 1fr;
    gap: 30px;
  }

  .settings-header h1 {
    font-size: 40px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .settings-wrapper {
    padding: 30px 20px;
  }

  .settings-main {
    grid-template-columns: 1fr;
  }

  .settings-sidebar {
    position: static;
  }

  .sidebar-nav {
    margin-bottom: 30px;
  }

  .settings-header h1 {
    font-size: 32px;
  }

  .settings-section h2 {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .servers-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .swatches-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }

  .modal {
    width: 95%;
  }

  .gift-modal {
    width: 95%;
  }
}

/* Gift System Styles */
.credits-panel {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1), rgba(74, 222, 128, 0.05));
  border: 2px solid rgba(81, 112, 255, 0.2);
  padding: 30px;
  text-align: center;
}

.credits-display {
  margin: 20px 0;
}

.credits-amount {
  font-size: 48px;
  font-weight: bold;
  color: #5170ff;
  margin: 10px 0;
}

.credits-label {
  color: var(--text-secondary);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.credits-info {
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 10px;
}

.gift-button {
  background: linear-gradient(135deg, #5170ff, #7b68ff);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.gift-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(81, 112, 255, 0.3);
}

.gift-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.gift-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #5170ff;
  box-shadow: 0 0 0 3px rgba(81, 112, 255, 0.1);
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
}

.gift-details-info {
  background: var(--bg-secondary);
  border-left: 3px solid #5170ff;
  padding: 12px;
  border-radius: 4px;
}

.detail-item {
  padding: 6px 0;
  color: var(--text-primary);
  font-size: 13px;
}

.detail-item strong {
  color: #5170ff;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.cancel-btn:hover {
  background: var(--bg-tertiary);
}

.confirm-btn {
  background: linear-gradient(135deg, #5170ff, #7b68ff);
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(81, 112, 255, 0.3);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
