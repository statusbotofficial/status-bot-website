<template>
  <div class="status-page">
    <div class="container">
      <div class="status-header">
        <h1>🔍 API Monitor</h1>
        <p>Real-time monitoring of Status Bot backend health</p>
        <button @click="refreshHealth" :disabled="loading" class="refresh-btn">
          <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
      </div>

      <div class="status-grid">
        <!-- Overall Status -->
        <div class="status-card" :class="healthData?.status || 'unknown'">
          <div class="status-icon">
            <i v-if="healthData?.status === 'healthy'" class="fas fa-check-circle"></i>
            <i v-else-if="healthData?.status === 'unhealthy'" class="fas fa-exclamation-triangle"></i>
            <i v-else class="fas fa-question-circle"></i>
          </div>
          <div class="status-content">
            <h3>Backend Status</h3>
            <p class="status-value">{{ healthData?.status?.toUpperCase() || 'CHECKING...' }}</p>
            <p class="status-time" v-if="healthData?.timestamp">
              Last updated: {{ formatTime(healthData.timestamp) }}
            </p>
          </div>
        </div>

        <!-- Memory Usage -->
        <div class="status-card">
          <div class="status-icon">
            <i class="fas fa-memory" style="color: #8b5cf6;"></i>
          </div>
          <div class="status-content">
            <h3>Memory Usage</h3>
            <p class="status-value" v-if="healthData?.memory">
              {{ healthData.memory.used }}MB / {{ healthData.memory.total }}MB
            </p>
            <div v-if="healthData?.memory" class="progress-bar">
              <div class="progress-fill" :style="{ width: memoryPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Discord API Stats -->
        <div class="status-card">
          <div class="status-icon">
            <i class="fab fa-discord" style="color: #5865f2;"></i>
          </div>
          <div class="status-content">
            <h3>Discord API</h3>
            <p class="status-value">{{ healthData?.discord?.token || 'Checking...' }}</p>
            <div v-if="healthData?.discord?.rateLimitStats" class="api-stats">
              <div class="stat-item">
                <span>Requests: {{ healthData.discord.rateLimitStats.totalRequests }}</span>
              </div>
              <div class="stat-item">
                <span>Rate Limits: {{ healthData.discord.rateLimitStats.rateLimitHits }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Log -->
        <div class="status-card full-width" v-if="errorLog.length > 0">
          <div class="status-icon">
            <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
          </div>
          <div class="status-content">
            <h3>Recent Errors</h3>
            <div class="error-list">
              <div v-for="error in errorLog.slice(0, 5)" :key="error.timestamp" class="error-item">
                <span class="error-time">{{ formatTime(error.timestamp) }}</span>
                <span class="error-message">{{ error.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="auto-refresh">
        <label>
          <input type="checkbox" v-model="autoRefresh" />
          Auto-refresh every 2 minutes
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const healthData = ref(null)
const loading = ref(false)
const errorLog = ref([])
const autoRefresh = ref(true)
let refreshInterval = null

const memoryPercent = computed(() => {
  if (!healthData.value?.memory) return 0
  return Math.round((healthData.value.memory.used / healthData.value.memory.total) * 100)
})

const refreshHealth = async () => {
  loading.value = true
  try {
    const response = await fetch('https://backend-nwct.onrender.com/api/health')
    const data = await response.json()
    
    if (response.ok) {
      healthData.value = data
    } else {
      throw new Error(data.error || 'Health check failed')
    }
  } catch (error) {
    console.error('Health check failed:', error)
    errorLog.value.unshift({
      timestamp: new Date().toISOString(),
      message: error.message
    })
    healthData.value = {
      status: 'unhealthy',
      timestamp: new Date().toISOString()
    }
  } finally {
    loading.value = false
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

onMounted(() => {
  document.title = 'API Monitor - Status Bot'
  refreshHealth()
  
  refreshInterval = setInterval(() => {
    if (autoRefresh.value) {
      refreshHealth()
    }
  }, 120000) // Changed from 30s to 2 minutes
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.status-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.status-header {
  text-align: center;
  margin-bottom: 40px;
}

.status-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.status-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.refresh-btn {
  background: linear-gradient(135deg, #5170ff, #8b5cf6);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(81, 112, 255, 0.3);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.status-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.status-card.healthy {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.status-card.unhealthy {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.status-card.full-width {
  grid-column: 1 / -1;
}

.status-icon {
  font-size: 2rem;
  margin-bottom: 16px;
}

.status-content h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.status-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #8b5cf6);
  transition: width 0.3s ease;
}

.api-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.error-time {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
}

.auto-refresh label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
}
</style>