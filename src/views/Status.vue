<template>
  <div class="page-section">
    <div class="container">
      <h1>Bot Status</h1>
      <p>Monitor the real-time status and uptime of Status Bot.</p>
      
      <div class="status-overview">
        <div class="status-card" :class="{ operational: isOperational }">
          <h3>Overall Status</h3>
          <p class="status-text" :class="{ operational: isOperational }">
            {{ isOperational ? '✓ Operational' : '✗ Issues Detected' }}
          </p>
          <p class="uptime">Uptime: {{ uptime }}%</p>
        </div>

        <div class="status-card">
          <h3>API Status</h3>
          <p class="status-indicator operational">✓ Online</p>
          <p class="status-detail">Response time: {{ responseTime }}ms</p>
        </div>

        <div class="status-card">
          <h3>Database</h3>
          <p class="status-indicator operational">✓ Online</p>
          <p class="status-detail">Last checked: 2 min ago</p>
        </div>

        <div class="status-card">
          <h3>Services</h3>
          <p class="status-indicator operational">✓ All Systems</p>
          <p class="status-detail">No known issues</p>
        </div>
      </div>

      <div class="incidents-section">
        <h2>Recent Incidents</h2>
        <div v-if="incidents.length === 0" class="no-incidents">
          <p>No recent incidents reported.</p>
        </div>
        <div v-else class="incidents-list">
          <div v-for="incident in incidents" :key="incident.id" class="incident-item">
            <h4>{{ incident.title }}</h4>
            <p>{{ incident.description }}</p>
            <p class="incident-date">{{ incident.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOperational = ref(true)
const uptime = ref(99.9)
const responseTime = ref(45)
const incidents = ref([])
</script>

<style scoped>
.page-section {
  padding: 80px 50px;
  min-height: calc(100vh - 200px);
}

.container h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.container > p {
  font-size: 1.1rem;
  margin-bottom: 60px;
  max-width: 600px;
}

.status-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.status-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-left: 4px solid #ff6b6b;
  padding: 25px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.status-card.operational {
  border-left-color: #51cf66;
}

.status-card h3 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.status-text {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ff6b6b;
}

.status-text.operational {
  color: #51cf66;
}

.status-indicator {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.status-indicator.operational {
  color: #51cf66;
}

.status-detail, .uptime {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.incidents-section {
  max-width: 700px;
}

.incidents-section h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.no-incidents {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  color: var(--text-secondary);
}

.incidents-list {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.incident-item {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.incident-item:last-child {
  border-bottom: none;
}

.incident-item h4 {
  color: #ff6b6b;
  margin-bottom: 10px;
}

.incident-date {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .status-overview {
    grid-template-columns: 1fr;
  }
}
</style>
