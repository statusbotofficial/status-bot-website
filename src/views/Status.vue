<template>
  <div class="status-wrapper">
    <div class="container">
      <!-- Status Header -->
      <div class="status-header">
        <h1 style="background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(81, 112, 255, 0.15) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">System Status</h1>
        
        <!-- Status Color Legend -->
        <div class="status-legend">
          <div class="legend-item">
            <span class="legend-dot operational"></span>
            <span>Operational</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot outage"></span>
            <span>Outage</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot offline"></span>
            <span>Offline</span>
          </div>
        </div>
      </div>

      <!-- Overall Status Banner -->
      <div class="overall-status" :class="overallStatusClass">
        <div class="status-indicator">
          <i :class="overallStatusIcon"></i>
          <span class="status-text">{{ overallStatusText }}</span>
        </div>
        <div class="status-description">
          {{ overallStatusDescription }}
        </div>
      </div>

      <!-- Service Status Cards -->
      <div class="services-grid">
        <!-- Discord Bot Status -->
        <div class="service-card" :class="botStatusClass">
          <div class="service-header">
            <div class="service-icon">
              <i class="fab fa-discord"></i>
            </div>
            <div class="service-info">
              <h3>Discord Bot</h3>
              <span class="service-status" :class="botStatusClass">{{ botStatusText }}</span>
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
              <span class="service-status" :class="apiStatusClass">{{ apiStatusText }}</span>
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

        <!-- Dashboard Status -->
        <div class="service-card operational">
          <div class="service-header">
            <div class="service-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="service-info">
              <h3>Web Dashboard</h3>
              <span class="service-status operational">Operational</span>
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
            <div class="no-incidents-content">
              <p class="main-message">No incidents reported in the past 7 days. Status Bot is running smoothly!</p>
            </div>
          </div>
          
          <div v-else class="incidents-items">
            <div v-for="incident in incidents" :key="incident.id" class="incident-item" :class="{ resolved: incident.resolved }">
              <div class="incident-status-badge">
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
  if (botStatus.value === 'offline' || apiStatus.value === 'offline') return 'offline'
  if (botStatus.value === 'outage' || apiStatus.value === 'outage') return 'degraded'
  return 'operational'
})

const overallStatusIcon = computed(() => {
  if (botStatus.value === 'offline' || apiStatus.value === 'offline') return 'fas fa-times-circle'
  if (botStatus.value === 'outage' || apiStatus.value === 'outage') return 'fas fa-exclamation-triangle'
  return 'fas fa-check-circle'
})

const overallStatusText = computed(() => {
  if (botStatus.value === 'offline' && apiStatus.value === 'offline') return 'Major Outage'
  if (botStatus.value === 'offline' || apiStatus.value === 'offline') return 'Service Offline'
  if (botStatus.value === 'outage' || apiStatus.value === 'outage') return 'Service Outage'
  return 'All Systems Operational'
})

const overallStatusDescription = computed(() => {
  if (botStatus.value === 'offline' && apiStatus.value === 'offline') return 'Multiple services are currently offline'
  if (botStatus.value === 'offline') return 'Discord bot is currently offline'
  if (apiStatus.value === 'offline') return 'Backend API is currently offline'
  if (botStatus.value === 'outage') return 'Discord bot is experiencing high latency (>500ms)'
  if (apiStatus.value === 'outage') return 'Backend API is experiencing high latency (>500ms)'
  return 'All services are running normally'
})

const botStatusClass = computed(() => {
  if (botStatus.value === 'offline') return 'offline'
  if (botStatus.value === 'outage') return 'degraded'
  return 'operational'
})

const botStatusText = computed(() => {
  if (botStatus.value === 'offline') return 'Offline'
  if (botStatus.value === 'outage') return 'Outage'
  return 'Operational'
})

const apiStatusClass = computed(() => {
  if (apiStatus.value === 'offline') return 'offline'
  if (apiStatus.value === 'outage') return 'degraded'
  return 'operational'
})

const apiStatusText = computed(() => {
  if (apiStatus.value === 'offline') return 'Offline'
  if (apiStatus.value === 'outage') return 'Outage'
  return 'Operational'
})

// API Status checking
const checkApiStatus = async () => {
  const startTime = Date.now()
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`)
    const responseTime = Date.now() - startTime
    
    if (!response.ok) throw new Error('API returned error status')
    
    // Set status based on ping thresholds
    if (responseTime > 500) {
      apiStatus.value = 'outage'
    } else {
      apiStatus.value = 'online'
    }
    
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
    
    // Set bot status based on ping thresholds
    if (data.ping && data.ping > 500) {
      botStatus.value = 'outage'
    } else if (data.ping && data.ping >= 0) {
      botStatus.value = 'online'
    }
    
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
        if (botStatus.value !== 'offline') {
          addIncident('Discord Bot Offline', Date.now())
        }
        botStatus.value = 'offline'
      } else {
        if (botStatus.value === 'offline') {
          resolveLastIncident()
        }
        // Don't override the ping-based status if we're not offline
        if (botStatus.value === 'offline') {
          botStatus.value = data.ping > 500 ? 'outage' : 'online'
        }
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
  padding: 80px 0;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  position: relative;
  z-index: 2;
}

/* Header Styles - matching Home.vue */
.status-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.2) 0%, rgba(81, 112, 255, 0.1) 100%);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  backdrop-filter: blur(10px);
}

.status-header h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.status-header p {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
}

/* Status Legend */
.status-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  padding: 15px 25px;
  background: rgba(80, 80, 80, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.operational {
  background: #10b981;
}

.legend-dot.outage {
  background: #f59e0b;
}

.legend-dot.offline {
  background: #ef4444;
}

/* Overall Status Banner */
.overall-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  border-radius: 20px;
  border: 2px solid;
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.15), rgba(80, 80, 80, 0.05));
  backdrop-filter: blur(10px);
  transition: all var(--transition-duration) ease;
}

.overall-status.operational {
  border-color: #10b981;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.1);
}

.overall-status.degraded {
  border-color: #f59e0b;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.1);
}

.overall-status.offline {
  border-color: #ef4444;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.1);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
}

.overall-status.operational .status-indicator {
  color: #10b981;
}

.overall-status.degraded .status-indicator {
  color: #f59e0b;
}

.overall-status.offline .status-indicator {
  color: #ef4444;
}

.status-description {
  font-size: 16px;
  color: var(--text-secondary);
  text-align: center;
}

/* Services Grid - matching feature cards style */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.service-card {
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 30px;
  transition: all var(--transition-duration) ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--primary-color) 50%, transparent 100%);
  opacity: 0;
  transition: opacity var(--transition-duration) ease;
}

.service-card:hover::before {
  opacity: 0;
}

.service-card:hover {
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.5), rgba(80, 80, 80, 0.35));
  transform: translateY(-5px);
  border-color: var(--primary-color);
}

.service-card.operational:hover {
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.25);
  border-color: #10b981;
}

.service-card.degraded:hover {
  box-shadow: 0 10px 40px rgba(245, 158, 11, 0.25);
  border-color: #f59e0b;
}

.service-card.offline:hover {
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.25);
  border-color: #ef4444;
}

.service-card.operational {
  border-color: rgba(16, 185, 129, 0.3);
}

.service-card.degraded {
  border-color: rgba(245, 158, 11, 0.3);
}

.service-card.offline {
  border-color: rgba(239, 68, 68, 0.3);
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
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
}

.service-info h3 {
  margin: 0 0 5px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.service-status {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-status.operational {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.service-status.degraded {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.service-status.offline {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.service-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Incidents Section */
.incidents-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary); /* Back to white like other headers */
}

.incident-count {
  font-size: 14px;
  color: var(--text-secondary);
  background: rgba(80, 80, 80, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-incidents {
  text-align: center;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--border-color);
  border-radius: 20px;
}

.no-incidents-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.no-incidents .main-message {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary); /* Grey instead of white */
  max-width: 500px;
  line-height: 1.4;
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
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 15px;
  transition: all var(--transition-duration) ease;
}

.incident-item.resolved {
  border-color: rgba(16, 185, 129, 0.3);
}

.incident-item:hover {
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.5), rgba(80, 80, 80, 0.35));
  transform: translateY(-2px);
}

.incident-status-badge {
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

.incident-item:not(.resolved) .incident-status-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.incident-item.resolved .incident-status-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.incident-content {
  flex: 1;
  min-width: 0;
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
  flex-wrap: wrap;
}

.incident-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
  min-width: 200px;
}

.incident-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.incident-badge.active {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.incident-badge.resolved {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
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
  color: var(--text-secondary);
}

.incident-time i,
.incident-duration i {
  width: 14px;
  font-size: 12px;
  color: var(--primary-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .status-wrapper {
    padding: 60px 0;
  }

  .container {
    padding: 0 15px;
    gap: 40px;
  }

  .status-header h1 {
    font-size: 36px;
  }

  .status-header p {
    font-size: 16px;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .service-card {
    padding: 25px;
  }

  .service-metrics {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .section-header h2 {
    font-size: 28px;
  }

  .incident-item {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }

  .incident-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .incident-header h4 {
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .status-wrapper {
    padding: 40px 0;
  }

  .container {
    gap: 30px;
  }

  .status-header h1 {
    font-size: 28px;
  }

  .overall-status {
    padding: 25px;
  }

  .service-card {
    padding: 20px;
  }

  .no-incidents {
    padding: 40px 20px;
  }

  .incident-item {
    padding: 15px;
  }
}
</style>
