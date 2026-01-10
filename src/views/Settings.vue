<template>
  <div class="page-section">
    <div class="container">
      <h1>Settings</h1>
      <p>Manage your Status Bot settings and preferences.</p>
      
      <div v-if="!authStore.isLoggedIn" class="login-required">
        <p>Please log in to access settings.</p>
      </div>
      <div v-else class="settings-content">
        <div class="settings-card">
          <h3>Account Settings</h3>
          <div class="setting-item">
            <label>Username</label>
            <input v-model="username" type="text">
          </div>
          <div class="setting-item">
            <label>Email</label>
            <input v-model="email" type="email">
          </div>
          <button class="btn" @click="saveSettings">Save Changes</button>
        </div>

        <div class="settings-card">
          <h3>Bot Preferences</h3>
          <div class="setting-item">
            <label>
              <input v-model="notifications" type="checkbox">
              Receive notifications
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input v-model="analytics" type="checkbox">
              Allow analytics
            </label>
          </div>
          <button class="btn" @click="savePreferences">Save Preferences</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const username = ref(authStore.user?.username || '')
const email = ref(authStore.user?.email || '')
const notifications = ref(true)
const analytics = ref(true)

const saveSettings = () => {
  console.log('Settings saved')
}

const savePreferences = () => {
  console.log('Preferences saved')
}
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

.login-required {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  color: var(--text-secondary);
}

.settings-content {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 8px;
}

.settings-card h3 {
  margin-bottom: 20px;
}

.setting-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.setting-item label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item input[type="text"],
.setting-item input[type="email"] {
  width: 100%;
}

.setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.settings-card .btn {
  width: 100%;
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .settings-content {
    max-width: 100%;
  }
}
</style>
