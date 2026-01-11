<template>
  <div class="servers-page">
    <!-- Login Required -->
    <div v-if="!authStore.user || !authStore.token" class="login-required">
      <h2>Login Required</h2>
      <p>You need to be logged in to access this page.</p>
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
      <div v-if="loading" class="loading-container">Loading servers...</div>
      <div v-else-if="servers.length === 0" class="empty-state">No servers found.</div>
      <div v-else class="servers-grid">
        <div v-for="server in filteredServers" :key="server.id" class="server-card">
          <div
            class="server-icon"
            :style="{ backgroundImage: server.icon ? `url(${server.icon})` : 'none' }"
          >
            <span v-if="!server.icon">{{ server.name.charAt(0).toUpperCase() }}</span>
          </div>
          <h3 class="server-name">{{ server.name }}</h3>
          
          <button
            v-if="server.buttonType === 'configure'"
            class="server-button configure"
            @click="selectServer(server)"
          >
            Configure
          </button>
          <button
            v-else-if="server.buttonType === 'view'"
            class="server-button view"
            @click="selectServer(server)"
          >
            View
          </button>
          <button
            v-else-if="server.buttonType === 'invite-bot'"
            class="server-button invite-bot"
            @click="inviteBot(server)"
          >
            Invite Bot
          </button>
          <button v-else class="server-button no-access" disabled>No Access</button>
        </div>
      </div>
    </div>

    <!-- Server Config View -->
    <div v-else class="config-view">
      <div class="config-header">
        <button class="back-btn" @click="selectedServer = null">← Back</button>
        <h2>{{ selectedServer.name }}</h2>
      </div>

      <div class="config-container">
        <!-- Sidebar -->
        <aside class="config-sidebar">
          <nav class="config-nav">
            <button
              v-for="section in sections"
              :key="section.id"
              class="nav-btn"
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
            <div class="overview-grid">
              <!-- Top Users -->
              <div class="overview-panel">
                <h3>Top Users</h3>
                <div v-if="overviewLoading" class="loading">Loading...</div>
                <div v-else-if="overviewData.length > 0" class="user-list">
                  <div v-for="(user, idx) in overviewData" :key="user.id" class="user-row">
                    <span class="rank">#{{ idx + 1 }}</span>
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="avatar" />
                    <div class="user-info">
                      <p class="username">{{ user.username }}</p>
                      <p class="level">Level {{ user.level || 0 }}</p>
                    </div>
                    <div class="stat">{{ user.xp || 0 }} XP</div>
                  </div>
                </div>
                <div v-else class="empty">No data</div>
              </div>

              <!-- Leaderboard -->
              <div class="overview-panel">
                <h3>Leaderboard</h3>
                <div v-if="leaderboardLoading" class="loading">Loading...</div>
                <div v-else-if="leaderboardData.length > 0" class="leaderboard">
                  <div
                    v-for="(user, idx) in leaderboardData"
                    :key="user.id"
                    class="leaderboard-item"
                    :class="getMedalClass(idx)"
                  >
                    <span class="rank">#{{ idx + 1 }}</span>
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="avatar" />
                    <div class="user-info">
                      <p class="username">{{ user.username }}</p>
                      <p class="level">Level {{ user.level || 0 }}</p>
                    </div>
                    <div class="stats">
                      <div class="stat-item">
                        <span class="label">XP</span>
                        <span class="value xp-color">{{ user.xp || 0 }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="label">Balance</span>
                        <span class="value balance-color">{{ user.balance || 0 }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="label">Voice</span>
                        <span class="value voice-color">{{ user.voiceTime || 0 }}m</span>
                      </div>
                      <div class="stat-item">
                        <span class="label">Msgs</span>
                        <span class="value msg-color">{{ user.messages || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">No data</div>
              </div>
            </div>
          </section>

          <!-- Leveling -->
          <section v-else-if="activeSection === 'leveling'" class="config-section">
            <h3>Leveling Settings</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Leveling</label>
                <toggle-switch v-model="levelingSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>XP per message</label>
                <input v-model.number="levelingSettings.xpPerMessage" type="number" min="1" class="input-field" />
              </div>

              <div class="setting-item">
                <label>Voice chat XP</label>
                <input v-model.number="levelingSettings.voiceXp" type="number" min="1" class="input-field" />
              </div>

              <div class="setting-item">
                <label>Level up channel</label>
                <div class="channel-selector">
                  <input
                    v-model="levelingSettings.levelUpChannel"
                    type="text"
                    placeholder="None selected"
                    disabled
                    class="input-field"
                  />
                  <button @click="openChannelSelector('levelingSettings', 'levelUpChannel')" class="select-btn">+</button>
                </div>
              </div>

              <div class="setting-item">
                <label>Level up message</label>
                <textarea
                  v-model="levelingSettings.levelUpMessage"
                  class="input-field textarea"
                  placeholder="🎉 {user} has reached Level {level}!"
                  @input="updateLevelUpPreview"
                />
                <div class="preview-box">
                  <div class="preview-title">Preview</div>
                  <div class="preview-content" v-html="levelUpPreview"></div>
                </div>
              </div>

              <div class="setting-item">
                <label>Allowed XP channels</label>
                <div class="channel-selector">
                  <input
                    v-model="levelingSettings.allowedChannels"
                    type="text"
                    placeholder="All channels"
                    disabled
                    class="input-field"
                  />
                  <button @click="openChannelSelector('levelingSettings', 'allowedChannels')" class="select-btn">+</button>
                </div>
              </div>

              <div class="button-group">
                <button @click="saveLevelingSettings" class="save-btn">Save</button>
                <button @click="resetLevelingSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>

          <!-- Economy -->
          <section v-else-if="activeSection === 'economy'" class="config-section">
            <h3>Economy System</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Economy</label>
                <toggle-switch v-model="economySettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Currency gained per message</label>
                <input v-model.number="economySettings.currencyPerMessage" type="number" min="1" class="input-field" />
              </div>

              <div class="setting-item">
                <label>Currency symbol</label>
                <input v-model="economySettings.currencySymbol" type="text" class="input-field" placeholder="💰" />
              </div>

              <div class="setting-item">
                <label>Starting amount</label>
                <input v-model.number="economySettings.startingAmount" type="number" min="0" class="input-field" />
              </div>

              <div class="button-group">
                <button @click="saveEconomySettings" class="save-btn">Save</button>
                <button @click="showResetEconomyModal" class="reset-btn">Reset All Balances</button>
              </div>
            </div>
          </section>

          <!-- Status Tracking -->
          <section v-else-if="activeSection === 'status-tracking'" class="config-section">
            <h3>Status Tracking</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Status Tracking</label>
                <toggle-switch v-model="statusSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>User to track</label>
                <div class="channel-selector">
                  <input
                    v-model="statusSettings.userToTrack"
                    type="text"
                    placeholder="None selected"
                    disabled
                    class="input-field"
                  />
                  <button @click="openMemberSelector" class="select-btn">+</button>
                </div>
              </div>

              <div class="setting-item">
                <label>Channel to post in</label>
                <div class="channel-selector">
                  <input
                    v-model="statusSettings.trackingChannel"
                    type="text"
                    placeholder="None selected"
                    disabled
                    class="input-field"
                  />
                  <button @click="openChannelSelector('statusSettings', 'trackingChannel')" class="select-btn">+</button>
                </div>
              </div>

              <div class="setting-item">
                <label>Delay (seconds)</label>
                <input v-model.number="statusSettings.delay" type="number" min="1" class="input-field" />
              </div>

              <div class="setting-item">
                <label>Automatic updates</label>
                <toggle-switch v-model="statusSettings.automatic" />
              </div>

              <div class="setting-item">
                <label>Use embed format</label>
                <toggle-switch v-model="statusSettings.useEmbed" />
              </div>

              <div class="setting-item">
                <label>Default offline message</label>
                <input
                  v-model="statusSettings.offlineMessage"
                  type="text"
                  class="input-field"
                  placeholder="User is currently offline"
                  @input="updateStatusPreview"
                />
              </div>

              <div class="preview-box">
                <div class="preview-title">Preview</div>
                <div class="preview-content" v-html="statusPreview"></div>
              </div>

              <div class="button-group">
                <button @click="saveStatusSettings" class="save-btn">Save</button>
                <button @click="resetStatusSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>

          <!-- Welcome -->
          <section v-else-if="activeSection === 'welcome'" class="config-section">
            <h3>Welcome Messages</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Welcome Messages</label>
                <toggle-switch v-model="welcomeSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Welcome channel</label>
                <div class="channel-selector">
                  <input
                    v-model="welcomeSettings.welcomeChannel"
                    type="text"
                    placeholder="None selected"
                    disabled
                    class="input-field"
                  />
                  <button @click="openChannelSelector('welcomeSettings', 'welcomeChannel')" class="select-btn">+</button>
                </div>
              </div>

              <div class="setting-item">
                <label>Use embed format</label>
                <toggle-switch v-model="welcomeSettings.useEmbed" />
              </div>

              <div v-if="!welcomeSettings.useEmbed" class="setting-item">
                <label>Message text</label>
                <textarea
                  v-model="welcomeSettings.messageText"
                  class="input-field textarea"
                  placeholder="Welcome to {server}, {user}!"
                  @input="updateWelcomePreview"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Embed title</label>
                <input
                  v-model="welcomeSettings.embedTitle"
                  type="text"
                  class="input-field"
                  placeholder="Welcome!"
                  @input="updateWelcomePreview"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Description</label>
                <textarea
                  v-model="welcomeSettings.embedDescription"
                  class="input-field textarea"
                  placeholder="Welcome to {server}! We're glad to have you here."
                  @input="updateWelcomePreview"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Footer text</label>
                <input
                  v-model="welcomeSettings.embedFooter"
                  type="text"
                  class="input-field"
                  placeholder="Thanks for joining!"
                  @input="updateWelcomePreview"
                />
              </div>

              <div class="preview-box">
                <div class="preview-title">Preview</div>
                <div class="preview-content" v-html="welcomePreview"></div>
              </div>

              <div class="button-group">
                <button @click="saveWelcomeSettings" class="save-btn">Save</button>
                <button @click="resetWelcomeSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showChannelModal" class="modal-overlay" @click="closeChannelModal">
      <div class="modal-content" @click.stop>
        <h3>Select Channels</h3>
        <div class="channel-list">
          <label v-for="channel in guildChannels" :key="channel.id" class="channel-option">
            <input
              type="checkbox"
              :value="channel.id"
              v-model="selectedChannelIds"
            />
            <span>{{ channel.name }}</span>
          </label>
        </div>
        <div class="modal-buttons">
          <button @click="confirmChannelSelection" class="confirm-btn">Select</button>
          <button @click="closeChannelModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showMemberModal" class="modal-overlay" @click="closeMemberModal">
      <div class="modal-content" @click.stop>
        <h3>Select User</h3>
        <input
          v-model="memberSearchQuery"
          type="text"
          placeholder="Search members..."
          class="input-field"
        />
        <div class="member-list">
          <button
            v-for="member in filteredMembers"
            :key="member.id"
            @click="selectMember(member)"
            class="member-option"
          >
            <img v-if="member.avatar" :src="member.avatar" :alt="member.username" class="avatar-small" />
            <span>{{ member.username }}</span>
          </button>
        </div>
        <div class="modal-buttons">
          <button @click="closeMemberModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showResetModal" class="modal-overlay" @click="closeResetModal">
      <div class="modal-content" @click.stop>
        <h3>{{ resetModalTitle }}</h3>
        <p>{{ resetModalMessage }}</p>
        <div class="modal-buttons">
          <button @click="confirmReset" class="confirm-btn">Confirm</button>
          <button @click="closeResetModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import ToggleSwitch from '../components/ToggleSwitch.vue'

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

// Settings
const levelingSettings = reactive({
  enabled: true,
  xpPerMessage: 10,
  voiceXp: 10,
  levelUpMessage: '🎉 {user} has reached Level {level}!',
  levelUpChannel: '',
  allowedChannels: '',
})

const economySettings = reactive({
  enabled: true,
  currencyPerMessage: 10,
  currencySymbol: '💰',
  startingAmount: 500,
})

const statusSettings = reactive({
  enabled: true,
  userToTrack: '',
  trackingChannel: '',
  delay: 60,
  automatic: true,
  useEmbed: false,
  offlineMessage: 'User is currently offline',
})

const welcomeSettings = reactive({
  enabled: true,
  useEmbed: false,
  welcomeChannel: '',
  messageText: 'Welcome to {server}, {user}!',
  embedTitle: 'Welcome!',
  embedDescription: 'Welcome to {server}! We\'re glad to have you here.',
  embedFooter: 'Thanks for joining!',
})

// Modal state
const showChannelModal = ref(false)
const showMemberModal = ref(false)
const showResetModal = ref(false)
const guildChannels = ref([])
const guildMembers = ref([])
const selectedChannelIds = ref([])
const memberSearchQuery = ref('')
const currentChannelField = ref(null)
const currentSettingsObject = ref(null)
const resetModalTitle = ref('')
const resetModalMessage = ref('')
const resetType = ref(null)

// Computed
const filteredServers = computed(() => {
  return servers.value.filter(server =>
    server.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredMembers = computed(() => {
  return guildMembers.value.filter(member =>
    member.username.toLowerCase().includes(memberSearchQuery.value.toLowerCase())
  )
})

const getMedalClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

// Preview computed properties
const levelUpPreview = computed(() => {
  let msg = levelingSettings.levelUpMessage
    .replace('{user}', 'Blake')
    .replace('{level}', '3')
  return `<div class="message-preview">${escapeHtml(msg)}</div>`
})

const statusPreview = computed(() => {
  if (statusSettings.useEmbed) {
    return `<div class="embed-preview">
      <div class="embed-title">User Status</div>
      <div class="embed-field">${escapeHtml(statusSettings.offlineMessage)}</div>
    </div>`
  }
  return `<div class="message-preview">${escapeHtml(statusSettings.offlineMessage)}</div>`
})

const welcomePreview = computed(() => {
  if (welcomeSettings.useEmbed) {
    return `<div class="embed-preview">
      <div class="embed-title">${escapeHtml(welcomeSettings.embedTitle)}</div>
      <div class="embed-field">${escapeHtml(welcomeSettings.embedDescription).replace('{user}', 'Blake').replace('{server}', selectedServer.value.name)}</div>
      <div class="embed-footer">${escapeHtml(welcomeSettings.embedFooter)}</div>
    </div>`
  }
  let msg = welcomeSettings.messageText
    .replace('{user}', 'Blake')
    .replace('{server}', selectedServer.value.name)
  return `<div class="message-preview">${escapeHtml(msg)}</div>`
})

// Methods
const loadServers = async () => {
  if (!authStore.user || !authStore.token) return

  loading.value = true
  try {
    const userResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    if (!userResponse.ok) {
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
    loadLeaderboardData(server.id),
    loadAllSettings(server.id),
    loadGuildChannels(server.id),
    loadGuildMembers(server.id),
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

const loadAllSettings = async (guildId) => {
  try {
    const [levelingRes, economyRes, statusRes, welcomeRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/leveling/${guildId}/settings`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      fetch(`${BACKEND_URL}/api/economy/${guildId}/settings`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      fetch(`${BACKEND_URL}/api/status/${guildId}/settings`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      fetch(`${BACKEND_URL}/api/welcome/${guildId}/settings`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
    ])

    if (levelingRes.ok) {
      const data = await levelingRes.json()
      Object.assign(levelingSettings, data.settings || {})
    }
    if (economyRes.ok) {
      const data = await economyRes.json()
      Object.assign(economySettings, data.settings || {})
    }
    if (statusRes.ok) {
      const data = await statusRes.json()
      Object.assign(statusSettings, data.settings || {})
    }
    if (welcomeRes.ok) {
      const data = await welcomeRes.json()
      Object.assign(welcomeSettings, data.settings || {})
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

const loadGuildChannels = async (guildId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/channels/${guildId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (response.ok) {
      const data = await response.json()
      guildChannels.value = data.channels || []
    }
  } catch (error) {
    console.error('Error loading channels:', error)
  }
}

const loadGuildMembers = async (guildId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/members/${guildId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (response.ok) {
      const data = await response.json()
      guildMembers.value = data.members || []
    }
  } catch (error) {
    console.error('Error loading members:', error)
  }
}

const openChannelSelector = (settingsObject, fieldName) => {
  currentSettingsObject.value = settingsObject
  currentChannelField.value = fieldName
  selectedChannelIds.value = []
  showChannelModal.value = true
}

const confirmChannelSelection = () => {
  if (currentSettingsObject.value && currentChannelField.value) {
    const settings = eval(currentSettingsObject.value)
    settings[currentChannelField.value] = selectedChannelIds.value
      .map(id => guildChannels.value.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }
  closeChannelModal()
}

const closeChannelModal = () => {
  showChannelModal.value = false
  selectedChannelIds.value = []
}

const openMemberSelector = () => {
  memberSearchQuery.value = ''
  showMemberModal.value = true
}

const selectMember = (member) => {
  statusSettings.userToTrack = member.username
  closeMemberModal()
}

const closeMemberModal = () => {
  showMemberModal.value = false
  memberSearchQuery.value = ''
}

const saveLevelingSettings = async () => {
  if (!selectedServer.value) return
  try {
    const response = await fetch(`${BACKEND_URL}/api/leveling/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(levelingSettings)
    })
    if (response.ok) alert('Leveling settings saved!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Error saving settings')
  }
}

const saveEconomySettings = async () => {
  if (!selectedServer.value) return
  try {
    const response = await fetch(`${BACKEND_URL}/api/economy/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(economySettings)
    })
    if (response.ok) alert('Economy settings saved!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Error saving settings')
  }
}

const saveStatusSettings = async () => {
  if (!selectedServer.value) return
  try {
    const response = await fetch(`${BACKEND_URL}/api/status/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(statusSettings)
    })
    if (response.ok) alert('Status tracking settings saved!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Error saving settings')
  }
}

const saveWelcomeSettings = async () => {
  if (!selectedServer.value) return
  try {
    const response = await fetch(`${BACKEND_URL}/api/welcome/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(welcomeSettings)
    })
    if (response.ok) alert('Welcome settings saved!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Error saving settings')
  }
}

const showResetEconomyModal = () => {
  resetModalTitle.value = 'Reset Economy'
  resetModalMessage.value = 'Are you sure you want to reset all users\' balances?'
  resetType.value = 'economy'
  showResetModal.value = true
}

const resetLevelingSettings = () => {
  Object.assign(levelingSettings, {
    enabled: true,
    xpPerMessage: 10,
    voiceXp: 10,
    levelUpMessage: '🎉 {user} has reached Level {level}!',
    levelUpChannel: '',
    allowedChannels: '',
  })
}

const resetEconomyBalances = async () => {
  if (!selectedServer.value) return
  try {
    const response = await fetch(`${BACKEND_URL}/api/economy/${selectedServer.value.id}/reset-balances`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (response.ok) alert('Economy balances reset!')
  } catch (error) {
    console.error('Error resetting balances:', error)
  }
}

const resetStatusSettings = () => {
  Object.assign(statusSettings, {
    enabled: true,
    userToTrack: '',
    trackingChannel: '',
    delay: 60,
    automatic: true,
    useEmbed: false,
    offlineMessage: 'User is currently offline',
  })
}

const resetWelcomeSettings = () => {
  Object.assign(welcomeSettings, {
    enabled: true,
    useEmbed: false,
    welcomeChannel: '',
    messageText: 'Welcome to {server}, {user}!',
    embedTitle: 'Welcome!',
    embedDescription: 'Welcome to {server}! We\'re glad to have you here.',
    embedFooter: 'Thanks for joining!',
  })
}

const confirmReset = () => {
  if (resetType.value === 'economy') {
    resetEconomyBalances()
  }
  closeResetModal()
}

const closeResetModal = () => {
  showResetModal.value = false
  resetType.value = null
}

const updateLevelUpPreview = () => {
  // Computed property handles this
}

const updateStatusPreview = () => {
  // Computed property handles this
}

const updateWelcomePreview = () => {
  // Computed property handles this
}

const inviteBot = (server) => {
  const DISCORD_CLIENT_ID = '1436123870158520411'
  const REDIRECT_URI = 'https://status-bot.xyz/servers'
  const BOT_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&permissions=8&scope=bot%20applications.commands`
  window.open(`${BOT_INVITE_URL}&guild_id=${server.id}`, '_blank')
}

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, m => map[m])
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.login-required h2 {
  font-size: 32px;
  color: #fff;
  margin-bottom: 16px;
}

.login-required p {
  color: #999;
  font-size: 16px;
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
  width: 100%;
  max-width: 500px;
  padding: 12px 16px;
  background: rgba(81, 112, 255, 0.1);
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: #fff;
  margin-bottom: 30px;
}

.search-box:focus {
  outline: none;
  background: rgba(81, 112, 255, 0.15);
  box-shadow: 0 0 15px rgba(81, 112, 255, 0.3);
}

.loading-container,
.empty-state {
  text-align: center;
  color: #999;
  padding: 60px 20px;
}

.servers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.server-card {
  border: 2px solid #5170ff;
  border-radius: 12px;
  padding: 24px;
  background: rgba(81, 112, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.server-card:hover {
  background: rgba(81, 112, 255, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(81, 112, 255, 0.2);
}

.server-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: #5170ff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  color: #fff;
}

.server-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #fff;
}

.server-button {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.server-button.configure {
  background: linear-gradient(135deg, rgba(59, 91, 219, 0.8), rgba(59, 91, 219, 0.5));
  border-color: #3b5bdb;
  color: #fff;
}

.server-button.view {
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.8), rgba(128, 128, 128, 0.5));
  border-color: #808080;
  color: #fff;
}

.server-button.invite-bot {
  background: linear-gradient(135deg, rgba(92, 184, 92, 0.8), rgba(92, 184, 92, 0.5));
  border-color: #5cb85c;
  color: #fff;
}

.server-button.no-access {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.8), rgba(220, 53, 69, 0.5));
  border-color: #dc3545;
  color: #fff;
  cursor: not-allowed;
}

.server-button:hover:not(.no-access) {
  opacity: 1;
  transform: translateY(-2px);
}

/* Config View */
.config-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.config-header {
  padding: 30px 50px;
  border-bottom: 1px solid #333;
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

.config-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.config-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.config-sidebar {
  width: 250px;
  border-right: 1px solid #333;
  padding: 20px 0;
  overflow-y: auto;
}

.config-nav {
  display: flex;
  flex-direction: column;
}

.nav-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: #aaa;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-btn:hover {
  background: rgba(81, 112, 255, 0.1);
  color: #5170ff;
}

.nav-btn.active {
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
  max-width: 1000px;
}

.config-section h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-section h3::before {
  content: '';
  width: 4px;
  height: 24px;
  background: #5170ff;
  border-radius: 2px;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.overview-panel {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
}

.overview-panel h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #fff;
}

.overview-panel h3::before {
  display: none;
}

.user-list,
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-row,
.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.15);
  border-radius: 8px;
}

.leaderboard-item.gold {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.leaderboard-item.silver {
  background: rgba(192, 192, 192, 0.1);
  border-color: rgba(192, 192, 192, 0.3);
}

.leaderboard-item.bronze {
  background: rgba(205, 127, 50, 0.1);
  border-color: rgba(205, 127, 50, 0.3);
}

.rank {
  font-weight: 800;
  color: #5170ff;
  min-width: 40px;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-small {
  width: 32px;
  height: 32px;
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
  font-size: 14px;
}

.level {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.stat {
  font-weight: 700;
  color: #fbbf24;
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 16px;
  margin-left: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.stat-item .label {
  color: #888;
  text-transform: uppercase;
}

.stat-item .value {
  font-weight: 700;
}

.xp-color {
  color: #fbbf24;
}

.balance-color {
  color: #4ade80;
}

.voice-color {
  color: #38bdf8;
}

.msg-color {
  color: #c084fc;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 30px;
}

.settings-box {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-weight: 600;
  color: #fff;
  font-size: 15px;
}

.input-field {
  padding: 10px 12px;
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.input-field:hover {
  background: rgba(81, 112, 255, 0.3);
}

.input-field:focus {
  box-shadow: 0 0 12px rgba(81, 112, 255, 0.4);
}

.input-field.textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.input-field:disabled {
  color: #666;
}

.channel-selector {
  display: flex;
  gap: 8px;
}

.channel-selector .input-field {
  flex: 1;
}

.select-btn {
  width: 50px;
  padding: 10px 12px;
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-btn:hover {
  background: rgba(81, 112, 255, 0.35);
}

.preview-box {
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-left: 4px solid #5170ff;
  border-radius: 4px;
  margin-top: 8px;
}

.preview-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.preview-content {
  color: #ddd;
  font-size: 14px;
}

.message-preview {
  word-break: break-word;
}

.embed-preview {
  background: #2a2a2a;
  border-left: 4px solid #5170ff;
  padding: 12px;
  border-radius: 4px;
}

.embed-title {
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.embed-field {
  color: #ccc;
  margin-bottom: 8px;
}

.embed-footer {
  font-size: 12px;
  color: #999;
}

.button-group {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(81, 112, 255, 0.2);
}

.save-btn {
  flex: 1;
  padding: 12px 20px;
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background: rgba(81, 112, 255, 0.35);
}

.reset-btn {
  padding: 12px 20px;
  background: rgba(220, 53, 69, 0.2);
  border: 2px solid #dc3545;
  border-radius: 8px;
  color: #dc3545;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: rgba(220, 53, 69, 0.35);
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border: 2px solid #5170ff;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 0 30px rgba(81, 112, 255, 0.3);
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.modal-content p {
  color: #ccc;
  margin-bottom: 24px;
  line-height: 1.5;
}

.channel-list,
.member-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.channel-option,
.member-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #fff;
}

.channel-option:hover,
.member-option:hover {
  background: rgba(81, 112, 255, 0.1);
}

.channel-option input {
  cursor: pointer;
}

.member-option {
  border: none;
  background: transparent;
  padding: 8px 0;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.confirm-btn,
.cancel-btn {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn {
  background: rgba(81, 112, 255, 0.2);
  border-color: #5170ff;
  color: #fff;
}

.confirm-btn:hover {
  background: rgba(81, 112, 255, 0.35);
}

.cancel-btn {
  background: rgba(128, 128, 128, 0.2);
  border-color: #808080;
  color: #fff;
}

.cancel-btn:hover {
  background: rgba(128, 128, 128, 0.35);
}
</style>
