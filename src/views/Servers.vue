<template>
  <div class="servers-page">
    <!-- Login Required Message -->
    <div v-if="!authStore.user || !authStore.token" class="login-required">
      <div>
        <h2>Login Required</h2>
        <p>You need to be logged in to access this page.</p>
      </div>
    </div>

    <!-- Servers List View -->
    <div v-else-if="!selectedServer" class="servers-list-view">
      <h1 class="page-title">Select a Server</h1>
      <input
        v-model="searchQuery"
        type="text"
        class="search-box"
        placeholder="Search servers..."
      />
      <div v-if="loading" class="loading-container">
        <p>Loading servers...</p>
      </div>
      <div v-else-if="servers.length === 0" class="empty-state">
        <p>No servers found.</p>
      </div>
      <div v-else class="servers-grid">
        <div v-for="server in filteredServers" :key="server.id" class="server-card">
          <div class="server-icon-wrapper">
            <div
              class="server-icon"
              :style="{ backgroundImage: server.icon ? `url(${server.icon})` : 'none' }"
            >
              <span v-if="!server.icon" class="server-initial">
                {{ server.name.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <h3 class="server-name">{{ server.name }}</h3>
          
          <button
            v-if="server.buttonType === 'configure'"
            class="btn btn-configure"
            @click="selectServer(server)"
          >
            Configure
          </button>
          <button
            v-else-if="server.buttonType === 'view'"
            class="btn btn-view"
            @click="selectServer(server)"
          >
            View
          </button>
          <button
            v-else-if="server.buttonType === 'invite-bot'"
            class="btn btn-invite"
            @click="inviteBot(server)"
          >
            Invite Bot
          </button>
          <button v-else class="btn btn-no-access" disabled>
            No Access
          </button>
        </div>
      </div>
    </div>

    <!-- Server Config View -->
    <div v-else class="server-config-view">
      <div class="config-header">
        <button class="back-btn" @click="selectedServer = null">← Back</button>
        <h2 class="config-title">{{ selectedServer.name }}</h2>
      </div>

      <div class="config-content">
        <!-- Sidebar Navigation -->
        <aside class="config-sidebar">
          <nav class="config-nav">
            <button
              v-for="section in sections"
              :key="section.id"
              class="nav-item"
              :class="{ active: activeSection === section.id }"
              @click="activeSection = section.id"
            >
              {{ section.label }}
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="config-main">
          <!-- Overview -->
          <section v-if="activeSection === 'overview'" class="config-section">
            <h3>Top Users</h3>
            <div v-if="overviewLoading" class="loading">Loading...</div>
            <div v-else-if="overviewData.length > 0" class="user-list">
              <div v-for="(user, index) in overviewData" :key="user.id" class="user-item">
                <span class="rank">#{{ index + 1 }}</span>
                <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="avatar" />
                <div class="user-info">
                  <p class="username">{{ user.username }}</p>
                  <p class="level">Level {{ user.level || 0 }}</p>
                </div>
                <div class="stats">
                  <div class="stat">
                    <span class="label">XP</span>
                    <span class="value">{{ user.xp || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty">No user data available</div>
          </section>

          <!-- Leaderboard -->
          <section v-else-if="activeSection === 'leaderboard'" class="config-section">
            <h3>Leaderboard</h3>
            <div v-if="leaderboardLoading" class="loading">Loading...</div>
            <div v-else-if="leaderboardData.length > 0" class="leaderboard">
              <div v-for="(user, index) in leaderboardData" :key="user.id" class="leaderboard-item" :class="getMedalClass(index)">
                <span class="rank">#{{ index + 1 }}</span>
                <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="avatar" />
                <div class="user-info">
                  <p class="username">{{ user.username }}</p>
                  <p class="level">Level {{ user.level || 0 }}</p>
                </div>
                <div class="stats">
                  <div class="stat xp-stat">
                    <span class="label">XP</span>
                    <span class="value">{{ user.xp || 0 }}</span>
                  </div>
                  <div class="stat balance-stat">
                    <span class="label">Balance</span>
                    <span class="value">{{ user.balance || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty">No leaderboard data</div>
          </section>

          <!-- Leveling -->
          <section v-else-if="activeSection === 'leveling'" class="config-section">
            <h3>Leveling Settings</h3>
            <p class="placeholder">Leveling configuration coming soon...</p>
          </section>

          <!-- Economy -->
          <section v-else-if="activeSection === 'economy'" class="config-section">
            <h3>Economy Settings</h3>
            <p class="placeholder">Economy configuration coming soon...</p>
          </section>

          <!-- Status Tracking -->
          <section v-else-if="activeSection === 'status-tracking'" class="config-section">
            <h3>Status Tracking</h3>
            <p class="placeholder">Status tracking configuration coming soon...</p>
          </section>

          <!-- Welcome -->
          <section v-else-if="activeSection === 'welcome'" class="config-section">
            <h3>Welcome Settings</h3>
            <p class="placeholder">Welcome message configuration coming soon...</p>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const overviewLoading = ref(false)
const leaderboardLoading = ref(false)
const servers = ref([])
const selectedServer = ref(null)
const searchQuery = ref('')
const activeSection = ref('overview')
const overviewData = ref([])
const leaderboardData = ref([])

const BACKEND_URL = 'https://status-bot-backend.onrender.com'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'leveling', label: 'Leveling' },
  { id: 'economy', label: 'Economy' },
  { id: 'status-tracking', label: 'Status Tracking' },
  { id: 'welcome', label: 'Welcome' },
]

// Computed
const filteredServers = computed(() => {
  return servers.value.filter(server =>
    server.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getMedalClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

// Methods
const loadServers = async () => {
  loading.value = true
  try {
    const userResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch user guilds')
      servers.value = []
      return
    }

    const userGuilds = await userResponse.json()

    const botResponse = await fetch(`${BACKEND_URL}/api/bot-guilds`)
    const botData = await botResponse.json()
    const botGuildIds = new Set(botData.guilds || [])

    const MANAGE_GUILD = BigInt(0x20)
    const processedServers = userGuilds.map(guild => {
      const permissions = BigInt(guild.permissions || 0)
      const hasManage = (permissions & MANAGE_GUILD) === MANAGE_GUILD
      const isBotPresent = botGuildIds.has(guild.id)

      let buttonType = 'no-access'
      if (hasManage && isBotPresent) buttonType = 'configure'
      else if (!hasManage && isBotPresent) buttonType = 'view'
      else if (hasManage && !isBotPresent) buttonType = 'invite-bot'

      const iconUrl = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`
        : null

      return {
        id: guild.id,
        name: guild.name,
        icon: iconUrl,
        buttonType,
        priority: buttonType === 'configure' ? 1 : buttonType === 'view' ? 2 : buttonType === 'invite-bot' ? 3 : 4
      }
    }).sort((a, b) => a.priority - b.priority)

    servers.value = processedServers
  } catch (error) {
    console.error('Error loading servers:', error)
    servers.value = []
  } finally {
    loading.value = false
  }
}

const selectServer = async (server) => {
  selectedServer.value = server
  activeSection.value = 'overview'
  await Promise.all([
    loadOverviewData(server.id),
    loadLeaderboardData(server.id)
  ])
}

const loadOverviewData = async (guildId) => {
  overviewLoading.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/server-overview/${guildId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (response.ok) {
      const data = await response.json()
      overviewData.value = data.topUsers || []
    }
  } catch (error) {
    console.error('Error loading overview:', error)
  } finally {
    overviewLoading.value = false
  }
}

const loadLeaderboardData = async (guildId) => {
  leaderboardLoading.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/server-leaderboard/${guildId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (response.ok) {
      const data = await response.json()
      leaderboardData.value = data.leaderboard || []
    }
  } catch (error) {
    console.error('Error loading leaderboard:', error)
  } finally {
    leaderboardLoading.value = false
  }
}

const inviteBot = (server) => {
  const DISCORD_CLIENT_ID = '1436123870158520411'
  const REDIRECT_URI = 'https://status-bot.xyz/servers'
  const BOT_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&permissions=8&scope=bot%20applications.commands`
  window.open(`${BOT_INVITE_URL}&guild_id=${server.id}`, '_blank')
}

onMounted(() => {
  loadServers()
})
</script>

<style scoped>
.servers-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.login-required {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-required div {
  text-align: center;
}

.login-required h2 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px 0;
}

.login-required p {
  font-size: 16px;
  color: #999;
  margin: 0;
}

.servers-list-view {
  padding: 50px;
  overflow-y: auto;
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff 0%, #aaa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-box {
  max-width: 500px;
  padding: 14px 20px;
  background: rgba(81, 112, 255, 0.1);
  border: 2px solid rgba(81, 112, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 40px;
  transition: all 0.3s ease;
}

.search-box:focus {
  outline: none;
  background: rgba(81, 112, 255, 0.15);
  border-color: rgba(81, 112, 255, 0.6);
  box-shadow: 0 0 20px rgba(81, 112, 255, 0.3);
}

.loading-container,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.servers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.server-card {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.15) 0%, rgba(81, 112, 255, 0.1) 100%);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.server-card:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.2) 0%, rgba(81, 112, 255, 0.15) 100%);
  border-color: rgba(81, 112, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(81, 112, 255, 0.2);
}

.server-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: #5170ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(81, 112, 255, 0.3);
}

.server-initial {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
}

.server-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 16px 0 20px;
}

.btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  border: 2px solid;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-configure {
  background: rgba(59, 91, 219, 0.2);
  border-color: #3b5bdb;
  color: #fff;
}

.btn-configure:hover {
  background: rgba(59, 91, 219, 0.35);
}

.btn-view {
  background: rgba(128, 128, 128, 0.2);
  border-color: #808080;
  color: #fff;
}

.btn-view:hover {
  background: rgba(128, 128, 128, 0.35);
}

.btn-invite {
  background: rgba(92, 184, 92, 0.2);
  border-color: #5cb85c;
  color: #fff;
}

.btn-invite:hover {
  background: rgba(92, 184, 92, 0.35);
}

.btn-no-access {
  background: rgba(220, 53, 69, 0.2);
  border-color: #dc3545;
  color: #999;
  cursor: not-allowed;
}

/* Server Config View */
.server-config-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.config-header {
  padding: 30px 50px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(81, 112, 255, 0.35);
}

.config-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.config-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.config-sidebar {
  width: 250px;
  border-right: 1px solid rgba(81, 112, 255, 0.2);
  padding: 20px 0;
  overflow-y: auto;
}

.config-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.nav-item {
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: #aaa;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(81, 112, 255, 0.1);
  color: #5170ff;
}

.nav-item.active {
  background: rgba(81, 112, 255, 0.1);
  color: #5170ff;
  border-left: 3px solid #5170ff;
  padding-left: 17px;
}

.config-main {
  flex: 1;
  padding: 40px 50px;
  overflow-y: auto;
}

.config-section {
  max-width: 900px;
}

.config-section h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #fff;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 40px;
}

.placeholder {
  color: #999;
  font-style: italic;
}

.user-list,
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item,
.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.15);
  border-radius: 8px;
}

.rank {
  font-weight: 800;
  color: #5170ff;
  min-width: 40px;
  text-align: center;
}

.leaderboard-item.gold .rank {
  color: #FFD700;
}

.leaderboard-item.silver .rank {
  color: #C0C0C0;
}

.leaderboard-item.bronze .rank {
  color: #CD7F32;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  font-weight: 600;
  color: #fff;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.level {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat .label {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
}

.stat .value {
  font-size: 14px;
  font-weight: 700;
  color: #fbbf24;
}

.balance-stat .value {
  color: #4ade80;
}
</style>
