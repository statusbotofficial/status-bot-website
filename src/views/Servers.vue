<template>
  <div class="page-section">
    <div class="container">
      <h1>Dashboard</h1>
      <p>Manage your server settings and Status Bot configuration.</p>
      
      <div class="dashboard-content">
        <div class="dashboard-card">
          <h3>Servers</h3>
          <p v-if="!authStore.isLoggedIn" class="login-prompt">Please log in to view your servers.</p>
          <div v-else class="servers-list">
            <p v-if="servers.length === 0">No servers found.</p>
            <div v-for="server in servers" :key="server.id" class="server-item">
              <img :src="server.icon" :alt="server.name">
              <div>
                <h4>{{ server.name }}</h4>
                <p>Members: {{ server.memberCount }}</p>
              </div>
              <router-link :to="`/servers/${server.id}`" class="btn secondary">Configure</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const servers = ref([
  {
    id: 1,
    name: 'Example Server',
    icon: 'https://via.placeholder.com/50',
    memberCount: 150
  }
])
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

.dashboard-content {
  max-width: 900px;
}

.dashboard-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 8px;
}

.dashboard-card h3 {
  margin-bottom: 20px;
}

.login-prompt {
  color: var(--text-secondary);
}

.servers-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.server-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.server-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.server-item h4 {
  margin-bottom: 5px;
}

.server-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0;
}

.server-item .btn {
  margin-left: auto;
  padding: 8px 16px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .server-item {
    flex-wrap: wrap;
  }

  .server-item .btn {
    margin-left: 0;
    width: 100%;
  }
}
</style>
