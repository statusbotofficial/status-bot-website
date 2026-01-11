<template>
  <div v-if="isAuthorized" class="dev-wrapper">
    <div class="dev-container">
      <div class="dev-header">
        <h1>Developer Tools</h1>
        <p>Internal testing and debugging tools</p>
        <hr>
      </div>

      <div class="dev-content">
        <section class="dev-section">
          <h2>Gifts Testing</h2>
          <div v-if="loadingGifts" class="loading-state">
            <div class="spinner"></div>
            <p>Loading gifts...</p>
          </div>

          <div v-else-if="gifts.length > 0" class="gifts-list">
            <div v-for="gift in gifts" :key="gift.id" class="gift-item">
              <div class="gift-header">
                <span class="gift-name">{{ gift.name }}</span>
                <span class="gift-code">{{ gift.code }}</span>
              </div>
              <div class="gift-details">
                <p><strong>ID:</strong> {{ gift.id }}</p>
                <p><strong>Expires:</strong> {{ formatDate(gift.expiresAt) }}</p>
                <p><strong>Claimed:</strong> {{ gift.claimed ? 'Yes' : 'No' }}</p>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <p>No gifts found</p>
          </div>
        </section>

        <section class="dev-section">
          <h2>User Information</h2>
          <div class="user-info">
            <p><strong>ID:</strong> {{ userId }}</p>
            <p><strong>Premium:</strong> {{ hasPremium ? 'Yes' : 'No' }}</p>
            <p><strong>Expiry:</strong> {{ premiumExpiryDate || 'N/A' }}</p>
          </div>
        </section>

        <section class="dev-section">
          <h2>API Tests</h2>
          <button class="btn btn-primary" @click="testAPIs">Test All APIs</button>
          <div v-if="apiTestResults" class="test-results">
            <pre>{{ apiTestResults }}</pre>
          </div>
        </section>
      </div>
    </div>
  </div>
  <div v-else class="unauthorized">
    <p>Access Denied</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const AUTHORIZED_USER_ID = '1362553254117904496'
const BACKEND_URL = 'https://status-bot-backend.onrender.com'
const SECRET_KEY = 'status-bot-stats-secret-key'

const userId = ref(null)
const gifts = ref([])
const loadingGifts = ref(false)
const hasPremium = ref(false)
const premiumExpiryDate = ref(null)
const apiTestResults = ref(null)

const isAuthorized = computed(() => {
  return authStore.user?.id === AUTHORIZED_USER_ID
})

const loadGifts = async () => {
  if (!userId.value) return
  
  loadingGifts.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/${userId.value}/gifts`, {
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

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const testAPIs = async () => {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      userId: userId.value,
      tests: {}
    }

    const endpoints = [
      {
        name: 'User Premium Status',
        url: `${BACKEND_URL}/api/user-premium/${userId.value}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
      },
      {
        name: 'User Gifts',
        url: `${BACKEND_URL}/api/user/${userId.value}/gifts`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
      },
      {
        name: 'Bot Guilds',
        url: `${BACKEND_URL}/api/bot-guilds`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
      }
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: endpoint.headers
        })
        results.tests[endpoint.name] = {
          status: response.status,
          statusText: response.statusText,
          success: response.ok
        }
      } catch (err) {
        results.tests[endpoint.name] = {
          error: err.message
        }
      }
    }

    apiTestResults.value = JSON.stringify(results, null, 2)
  } catch (err) {
    console.error('Error testing APIs:', err)
  }
}

onMounted(async () => {
  document.title = 'Developer Tools | Status Bot'
  
  if (!isAuthorized.value) {
    return
  }

  userId.value = authStore.user?.id

  try {
    const response = await fetch(`${BACKEND_URL}/api/user-premium/${userId.value}`)
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

  await loadGifts()
})
</script>

<style scoped>
.dev-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.dev-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.dev-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 60px;
}

.dev-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  color: #fff;
}

.dev-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.dev-header hr {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  border: none;
  margin-top: 20px;
}

.dev-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.dev-section {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
}

.dev-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
}

.gifts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.gift-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
}

.gift-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.gift-name {
  font-weight: 600;
  color: #fff;
  font-size: 16px;
}

.gift-code {
  font-family: monospace;
  font-size: 12px;
  color: #5170ff;
  background: rgba(81, 112, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.gift-details {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gift-details p {
  margin: 0;
}

.user-info {
  font-size: 14px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-info p {
  margin: 0;
}

.test-results {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  overflow-x: auto;
}

.test-results pre {
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  color: #4ade80;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(81, 112, 255, 0.2);
  border-top: 4px solid #5170ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.unauthorized {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 60px 50px;
  font-size: 24px;
  color: var(--text-secondary);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #5170ff;
  color: #fff;
}

.btn-primary:hover {
  background: #3d55dd;
  transform: translateY(-2px);
}

@media (max-width: 1023px) {
  .dev-wrapper {
    padding: 40px 30px;
  }

  .dev-header h1 {
    font-size: 40px;
  }
}

@media (max-width: 767px) {
  .dev-wrapper {
    padding: 30px 20px;
  }

  .dev-header h1 {
    font-size: 32px;
  }

  .dev-section {
    padding: 15px;
  }
}
</style>
