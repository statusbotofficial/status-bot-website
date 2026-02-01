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
          <p class="stat-value">{{ botStatus === 'offline' ? 'Offline' : uptime }}</p>
        </div>
        <div class="stat-card">
          <h3>Ping</h3>
          <p class="stat-value">{{ botStatus === 'offline' ? 'Offline' : ping + 'ms' }}</p>
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
            <p>No incidents recorded. Status Bot is running smoothly!</p>
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
                  <strong>Duration:</strong> {{ formatDuration(incident.startTime, Date.now()) }} (Ongoing)
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
let pollInterval = null
let durationInterval = null

onMounted(() => {
  document.title = 'Status | Status Bot'
})

const BACKEND_URL = 'https://backend-nwct.onrender.com'
const OFFLINE_THRESHOLD = 5 * 60 * 1000 // 5 minutes
const INCIDENT_EXPIRY_DAYS = 7

const loadIncidents = () => {
  try {
    const stored = localStorage.getItem('status_incidents')
    if (!stored) return []
    
    const data = JSON.parse(stored)
    const now = Date.now()
    const sevenDaysMs = INCIDENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    
    const validIncidents = data.filter(incident => {
      return (now - incident.startTime) < sevenDaysMs
    })
    
    if (validIncidents.length !== data.length) {
      saveIncidents(validIncidents)
    }
    
    return validIncidents
  } catch (error) {
    return []
  }
}

const saveIncidents = (incidentsToSave) => {
  try {
    localStorage.setItem('status_incidents', JSON.stringify(incidentsToSave))
  } catch (error) {
  }
}

const fetchBotStats = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/bot-stats`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    
    const data = await response.json()
    
    ping.value = data.ping || 0
    servers.value = data.servers || 0
    
    if (data.uptime) {
      const uptimeMs = data.uptime * 1000
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
    
    if (data.lastUpdated) {
      const lastUpdateTime = new Date(data.lastUpdated).getTime()
      const timeSinceUpdate = Date.now() - lastUpdateTime
      
      if (timeSinceUpdate > OFFLINE_THRESHOLD) {
        if (botStatus.value === 'online') {
          addIncident('Downtime Detected', Date.now())
        }
        botStatus.value = 'offline'
      } else {
        if (botStatus.value === 'offline') {
          resolveLastIncident()
        }
        botStatus.value = 'online'
      }
    }
  } catch (error) {
    botStatus.value = 'offline'
  }
}

const addIncident = (type, startTime) => {
  const existingIncident = incidents.value.find(inc => !inc.resolved)
  if (existingIncident) return // Don't add duplicate
  
  const newIncident = {
    id: Date.now(),
    type,
    startTime,
    endTime: null,
    resolved: false
  }
  
  incidents.value.unshift(newIncident)
  saveIncidents(incidents.value)
}

const resolveLastIncident = () => {
  const lastIncident = incidents.value.find(inc => !inc.resolved)
  if (lastIncident) {
    lastIncident.resolved = true
    lastIncident.endTime = Date.now()
    saveIncidents(incidents.value)
    // Force Vue to detect the change by reassigning the array
    incidents.value = [...incidents.value]
  }
}

const formatIncidentTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

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

onMounted(() => {
  incidents.value = loadIncidents()
  
  fetchBotStats()
  
  pollInterval = setInterval(() => {
    fetchBotStats()
  }, 300000) // Changed from 30s to 5 minutes
  
  // Update incident durations in real-time every second
  durationInterval = setInterval(() => {
    incidents.value = incidents.value
  }, 1000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (durationInterval) clearInterval(durationInterval)
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
  color: var(--text-primary);
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
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.1) 0%, rgba(80, 80, 80, 0.05) 100%);
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
  transform: translateY(-1px);
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
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
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
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.5), rgba(80, 80, 80, 0.35));
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(81, 112, 255, 0.2);
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
  color: var(--text-primary);
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
  color: var(--text-secondary);
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
  color: var(--text-secondary);
}

.incident-details {
  font-size: 13px;
  color: var(--text-secondary);
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
