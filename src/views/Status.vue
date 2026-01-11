<template>
  <div class="status-wrapper">
    <div class="status-container">
      <!-- Status Header -->
      <div class="status-header">
        <h1>System Status</h1>
        <p>We strive to keep all of our systems online 24/7 just for you!</p>
      </div>

      <!-- Status Indicator -->
      <div class="status-badge" :class="botStatus">
        <span class="status-dot"></span>
        <span class="status-text">{{ botStatus === 'online' ? 'Online' : 'Offline' }}</span>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Uptime</h3>
          <p class="stat-value">{{ uptime }}</p>
        </div>
        <div class="stat-card">
          <h3>Ping</h3>
          <p class="stat-value">{{ ping }}ms</p>
        </div>
        <div class="stat-card">
          <h3>Servers</h3>
          <p class="stat-value">{{ servers }}</p>
        </div>
      </div>

      <!-- Incidents Section -->
      <div class="incidents-section">
        <h2>Incidents</h2>
        <div class="incidents-list">
          <div v-if="incidents.length === 0" class="no-incidents">
            <p>✅ No incidents recorded. Status Bot is running smoothly!</p>
          </div>
          <div v-else class="incidents-items">
            <div v-for="incident in incidents" :key="incident.id" class="incident-item">
              <div class="incident-header">
                <span class="incident-type">{{ incident.type }}</span>
                <span class="incident-time">{{ formatIncidentTime(incident.startTime) }}</span>
              </div>
              <div class="incident-details">
                <p v-if="incident.resolved">
                  <strong>Duration:</strong> {{ formatDuration(incident.startTime, incident.endTime) }}
                </p>
                <p v-else>
                  <strong>Duration:</strong> {{ formatDuration(incident.startTime, Date.now()) }} (ongoing)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const botStatus = ref('online')
const uptime = ref('Calculating...')
const ping = ref(0)
const servers = ref(0)
const incidents = ref([])
const botStartTime = ref(null)
let pollInterval = null

const BACKEND_URL = 'https://status-bot-backend.onrender.com'
const OFFLINE_THRESHOLD = 5 * 60 * 1000 // 5 minutes

// Fetch bot stats from backend
const fetchBotStats = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/bot-stats`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    
    const data = await response.json()
    
    // Update basic stats
    ping.value = data.ping || 0
    servers.value = data.servers || 0
    
    // Check if bot is online or offline
    if (data.lastUpdated) {
      const lastUpdateTime = new Date(data.lastUpdated).getTime()
      const timeSinceUpdate = Date.now() - lastUpdateTime
      
      if (timeSinceUpdate > OFFLINE_THRESHOLD) {
        // Bot is offline
        if (botStatus.value === 'online') {
          // Just went offline - add incident
          addIncident('Downtime Detected', Date.now())
        }
        botStatus.value = 'offline'
      } else {
        // Bot is online
        if (botStatus.value === 'offline') {
          // Just came back online - resolve last incident
          resolveLastIncident()
        }
        botStatus.value = 'online'
      }
      
      // Store start time if this is first update
      if (!botStartTime.value) {
        botStartTime.value = Date.parse(data.lastUpdated) - (data.uptime || 0)
      }
    }
  } catch (error) {
    console.error('Error fetching bot stats:', error)
    botStatus.value = 'offline'
  }
}

// Add incident to list
const addIncident = (type, startTime) => {
  const existingIncident = incidents.value.find(inc => !inc.resolved)
  if (existingIncident) return // Don't add duplicate
  
  incidents.value.unshift({
    id: Date.now(),
    type,
    startTime,
    endTime: null,
    resolved: false
  })
}

// Resolve last incident
const resolveLastIncident = () => {
  const lastIncident = incidents.value.find(inc => !inc.resolved)
  if (lastIncident) {
    lastIncident.resolved = true
    lastIncident.endTime = Date.now()
  }
}

// Format incident time
const formatIncidentTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// Format duration
const formatDuration = (startTime, endTime) => {
  const duration = endTime - startTime
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((duration % (1000 * 60)) / 1000)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

// Calculate uptime display
const calculateUptime = () => {
  if (!botStartTime.value) {
    uptime.value = 'Calculating...'
    return
  }
  
  const uptimeMs = Date.now() - botStartTime.value
  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    uptime.value = `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    uptime.value = `${hours}h ${minutes}m`
  } else {
    uptime.value = `${minutes}m`
  }
}

onMounted(() => {
  // Initial fetch
  fetchBotStats()
  calculateUptime()
  
  // Poll every 30 seconds
  pollInterval = setInterval(() => {
    fetchBotStats()
    calculateUptime()
  }, 30000)
  
  // Update uptime calculation every minute
  setInterval(() => {
    calculateUptime()
  }, 60000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style scoped>
.status-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.status-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.status-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.status-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  color: #fff;
}

.status-header p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.status-indicator-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1) 0%, rgba(81, 112, 255, 0.05) 100%);
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
}

.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  padding: 20px 40px;
  border-radius: 16px;
  border: 2px solid var(--primary-color);
  width: 100%;
  max-width: 280px;
}

.status-badge.online {
  color: #4ade80;
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
}

.status-badge.offline {
  color: #ff4444;
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
}

.status-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-badge.online .status-dot {
  background: #4ade80;
}

.status-badge.offline .status-dot {
  background: #ff4444;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  display: none;
}

.status-badge.online .status-text {
  display: inline;
}

.status-badge.offline .status-text {
  display: inline;
}

.status-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 900px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  text-align: center;
}

.stat-card:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(81, 112, 255, 0.3);
}

.stat-icon {
  font-size: 36px;
}

.stat-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  color: #fff;
}

.incidents-section {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.incidents-section h2 {
  font-size: 36px;
  font-weight: 900;
  margin: 0;
  text-align: center;
}

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-incidents {
  background: rgba(100, 100, 120, 0.3);
  border: 1px solid rgba(150, 150, 180, 0.4);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}

.no-incidents p {
  font-size: 16px;
  color: #aaa;
  margin: 0;
  font-weight: 500;
}

.incidents-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.incident-item {
  background: rgba(100, 100, 120, 0.25);
  border: 1px solid rgba(150, 150, 180, 0.4);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
}

.incident-item:hover {
  background: rgba(100, 100, 120, 0.35);
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.incident-type {
  background: rgba(255, 68, 68, 0.3);
  color: #ff8888;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.incident-time {
  font-size: 12px;
  color: #999;
}

.incident-details {
  font-size: 13px;
  color: #aaa;
}

.incident-details p {
  margin: 0;
}

@media (max-width: 1024px) {
  .status-wrapper {
    padding: 50px 30px;
  }

  .status-header h1 {
    font-size: 44px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
  }

  .stat-card {
    padding: 25px;
  }

  .stat-value {
    font-size: 28px;
  }

  .incidents-section h2 {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .status-wrapper {
    padding: 40px 20px;
  }

  .status-header h1 {
    font-size: 32px;
  }

  .status-header p {
    font-size: 14px;
  }

  .status-indicator-section {
    max-width: 100%;
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    font-size: 32px;
  }

  .stat-card h3 {
    font-size: 14px;
  }

  .stat-value {
    font-size: 24px;
  }

  .incidents-section h2 {
    font-size: 24px;
  }

  .incident-item {
    padding: 15px;
  }

  .incident-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .status-wrapper {
    padding: 30px 15px;
  }

  .status-header h1 {
    font-size: 24px;
  }

  .status-header p {
    font-size: 13px;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 15px;
    gap: 10px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-card h3 {
    font-size: 12px;
  }

  .stat-value {
    font-size: 20px;
  }

  .incidents-section h2 {
    font-size: 20px;
  }

  .incident-item {
    padding: 12px;
  }

  .incident-time {
    font-size: 12px;
  }

  .incident-details {
    font-size: 13px;
  }
}
</style>
