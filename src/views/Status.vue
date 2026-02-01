<template>
  <div class="status-wrapper">
    <div class="status-container">
      <!-- Status Header -->
      <div class="status-header">
        <div class="header-icon">
          <i class="fas fa-heartbeat"></i>
        </div>
        <h1>System Status</h1>
        <p>Real-time monitoring of all Status Bot services and infrastructure</p>
      </div>

      <!-- Overall Status Banner -->
      <div class="overall-status" :class="overallStatusClass">
        <div class="status-icon">
          <i :class="overallStatusIcon"></i>
        </div>
        <div class="status-info">
          <h2>{{ overallStatusText }}</h2>
          <p>{{ overallStatusDescription }}</p>
        </div>
      </div>

      <!-- Service Status Grid -->
      <div class="services-grid">
        <!-- Discord Bot Status -->
        <div class="service-card" :class="botStatusClass">
          <div class="service-header">
            <div class="service-icon">
              <i class="fab fa-discord"></i>
            </div>
            <div class="service-info">
              <h3>Discord Bot</h3>
              <span class="service-status">{{ botStatusText }}</span>
            </div>
          </div>
          <div class="service-metrics">
            <div class="metric">
              <span class="metric-label">Uptime</span>
              <span class="metric-value">{{ botStatus === 'offline' ? 'Unknown' : uptime }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Response Time</span>
              <span class="metric-value">{{ botStatus === 'offline' ? 'Unknown' : ping + 'ms' }}</span>
            </div>
          </div>
        </div>

        <!-- API Status -->
        <div class="service-card" :class="apiStatusClass">
          <div class="service-header">
            <div class="service-icon">
              <i class="fas fa-server"></i>
            </div>
            <div class="service-info">
              <h3>Backend API</h3>
              <span class="service-status">{{ apiStatusText }}</span>
            </div>
          </div>
          <div class="service-metrics">
            <div class="metric">
              <span class="metric-label">Response Time</span>
              <span class="metric-value">{{ apiResponseTime }}ms</span>
            </div>
            <div class="metric">
              <span class="metric-label">Last Check</span>
              <span class="metric-value">{{ lastApiCheck }}</span>
            </div>
          </div>
        </div>

        <!-- Database Status -->
        <div class="service-card operational">
          <div class="service-header">
            <div class="service-icon">
              <i class="fas fa-database"></i>
            </div>
            <div class="service-info">
              <h3>Database</h3>
              <span class="service-status">Operational</span>
            </div>
          </div>
          <div class="service-metrics">
            <div class="metric">
              <span class="metric-label">Status</span>
              <span class="metric-value">Healthy</span>
            </div>
            <div class="metric">
              <span class="metric-label">Performance</span>
              <span class="metric-value">Optimal</span>
            </div>
          </div>
        </div>

        <!-- Dashboard Status -->
        <div class="service-card operational">
          <div class="service-header">
            <div class="service-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="service-info">
              <h3>Web Dashboard</h3>
              <span class="service-status">Operational</span>
            </div>
          </div>
          <div class="service-metrics">
            <div class="metric">
              <span class="metric-label">Status</span>
              <span class="metric-value">Healthy</span>
            </div>
            <div class="metric">
              <span class="metric-label">Load Time</span>
              <span class="metric-value">< 2s</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Incidents Section -->
      <div class="incidents-section">
        <div class="section-header">
          <h2>Recent Incidents</h2>
          <span class="incident-count">{{ incidents.length }} incidents in the last 7 days</span>
        </div>
        
        <div class="incidents-list">
          <div v-if="incidents.length === 0" class="no-incidents">
            <div class="no-incidents-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3>All Systems Operational</h3>
            <p>No incidents reported in the past 7 days. Status Bot is running smoothly!</p>
          </div>
          
          <div v-else class="incidents-items">
            <div v-for="incident in incidents" :key="incident.id" class="incident-item" :class="{ resolved: incident.resolved }">
              <div class="incident-status-indicator">
                <i :class="incident.resolved ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
              </div>
              <div class="incident-content">
                <div class="incident-header">
                  <h4>{{ incident.type }}</h4>
                  <span class="incident-badge" :class="incident.resolved ? 'resolved' : 'active'">
                    {{ incident.resolved ? 'Resolved' : 'Active' }}
                  </span>
                </div>
                <div class="incident-details">
                  <div class="incident-time">
                    <i class="fas fa-clock"></i>
                    Started: {{ formatIncidentTime(incident.startTime) }}
                  </div>
                  <div class="incident-duration">
                    <i class="fas fa-stopwatch"></i>
                    Duration: {{ incident.resolved ? formatDuration(incident.startTime, incident.endTime) : formatDuration(incident.startTime, Date.now()) + ' (Ongoing)' }}
                  </div>
                </div>
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
const uptime = ref('Unknown')
const ping = ref(0)
const servers = ref(0)
const incidents = ref([])
const apiStatus = ref('online')
const apiResponseTime = ref(0)
const lastApiCheck = ref('Never')

let pollInterval = null
let durationInterval = null

onMounted(() => {
  document.title = 'System Status | Status Bot'
  incidents.value = loadIncidents()
  fetchBotStats()
  checkApiStatus()
  
  pollInterval = setInterval(() => {
    fetchBotStats()
    checkApiStatus()
  }, 300000) // 5 minutes
  
  durationInterval = setInterval(() => {
    incidents.value = incidents.value
    updateLastApiCheck()
  }, 1000)
})

const BACKEND_URL = 'https://backend-nwct.onrender.com'
const OFFLINE_THRESHOLD = 5 * 60 * 1000 // 5 minutes
const INCIDENT_EXPIRY_DAYS = 7

// Computed properties for status display
const overallStatusClass = computed(() => {
  if (botStatus.value === 'offline' || apiStatus.value === 'offline') return 'degraded'
  return 'operational'
})

const overallStatusIcon = computed(() => {
  if (botStatus.value === 'offline' || apiStatus.value === 'offline') return 'fas fa-exclamation-triangle'
  return 'fas fa-check-circle'
})

const overallStatusText = computed(() => {
  if (botStatus.value === 'offline' && apiStatus.value === 'offline') return 'Major Outage'
  if (botStatus.value === 'offline' || apiStatus.value === 'offline') return 'Degraded Performance'
  return 'All Systems Operational'
})

const overallStatusDescription = computed(() => {
  if (botStatus.value === 'offline' && apiStatus.value === 'offline') return 'Multiple services are experiencing issues'
  if (botStatus.value === 'offline') return 'Discord bot is currently offline'
  if (apiStatus.value === 'offline') return 'Backend API is experiencing issues'
  return 'All services are running normally'
})

const botStatusClass = computed(() => botStatus.value === 'online' ? 'operational' : 'degraded')
const botStatusText = computed(() => botStatus.value === 'online' ? 'Operational' : 'Degraded')

const apiStatusClass = computed(() => apiStatus.value === 'online' ? 'operational' : 'degraded')
const apiStatusText = computed(() => apiStatus.value === 'online' ? 'Operational' : 'Degraded')

// API Status checking
const checkApiStatus = async () => {
  const startTime = Date.now()
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`)
    const responseTime = Date.now() - startTime
    
    if (!response.ok) throw new Error('API returned error status')
    
    apiStatus.value = 'online'
    apiResponseTime.value = responseTime
    lastApiCheck.value = 'Just now'
  } catch (error) {
    apiStatus.value = 'offline'
    apiResponseTime.value = 0
    lastApiCheck.value = 'Failed'
  }
}

const updateLastApiCheck = () => {
  if (lastApiCheck.value !== 'Just now' && lastApiCheck.value !== 'Failed' && lastApiCheck.value !== 'Never') {
    // Update relative time for last check
    const now = new Date()
    const minutes = Math.floor((now - new Date(lastApiCheck.value)) / 60000)
    if (minutes > 0) {
      lastApiCheck.value = `${minutes}m ago`
    }
  }
}

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
    } else {
      uptime.value = 'Unknown'
    }
    
    if (data.lastUpdated) {
      const lastUpdateTime = new Date(data.lastUpdated).getTime()
      const timeSinceUpdate = Date.now() - lastUpdateTime
      
      if (timeSinceUpdate > OFFLINE_THRESHOLD) {
        if (botStatus.value === 'online') {
          addIncident('Discord Bot Offline', Date.now())
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
    uptime.value = 'Unknown'
    if (botStatus.value === 'online') {
      addIncident('Connection Lost', Date.now())
    }
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
  checkApiStatus()
  
  pollInterval = setInterval(() => {
    fetchBotStats()
    checkApiStatus()
  }, 300000) // 5 minutes
  
  durationInterval = setInterval(() => {
    incidents.value = incidents.value
    updateLastApiCheck()
  }, 1000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (durationInterval) clearInterval(durationInterval)
})
</script>

<style scoped>
.status-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  padding: 40px 20px;
}

.status-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Header Styles */
.status-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.status-header h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-header p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 600px;
}

/* Overall Status Banner */
.overall-status {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 30px;
  border-radius: 20px;
  border: 2px solid;
  backdrop-filter: blur(10px);
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
}

.overall-status.operational {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%);
  border-color: #22c55e;
  box-shadow: 0 10px 40px rgba(34, 197, 94, 0.2);
}

.overall-status.degraded {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
  border-color: #fb923c;
  box-shadow: 0 10px 40px rgba(251, 146, 60, 0.2);
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.overall-status.operational .status-icon {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.overall-status.degraded .status-icon {
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
}

.status-info h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.status-info p {
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
}

.service-card.operational {
  border-color: rgba(34, 197, 94, 0.3);
}

.service-card.degraded {
  border-color: rgba(251, 146, 60, 0.3);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.service-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.service-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.service-card.operational .service-icon {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.service-card.degraded .service-icon {
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
}

.service-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.service-status {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.service-card.operational .service-status {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.service-card.degraded .service-status {
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

.service-metrics {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

/* Incidents Section */
.incidents-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.incident-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-incidents {
  text-align: center;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
}

.no-incidents-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
}

.no-incidents h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.no-incidents p {
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.incidents-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.incident-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(251, 146, 60, 0.3);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.incident-item.resolved {
  border-color: rgba(34, 197, 94, 0.3);
}

.incident-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.incident-status-indicator {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.incident-item:not(.resolved) .incident-status-indicator {
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
}

.incident-item.resolved .incident-status-indicator {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.incident-content {
  flex: 1;
  min-width: 0;
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
}

.incident-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.incident-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.incident-badge.active {
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

.incident-badge.resolved {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.incident-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.incident-time,
.incident-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.incident-time i,
.incident-duration i {
  width: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .status-wrapper {
    padding: 30px 15px;
  }

  .status-header h1 {
    font-size: 36px;
  }

  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .overall-status {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .service-metrics {
    flex-direction: column;
    gap: 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .incident-item {
    flex-direction: column;
    gap: 15px;
  }

  .incident-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .status-wrapper {
    padding: 20px 10px;
  }

  .status-header h1 {
    font-size: 28px;
  }

  .status-header p {
    font-size: 16px;
  }

  .overall-status {
    padding: 20px;
  }

  .service-card {
    padding: 20px;
  }

  .no-incidents {
    padding: 40px 20px;
  }
}
</style>
