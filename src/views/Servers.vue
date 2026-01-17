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
        <button class="back-btn" @click="router.push('/servers')">Back</button>
        <div class="header-content">
          <img v-if="selectedServer.icon" :src="selectedServer.icon" :alt="selectedServer.name" class="server-icon-header" />
          <div v-else class="server-icon-header-placeholder">{{ selectedServer.name.charAt(0).toUpperCase() }}</div>
          <h2>{{ selectedServer.name }}</h2>
        </div>
        <!-- Hamburger Menu for Mobile -->
        <button class="mobile-hamburger" @click="isMobileNavOpen = !isMobileNavOpen">
          <span :class="{ open: isMobileNavOpen }"></span>
          <span :class="{ open: isMobileNavOpen }"></span>
          <span :class="{ open: isMobileNavOpen }"></span>
        </button>
      </div>

      <div class="config-container">
        <!-- Sidebar (Hidden on Mobile unless menu is open) -->
        <aside class="config-sidebar" :class="{ 'mobile-open': isMobileNavOpen }">
          <nav class="config-nav">
            <button
              v-for="section in filteredSections"
              :key="section.id"
              class="nav-btn"
              :class="{ active: activeSection === section.id }"
              @click="activeSection = section.id; isMobileNavOpen = false"
            >
              <span class="nav-icon">{{ section.icon }}</span>
              <span>{{ section.label }}</span>
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="config-main">
          <!-- Overview -->
          <section v-if="activeSection === 'overview'" class="config-section">
            <div class="overview-container">
              <!-- Server Stats -->
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-icon xp-icon">⭐</div>
                  <div class="stat-content">
                    <div class="stat-label">Total XP</div>
                    <div class="stat-value">{{ totalStats.totalXp }}</div>
                  </div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon balance-icon">💰</div>
                  <div class="stat-content">
                    <div class="stat-label">Total Currency</div>
                    <div class="stat-value">{{ totalStats.totalBalance }}</div>
                  </div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon members-icon">👥</div>
                  <div class="stat-content">
                    <div class="stat-label">Members</div>
                    <div class="stat-value">{{ totalStats.membersTracked }}</div>
                  </div>
                </div>
              </div>

              <!-- Leaderboard with sidebar -->
              <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: start;">
                <!-- Left: Leaderboard -->
                <div class="overview-panel">
                  <h3>Leaderboard</h3>
                  <div v-if="leaderboardLoading" class="loading">Loading leaderboard...</div>
                  <div v-else-if="leaderboardData.length > 0" class="leaderboard">
                    <div
                      v-for="(user, idx) in leaderboardData.slice(0, 10)"
                      :key="user.id"
                      class="leaderboard-item"
                      :class="getMedalClass(idx)"
                    >
                      <span class="rank" :class="getMedalClass(idx)">{{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '#' + (idx + 1) }}</span>
                      <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="avatar" />
                      <div class="user-info">
                        <p class="username">{{ user.username }}</p>
                        <p class="level">Level {{ user.level || 0 }}</p>
                      </div>
                      <div class="stats">
                        <div class="stat-item">
                          <span class="label">XP</span>
                          <span class="value xp-color">{{ (user.xp || 0).toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                          <span class="label">Balance</span>
                          <span class="value balance-color">{{ (user.balance || 0).toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                          <span class="label">Voice</span>
                          <span class="value voice-color">{{ user.voiceTime || 0 }}m</span>
                        </div>
                        <div class="stat-item">
                          <span class="label">Msgs</span>
                          <span class="value msg-color">{{ (user.messages || 0).toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty">No leaderboard data available. Users will appear here once they start earning XP!</div>
                </div>

                <!-- Right: Info Box + Rank Card -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                  <!-- How XP Works Info Box -->
                  <div class="info-box">
                    <h3>How XP works</h3>
                    <p>First to enable the XP system go to the <strong>Leveling</strong> section, toggle in on. Then set up your preferences for the XP rewards. Then, when a user sends a message, or spends time in a voice chat, they earn XP.</p>
                  </div>

                  <!-- Your Rank Card -->
                  <div class="rank-card">
                    <h3>Your Rank</h3>
                    <div class="rank-avatar" :style="{ backgroundImage: userRankData.avatarUrl ? `url('${userRankData.avatarUrl}')` : 'none' }">
                      {{ !userRankData.avatarUrl ? (authStore.user?.username?.charAt(0) || 'U').toUpperCase() : '' }}
                    </div>
                    <div class="rank-number">#{{ userRankData.rank || '-' }}</div>
                    <div class="rank-xp">{{ userRankData.xp?.toLocaleString() || 0 }}/{{ userRankData.nextLevelXp?.toLocaleString() || '-' }} XP</div>
                    <div class="rank-level">Level: <span>{{ userRankData.level || '-' }}</span></div>
                    <div class="rank-bar">
                      <div class="rank-bar-fill" :style="{ width: userRankData.progressPercent + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Leaderboard Page -->
          <section v-else-if="activeSection === 'leaderboard'" class="config-section">
            <div style="display: grid; grid-template-columns: 1fr 500px; gap: 40px; align-items: start;">
              <!-- Main Leaderboard -->
              <div>
                <h3>Leaderboard</h3>
                <div v-if="leaderboardLoading" class="loading">Loading leaderboard...</div>
                <div v-else-if="leaderboardData.length > 0" class="leaderboard leaderboard-full">
                  <div
                    v-for="(user, idx) in leaderboardData"
                    :key="user.id"
                    class="leaderboard-item"
                    :class="getMedalClass(idx)"
                  >
                    <span class="rank" :class="getMedalClass(idx)">{{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '#' + (idx + 1) }}</span>
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="avatar" />
                    <div class="user-info">
                      <p class="username">{{ user.username }}</p>
                      <p class="level">Level {{ user.level || 0 }}</p>
                    </div>
                    <div class="stats">
                      <div class="stat-item">
                        <span class="label">XP</span>
                        <span class="value xp-color">{{ (user.xp || 0).toLocaleString() }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="label">Balance</span>
                        <span class="value balance-color">{{ (user.balance || 0).toLocaleString() }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="label">Voice</span>
                        <span class="value voice-color">{{ user.voiceTime || 0 }}m</span>
                      </div>
                      <div class="stat-item">
                        <span class="label">Msgs</span>
                        <span class="value msg-color">{{ (user.messages || 0).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">No leaderboard data available. Users will appear here once they start earning XP!</div>
              </div>

              <!-- Right Sidebar: Info Box + Rank Card -->
              <div style="display: flex; flex-direction: column; gap: 40px; margin-top: 54px;">
                <!-- How XP Works Info Box -->
                <div class="info-box">
                  <h3>How XP works</h3>
                  <p>First to enable the XP system go to the <strong>Leveling</strong> section, use the toggle button, or use <strong>/xp toggle</strong> in discord. Then set up your preferences for the XP rewards. Then, when a user sends a message, or spends time in a voice chat, they earn XP.</p>
                </div>

                <!-- Your Rank Card -->
                <div class="rank-card">
                  <h3>Your Rank</h3>
                  <div class="rank-avatar" :style="{ backgroundImage: userRankData.avatarUrl ? `url('${userRankData.avatarUrl}')` : 'none' }">
                    {{ !userRankData.avatarUrl ? (authStore.user?.username?.charAt(0) || 'U').toUpperCase() : '' }}
                  </div>
                  <div class="rank-number">#{{ userRankData.rank || '-' }}</div>
                  <div class="rank-xp">{{ userRankData.xp?.toLocaleString() || 0 }}/{{ userRankData.nextLevelXp?.toLocaleString() || '-' }} XP</div>
                  <div class="rank-level">Level: <span>{{ userRankData.level || '-' }}</span></div>
                  <div class="rank-bar">
                    <div class="rank-bar-fill" :style="{ width: userRankData.progressPercent + '%' }"></div>
                  </div>
                </div>
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
                <label>XP per message <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="levelingSettings.xpPerMessage" type="number" min="1" class="input-field" :disabled="!userHasPremium" />
                <p v-if="!userHasPremium" class="premium-note">Upgrade to Premium to customize XP rewards</p>
              </div>

              <div class="setting-item">
                <label>Voice chat XP <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="levelingSettings.voiceXp" type="number" min="1" class="input-field" :disabled="!userHasPremium" />
                <p v-if="!userHasPremium" class="premium-note">Upgrade to Premium to customize voice rewards</p>
              </div>

              <div class="setting-item">
                <label>XP Cooldown (seconds) <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="levelingSettings.xpCooldown" type="number" min="1" max="300" class="input-field" :disabled="!userHasPremium" placeholder="60" />
                <p v-if="!userHasPremium" class="premium-note">Upgrade to Premium to customize cooldown settings</p>
              </div>

              <div class="setting-item">
                <label>Level up channel</label>
                <div class="channel-selector">
                  <input
                    type="text"
                    :value="levelingChannelName"
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
                    type="text"
                    :value="allowedChannelsDisplay"
                    placeholder="All channels"
                    disabled
                    class="input-field"
                  />
                  <button @click="openChannelSelector('levelingSettings', 'allowedChannels')" class="select-btn">+</button>
                </div>
              </div>

              <div class="button-group">
                <button @click="saveLevelingSettings" class="save-btn" :class="{ 'save-success': levelingSaveSuccess }" :disabled="levelingSaveLoading">
                  <span v-if="levelingSaveLoading" class="spinner"></span>
                  {{ levelingSaveSuccess ? '✓ Saved Successfully' : levelingSaveLoading ? 'Saving...' : 'Save' }}
                </button>
                <button @click="resetLevelingSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>

          <!-- Economy -->
          <section v-else-if="activeSection === 'economy'" class="config-section">
            <h3>Economy System <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Economy</label>
                <toggle-switch v-model="economySettings.enabled" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Currency gained per message</label>
                <input v-model.number="economySettings.currencyPerMessage" type="number" min="1" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Currency symbol</label>
                <input v-model="economySettings.currencySymbol" type="text" class="input-field" placeholder="💰" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Starting amount</label>
                <input v-model.number="economySettings.startingAmount" type="number" min="0" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Balance multiplier <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="economySettings.balanceMultiplier" type="number" step="0.1" min="0.1" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Daily interest rate (%) <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="economySettings.dailyInterestRate" type="number" step="0.1" min="0" max="100" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Robbery success chance (%) <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="economySettings.robberyChance" type="number" step="0.1" min="0" max="100" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Work reward multiplier <span v-if="!userHasPremium" class="premium-badge">⭐ Premium</span></label>
                <input v-model.number="economySettings.workRewardMultiplier" type="number" step="0.1" min="0.1" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="button-group">
                <button @click="saveEconomySettings" class="save-btn" :class="{ 'save-success': economySaveSuccess }" :disabled="economySaveLoading || !userHasPremium">
                  <span v-if="economySaveLoading" class="spinner"></span>
                  {{ economySaveSuccess ? '✓ Saved Successfully' : economySaveLoading ? 'Saving...' : 'Save' }}
                </button>
                <button @click="showResetEconomyModal" class="reset-btn" :disabled="!userHasPremium">Reset All Balances</button>
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
                    v-model="trackedUserName"
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
                    type="text"
                    :value="trackingChannelName"
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
                />
              </div>

              <div class="button-group">
                <button @click="saveStatusSettings" class="save-btn" :class="{ 'save-success': statusSaveSuccess }" :disabled="statusSaveLoading">
                  <span v-if="statusSaveLoading" class="spinner"></span>
                  {{ statusSaveSuccess ? '✓ Saved Successfully' : statusSaveLoading ? 'Saving...' : 'Save' }}
                </button>
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
                    v-model="welcomeChannelName"
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

              <div class="info-box">
                <strong>Available placeholders:</strong>
                <div style="font-size: 12px; color: #999; margin-top: 8px;">
                  {user} • {user_icon} • {servername} • {server_icon} • {members} • {member_count}
                </div>
              </div>

              <div v-if="!welcomeSettings.useEmbed" class="setting-item">
                <label>Message text</label>
                <textarea
                  v-model="welcomeSettings.messageText"
                  class="input-field textarea"
                  placeholder="Welcome to {servername}, {user}!"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Embed title</label>
                <input
                  v-model="welcomeSettings.embedTitle"
                  type="text"
                  class="input-field"
                  placeholder="Welcome!"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Description</label>
                <textarea
                  v-model="welcomeSettings.embedDescription"
                  class="input-field textarea"
                  placeholder="Welcome to {servername}! We're glad to have you here."
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Thumbnail URL (small image, right side)</label>
                <input
                  v-model="welcomeSettings.embedThumbnail"
                  type="text"
                  class="input-field"
                  placeholder="https://example.com/thumbnail.png"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Image URL (large image, bottom)</label>
                <input
                  v-model="welcomeSettings.embedImage"
                  type="text"
                  class="input-field"
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Embed color (hex)</label>
                <input
                  v-model="welcomeSettings.embedColor"
                  type="text"
                  class="input-field"
                  placeholder="#5170ff"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Footer</label>
                <input
                  v-model="welcomeSettings.embedFooter"
                  type="text"
                  class="input-field"
                  placeholder="Thanks for joining!"
                />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Custom field (optional)</label>
                <div style="display: flex; gap: 8px;">
                  <input
                    v-model="welcomeSettings.embedFieldName"
                    type="text"
                    class="input-field"
                    placeholder="Field name"
                    style="flex: 1;"
                  />
                  <input
                    v-model="welcomeSettings.embedFieldValue"
                    type="text"
                    class="input-field"
                    placeholder="Field value"
                    style="flex: 1;"
                  />
                </div>
              </div>

              <div class="button-group">
                <button @click="saveWelcomeSettings" class="save-btn" :class="{ 'save-success': welcomeSaveSuccess }" :disabled="welcomeSaveLoading">
                  <span v-if="welcomeSaveLoading" class="spinner"></span>
                  {{ welcomeSaveSuccess ? '✓ Saved Successfully' : welcomeSaveLoading ? 'Saving...' : 'Save' }}
                </button>
                <button @click="resetWelcomeSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>

          <!-- Member Goals -->
          <section v-else-if="activeSection === 'member-goals'" class="config-section">
            <h3>Member Goals</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Member Goals</label>
                <toggle-switch v-model="memberGoalsSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Member Count Channel</label>
                <div class="channel-selector">
                  <input 
                    v-model="memberCountChannelName" 
                    type="text" 
                    class="input-field" 
                    readonly 
                    placeholder="Select channel..." 
                  />
                  <button @click="openChannelSelector('memberGoalsSettings', 'memberCountChannelId')" class="select-btn">+</button>
                </div>
                <small>Channel name will display as: "Members: 150"</small>
              </div>

              <div class="setting-item">
                <label>Member Goal Channel</label>
                <div class="channel-selector">
                  <input 
                    v-model="memberGoalChannelName" 
                    type="text" 
                    class="input-field" 
                    readonly 
                    placeholder="Select channel..." 
                  />
                  <button @click="openChannelSelector('memberGoalsSettings', 'memberGoalChannelId')" class="select-btn">+</button>
                </div>
                <small>Channel will display goal countdown or completion status</small>
              </div>

              <div class="setting-item">
                <label>Target Member Goal</label>
                <input v-model.number="memberGoalsSettings.memberGoal" type="number" min="0" class="input-field" placeholder="e.g., 500" />
                <small>Set to 0 to disable the goal counter</small>
              </div>

              <div class="button-group">
                <button @click="saveMemberGoalsSettings" class="save-btn" :disabled="memberGoalsSaveLoading" :class="{ 'save-success': memberGoalsSaveSuccess }">
                  <span v-if="memberGoalsSaveLoading" class="spinner"></span>
                  {{ memberGoalsSaveSuccess ? '✓ Saved Successfully' : memberGoalsSaveLoading ? 'Saving...' : 'Save' }}
                </button>
                <button @click="resetMemberGoalsSettings" class="reset-btn">Reset</button>
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
          <label v-for="member in filteredMembers" :key="member.id" class="member-option-label">
            <input
              type="radio"
              name="selectedMember"
              :value="member.id"
              @change="selectMember(member)"
              class="member-radio"
            />
            <img v-if="member.avatar" :src="member.avatar" :alt="member.username" class="avatar-small" />
            <div class="member-info">
              <div class="member-username">@{{ member.username }}</div>
              <div class="member-id">ID: {{ member.id }}</div>
            </div>
          </label>
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
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ToggleSwitch from '../components/ToggleSwitch.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const overviewLoading = ref(false)
const leaderboardLoading = ref(false)
const servers = ref([])
const selectedServer = ref(null)
const searchQuery = ref('')
const activeSection = ref('overview')
const overviewData = ref([])
const leaderboardData = ref([])

const userRankData = reactive({
  rank: null,
  level: null,
  xp: 0,
  nextLevelXp: 0,
  progressPercent: 0,
  avatarUrl: null
})

const levelingSaveSuccess = ref(false)
const levelingSaveLoading = ref(false)
const economySaveSuccess = ref(false)
const economySaveLoading = ref(false)
const statusSaveSuccess = ref(false)
const statusSaveLoading = ref(false)
const welcomeSaveSuccess = ref(false)
const welcomeSaveLoading = ref(false)
const memberGoalsSaveSuccess = ref(false)
const memberGoalsSaveLoading = ref(false)

const isMobileNavOpen = ref(false)

const userHasPremium = ref(false)

const fetchPremiumStatus = async () => {
  if (!selectedServer.value?.id) return
  try {
    const response = await fetch(`${BACKEND_URL}/api/user-premium/${authStore.user?.id}`)
    if (response.ok) {
      const data = await response.json()
      userHasPremium.value = data.hasPremium || false
    }
  } catch (err) {
    console.error('Failed to fetch premium status:', err)
  }
}

const BACKEND_URL = 'https://status-bot-backend.onrender.com'

const sections = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'leveling', label: 'Leveling', icon: '⬆️' },
  { id: 'economy', label: 'Economy', icon: '💰' },
  { id: 'status-tracking', label: 'Status Tracking', icon: '🟢' },
  { id: 'welcome', label: 'Welcome', icon: '👋' },
  { id: 'member-goals', label: 'Member Goals', icon: '👥' },
]

const levelingSettings = reactive({
  enabled: true,
  xpPerMessage: 10,
  voiceXp: 10,
  xpCooldown: 60,
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
  userToTrackId: '',
  trackingChannel: '',
  delay: 60,
  automatic: true,
  useEmbed: false,
  offlineMessage: 'User is currently offline',
  messageId: null
})

const welcomeSettings = reactive({
  enabled: true,
  useEmbed: false,
  welcomeChannel: '',
  messageText: 'Welcome to {servername}, {user}!',
  embedTitle: 'Welcome!',
  embedDescription: 'Welcome to {servername}! We\'re glad to have you here.',
  embedFooter: 'Thanks for joining!',
  embedThumbnail: '',
  embedImage: '',
  embedColor: '#5170ff',
  embedFieldName: '',
  embedFieldValue: '',
})

const memberGoalsSettings = reactive({
  enabled: true,
  memberCountChannelId: '',
  memberGoalChannelId: '',
  memberGoal: 0,
})

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
const totalGuildMembers = ref(0)
const resetModalMessage = ref('')
const resetType = ref(null)

const filteredServers = computed(() => {
  return servers.value.filter(server =>
    server.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredSections = computed(() => {
  if (selectedServer.value?.buttonType === 'view') {
    return sections.filter(s => ['overview', 'leaderboard'].includes(s.id))
  }
  return sections
})

watch(activeSection, (newSection) => {
  if (selectedServer.value?.buttonType === 'view') {
    if (!['overview', 'leaderboard'].includes(newSection)) {
      activeSection.value = 'overview'
    }
  }
})

const getMedalClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

const totalStats = computed(() => {
  return {
    totalXp: leaderboardData.value.reduce((sum, u) => sum + (u.xp || 0), 0).toLocaleString(),
    totalBalance: leaderboardData.value.reduce((sum, u) => sum + (u.balance || 0), 0).toLocaleString(),
    membersTracked: totalGuildMembers.value
  }
})

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
    const desc = welcomeSettings.embedDescription
      .replace('{user}', 'Blake')
      .replace('{server}', selectedServer.value.name)
    return `<div class="embed-preview" style="border-left: 4px solid ${welcomeSettings.embedColor}">
      ${welcomeSettings.embedAuthor ? `<div class="embed-author">${escapeHtml(welcomeSettings.embedAuthor)}</div>` : ''}
      <div class="embed-title">${escapeHtml(welcomeSettings.embedTitle)}</div>
      <div class="embed-description">${escapeHtml(desc)}</div>
      ${welcomeSettings.embedThumbnail ? `<img src="${welcomeSettings.embedThumbnail}" alt="embed" class="embed-thumbnail" />` : ''}
      <div class="embed-footer">${escapeHtml(welcomeSettings.embedFooter)}</div>
    </div>`
  }
  let msg = welcomeSettings.messageText
    .replace('{user}', 'Blake')
    .replace('{server}', selectedServer.value.name)
  return `<div class="message-preview">${escapeHtml(msg)}</div>`
})

const filteredMembers = computed(() => {
  return guildMembers.value.filter(member =>
    member.username.toLowerCase().includes(memberSearchQuery.value.toLowerCase())
  )
})

const trackingChannelName = computed(() => {
  if (!statusSettings.trackingChannel) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === statusSettings.trackingChannel)
  return channel ? channel.name : statusSettings.trackingChannel
})

const levelingChannelName = computed(() => {
  if (!levelingSettings.levelUpChannel) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === levelingSettings.levelUpChannel)
  return channel ? channel.name : levelingSettings.levelUpChannel
})

const welcomeChannelName = computed(() => {
  if (!welcomeSettings.welcomeChannel) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === welcomeSettings.welcomeChannel)
  return channel ? channel.name : welcomeSettings.welcomeChannel
})

const trackedUserName = computed(() => {
  if (!statusSettings.userToTrackId) return 'None selected'
  const member = guildMembers.value.find(m => m.id === statusSettings.userToTrackId)
  return member ? member.username : statusSettings.userToTrackId
})

const memberCountChannelName = computed(() => {
  if (!memberGoalsSettings.memberCountChannelId) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === memberGoalsSettings.memberCountChannelId)
  return channel ? channel.name : memberGoalsSettings.memberCountChannelId
})

const memberGoalChannelName = computed(() => {
  if (!memberGoalsSettings.memberGoalChannelId) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === memberGoalsSettings.memberGoalChannelId)
  return channel ? channel.name : memberGoalsSettings.memberGoalChannelId
})

const allowedChannelsDisplay = computed(() => {
  if (!levelingSettings.allowedChannels || levelingSettings.allowedChannels.length === 0) {
    return 'None selected'
  }
  const channelIds = typeof levelingSettings.allowedChannels === 'string' 
    ? levelingSettings.allowedChannels.split(', ') 
    : levelingSettings.allowedChannels
  
  return channelIds
    .map(id => {
      const channel = guildChannels.value.find(c => c.id === id)
      return channel ? channel.name : id
    })
    .filter(Boolean)
    .join(', ')
})

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

    const DEV_USER_ID = '1362553254117904496'
    const isDevUser = authStore.user.id === DEV_USER_ID

    const MANAGE_GUILD = BigInt(0x20)
    const processedServers = userGuilds.map(guild => {
      const permissions = BigInt(guild.permissions || 0)
      const hasManage = (permissions & MANAGE_GUILD) === MANAGE_GUILD
      const isBotPresent = botGuildIds.has(guild.id)

      let buttonType = 'no-access'
      if (isDevUser && isBotPresent) buttonType = 'configure'
      else if (hasManage && isBotPresent) buttonType = 'configure'
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
  router.push(`/servers/${server.id}`)
  
  if (server.buttonType === 'view') {
    activeSection.value = 'overview'
  } else if (server.buttonType === 'configure') {
    activeSection.value = 'overview'
  }
  
  await Promise.all([
    loadOverviewData(server.id),
    loadLeaderboardData(server.id),
    loadAllSettings(server.id),
    loadGuildChannels(server.id),
    fetchPremiumStatus(),
  ])
  guildMembers.value = leaderboardData.value.map(u => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar
  }))
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
      leaderboardData.value = data.leaderboard || data.allUsers || []
      totalGuildMembers.value = data.memberCount || leaderboardData.value.length
      await loadUserRankData(guildId)
    }
  } catch (error) {
    console.error('Error loading leaderboard:', error)
  } finally {
    leaderboardLoading.value = false
  }
}

const loadUserRankData = async (guildId) => {
  try {
    if (!authStore.user) return
    
    const currentUserId = authStore.user.id
    const allUsers = leaderboardData.value
    
    const userInLeaderboard = allUsers.find(u => u.id === currentUserId)
    
    if (userInLeaderboard) {
      const userRank = allUsers.findIndex(u => u.id === currentUserId) + 1
      
      let avatarUrl = null
      if (authStore.user.avatar) {
        if (authStore.user.avatar.includes('http')) {
          avatarUrl = authStore.user.avatar
        } else {
          avatarUrl = `https://cdn.discordapp.com/avatars/${currentUserId}/${authStore.user.avatar}.png`
        }
      }
      
      const prevLevelXp = userInLeaderboard.currentLevelXp || 0
      const currentLevelXp = (userInLeaderboard.nextLevelXp || 100) - prevLevelXp
      const userLevelXp = userInLeaderboard.xp - prevLevelXp
      const progressPercent = Math.min(100, (userLevelXp / currentLevelXp) * 100)
      
      Object.assign(userRankData, {
        rank: userRank,
        level: userInLeaderboard.level || 0,
        xp: userInLeaderboard.xp || 0,
        nextLevelXp: userInLeaderboard.nextLevelXp || 100,
        progressPercent: progressPercent,
        avatarUrl: avatarUrl
      })
    } else {
      Object.assign(userRankData, {
        rank: null,
        level: 0,
        xp: 0,
        nextLevelXp: 100,
        progressPercent: 0,
        avatarUrl: null
      })
    }
  } catch (error) {
    console.error('Error loading user rank data:', error)
  }
}

const loadAllSettings = async (guildId) => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    
    const [levelingRes, economyRes, statusRes, welcomeRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/leveling/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/economy/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/status/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/welcome/${guildId}/settings`, { headers }),
    ])

    if (levelingRes.ok) {
      const data = await levelingRes.json()
      Object.assign(levelingSettings, {
        enabled: data.enabled || false,
        xpPerMessage: data.xp_per_message || 10,
        voiceXp: data.vc_xp_per_minute || 2,
        xpCooldown: data.xp_cooldown || 60,
        levelUpMessage: data.level_up_message || "🎉 {user} reached level {level}!",
        levelUpChannel: data.level_up_channel || '',
        allowedChannels: Array.isArray(data.allowed_xp_channels) ? data.allowed_xp_channels.join(', ') : ''
      })
    }
    
    if (economyRes.ok) {
      const data = await economyRes.json()
      Object.assign(economySettings, {
        enabled: data.enabled || false,
        currencyPerMessage: data.per_message || 5,
        currencySymbol: data.currency_symbol || '💰',
        startingAmount: data.start || 500
      })
    }
    
    if (statusRes.ok) {
      const data = await statusRes.json()
      Object.assign(statusSettings, {
        enabled: data.enabled || false,
        userToTrack: data.username || '',
        userToTrackId: data.user_id || '',
        trackingChannel: data.channel_id || '',
        delay: data.delay_seconds || 0,
        useEmbed: data.use_embed || false,
        offlineMessage: data.offline_message || 'User is offline',
        messageId: data.message_id || null
      })
    }
    
    if (welcomeRes.ok) {
      const data = await welcomeRes.json()
      Object.assign(welcomeSettings, {
        enabled: data.enabled === true,
        useEmbed: data.use_embed === true,
        welcomeChannel: data.channel_id || '',
        messageText: data.message_text || 'Welcome to {servername}, {user}!',
        embedTitle: data.embed_title || 'Welcome!',
        embedDescription: data.embed_description || 'Welcome to {servername}! We\'re glad to have you here.',
        embedFooter: data.embed_footer || 'Thanks for joining!',
        embedThumbnail: data.embed_thumbnail || '',
        embedImage: data.embed_image || '',
        embedColor: data.embed_color || '#5170ff',
        embedFieldName: data.embed_field_name || '',
        embedFieldValue: data.embed_field_value || ''
      })
      
      Object.assign(memberGoalsSettings, {
        enabled: data.enabled === true,
        memberCountChannelId: data.member_count_channel_id || '',
        memberGoalChannelId: data.member_goal_channel_id || '',
        memberGoal: data.member_goal || 0
      })
    }
  } catch (error) {
  }
}

const loadGuildChannels = async (guildId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/channels/${guildId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (response.ok) {
      const data = await response.json()
      guildChannels.value = (data.channels || []).map(c => ({
        id: c.id,
        name: c.name || 'Unknown Channel'
      }))
    }
  } catch (error) {
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
    
    if (currentSettingsObject.value === 'statusSettings' || currentSettingsObject.value === 'welcomeSettings') {
      settings[currentChannelField.value] = selectedChannelIds.value[0] || ''
    } else {
      settings[currentChannelField.value] = selectedChannelIds.value.join(', ')
    }
  }
  closeChannelModal()
}

const closeChannelModal = () => {
  showChannelModal.value = false
  selectedChannelIds.value = []
}

const openMemberSelector = async () => {
  memberSearchQuery.value = ''
  showMemberModal.value = true
  
  if (guildMembers.value.length === 0 && selectedServer.value) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/guild/${selectedServer.value.id}/members`, {
        headers: { Authorization: 'Bearer status-bot-stats-secret-key' }
      })
      if (response.ok) {
        const data = await response.json()
        guildMembers.value = (data.members || []).map(m => ({
          id: m.id,
          username: m.username,
          avatar: m.avatar
        }))
      }
    } catch (error) {
      console.error('Error fetching guild members:', error)
    }
  }
}

const selectMember = (member) => {
  statusSettings.userToTrack = member.username
  statusSettings.userToTrackId = member.id
  closeMemberModal()
}

const closeMemberModal = () => {
  showMemberModal.value = false
  memberSearchQuery.value = ''
}

const setSaveState = (loadingRef, successRef) => {
  loadingRef.value = true
  successRef.value = false
}

const resetSaveState = (loadingRef, successRef) => {
  loadingRef.value = false
  successRef.value = true
  setTimeout(() => {
    successRef.value = false
  }, 2000)
}

const saveLevelingSettings = async () => {
  if (!selectedServer.value) return
  setSaveState(levelingSaveLoading, levelingSaveSuccess)
  try {
    const response = await fetch(`${BACKEND_URL}/api/leveling/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(levelingSettings)
    })
    if (response.ok) {
      resetSaveState(levelingSaveLoading, levelingSaveSuccess)
    } else {
      levelingSaveLoading.value = false
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    levelingSaveLoading.value = false
  }
}

const saveEconomySettings = async () => {
  if (!selectedServer.value) return
  setSaveState(economySaveLoading, economySaveSuccess)
  try {
    const response = await fetch(`${BACKEND_URL}/api/economy/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(economySettings)
    })
    if (response.ok) {
      resetSaveState(economySaveLoading, economySaveSuccess)
    } else {
      economySaveLoading.value = false
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    economySaveLoading.value = false
  }
}

const postStatusMessage = async () => {
  if (!selectedServer.value || !statusSettings.userToTrackId || !statusSettings.trackingChannel) {
    console.warn('Missing required fields for posting status message')
    return
  }

  try {
    const payload = {
      user_id: statusSettings.userToTrackId,
      channel_id: statusSettings.trackingChannel,
      offline_message: statusSettings.offlineMessage,
      use_embed: statusSettings.useEmbed
    }
    const response = await fetch(`${BACKEND_URL}/api/status/${selectedServer.value.id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer status-bot-stats-secret-key'
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      console.error('Failed to queue status message:', response.status, response.statusText)
    } else {
      console.log('Status message queued for posting/updating')
    }
  } catch (error) {
    console.error('Error queuing status message:', error)
  }
}

const saveStatusSettings = async () => {
  if (!selectedServer.value) return
  setSaveState(statusSaveLoading, statusSaveSuccess)
  try {
    const delayValue = statusSettings.delay ? parseInt(statusSettings.delay) : 60
    const payload = {
      enabled: statusSettings.enabled,
      userToTrack: statusSettings.userToTrackId,
      trackingChannel: statusSettings.trackingChannel,
      delay: delayValue,
      automatic: statusSettings.automatic,
      useEmbed: statusSettings.useEmbed,
      offlineMessage: statusSettings.offlineMessage
    }
    console.log('Saving status settings with payload:', payload)
    const response = await fetch(`${BACKEND_URL}/api/status/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      console.log('Settings saved, posting message...')
      await postStatusMessage()
      
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const reloadRes = await fetch(`${BACKEND_URL}/api/status/${selectedServer.value.id}/settings`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      if (reloadRes.ok) {
        const data = await reloadRes.json()
        console.log('Reloaded settings from backend:', data)
        Object.assign(statusSettings, {
          enabled: data.enabled === true,
          userToTrack: data.user_id || '',
          userToTrackId: data.user_id || '',
          trackingChannel: data.channel_id || '',
          delay: data.delay_seconds || 0,
          useEmbed: data.use_embed === true,
          automatic: data.automatic === true,
          offlineMessage: data.offline_message || 'User is offline',
          messageId: data.message_id || null
        })
        console.log('Settings reloaded with messageId:', data.message_id)
      }
      
      resetSaveState(statusSaveLoading, statusSaveSuccess)
    } else {
      console.error('Failed to save settings:', response.status)
      statusSaveLoading.value = false
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    statusSaveLoading.value = false
  }
}

const saveWelcomeSettings = async () => {
  if (!selectedServer.value) return
  setSaveState(welcomeSaveLoading, welcomeSaveSuccess)
  try {
    const payload = {
      enabled: welcomeSettings.enabled,
      use_embed: welcomeSettings.useEmbed,
      channel_id: welcomeSettings.welcomeChannel,
      message_text: welcomeSettings.messageText,
      embed_title: welcomeSettings.embedTitle,
      embed_description: welcomeSettings.embedDescription,
      embed_footer: welcomeSettings.embedFooter,
      embed_thumbnail: welcomeSettings.embedThumbnail,
      embed_image: welcomeSettings.embedImage,
      embed_color: welcomeSettings.embedColor,
      embed_field_name: welcomeSettings.embedFieldName,
      embed_field_value: welcomeSettings.embedFieldValue
    }
    console.log('Saving welcome settings with payload:', payload)
    const response = await fetch(`${BACKEND_URL}/api/welcome/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      const data = await response.json()
      console.log('Welcome settings saved successfully:', data)
      resetSaveState(welcomeSaveLoading, welcomeSaveSuccess)
    } else {
      welcomeSaveLoading.value = false
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    welcomeSaveLoading.value = false
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
    const data = await response.json()
    console.log('Reset response:', response.status, data)
    if (response.ok) {
      alert(`Economy balances reset! ${data.usersReset} users reset to ${data.startingAmount}`)
    } else {
      alert(`Error: ${data.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error resetting balances:', error)
    alert(`Error: ${error.message}`)
  }
}

const resetStatusSettings = () => {
  Object.assign(statusSettings, {
    enabled: true,
    userToTrack: '',
    userToTrackId: '',
    trackingChannel: '',
    delay: 60,
    automatic: true,
    useEmbed: false,
    offlineMessage: 'User is currently offline',
    messageId: null
  })
}

const resetWelcomeSettings = () => {
  Object.assign(welcomeSettings, {
    enabled: true,
    useEmbed: false,
    welcomeChannel: '',
    messageText: 'Welcome to {servername}, {user}!',
    embedTitle: 'Welcome!',
    embedDescription: 'Welcome to {servername}! We\'re glad to have you here.',
    embedFooter: 'Thanks for joining!',
    embedThumbnail: '',
    embedImage: '',
    embedColor: '#5170ff',
    embedFieldName: '',
    embedFieldValue: '',
  })
}

const saveMemberGoalsSettings = async () => {
  if (!selectedServer.value) return
  setSaveState(memberGoalsSaveLoading, memberGoalsSaveSuccess)
  try {
    const payload = {
      enabled: memberGoalsSettings.enabled,
      member_count_channel_id: memberGoalsSettings.memberCountChannelId,
      member_goal_channel_id: memberGoalsSettings.memberGoalChannelId,
      member_goal: memberGoalsSettings.memberGoal
    }
    console.log('Saving member goals settings with payload:', payload)
    const response = await fetch(`${BACKEND_URL}/api/welcome/${selectedServer.value.id}/member-goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      const data = await response.json()
      console.log('Member goals settings saved successfully:', data)
      resetSaveState(memberGoalsSaveLoading, memberGoalsSaveSuccess)
    } else {
      memberGoalsSaveLoading.value = false
    }
  } catch (error) {
    console.error('Error saving member goals settings:', error)
    memberGoalsSaveLoading.value = false
  }
}

const resetMemberGoalsSettings = () => {
  Object.assign(memberGoalsSettings, {
    enabled: true,
    memberCountChannelId: '',
    memberGoalChannelId: '',
    memberGoal: 0,
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
}

const updateStatusPreview = () => {
}

const updateWelcomePreview = () => {
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

watch(
  () => route.params.guildId,
  async (guildId) => {
    if (guildId && servers.value.length > 0) {
      const server = servers.value.find(s => s.id === guildId)
      if (server) {
        selectedServer.value = server
        if (server.buttonType === 'view') {
          activeSection.value = 'overview'
        } else if (server.buttonType === 'configure') {
          activeSection.value = 'overview'
        }
        await Promise.all([
          loadOverviewData(server.id),
          loadLeaderboardData(server.id),
          loadAllSettings(server.id)
        ])
      }
    } else if (!guildId) {
      selectedServer.value = null
    }
  },
  { immediate: true }
)

watch(
  () => servers.value,
  () => {
    const guildId = route.params.guildId
    if (guildId && servers.value.length > 0 && !selectedServer.value) {
      const server = servers.value.find(s => s.id === guildId)
      if (server) {
        selectedServer.value = server
        if (server.buttonType === 'view') {
          activeSection.value = 'overview'
        } else if (server.buttonType === 'configure') {
          activeSection.value = 'overview'
        }
      }
    }
  }
)
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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .servers-list-view {
    padding: 24px;
    max-width: 100%;
  }
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
  position: relative;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.server-icon-header,
.server-icon-header-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
  background: #5170ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
  object-fit: cover;
}

.config-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;
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
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}

.back-btn:hover {
  background: rgba(81, 112, 255, 0.35);
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
  display: flex;
  align-items: center;
  gap: 12px;
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

.nav-icon {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
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

.overview-panel.full-width {
  grid-column: 1 / -1;
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

.info-box {
  background: rgba(81, 112, 255, 0.15);
  border: 2px solid rgba(81, 112, 255, 0.4);
  border-radius: 16px;
  padding: 24px;
  position: sticky;
  top: 30px;
}

.info-box h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #5170ff;
}

.info-box p {
  font-size: 13px;
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

.info-box strong {
  color: #5170ff;
}

.rank-card {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.2), rgba(81, 112, 255, 0.05));
  border: 2px solid rgba(81, 112, 255, 0.4);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.rank-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #5170ff;
}

.rank-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: #5170ff;
  margin: 0 auto 16px;
  border: 3px solid #5170ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 32px;
  color: #fff;
}

.rank-number {
  font-size: 36px;
  font-weight: 800;
  color: #5170ff;
  margin-bottom: 12px;
}

.rank-xp {
  font-size: 18px;
  font-weight: 700;
  color: #ccc;
  margin-bottom: 8px;
}

.rank-level {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  margin-bottom: 12px;
}

.rank-level span {
  color: #5170ff;
}

.rank-bar {
  width: 100%;
  height: 6px;
  background: rgba(81, 112, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
}

.rank-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5170ff, #7c9dff);
  width: 0%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.leaderboard-full {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  padding-right: 10px;
}

.overview-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-box {
  background: rgba(81, 112, 255, 0.1);
  border: 2px solid rgba(81, 112, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-box:hover {
  background: rgba(81, 112, 255, 0.15);
  border-color: rgba(81, 112, 255, 0.5);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  min-width: 50px;
  text-align: center;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
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
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.embed-author {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.embed-title {
  font-weight: 700;
  color: #fff;
  font-size: 16px;
  margin: 0;
  padding: 0;
}

.embed-description {
  color: #ddd;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}
.embed-thumbnail {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.embed-footer {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

.save-btn.save-success {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
  color: #4ade80;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  gap: 12px;
  padding: 12px 0;
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

.member-option-label {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
  cursor: pointer;
  gap: 12px;
  padding: 12px;
  background: rgba(81, 112, 255, 0.1);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.member-option-label:hover {
  background: rgba(81, 112, 255, 0.2);
}

.member-radio {
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 8px;
}

.member-username {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.member-id {
  font-size: 12px;
  color: #999;
}

.member-option {
  border: none;
  background: transparent;
  padding: 0;
}

.member-option-label:hover {
  background: rgba(81, 112, 255, 0.1);
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

/* Mobile Hamburger Menu */
.mobile-hamburger {
  display: none;
  flex-direction: column;
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  gap: 4px;
}

.mobile-hamburger:hover {
  background: rgba(81, 112, 255, 0.35);
}

.mobile-hamburger span {
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.mobile-hamburger span:nth-child(2) {
  width: 18px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .config-main {
    padding: 30px 35px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .overview-grid > div:nth-child(2) {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .config-header {
    padding: 20px 16px;
    gap: 12px;
  }

  .back-btn {
    left: 16px;
    padding: 8px 16px;
    font-size: 14px;
  }

  .mobile-hamburger {
    display: flex;
    right: 16px;
  }

  .config-header h2 {
    font-size: 18px;
  }

  .server-icon-header,
  .server-icon-header-placeholder {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .config-container {
    flex-direction: column;
  }

  .config-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #333;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .config-sidebar.mobile-open {
    max-height: 70vh;
    padding: 16px 0;
    overflow-y: auto;
  }

  .config-nav {
    display: grid;
    grid-template-columns: 2fr 2fr;
    gap: 0;
  }

  .nav-btn {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(81, 112, 255, 0.1);
    border-right: 1px solid rgba(81, 112, 255, 0.1);
    text-align: center;
    font-size: 13px;
    flex-direction: column;
    gap: 6px;
  }

  .nav-btn:nth-child(odd) {
    border-right: 1px solid rgba(81, 112, 255, 0.1);
  }

  .nav-btn:nth-child(even) {
    border-right: none;
  }

  .nav-btn:nth-last-child(-n+2) {
    border-bottom: none;
  }

  .nav-btn.active {
    background: rgba(81, 112, 255, 0.15);
    border-left: none;
    padding-left: 16px;
  }

  .nav-icon {
    font-size: 20px;
    min-width: auto;
  }

  .config-main {
    flex: 1;
    padding: 20px 16px;
    overflow-y: auto;
  }

  .config-section h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-box {
    padding: 16px;
  }

  .stats-grid {
    gap: 12px;
  }

  /* Leaderboard responsive layout */
  .leaderboard-full {
    grid-template-columns: 1fr !important;
  }

  [style*="grid-template-columns: 1fr 1.2fr"] {
    grid-template-columns: 1fr !important;
  }

  [style*="grid-template-columns: 1fr 500px"] {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  .leaderboard-item {
    padding: 12px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .leaderboard-item .stats {
    width: 100%;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .leaderboard-item .stat-item {
    flex-direction: column;
    gap: 4px;
  }

  .info-box,
  .rank-card {
    max-width: 100%;
  }

  .overview-panel {
    padding: 16px;
  }

  .settings-box {
    padding: 16px;
  }

  .setting-item {
    gap: 12px;
  }

  .setting-item input,
  .setting-item select,
  .setting-item textarea {
    font-size: 16px;
  }

  .modal-content {
    padding: 20px;
    width: 95%;
  }

  .settings-form {
    gap: 16px;
  }

  .form-group {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .config-nav {
    grid-template-columns: 1fr;
  }

  .nav-btn {
    border-right: none !important;
    border-bottom: 1px solid rgba(81, 112, 255, 0.1);
    padding: 14px 12px;
  }

  .nav-btn:nth-last-child(1) {
    border-bottom: none;
  }

  .config-header h2 {
    font-size: 14px;
  }

  .leaderboard-item {
    flex-wrap: wrap;
  }

  .leaderboard-item .user-info {
    width: 100%;
  }

  .leaderboard-item .stats {
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .button-group {
    flex-direction: column;
    gap: 8px;
  }

  .save-btn,
  .reset-btn,
  .confirm-btn,
  .cancel-btn {
    width: 100%;
  }
}

.premium-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-note {
  font-size: 12px;
  color: #fbbf24;
  margin-top: 4px;
  font-style: italic;
}

input:disabled {
  background: rgba(81, 112, 255, 0.05);
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
