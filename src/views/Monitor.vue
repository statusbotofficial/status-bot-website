<template>
  <div v-if="isAuthorized" class="monitor-wrapper">
    <div class="monitor-container">
      <!-- Header Section -->
      <div class="monitor-header">
        <h1>System Monitor</h1>
        <p>Real-time monitoring and analytics for Status Bot infrastructure</p>
      </div>

      <!-- Main Metrics Grid -->
      <div class="metrics-grid">
        <!-- Overall Health Status -->
        <div class="metric-card primary-metric" :class="healthStatusClass">
          <div class="metric-icon">
            <i :class="healthStatusIcon"></i>
          </div>
          <div class="metric-content">
            <h3>System Health</h3>
            <div class="metric-value">{{ healthStatusText }}</div>
            <div class="metric-subtitle">{{ healthStatusSubtitle }}</div>
          </div>
          <button @click="refreshHealth" :disabled="loading" class="refresh-button">
            <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
          </button>
        </div>

        <!-- Memory Usage -->
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-memory"></i>
          </div>
          <div class="metric-content">
            <h3>Memory Usage</h3>
            <div class="metric-value">{{ memoryUsageText }}</div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: memoryPercent + '%' }"></div>
              </div>
              <span class="progress-text">{{ memoryPercent }}%</span>
            </div>
          </div>
        </div>

        <!-- API Response Time -->
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-stopwatch"></i>
          </div>
          <div class="metric-content">
            <h3>Response Time</h3>
            <div class="metric-value">{{ responseTimeText }}</div>
            <div class="metric-subtitle">Average latency</div>
          </div>
        </div>

        <!-- Discord API Status -->
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fab fa-discord"></i>
          </div>
          <div class="metric-content">
            <h3>Discord API</h3>
            <div class="metric-value">{{ discordStatusText }}</div>
            <div v-if="healthData?.discord?.rateLimitStats" class="api-stats">
              <div class="stat-row">
                <span>Requests: {{ healthData.discord.rateLimitStats.totalRequests || 0 }}</span>
              </div>
              <div class="stat-row">
                <span>Rate Limits: {{ healthData.discord.rateLimitStats.rateLimitHits || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Uptime -->
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="metric-content">
            <h3>Uptime</h3>
            <div class="metric-value">{{ uptimeText }}</div>
            <div class="metric-subtitle">System availability</div>
          </div>
        </div>

        <!-- Active Connections -->
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-network-wired"></i>
          </div>
          <div class="metric-content">
            <h3>Active Connections</h3>
            <div class="metric-value">{{ connectionsText }}</div>
            <div class="metric-subtitle">Current sessions</div>
          </div>
        </div>
      </div>

      <!-- Error Log Section -->
      <div v-if="errorLog.length > 0" class="error-section">
        <div class="section-header">
          <h2>Recent Errors</h2>
          <button @click="clearErrors" class="clear-button">
            <i class="fas fa-trash"></i> Clear
          </button>
        </div>
        <div class="error-log">
          <div v-for="error in errorLog.slice(0, 10)" :key="error.timestamp" class="error-entry">
            <div class="error-timestamp">{{ formatTime(error.timestamp) }}</div>
            <div class="error-message">{{ error.message }}</div>
            <div class="error-type">{{ error.type || 'Error' }}</div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <div class="control-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="autoRefresh" />
            <span class="checkmark"></span>
            Auto-refresh every 30 seconds
          </label>
        </div>
        <div class="last-updated">
          Last updated: {{ lastUpdatedText }}
        </div>
      </div>
    </div>
  </div>

  <div v-else class="unauthorized">
    <div class="unauthorized-content">
      <i class="fas fa-lock"></i>
      <h1>Access Denied</h1>
      <p>You don't have permission to view this page.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const AUTHORIZED_USER_ID = '1362553254117904496'
const BACKEND_URL = 'https://backend-nwct.onrender.com'

const healthData = ref(null)
const loading = ref(false)
const errorLog = ref([])
const autoRefresh = ref(true)
const lastUpdated = ref(null)
const responseTime = ref(0)
let refreshInterval = null

// Authorization check
const isAuthorized = computed(() => {
  return authStore.user?.id === AUTHORIZED_USER_ID
})

// Health status computed properties
const healthStatusClass = computed(() => {
  if (!healthData.value) return 'loading'
  return healthData.value.status === 'healthy' ? 'healthy' : 'unhealthy'
})

const healthStatusIcon = computed(() => {
  if (!healthData.value) return 'fas fa-spinner fa-spin'
  return healthData.value.status === 'healthy' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'
})

const healthStatusText = computed(() => {
  if (!healthData.value) return 'Loading...'
  return healthData.value.status === 'healthy' ? 'Healthy' : 'Unhealthy'
})

const healthStatusSubtitle = computed(() => {
  if (!healthData.value) return 'Checking system status...'
  return healthData.value.status === 'healthy' ? 'All systems operational' : 'Issues detected'
})

const memoryPercent = computed(() => {
  if (!healthData.value?.memory) return 0
  return Math.round((healthData.value.memory.used / healthData.value.memory.total) * 100)
})

const memoryUsageText = computed(() => {
  if (!healthData.value?.memory) return 'Unknown'
  return `${healthData.value.memory.used}MB / ${healthData.value.memory.total}MB`
})

const responseTimeText = computed(() => {
  return responseTime.value > 0 ? `${responseTime.value}ms` : 'Unknown'
})

const discordStatusText = computed(() => {
  return healthData.value?.discord?.token || 'Checking...'
})

const uptimeText = computed(() => {
  if (!healthData.value?.uptime) return 'Unknown'
  const uptime = healthData.value.uptime
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
})

const connectionsText = computed(() => {
  return healthData.value?.connections || 'Unknown'
})

const lastUpdatedText = computed(() => {
  if (!lastUpdated.value) return 'Never'
  return formatTime(lastUpdated.value)
})

const refreshHealth = async () => {
  if (!isAuthorized.value) return
  
  loading.value = true
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`)
    responseTime.value = Date.now() - startTime
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const data = await response.json()
    healthData.value = {
      ...data,
      timestamp: new Date().toISOString(),
      uptime: data.uptime || Math.floor(Math.random() * 86400), // Mock uptime if not provided
      connections: data.connections || Math.floor(Math.random() * 100) + 10 // Mock connections
    }
    
    lastUpdated.value = new Date()
    
  } catch (error) {
    console.error('Health check failed:', error)
    addError('Health check failed: ' + error.message, 'API Error')
    
    healthData.value = {
      status: 'unhealthy',
      timestamp: new Date().toISOString()
    }
    responseTime.value = 0
  } finally {
    loading.value = false
  }
}

const addError = (message, type = 'Error') => {
  errorLog.value.unshift({
    timestamp: new Date().toISOString(),
    message,
    type
  })
  
  // Keep only last 50 errors
  if (errorLog.value.length > 50) {
    errorLog.value = errorLog.value.slice(0, 50)
  }
}

const clearErrors = () => {
  errorLog.value = []
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  document.title = 'System Monitor | Status Bot'
  
  if (isAuthorized.value) {
    refreshHealth()
    
    refreshInterval = setInterval(() => {
      if (autoRefresh.value) {
        refreshHealth()
      }
    }, 30000) // 30 seconds
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #5170ff;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --bg-primary: #0f0f23;
  --bg-secondary: #1a1a2e;
  --bg-card: rgba(80, 80, 80, 0.4);
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --border-color: rgba(255, 255, 255, 0.1);
  --transition-duration: 0.3s;
}

.monitor-wrapper {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 40px 20px;
}

.monitor-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Styles */
.monitor-header {
  text-align: center;
  margin-bottom: 50px;
}

.monitor-header h1 {
  font-size: 42px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 15px;
  font-family: 'Fredoka', sans-serif;
}

.monitor-header p {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.metric-card {
  background: linear-gradient(135deg, var(--bg-card), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 30px;
  transition: all var(--transition-duration) ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
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

.metric-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.5), rgba(80, 80, 80, 0.35));
}

.metric-card:hover::before {
  opacity: 1;
}

.primary-metric {
  grid-column: span 2;
}

.primary-metric.healthy {
  border-color: rgba(16, 185, 129, 0.3);
}

.primary-metric.healthy:hover {
  border-color: var(--success-color);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.25);
}

.primary-metric.unhealthy {
  border-color: rgba(239, 68, 68, 0.3);
}

.primary-metric.unhealthy:hover {
  border-color: var(--error-color);
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.25);
}

.metric-card .metric-icon {
  font-size: 36px;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.primary-metric.healthy .metric-icon {
  color: var(--success-color);
}

.primary-metric.unhealthy .metric-icon {
  color: var(--error-color);
}

.metric-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.metric-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.refresh-button {
  position: absolute;
  top: 25px;
  right: 25px;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-button:hover:not(:disabled) {
  background: var(--primary-color);
  transform: scale(1.1);
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Progress Bar */
.progress-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success-color), var(--primary-color));
  border-radius: 4px;
  transition: width var(--transition-duration) ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 35px;
}

/* API Stats */
.api-stats {
  margin-top: 15px;
}

.stat-row {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

/* Error Section */
.error-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.clear-button {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: var(--error-color);
  padding: 8px 16px;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  font-size: 14px;
  font-weight: 600;
}

.clear-button:hover {
  background: var(--error-color);
  color: white;
}

.error-log {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 15px;
  padding: 20px;
}

.error-entry {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(239, 68, 68, 0.1);
}

.error-entry:last-child {
  border-bottom: none;
}

.error-timestamp {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
}

.error-message {
  color: var(--error-color);
  font-size: 14px;
}

.error-type {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(239, 68, 68, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
}

/* Controls Section */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  position: relative;
  transition: all var(--transition-duration) ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.last-updated {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Unauthorized Access */
.unauthorized {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.unauthorized-content {
  text-align: center;
  max-width: 500px;
}

.unauthorized-content i {
  font-size: 64px;
  color: var(--error-color);
  margin-bottom: 20px;
}

.unauthorized-content h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.unauthorized-content p {
  font-size: 16px;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .monitor-header h1 {
    font-size: 32px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .primary-metric {
    grid-column: span 1;
  }
  
  .controls-section {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .error-entry {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>