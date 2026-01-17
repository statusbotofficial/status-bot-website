<template>
  <div v-if="isAuthorized" class="dev-wrapper">
    <div class="dev-container">
      <div class="dev-header">
        <h1>User Management</h1>
        <p>Send trials and notifications to users</p>
        <hr>
      </div>

      <div class="dev-panels">
        <!-- Left Panel: Trial Sending -->
        <div class="dev-sub-panel">
          <h2>Who to send trial to</h2>
          <div class="input-group">
            <label>User ID</label>
            <input 
              v-model="trialUserId" 
              type="text" 
              placeholder="e.g. 1362553254117904496"
              class="dev-input"
            >
          </div>
          <div class="checkbox-group">
            <input v-model="sendTrialToAll" type="checkbox" id="trialToAll">
            <label for="trialToAll">Send to all users</label>
          </div>

          <h2 style="margin-top: 30px;">How long should it last</h2>
          <div class="input-group">
            <label>Dashboard Duration (days)</label>
            <input 
              v-model.number="dashboardDuration" 
              type="number" 
              placeholder="e.g. 7 days - how long the gift appears on dashboard"
              min="1"
              class="dev-input"
            >
            <small style="color: #999; margin-top: 4px;">How long the gift will be visible on the dashboard</small>
          </div>

          <div class="input-group">
            <label>Premium Trial Duration (days)</label>
            <input 
              v-model.number="premiumTrialDuration" 
              type="number" 
              placeholder="e.g. 7 days - how long the premium access lasts"
              min="1"
              class="dev-input"
            >
            <small style="color: #999; margin-top: 4px;">How long the user will have premium access</small>
          </div>

          <button @click="sendTrial" :disabled="sendingTrial" class="dev-btn trial-btn">
            {{ sendingTrial ? 'Sending...' : 'Send Trial' }}
          </button>
        </div>

        <!-- Right Panel: Notification Sending -->
        <div class="dev-sub-panel">
          <h2>Send Site Notification</h2>
          <div class="type-buttons">
            <button 
              v-for="type in ['Update', 'Trial']"
              :key="type"
              @click="selectedNotificationType = type"
              :class="{ active: selectedNotificationType === type }"
              class="type-btn"
            >
              {{ type }}
            </button>
          </div>

          <h2 style="margin-top: 20px;">Who to send notification to</h2>
          <div class="input-group">
            <label>User ID</label>
            <input 
              v-model="notificationUserId" 
              type="text" 
              placeholder="e.g. 1362553254117904496"
              class="dev-input"
            >
          </div>
          <div class="checkbox-group">
            <input v-model="sendNotificationToAll" type="checkbox" id="notifToAll">
            <label for="notifToAll">Send to all users</label>
          </div>

          <h2 style="margin-top: 20px;">Notification details</h2>
          <div class="input-group">
            <label>Title</label>
            <input 
              v-model="notificationTitle" 
              type="text" 
              placeholder="Notification title..."
              class="dev-input"
            >
          </div>

          <div class="input-group">
            <label>Message</label>
            <textarea 
              v-model="notificationMessage" 
              placeholder="Send as a custom message..."
              class="dev-input dev-textarea"
            ></textarea>
          </div>

          <button @click="sendNotification" :disabled="sendingNotification" class="dev-btn notify-btn">
            {{ sendingNotification ? 'Sending...' : 'Send Notification' }}
          </button>
        </div>
      </div>

      <!-- Give Premium Section -->
      <section class="dev-section">
        <div class="give-premium-panel">
          <h2 style="margin-bottom: 20px;">Grant Premium to User</h2>
          <div class="form-group">
            <label>User ID</label>
            <input 
              v-model="giveUserIdInput" 
              type="text" 
              placeholder="User ID"
              class="dev-input"
            >
          </div>

          <div class="form-group">
            <label>Duration (days)</label>
            <input 
              v-model.number="givePremiumDuration" 
              type="number" 
              placeholder='Days (type "p" or 0 for permanent)'
              min="1"
              @input="handleDurationInput"
              class="dev-input"
            >
            <small style="color: #999; margin-top: 4px;">Type "p" for permanent, or enter number of days</small>
          </div>

          <button @click="grantPremium" :disabled="grantingPremium" class="dev-btn grant-btn">
            {{ grantingPremium ? 'Granting...' : 'Grant Premium' }}
          </button>
        </div>

        <div class="remove-premium-panel" style="margin-top: 20px;">
          <h2 style="margin-bottom: 20px;">Remove Premium from User</h2>
          <div class="form-group">
            <label>User ID</label>
            <input 
              v-model="removeUserIdInput" 
              type="text" 
              placeholder="User ID"
              class="dev-input"
            >
          </div>

          <button @click="removePremium" :disabled="removingPremium" class="dev-btn remove-btn">
            {{ removingPremium ? 'Removing...' : 'Remove Premium' }}
          </button>
        </div>
      </section>

      <!-- Premium Users Section -->
      <section class="dev-section">
        <h2>Premium Users</h2>
        <div class="premium-panel">
          <div v-if="premiumUsers.length > 0" class="premium-list">
            <div class="premium-header">
              <div class="col-user">User</div>
              <div class="col-type">Type</div>
              <div class="col-expiry">Expiry</div>
            </div>
            <div v-for="user in premiumUsers" :key="user.userId" class="premium-entry">
              <div class="col-user">{{ user.userId }}</div>
              <div class="col-type">
                <span :class="['type-badge', 'type-' + user.source]">{{ user.sourceLabel }}</span>
              </div>
              <div class="col-expiry">{{ user.expiryText }}</div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No premium users found</p>
          </div>
        </div>
      </section>

      <!-- Billing Section -->
      <section class="dev-section">
        <h2>Billing History</h2>
        <div class="billing-panel">
          <div v-if="billingHistory.length > 0" class="billing-list">
            <div v-for="entry in billingHistory" :key="entry.id" class="billing-entry">
              <span>{{ entry.description }}</span>
              <span>${{ entry.amount }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No billing history yet</p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="unauthorized">
    <div>
      <h2>Access Denied</h2>
      <p>You do not have permission to access this page.</p>
      <p v-if="authStore.user">Your User ID: {{ authStore.user.id }}</p>
      <p v-else>Please log in to continue.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const AUTHORIZED_USER_ID = '1362553254117904496'
const BACKEND_URL = 'https://status-bot-backend.onrender.com'
const SECRET_KEY = 'status-bot-stats-secret-key'

const trialUserId = ref('')
const dashboardDuration = ref(7)
const premiumTrialDuration = ref(7)
const sendTrialToAll = ref(false)
const sendingTrial = ref(false)

const notificationUserId = ref('')
const selectedNotificationType = ref('Update')
const notificationTitle = ref('')
const notificationMessage = ref('')
const sendNotificationToAll = ref(false)
const sendingNotification = ref(false)

const premiumUsers = ref([])
const giveUserIdInput = ref('')
const givePremiumDuration = ref(30)
const grantingPremium = ref(false)
const removeUserIdInput = ref('')
const removingPremium = ref(false)

const billingHistory = ref([])

const isAuthorized = computed(() => {
  return authStore.user?.id === AUTHORIZED_USER_ID
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const sendTrial = async () => {
  const userId = trialUserId.value.trim()
  
  if (!sendTrialToAll.value && !userId) {
    alert('Please enter a User ID or check "Send to all users"')
    return
  }

  if (dashboardDuration.value < 1) {
    alert('Dashboard duration must be at least 1 day')
    return
  }

  if (premiumTrialDuration.value < 1) {
    alert('Premium trial duration must be at least 1 day')
    return
  }

  sendingTrial.value = true

  try {
    const response = await fetch(`${BACKEND_URL}/api/trials/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: authStore.user.id,
        dashboardDurationDays: dashboardDuration.value,
        premiumTrialDurationDays: premiumTrialDuration.value,
        targetUsers: sendTrialToAll.value ? [] : [userId],
        sendToAll: sendTrialToAll.value
      })
    })

    const data = await response.json()
    if (response.ok) {
      alert('✓ Trial sent successfully')
      trialUserId.value = ''
      dashboardDuration.value = 7
      premiumTrialDuration.value = 7
      sendTrialToAll.value = false
    } else {
      alert(`❌ Error: ${data.message || 'Failed to send trial'}`)
    }
  } catch (err) {
    alert(`❌ Error: ${err.message}`)
  } finally {
    sendingTrial.value = false
  }
}

const sendNotification = async () => {
  const title = notificationTitle.value.trim()
  const message = notificationMessage.value.trim()
  const userId = notificationUserId.value.trim()

  if (!title || !message) {
    alert('Please fill in both title and message')
    return
  }

  if (!sendNotificationToAll.value && !userId) {
    alert('Please enter a User ID or check "Send to all users"')
    return
  }

  sendingNotification.value = true

  try {
    const response = await fetch(`${BACKEND_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        message,
        type: selectedNotificationType.value,
        targetUsers: sendNotificationToAll.value ? [] : [userId],
        sendToAll: sendNotificationToAll.value
      })
    })

    const data = await response.json()
    if (response.ok) {
      alert('✓ Notification sent successfully')
      notificationUserId.value = ''
      notificationTitle.value = ''
      notificationMessage.value = ''
      sendNotificationToAll.value = false
    } else {
      alert(`❌ Error: ${data.message || 'Failed to send notification'}`)
    }
  } catch (err) {
    alert(`❌ Error: ${err.message}`)
  } finally {
    sendingNotification.value = false
  }
}

const fetchPremiumUsers = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/premium-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    
    if (data.premiumCache) {
      const users = []
      for (const [userId, premiumData] of Object.entries(data.premiumCache)) {
        if (premiumData.active) {
          const expiryTimestamp = premiumData.expiresAt ? premiumData.expiresAt * 1000 : null
          const isExpired = expiryTimestamp && expiryTimestamp < Date.now()
          
          let sourceLabel = premiumData.reason || 'Unknown'
          let source = premiumData.source || 'unknown'
          
          if (!premiumData.reason || premiumData.reason === 'Unknown') {
            if (source === 'booster' || source === 'server_booster') sourceLabel = 'Server Booster'
            else if (source === 'dashboard') sourceLabel = 'Dashboard'
            else if (source === 'trial') sourceLabel = 'Trial'
            else if (source === 'gift') sourceLabel = 'Gifted'
            else if (source === 'patreon') sourceLabel = 'Patreon'
            else if (source) sourceLabel = source.charAt(0).toUpperCase() + source.slice(1)
            else sourceLabel = 'Unknown'
          }
          
          let expiryText = 'Permanent'
          if (expiryTimestamp) {
            const expiryDate = new Date(expiryTimestamp)
            if (isExpired) {
              expiryText = 'Expired'
            } else {
              const daysLeft = Math.ceil((expiryTimestamp - Date.now()) / (1000 * 60 * 60 * 24))
              expiryText = `${daysLeft}d (${expiryDate.toLocaleDateString()})`
            }
          }
          
          users.push({
            userId,
            source,
            sourceLabel,
            expiryText,
            isExpired
          })
        }
      }
      premiumUsers.value = users.sort((a, b) => a.userId - b.userId)
    }
  } catch (err) {
    console.error('Failed to fetch premium users:', err)
  }
}

const grantPremium = async () => {
  const userId = giveUserIdInput.value.trim()
  
  if (!userId) {
    alert('Please enter a User ID')
    return
  }
  
  const duration = givePremiumDuration.value || 30
  if (duration < 0) {
    alert('Duration cannot be negative')
    return
  }
  
  grantingPremium.value = true
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/premium/grant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        durationDays: duration
      })
    })
    
    const data = await response.json()
    if (response.ok) {
      const durationText = duration === 0 ? 'permanently' : `for ${duration} days`
      alert(`✓ Premium granted ${durationText}`)
      giveUserIdInput.value = ''
      givePremiumDuration.value = 30
      setTimeout(() => fetchPremiumUsers(), 500)
    } else {
      alert(`❌ Error: ${data.message || 'Failed to grant premium'}`)
    }
  } catch (err) {
    alert(`❌ Error: ${err.message}`)
  } finally {
    grantingPremium.value = false
  }
}

const handleDurationInput = (event) => {
  const value = event.target.value.toLowerCase().trim()
  if (value === 'p') {
    givePremiumDuration.value = 0
    event.target.value = ''
  }
}

const removePremium = async () => {
  const userId = removeUserIdInput.value.trim()
  
  if (!userId) {
    alert('Please enter a User ID')
    return
  }
  
  if (!confirm(`Are you sure you want to remove premium from user ${userId}?`)) {
    return
  }
  
  removingPremium.value = true
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/premium/remove`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId
      })
    })
    
    const data = await response.json()
    if (response.ok) {
      alert(`✓ Premium removed from user ${userId}`)
      removeUserIdInput.value = ''
      setTimeout(() => fetchPremiumUsers(), 500)
    } else {
      alert(`❌ Error: ${data.message || 'Failed to remove premium'}`)
    }
  } catch (err) {
    alert(`❌ Error: ${err.message}`)
  } finally {
    removingPremium.value = false
  }
}

onMounted(async () => {
  document.title = 'Developer Tools | Status Bot'
  if (isAuthorized.value) {
    await fetchPremiumUsers()
  }
})
</script>

<style scoped>
/* Layout */
.dev-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.dev-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header section */
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

.dev-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 60px;
}

.dev-sub-panel {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 30px;
}

.dev-sub-panel h2 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  margin-top: 0;
}

/* Form inputs */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.input-group label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dev-input {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.dev-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(81, 112, 255, 0.3);
}

.dev-textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.checkbox-group {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.checkbox-group input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-group label {
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #fff;
}

.type-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.type-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  background: rgba(81, 112, 255, 0.2);
  border-color: #5170ff;
}

.type-btn:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: rgba(81, 112, 255, 0.4);
}

.dev-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  color: white;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.trial-btn {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.8), rgba(74, 222, 128, 0.5));
  border: 2px solid #4ade80;
}

.trial-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(74, 222, 128, 1), rgba(74, 222, 128, 0.8));
  box-shadow: 0 8px 20px rgba(74, 222, 128, 0.3);
}

.notify-btn {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.8), rgba(220, 53, 69, 0.5));
  border: 2px solid #dc3545;
}

.notify-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(220, 53, 69, 1), rgba(220, 53, 69, 0.8));
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
}

.dev-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dev-section {
  margin-bottom: 60px;
}

.dev-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
}

.billing-panel,
.gifts-container {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
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
}

.gift-entry:hover {
  background: rgba(81, 112, 255, 0.08);
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
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.claim-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.3);
}

.claim-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.claim-btn.claimed {
  background: #444;
  color: #bbb;
  border: none;
  cursor: default;
}

.billing-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.billing-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  font-size: 14px;
  transition: background 0.2s ease;
}

.billing-entry:hover {
  background: rgba(255, 255, 255, 0.06);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
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

.unauthorized {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 60px 50px;
  color: var(--text-secondary);
}

.unauthorized div {
  text-align: center;
}

.unauthorized h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.unauthorized p {
  margin: 10px 0;
  font-size: 14px;
}

@media (max-width: 1023px) {
  .dev-wrapper {
    padding: 40px 30px;
  }

  .dev-panels {
    grid-template-columns: 1fr;
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

  .dev-sub-panel {
    padding: 20px;
  }

  .gift-entry {
    flex-direction: column;
  }

  .claim-btn {
    width: 100%;
  }
}

.premium-panel,
.give-premium-panel {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
}

.premium-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.premium-header {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 15px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(81, 112, 255, 0.2);
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  border-radius: 8px 8px 0 0;
}

.premium-entry {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 15px;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
  align-items: center;
  font-size: 14px;
}

.premium-entry:last-child {
  border-bottom: none;
}

.col-user {
  color: #fff;
  font-weight: 500;
}

.col-type {
  display: flex;
  align-items: center;
}

.col-expiry {
  color: var(--text-secondary);
  font-family: monospace;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.type-booster {
  background: rgba(236, 72, 153, 0.2);
  color: #ec4899;
}

.type-server_booster {
  background: rgba(236, 72, 153, 0.2);
  color: #ec4899;
}

.type-dashboard {
  background: rgba(81, 112, 255, 0.2);
  color: #5170ff;
}

.type-trial {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.type-gift {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
}

.type-patreon {
  background: rgba(255, 89, 116, 0.2);
  color: #ff5974;
}

.give-premium-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.grant-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 2px solid #5170ff;
}

.grant-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.3);
}

.remove-btn {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.5));
  border: 2px solid #ef4444;
}

.remove-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(239, 68, 68, 0.8));
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

@media (max-width: 1023px) {
  .premium-header,
  .premium-entry {
    grid-template-columns: 1fr;
  }
}
</style>
