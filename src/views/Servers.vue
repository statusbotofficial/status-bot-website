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
          <h3 class="server-name" :title="server.name">{{ truncateServerName(server.name) }}</h3>
          
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
          <h2 :title="selectedServer.name">{{ truncateServerName(selectedServer.name) }}</h2>
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
            <template v-for="section in filteredSections" :key="section.id">
              <!-- Parent button -->
              <button
                v-if="section.children"
                class="nav-btn parent-btn"
                :class="{ active: expandedSections.includes(section.id) }"
                @click="toggleExpandSection(section.id); isMobileNavOpen = false"
              >
                <span class="nav-icon" v-html="section.icon"></span>
                <span>{{ section.label }}</span>
                <span class="expand-icon" :class="{ expanded: expandedSections.includes(section.id) }">
                  <i class="fas fa-chevron-down"></i>
                </span>
              </button>
              <!-- Non-expandable button -->
              <button
                v-else
                class="nav-btn"
                :class="{ active: activeSection === section.id }"
                @click="activeSection = section.id; isMobileNavOpen = false"
              >
                <span class="nav-icon" v-html="section.icon"></span>
                <span>{{ section.label }}</span>
              </button>
              <!-- Child buttons -->
              <template v-if="section.children && expandedSections.includes(section.id)">
                <button
                  v-for="child in section.children"
                  :key="child.id"
                  class="nav-btn child-btn"
                  :class="{ active: activeSection === child.id }"
                  @click="activeSection = child.id; isMobileNavOpen = false"
                >
                  <span class="nav-icon" v-html="child.icon"></span>
                  <span>{{ child.label }}</span>
                </button>
              </template>
            </template>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="config-main">
          <Transition name="section-fade" mode="out-in">
            <!-- Overview -->
            <section v-if="activeSection === 'overview'" class="config-section" key="overview">
            <div class="overview-container">
              <!-- Language Selector -->
              <div class="language-selector-section">
                <div class="language-selector">
                  <label for="language-select">🌐 Bot Language</label>
                  <select 
                    id="language-select" 
                    v-model="selectedLanguage" 
                    @change="updateLanguage"
                    class="language-dropdown"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="ar">العربية</option>
                  </select>
                  <p class="language-note">This will change the bot's responses and website language for you.</p>
                </div>
              </div>

              <!-- Server Stats -->
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-icon xp-icon"><i class="fas fa-star" style="color: #f59e0b;"></i></div>
                  <div class="stat-content">
                    <div class="stat-label">Total XP</div>
                    <div class="stat-value">{{ totalStats.totalXp }}</div>
                  </div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon balance-icon"><i class="fas fa-coins" style="color: #fbbf24;"></i></div>
                  <div class="stat-content">
                    <div class="stat-label">Total Currency</div>
                    <div class="stat-value">{{ totalStats.totalBalance }}</div>
                  </div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon members-icon"><i class="fas fa-users" style="color: #3b82f6;"></i></div>
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
                      <span class="rank" :class="getMedalClass(idx)"><template v-if="idx === 0"><i class="fas fa-medal" style="color: #ffd700;"></i></template><template v-else-if="idx === 1"><i class="fas fa-medal" style="color: #c0c0c0;"></i></template><template v-else-if="idx === 2"><i class="fas fa-medal" style="color: #cd7f32;"></i></template><template v-else>#{{ idx + 1 }}</template></span>
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
          <section v-else-if="activeSection === 'leaderboard'" class="config-section" key="leaderboard">
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
                    <span class="rank" :class="getMedalClass(idx)"><template v-if="idx === 0"><i class="fas fa-medal" style="color: #ffd700;"></i></template><template v-else-if="idx === 1"><i class="fas fa-medal" style="color: #c0c0c0;"></i></template><template v-else-if="idx === 2"><i class="fas fa-medal" style="color: #cd7f32;"></i></template><template v-else>#{{ idx + 1 }}</template></span>
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
              <div style="display: flex; flex-direction: column; gap: 24px; margin-top: 54px;">
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
          <section v-else-if="activeSection === 'leveling'" class="config-section" key="leveling">
            <h3>Leveling Settings</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Leveling</label>
                <toggle-switch v-model="levelingSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Leveling Formula <span v-if="!userHasPremium" class="premium-badge"><i class="fas fa-star"></i> Premium</span></label>
                <button 
                  @click="openLevelingFormulaModal" 
                  class="input-field" 
                  style="text-align: left; cursor: pointer;" 
                  :disabled="!userHasPremium"
                >
                  {{ getLevelingFormulaLabel(levelingSettings.levelingType) }}
                  <i class="fas fa-chevron-down" style="float: right;"></i>
                </button>
              </div>

              <div class="setting-item">
                <label>XP per message <span v-if="!userHasPremium" class="premium-badge"><i class="fas fa-star"></i> Premium</span></label>
                <input v-model.number="levelingSettings.xpPerMessage" type="number" min="1" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Voice chat XP <span v-if="!userHasPremium" class="premium-badge"><i class="fas fa-star"></i> Premium</span></label>
                <input v-model.number="levelingSettings.voiceXp" type="number" min="1" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>XP Cooldown (seconds) <span v-if="!userHasPremium" class="premium-badge"><i class="fas fa-star"></i> Premium</span></label>
                <input v-model.number="levelingSettings.xpCooldown" type="number" min="1" max="300" class="input-field" :disabled="!userHasPremium" placeholder="60" />
              </div>

              <div class="setting-item">
                <label>Level up channel</label>
                <div class="channel-selector">
                  <div v-if="levelingChannelIsVoice" class="input-wrapper">
                    <i class="fas fa-volume-up"></i>
                    <input
                      type="text"
                      :value="levelingChannelName"
                      placeholder="None selected"
                      disabled
                      class="input-field input-with-icon"
                    />
                  </div>
                  <template v-else>
                    <input
                      type="text"
                      :value="levelingChannelName"
                      placeholder="None selected"
                      disabled
                      class="input-field"
                    />
                  </template>
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
          <section v-else-if="activeSection === 'economy'" class="config-section" key="economy">
            <h3>Economy System <span v-if="!userHasPremium" class="premium-badge"><i class="fas fa-star"></i> Premium</span></h3>
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
                <label>Balance multiplier</label>
                <input v-model.number="economySettings.balanceMultiplier" type="number" step="0.1" min="0.1" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Daily interest rate (%)</label>
                <input v-model.number="economySettings.dailyInterestRate" type="number" step="0.1" min="0" max="100" class="input-field" :disabled="!userHasPremium" />
              </div>

              <div class="setting-item">
                <label>Robbery success chance (%)</label>
                <input v-model.number="economySettings.robberyChance" type="number" step="0.1" min="0" max="100" class="input-field" :disabled="!userHasPremium" />
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
          <section v-else-if="activeSection === 'status-tracking'" class="config-section" key="status-tracking">
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
                  <div v-if="trackingChannelIsVoice" class="input-wrapper">
                    <i class="fas fa-volume-up"></i>
                    <input
                      type="text"
                      :value="trackingChannelName"
                      placeholder="None selected"
                      disabled
                      class="input-field input-with-icon"
                    />
                  </div>
                  <template v-else>
                    <input
                      type="text"
                      :value="trackingChannelName"
                      placeholder="None selected"
                      disabled
                      class="input-field"
                    />
                  </template>
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
                <button @click="forceUpdateStatus" class="update-btn" :disabled="statusUpdateLoading">
                  <span v-if="statusUpdateLoading" class="spinner"></span>
                  {{ statusUpdateLoading ? 'Updating...' : 'Update Status 🔄️' }}
                </button>
                <button @click="saveStatusSettings" class="save-btn" :class="{ 'save-success': statusSaveSuccess }" :disabled="statusSaveLoading">
                  <span v-if="statusSaveLoading" class="spinner"></span>
                  {{ statusSaveSuccess ? '✓ Saved Successfully' : statusSaveLoading ? 'Saving...' : 'Save' }}
                </button>
                <button @click="resetStatusSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>

          <!-- Welcome -->
          <section v-else-if="activeSection === 'welcome'" class="config-section" key="welcome">
            <h3>Welcome Messages</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Welcome Messages</label>
                <toggle-switch v-model="welcomeSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Welcome channel</label>
                <div class="channel-selector">
                  <div v-if="welcomeChannelIsVoice" class="input-wrapper">
                    <i class="fas fa-volume-up"></i>
                    <input
                      v-model="welcomeChannelName"
                      type="text"
                      placeholder="None selected"
                      disabled
                      class="input-field input-with-icon"
                    />
                  </div>
                  <template v-else>
                    <input
                      v-model="welcomeChannelName"
                      type="text"
                      placeholder="None selected"
                      disabled
                      class="input-field"
                    />
                  </template>
                  <button @click="openChannelSelector('welcomeSettings', 'welcomeChannel')" class="select-btn">+</button>
                </div>
              </div>

              <div class="setting-item">
                <label>Use embed format</label>
                <toggle-switch v-model="welcomeSettings.useEmbed" />
              </div>

              <div v-if="welcomeSettings.useEmbed" class="setting-item">
                <label>Preset templates</label>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button @click="applyWelcomePreset('minimal')" class="preset-btn">Minimal</button>
                  <button @click="applyWelcomePreset('friendly')" class="preset-btn">Friendly</button>
                  <button @click="applyWelcomePreset('detailed')" class="preset-btn">Detailed</button>
                  <button @click="applyWelcomePreset('gaming')" class="preset-btn">Gaming</button>
                </div>
              </div>

              <button @click="showPlaceholdersModal = true" class="placeholders-btn">
                <i class="fas fa-code"></i>
                Available Placeholders
              </button>

              <div v-if="!welcomeSettings.useEmbed" class="setting-item">
                <label>Message text</label>
                <textarea
                  v-model="welcomeSettings.messageText"
                  class="input-field textarea"
                  placeholder="Welcome to {server_name}, {user}!"
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
                <label>Description (leave blank for none)</label>
                <textarea
                  v-model="welcomeSettings.embedDescription"
                  class="input-field textarea"
                  placeholder="Leave blank for no description..."
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <label>Custom fields</label>
                  <button @click="addWelcomeField" class="small-btn">+ Add Field</button>
                </div>
                <div v-if="welcomeSettings.embedFields && welcomeSettings.embedFields.length > 0">
                  <div v-for="(field, index) in welcomeSettings.embedFields" :key="index" style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <input
                      v-model="field.name"
                      type="text"
                      class="input-field"
                      placeholder="Field name"
                      style="flex: 1;"
                    />
                    <input
                      v-model="field.value"
                      type="text"
                      class="input-field"
                      placeholder="Field value"
                      style="flex: 2;"
                    />
                    <button @click="removeWelcomeField(index)" class="delete-btn" style="padding: 8px 12px;">×</button>
                  </div>
                </div>
                <p v-else style="color: #999; font-size: 12px; margin-top: 8px;">No custom fields added yet</p>
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

          <!-- Leave Messages -->
          <section v-else-if="activeSection === 'leave'" class="config-section" key="leave">
            <h3>Leave Messages</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Leave Messages</label>
                <toggle-switch v-model="leaveSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Leave channel</label>
                <div class="channel-selector">
                  <div v-if="leaveChannelIsVoice" class="input-wrapper">
                    <i class="fas fa-volume-up"></i>
                    <input
                      v-model="leaveChannelName"
                      type="text"
                      placeholder="None selected"
                      disabled
                      class="input-field input-with-icon"
                    />
                  </div>
                  <template v-else>
                    <input
                      v-model="leaveChannelName"
                      type="text"
                      placeholder="None selected"
                      disabled
                      class="input-field"
                    />
                  </template>
                  <button @click="openChannelSelector('leaveSettings', 'leaveChannel')" class="select-btn">+</button>
                </div>
              </div>

              <div class="setting-item">
                <label>Use embed format</label>
                <toggle-switch v-model="leaveSettings.useEmbed" />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Preset templates</label>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button @click="applyLeavePreset('minimal')" class="preset-btn">Minimal</button>
                  <button @click="applyLeavePreset('friendly')" class="preset-btn">Friendly</button>
                  <button @click="applyLeavePreset('detailed')" class="preset-btn">Detailed</button>
                  <button @click="applyLeavePreset('sad')" class="preset-btn">Sad</button>
                </div>
              </div>

              <button @click="showPlaceholdersModal = true" class="placeholders-btn">
                <i class="fas fa-code"></i>
                Available Placeholders
              </button>

              <div v-if="!leaveSettings.useEmbed" class="setting-item">
                <label>Message text</label>
                <textarea
                  v-model="leaveSettings.messageText"
                  class="input-field textarea"
                  placeholder="Goodbye {user}!"
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Embed title</label>
                <input
                  v-model="leaveSettings.embedTitle"
                  type="text"
                  class="input-field"
                  placeholder="Member Left"
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Description (leave blank for none)</label>
                <textarea
                  v-model="leaveSettings.embedDescription"
                  class="input-field textarea"
                  placeholder="Leave blank for no description..."
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Thumbnail URL (small image, right side)</label>
                <input
                  v-model="leaveSettings.embedThumbnail"
                  type="text"
                  class="input-field"
                  placeholder="https://example.com/thumbnail.png"
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Image URL (large image, bottom)</label>
                <input
                  v-model="leaveSettings.embedImage"
                  type="text"
                  class="input-field"
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Embed color (hex)</label>
                <input
                  v-model="leaveSettings.embedColor"
                  type="text"
                  class="input-field"
                  placeholder="#5170ff"
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <label>Footer</label>
                <input
                  v-model="leaveSettings.embedFooter"
                  type="text"
                  class="input-field"
                  placeholder=""
                />
              </div>

              <div v-if="leaveSettings.useEmbed" class="setting-item">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <label>Custom fields</label>
                  <button @click="addLeaveField" class="small-btn">+ Add Field</button>
                </div>
                <div v-if="leaveSettings.embedFields && leaveSettings.embedFields.length > 0">
                  <div v-for="(field, index) in leaveSettings.embedFields" :key="index" style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <input
                      v-model="field.name"
                      type="text"
                      class="input-field"
                      placeholder="Field name"
                      style="flex: 1;"
                    />
                    <input
                      v-model="field.value"
                      type="text"
                      class="input-field"
                      placeholder="Field value"
                      style="flex: 2;"
                    />
                    <button @click="removeLeaveField(index)" class="delete-btn" style="padding: 8px 12px;">×</button>
                  </div>
                </div>
                <p v-else style="color: #999; font-size: 12px; margin-top: 8px;">No custom fields added yet</p>
              </div>

              <div class="button-group">
                <button @click="saveLeaveSettings" class="save-btn" :class="{ 'save-success': leaveSaveSuccess }" :disabled="leaveSaveLoading">
                  <span v-if="leaveSaveLoading" class="spinner"></span>
                  {{ leaveSaveSuccess ? '✓ Saved Successfully' : leaveSaveLoading ? 'Saving...' : 'Save' }}
                </button>
                <button @click="resetLeaveSettings" class="reset-btn">Reset</button>
              </div>
            </div>
          </section>

          <!-- Member Goals -->
          <section v-else-if="activeSection === 'member-goals'" class="config-section" key="member-goals">
            <h3>Member Goals</h3>
            <div class="settings-box">
              <div class="setting-item">
                <label>Enable Member Goals</label>
                <toggle-switch v-model="memberGoalsSettings.enabled" />
              </div>

              <div class="setting-item">
                <label>Member Count Channel</label>
                <div class="channel-selector">
                  <div v-if="memberCountChannelIsVoice" class="input-wrapper">
                    <i class="fas fa-volume-up"></i>
                    <input 
                      v-model="memberCountChannelName" 
                      type="text" 
                      class="input-field input-with-icon" 
                      disabled 
                      placeholder="Select channel..." 
                    />
                  </div>
                  <template v-else>
                    <input 
                      v-model="memberCountChannelName" 
                      type="text" 
                      class="input-field" 
                      disabled 
                      placeholder="Select channel..." 
                    />
                  </template>
                  <button @click="openChannelSelector('memberGoalsSettings', 'memberCountChannelId')" class="select-btn">+</button>
                </div>
                <small>Channel name will display as: "Members: 150"</small>
              </div>

              <div class="setting-item">
                <label>Member Goal Channel</label>
                <div class="channel-selector">
                  <div v-if="memberGoalChannelIsVoice" class="input-wrapper">
                    <i class="fas fa-volume-up"></i>
                    <input 
                      v-model="memberGoalChannelName" 
                      type="text" 
                      class="input-field input-with-icon" 
                      disabled 
                      placeholder="Select channel..." 
                    />
                  </div>
                  <template v-else>
                    <input 
                      v-model="memberGoalChannelName" 
                      type="text" 
                      class="input-field" 
                      disabled 
                      placeholder="Select channel..." 
                    />
                  </template>
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

          <!-- Activity Logs -->
          <section v-else-if="activeSection === 'logs'" class="config-section" key="logs">
            <h3>Activity Logs</h3>
            <div class="logs-container">
              <div v-if="logsLoading" class="loading">Loading logs...</div>
              <div v-else-if="activityLogs.length > 0" class="logs-list">
                <div v-for="log in activityLogs" :key="log.timestamp" class="log-entry">
                  <div class="log-header">
                    <span class="log-type" :class="`type-${log.event_type}`">{{ formatEventType(log.event_type) }}</span>
                    <span class="log-time">{{ formatLogTime(log.timestamp) }}</span>
                  </div>
                  <div class="log-description">{{ log.description }}</div>
                </div>
              </div>
              <div v-else class="empty">No logs yet</div>
            </div>
          </section>
          </Transition>
        </main>
      </div>
    </div>

    <!-- Modals -->
    <SelectorModal
      :is-open="showChannelModal"
      title="Select Channels"
      :items="guildChannels"
      v-model="selectedChannelIds"
      :multiple="true"
      search-placeholder="Search channels..."
      @close="closeChannelModal"
      @confirm="confirmChannelSelection"
    />

    <SelectorModal
      :is-open="showMemberModal"
      title="Select User"
      :items="memberSelectorItems"
      :model-value="statusSettings.userToTrackId ? [statusSettings.userToTrackId] : []"
      :multiple="false"
      search-placeholder="Search members..."
      @close="closeMemberModal"
      @confirm="handleMemberSelection"
    />

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

    <SelectorModal 
      :isOpen="showLevelingFormulaModal"
      title="Select Leveling Formula"
      :items="levelingFormulasForModal"
      :modelValue="[levelingSettings.levelingType]"
      :multiple="false"
      :searchable="false"
      @update:modelValue="(value) => levelingSettings.levelingType = value[0]"
      @close="closeLevelingFormulaModal"
    />

    <PlaceholdersModal 
      :isOpen="showPlaceholdersModal"
      title="Available Placeholders"
      :placeholders="placeholders"
      @close="showPlaceholdersModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLanguageStore } from '../stores/language'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import SelectorModal from '../components/SelectorModal.vue'
import PlaceholdersModal from '../components/PlaceholdersModal.vue'

const authStore = useAuthStore()
const languageStore = useLanguageStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const overviewLoading = ref(false)
const leaderboardLoading = ref(false)
const servers = ref([])
const selectedServer = ref(null)
const searchQuery = ref('')
const selectedLanguage = ref('en')
const activeSection = ref('overview')
const expandedSections = ref([])
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
const statusUpdateLoading = ref(false)
const welcomeSaveSuccess = ref(false)
const welcomeSaveLoading = ref(false)
const leaveSaveSuccess = ref(false)
const leaveSaveLoading = ref(false)
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
  }
}

const BACKEND_URL = 'https://backend-nwct.onrender.com'

const sections = [
  { id: 'overview', label: 'Overview', icon: '<i class="fas fa-chart-bar" style="color: var(--text-primary);"></i>' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '<i class="fas fa-trophy" style="color: var(--text-primary);"></i>' },
  { id: 'leveling', label: 'Leveling', icon: '<i class="fas fa-arrow-up" style="color: var(--text-primary);"></i>' },
  { id: 'economy', label: 'Economy', icon: '<i class="fas fa-coins" style="color: var(--text-primary);"></i>' },
  { id: 'status-tracking', label: 'Status Tracking', icon: '<i class="fas fa-circle" style="color: var(--text-primary);"></i>' },
  { 
    id: 'welcome-parent', 
    label: 'Welcome & Leave Messages', 
    icon: '<i class="fas fa-door-open" style="color: var(--text-primary);"></i>',
    children: [
      { id: 'welcome', label: 'Welcome Messages', icon: '<i class="fas fa-envelope" style="color: var(--text-primary);"></i>' },
      { id: 'leave', label: 'Leave Messages', icon: '<i class="fas fa-sign-out-alt" style="color: var(--text-primary);"></i>' }
    ]
  },
  { id: 'member-goals', label: 'Member Goals', icon: '<i class="fas fa-users" style="color: var(--text-primary);"></i>' },
  { id: 'logs', label: 'Activity Logs', icon: '<i class="fas fa-history" style="color: #ef4444;"></i>' },
]

const levelingSettings = reactive({
  enabled: true,
  levelingType: 'linear',
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
  balanceMultiplier: 1.0,
  dailyInterestRate: 0,
  robberyChance: 50,
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
  messageText: 'Welcome to {server_name}, {user}!',
  embedTitle: 'Welcome!',
  embedDescription: '',
  embedFooter: 'Thanks for joining!',
  embedThumbnail: '',
  embedImage: '',
  embedColor: '#5170ff',
  embedFields: []
})

const leaveSettings = reactive({
  enabled: true,
  useEmbed: false,
  leaveChannel: '',
  messageText: 'Goodbye {user}!',
  embedTitle: 'Member Left',
  embedDescription: '',
  embedFooter: '',
  embedThumbnail: '',
  embedImage: '',
  embedColor: '#5170ff',
  embedFields: []
})

const memberGoalsSettings = reactive({
  enabled: true,
  memberCountChannelId: '',
  memberGoalChannelId: '',
  memberGoal: 0,
})

// Overview shop display
const activityLogs = ref([])
const logsLoading = ref(false)
const showChannelModal = ref(false)
const showMemberModal = ref(false)
const showResetModal = ref(false)
const showLevelingFormulaModal = ref(false)
const showPlaceholdersModal = ref(false)
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

const placeholders = [
  { name: '{user}', description: 'Username of the member who joined' },
  { name: '{user_icon}', description: 'Profile picture of the member' },
  { name: '{server_name}', description: 'Name of the server' },
  { name: '{server_icon}', description: 'Icon/logo of the server' },
  { name: '{member_count}', description: 'Current total member count' },
]

const levelingFormulas = [
  { 
    value: 'linear', 
    name: 'Linear', 
    description: 'Constant XP increase per level - Balanced progression' 
  },
  { 
    value: 'exponential', 
    name: 'Exponential', 
    description: 'Rapidly increasing requirements - Challenging progression' 
  },
  { 
    value: 'polynomial', 
    name: 'Polynomial', 
    description: 'Medium increase per level - Steady difficulty curve' 
  },
  { 
    value: 'logarithmic', 
    name: 'Logarithmic', 
    description: 'Slow increase for early levels - Forgiving at start' 
  }
]

const levelingFormulasForModal = computed(() => {
  return levelingFormulas.map(formula => ({
    id: formula.value,
    name: formula.name,
    description: formula.description
  }))
})

const truncateServerName = (name, maxLength = 22) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + '...'
  }
  return name
}

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

const memberSelectorItems = computed(() => {
  return guildMembers.value.map(member => ({
    id: member.id,
    name: member.username,
    description: `ID: ${member.id}`,
    icon: member.avatar
  }))
})

const trackingChannelName = computed(() => {
  if (!statusSettings.trackingChannel) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === statusSettings.trackingChannel)
  if (!channel) return statusSettings.trackingChannel
  return channel.type === 'voice' ? channel.name : `# ${channel.name}`
})

const levelingChannelName = computed(() => {
  if (!levelingSettings.levelUpChannel) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === levelingSettings.levelUpChannel)
  if (!channel) return levelingSettings.levelUpChannel
  return channel.type === 'voice' ? channel.name : `# ${channel.name}`
})

const welcomeChannelName = computed(() => {
  if (!welcomeSettings.welcomeChannel) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === welcomeSettings.welcomeChannel)
  if (!channel) return welcomeSettings.welcomeChannel
  return channel.type === 'voice' ? channel.name : `# ${channel.name}`
})

const trackedUserName = computed(() => {
  if (!statusSettings.userToTrackId) return 'None selected'
  const member = guildMembers.value.find(m => m.id === statusSettings.userToTrackId)
  return member ? member.username : statusSettings.userToTrackId
})

const memberCountChannelName = computed(() => {
  if (!memberGoalsSettings.memberCountChannelId) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === memberGoalsSettings.memberCountChannelId)
  if (!channel) return memberGoalsSettings.memberCountChannelId
  return channel.type === 'voice' ? channel.name : `# ${channel.name}`
})

const memberGoalChannelName = computed(() => {
  if (!memberGoalsSettings.memberGoalChannelId) return 'None selected'
  const channel = guildChannels.value.find(c => c.id === memberGoalsSettings.memberGoalChannelId)
  if (!channel) return memberGoalsSettings.memberGoalChannelId
  return channel.type === 'voice' ? channel.name : `# ${channel.name}`
})

// Channel type icons for display next to inputs
const trackingChannelIsVoice = computed(() => {
  const channel = guildChannels.value.find(c => c.id === statusSettings.trackingChannel)
  return channel?.type === 'voice'
})

const levelingChannelIsVoice = computed(() => {
  const channel = guildChannels.value.find(c => c.id === levelingSettings.levelUpChannel)
  return channel?.type === 'voice'
})

const welcomeChannelIsVoice = computed(() => {
  const channel = guildChannels.value.find(c => c.id === welcomeSettings.welcomeChannel)
  return channel?.type === 'voice'
})

const leaveChannelIsVoice = computed(() => {
  const channel = guildChannels.value.find(c => c.id === leaveSettings.leaveChannel)
  return channel?.type === 'voice'
})

const leaveChannelName = computed(() => {
  const channel = guildChannels.value.find(c => c.id === leaveSettings.leaveChannel)
  return channel ? (channel.type === 'voice' ? channel.name : `# ${channel.name}`) : 'None selected'
})

const memberCountChannelIsVoice = computed(() => {
  const channel = guildChannels.value.find(c => c.id === memberGoalsSettings.memberCountChannelId)
  return channel?.type === 'voice'
})

const memberGoalChannelIsVoice = computed(() => {
  const channel = guildChannels.value.find(c => c.id === memberGoalsSettings.memberGoalChannelId)
  return channel?.type === 'voice'
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
      if (!channel) return id
      return channel.type === 'voice' ? channel.name : `# ${channel.name}`
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

// Language functions
const updateLanguage = async () => {
  if (!selectedServer.value || !authStore.user) return
  
  try {
    // Update language store first
    languageStore.setLanguage(selectedLanguage.value)
    
    // Save to backend
    const response = await fetch(`${BACKEND_URL}/api/user/language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_KEY}`
      },
      body: JSON.stringify({
        userId: authStore.user.id,
        guildId: selectedServer.value.id,
        language: selectedLanguage.value
      })
    })
    
    if (response.ok) {
      console.log('Language updated successfully')
    }
  } catch (error) {
    console.error('Error updating language:', error)
  }
}

const loadUserLanguage = async () => {
  if (!authStore.user) {
    selectedLanguage.value = languageStore.currentLanguage
    return
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/language/${authStore.user.id}`, {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      selectedLanguage.value = data.language || 'en'
      languageStore.setLanguage(selectedLanguage.value)
    } else {
      // Fallback to localStorage
      selectedLanguage.value = languageStore.currentLanguage
    }
  } catch (error) {
    console.error('Error loading user language:', error)
    selectedLanguage.value = languageStore.currentLanguage
  }
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
  }
}

const loadAllSettings = async (guildId) => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    
    const [levelingRes, economyRes, statusRes, welcomeRes, leaveRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/leveling/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/economy/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/status/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/welcome/${guildId}/settings`, { headers }),
      fetch(`${BACKEND_URL}/api/leave/${guildId}/settings`, { headers }),
    ])

    if (levelingRes.ok) {
      const data = await levelingRes.json()
      Object.assign(levelingSettings, {
        enabled: data.enabled || false,
        levelingType: data.leveling_type || 'linear',
        xpPerMessage: data.xp_per_message || 10,
        voiceXp: data.vc_xp_per_minute || 2,
        xpCooldown: data.xp_cooldown || 60,
        levelUpMessage: data.level_up_message || "🎉 {user} reached level {level}!",
        levelUpChannel: data.level_up_channel || '',
        allowedChannels: Array.isArray(data.allowed_xp_channels) ? data.allowed_xp_channels.join(', ') : ''
      })
      localStorage.setItem(`leveling_${guildId}`, JSON.stringify(levelingSettings))
    }
    
    if (economyRes.ok) {
      const data = await economyRes.json()
      Object.assign(economySettings, {
        enabled: data.enabled || false,
        currencyPerMessage: data.per_message || 5,
        currencySymbol: data.currency_symbol || '💰',
        startingAmount: data.start || 500,
        balanceMultiplier: data.balance_multiplier || 1.0,
        dailyInterestRate: data.daily_interest_rate || 0,
        robberyChance: data.robbery_chance || 50
      })
      localStorage.setItem(`economy_${guildId}`, JSON.stringify(economySettings))
    }
    
    if (statusRes.ok) {
      const data = await statusRes.json()
      const userId = data.user_id || ''
      let username = ''
      if (userId) {
        const member = guildMembers.value.find(m => m.id === userId)
        username = member ? member.username : userId
      }
      Object.assign(statusSettings, {
        enabled: data.enabled || false,
        userToTrack: username || '',
        userToTrackId: userId,
        trackingChannel: data.channel_id || '',
        delay: data.delay_seconds || 60,
        useEmbed: data.use_embed || false,
        offlineMessage: data.offline_message || 'User is offline',
        messageId: data.message_id || null
      })
      localStorage.setItem(`status_${guildId}`, JSON.stringify(statusSettings))
    }
    
    if (welcomeRes.ok) {
      const data = await welcomeRes.json()
      const embedFields = data.embed_fields ? JSON.parse(data.embed_fields) : []
      Object.assign(welcomeSettings, {
        enabled: data.enabled === true,
        useEmbed: data.use_embed === true,
        welcomeChannel: data.channel_id || '',
        messageText: data.message_text || 'Welcome to {server_name}, {user}!',
        embedTitle: data.embed_title || 'Welcome!',
        embedDescription: data.embed_description || '',
        embedFooter: data.embed_footer || 'Thanks for joining!',
        embedThumbnail: data.embed_thumbnail || '',
        embedImage: data.embed_image || '',
        embedColor: data.embed_color || '#5170ff',
        embedFields: Array.isArray(embedFields) ? embedFields : []
      })
      
      Object.assign(memberGoalsSettings, {
        enabled: data.enabled === true,
        memberCountChannelId: data.member_count_channel_id || '',
        memberGoalChannelId: data.member_goal_channel_id || '',
        memberGoal: data.member_goal || 0
      })
      localStorage.setItem(`welcome_${guildId}`, JSON.stringify(welcomeSettings))
      localStorage.setItem(`memberGoals_${guildId}`, JSON.stringify(memberGoalsSettings))
    }

    if (leaveRes.ok) {
      const data = await leaveRes.json()
      const embedFields = data.embed_fields ? JSON.parse(data.embed_fields) : []
      Object.assign(leaveSettings, {
        enabled: data.enabled === true,
        useEmbed: data.use_embed === true,
        leaveChannel: data.channel_id || '',
        messageText: data.message_text || 'Goodbye {user}!',
        embedTitle: data.embed_title || 'Member Left',
        embedDescription: data.embed_description || '',
        embedFooter: data.embed_footer || '',
        embedThumbnail: data.embed_thumbnail || '',
        embedImage: data.embed_image || '',
        embedColor: data.embed_color || '#5170ff',
        embedFields: Array.isArray(embedFields) ? embedFields : []
      })
      localStorage.setItem(`leave_${guildId}`, JSON.stringify(leaveSettings))
    }
  } catch (error) {
    // Try to load from localStorage as fallback
    try {
      const guildId = selectedServer.value?.id
      if (guildId) {
        const levelingData = localStorage.getItem(`leveling_${guildId}`)
        const economyData = localStorage.getItem(`economy_${guildId}`)
        const statusData = localStorage.getItem(`status_${guildId}`)
        const welcomeData = localStorage.getItem(`welcome_${guildId}`)
        
        if (levelingData) Object.assign(levelingSettings, JSON.parse(levelingData))
        if (economyData) Object.assign(economySettings, JSON.parse(economyData))
        if (statusData) Object.assign(statusSettings, JSON.parse(statusData))
        if (welcomeData) Object.assign(welcomeSettings, JSON.parse(welcomeData))
      }
    } catch (e) {
    }
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
        name: c.name || 'Unknown Channel',
        type: c.type || 'text'
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
    }
  }
}

const selectMember = (member) => {
  statusSettings.userToTrack = member.username
  statusSettings.userToTrackId = member.id
  closeMemberModal()
}

const handleMemberSelection = (selectedIds) => {
  if (selectedIds && selectedIds.length > 0) {
    const member = guildMembers.value.find(m => m.id === selectedIds[0])
    
    if (member) {
      statusSettings.userToTrack = member.username
      statusSettings.userToTrackId = member.id
    }
  }
  closeMemberModal()
}

const closeMemberModal = () => {
  showMemberModal.value = false
  memberSearchQuery.value = ''
}

const openLevelingFormulaModal = () => {
  showLevelingFormulaModal.value = true
}

const closeLevelingFormulaModal = () => {
  showLevelingFormulaModal.value = false
}

const getLevelingFormulaLabel = (value) => {
  const formula = levelingFormulas.find(f => f.value === value)
  return formula ? formula.name : 'Linear'
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

const toggleExpandSection = (sectionId) => {
  const index = expandedSections.value.indexOf(sectionId)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(sectionId)
  }
}

const saveLevelingSettings = async () => {
  if (!selectedServer.value) return
  setSaveState(levelingSaveLoading, levelingSaveSuccess)
  try {
    const payload = {
      enabled: levelingSettings.enabled,
      xpPerMessage: levelingSettings.xpPerMessage,
      voiceXp: levelingSettings.voiceXp,
      xpCooldown: levelingSettings.xpCooldown,
      levelUpMessage: levelingSettings.levelUpMessage,
      levelUpChannel: levelingSettings.levelUpChannel,
      allowedChannels: levelingSettings.allowedChannels,
      leveling_type: levelingSettings.levelingType
    }
    const response = await fetch(`${BACKEND_URL}/api/leveling/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      resetSaveState(levelingSaveLoading, levelingSaveSuccess)
    } else {
      levelingSaveLoading.value = false
    }
  } catch (error) {
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
    economySaveLoading.value = false
  }
}

const postStatusMessage = async () => {
  if (!selectedServer.value || !statusSettings.userToTrackId || !statusSettings.trackingChannel) {
    return
  }

  try {
    const payload = {
      user_id: statusSettings.userToTrackId,
      channel_id: statusSettings.trackingChannel,
      offline_message: statusSettings.offlineMessage,
      use_embed: statusSettings.useEmbed
    }
    console.log('📮 Posting status message with payload:', payload)
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
      console.log('✅ Status message queued for posting/updating')
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
      user_id: statusSettings.userToTrackId,
      channel_id: statusSettings.trackingChannel,
      delay_seconds: delayValue,
      automatic: statusSettings.automatic,
      use_embed: statusSettings.useEmbed,
      offline_message: statusSettings.offlineMessage
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
        const userId = data.user_id || ''
        let username = ''
        if (userId) {
          const member = guildMembers.value.find(m => m.id === userId)
          username = member ? member.username : userId
        }
        Object.assign(statusSettings, {
          enabled: data.enabled === true,
          userToTrack: username || '',
          userToTrackId: userId,
          trackingChannel: data.channel_id || '',
          delay: data.delay_seconds || 60,
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

const forceUpdateStatus = async () => {
  if (!selectedServer.value || !statusSettings.userToTrackId) {
    alert('Please select a user to track first')
    return
  }
  
  statusUpdateLoading.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/status/${selectedServer.value.id}/force-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        user_id: statusSettings.userToTrackId
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      alert(`✅ Status updated: ${data.status || 'Updated'}`)
    } else {
      alert('❌ Failed to update status')
    }
  } catch (error) {
    console.error('Error forcing status update:', error)
    alert('❌ Error updating status')
  } finally {
    statusUpdateLoading.value = false
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
      embed_fields: JSON.stringify(welcomeSettings.embedFields || [])
    }
    const response = await fetch(`${BACKEND_URL}/api/welcome/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      resetSaveState(welcomeSaveLoading, welcomeSaveSuccess)
    } else {
      welcomeSaveLoading.value = false
    }
  } catch (error) {
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
    messageText: 'Welcome to {server_name}, {user}!',
    embedTitle: 'Welcome!',
    embedDescription: '',
    embedFooter: 'Thanks for joining!',
    embedThumbnail: '',
    embedImage: '',
    embedColor: '#5170ff',
    embedFields: []
  })
}

const addWelcomeField = () => {
  welcomeSettings.embedFields.push({ name: '', value: '' })
}

const removeWelcomeField = (index) => {
  welcomeSettings.embedFields.splice(index, 1)
}

const removeLeaveField = (index) => {
  leaveSettings.embedFields.splice(index, 1)
}

const applyWelcomePreset = (preset) => {
  const presets = {
    minimal: {
      embedTitle: 'Welcome!',
      embedDescription: 'Welcome to {server_name}!',
      embedFooter: '',
      embedThumbnail: '',
      embedImage: '',
      embedColor: '#5170ff'
    },
    friendly: {
      embedTitle: 'Welcome to {server_name}! 👋',
      embedDescription: 'We\'re happy to have you here, {user}! Feel free to introduce yourself and explore the server.',
      embedFooter: 'Thanks for joining!',
      embedThumbnail: '{server_icon}',
      embedImage: '',
      embedColor: '#00ff88'
    },
    detailed: {
      embedTitle: 'Welcome to {server_name}!',
      embedDescription: 'A new member has joined! {user} is now part of our community. We now have {member_count} members!',
      embedFooter: 'You are member #{member_count}',
      embedThumbnail: '{user_icon}',
      embedImage: '',
      embedColor: '#5170ff',
      embedFields: [
        { name: 'Server Rules', value: 'Check out #rules for important guidelines' },
        { name: 'Get Roles', value: 'Visit #role-select to customize your experience' }
      ]
    },
    gaming: {
      embedTitle: '⚔️ Welcome to the Arena, {user}! ⚔️',
      embedDescription: 'Another warrior joins our ranks! You are member #{member_count} in {server_name}.',
      embedFooter: 'Let\'s get gaming!',
      embedThumbnail: '{server_icon}',
      embedImage: '',
      embedColor: '#ff6600'
    }
  }

  if (presets[preset]) {
    const presetData = presets[preset]
    Object.assign(welcomeSettings, {
      embedTitle: presetData.embedTitle,
      embedDescription: presetData.embedDescription,
      embedFooter: presetData.embedFooter,
      embedThumbnail: presetData.embedThumbnail,
      embedImage: presetData.embedImage,
      embedColor: presetData.embedColor,
      embedFields: presetData.embedFields ? [...presetData.embedFields] : []
    })
  }
}

const resetLeaveSettings = () => {
  Object.assign(leaveSettings, {
    enabled: true,
    useEmbed: false,
    leaveChannel: '',
    messageText: 'Goodbye {user}!',
    embedTitle: 'Member Left',
    embedDescription: '',
    embedFooter: '',
    embedThumbnail: '',
    embedImage: '',
    embedColor: '#5170ff',
    embedFields: []
  })
}

const addLeaveField = () => {
  leaveSettings.embedFields.push({ name: '', value: '' })
}

const applyLeavePreset = (preset) => {
  const presets = {
    minimal: {
      embedTitle: 'Member Left',
      embedDescription: '{user} has left {server_name}.',
      embedFooter: '',
      embedThumbnail: '',
      embedImage: '',
      embedColor: '#5170ff'
    },
    friendly: {
      embedTitle: 'Goodbye {user}! 👋',
      embedDescription: 'We\'ll miss you! Come back soon.',
      embedFooter: 'See you next time!',
      embedThumbnail: '',
      embedImage: '',
      embedColor: '#ff6b6b'
    },
    detailed: {
      embedTitle: 'Member Left',
      embedDescription: '{user} has left the server. We now have {member_count} members.',
      embedFooter: 'We hope to see them again!',
      embedThumbnail: '',
      embedImage: '',
      embedColor: '#5170ff'
    },
    sad: {
      embedTitle: '😢 {user} has left us 😢',
      embedDescription: 'We\'re sad to see {user} go. {server_name} now has {member_count} members.',
      embedFooter: 'We hope to see you again!',
      embedThumbnail: '',
      embedImage: '',
      embedColor: '#ff6b6b'
    }
  }

  if (presets[preset]) {
    const presetData = presets[preset]
    Object.assign(leaveSettings, {
      embedTitle: presetData.embedTitle,
      embedDescription: presetData.embedDescription,
      embedFooter: presetData.embedFooter,
      embedThumbnail: presetData.embedThumbnail,
      embedImage: presetData.embedImage,
      embedColor: presetData.embedColor,
      embedFields: presetData.embedFields ? [...presetData.embedFields] : []
    })
  }
}

const saveLeaveSettings = async () => {
  if (!selectedServer.value) return
  setSaveState(leaveSaveLoading, leaveSaveSuccess)
  try {
    const payload = {
      enabled: leaveSettings.enabled,
      use_embed: leaveSettings.useEmbed,
      channel_id: leaveSettings.leaveChannel,
      message_text: leaveSettings.messageText,
      embed_title: leaveSettings.embedTitle,
      embed_description: leaveSettings.embedDescription,
      embed_footer: leaveSettings.embedFooter,
      embed_thumbnail: leaveSettings.embedThumbnail,
      embed_image: leaveSettings.embedImage,
      embed_color: leaveSettings.embedColor,
      embed_fields: JSON.stringify(leaveSettings.embedFields)
    }
    const response = await fetch(`${BACKEND_URL}/api/leave/${selectedServer.value.id}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      console.log('Leave settings saved')
      leaveSaveSuccess.value = true
      setTimeout(() => { leaveSaveSuccess.value = false }, 3000)
    }
  } catch (error) {
    console.error('Error saving leave settings:', error)
  } finally {
    leaveSaveLoading.value = false
  }
}

const loadLeaveSettings = async (guildId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/leave/${guildId}/settings`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      const data = await response.json()
      Object.assign(leaveSettings, {
        enabled: data.enabled,
        useEmbed: data.use_embed,
        leaveChannel: data.channel_id,
        messageText: data.message_text,
        embedTitle: data.embed_title,
        embedDescription: data.embed_description,
        embedFooter: data.embed_footer,
        embedThumbnail: data.embed_thumbnail,
        embedImage: data.embed_image,
        embedColor: data.embed_color,
        embedFields: data.embed_fields ? JSON.parse(data.embed_fields) : []
      })
    }
  } catch (error) {
    console.error('Error loading leave settings:', error)
  }
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
  const REDIRECT_URI = 'https://status-bot.xyz/redirect'
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

const copyPlaceholder = (placeholder) => {
  navigator.clipboard.writeText(placeholder).then(() => {
    // Optional: Add a brief visual feedback
    const originalText = event.target.textContent
    event.target.textContent = '✓ Copied!'
    setTimeout(() => {
      event.target.textContent = originalText
    }, 1500)
  })
}

onMounted(() => {
  document.title = 'Dashboard | Status Bot'
  loadServers()
  loadUserLanguage()
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
          loadAllSettings(server.id),
          loadGuildChannels(server.id),
          fetchPremiumStatus()
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

const loadActivityLogs = async (guildId) => {
  logsLoading.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/api/logs/${guildId}?limit=50`, {
      headers: {
        'Authorization': `Bearer status-bot-stats-secret-key`
      }
    })
    if (response.ok) {
      const data = await response.json()
      activityLogs.value = data.logs.reverse()
    }
  } catch (err) {
    console.error('Failed to load activity logs:', err)
  } finally {
    logsLoading.value = false
  }
}

const formatEventType = (type) => {
  const types = {
    'user_offline': 'User Offline',
    'user_online': 'User Online',
    'goal_completed': 'Goal Completed',
    'currency_given': 'Currency Given',
    'currency_removed': 'Currency Removed',
    'xp_given': 'XP Given',
    'xp_removed': 'XP Removed',
    'level_up': 'Level Up',
    'message': 'Message Event',
  }
  return types[type] || type
}

const formatLogTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}

watch(activeSection, (newSection) => {
  if (newSection === 'logs' && selectedServer.value) {
    loadActivityLogs(selectedServer.value.id)
  }
})

const copyItemJson = (item) => {
  const json = JSON.stringify(item, null, 2)
  navigator.clipboard.writeText(json)
  alert('Item details copied to clipboard!')
}
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
  color: var(--text-primary);
  margin-bottom: 16px;
}

.login-required p {
  color: var(--text-secondary);
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
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-box {
  width: 100%;
  max-width: 500px;
  padding: 12px 16px;
  background: rgba(80, 80, 80, 0.3);
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: var(--text-primary);
  margin-bottom: 30px;
}

.search-box:focus {
  outline: none;
  background: rgba(80, 80, 80, 0.4);
  box-shadow: 0 0 15px rgba(81, 112, 255, 0.2);
}

.loading-container,
.empty-state {
  text-align: center;
  color: var(--text-secondary);
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
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.5), rgba(80, 80, 80, 0.15));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.server-card:hover {
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.6), rgba(80, 80, 80, 0.25));
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
  color: var(--text-primary);
}

.server-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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
  color: var(--text-primary);
}

.server-button.view {
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.8), rgba(128, 128, 128, 0.5));
  border-color: #808080;
  color: var(--text-primary);
}

.server-button.invite-bot {
  background: linear-gradient(135deg, rgba(92, 184, 92, 0.8), rgba(92, 184, 92, 0.5));
  border-color: #5cb85c;
  color: var(--text-primary);
}

.server-button.no-access {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.8), rgba(220, 53, 69, 0.5));
  border-color: #dc3545;
  color: var(--text-primary);
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
  color: var(--text-primary);
  object-fit: cover;
}

.config-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.back-btn {
  background: rgba(80, 80, 80, 0.3);
  border: 2px solid #5170ff;
  color: var(--text-primary);
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
  background: rgba(80, 80, 80, 0.45);
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
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn:hover {
  background: rgba(80, 80, 80, 0.3);
  color: #5170ff;
}

.nav-btn.active {
  background: rgba(80, 80, 80, 0.3);
  color: #5170ff;
  border-left: 3px solid #5170ff;
  padding-left: 17px;
}

.parent-btn {
  position: relative;
}

.expand-icon {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.child-btn {
  padding-left: 50px;
  color: var(--text-secondary);
}

.child-btn:hover {
  background: rgba(80, 80, 80, 0.2);
  color: #5170ff;
}

.child-btn.active {
  background: rgba(80, 80, 80, 0.3);
  color: #5170ff;
  border-left: 3px solid #5170ff;
  padding-left: 47px;
}

.nav-icon {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
  color: var(--text-primary);
}

.nav-icon i {
  font-size: 18px;
  color: var(--text-primary);
}

.config-main {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.config-section {
  width: 100%;
  max-width: 1200px;
}

.config-section h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-primary);
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
  color: var(--text-primary);
}

.overview-panel h3::before {
  display: none;
}

.user-list,
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.15);
  border-radius: 10px;
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
  width: 48px;
  height: 48px;
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
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.level {
  font-size: 12px;
  color: var(--text-secondary);
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
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  padding: 30px;
}

.logs-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.log-entry {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
  background: rgba(81, 112, 255, 0.02);
  transition: background 0.2s;
}

.log-entry:hover {
  background: rgba(81, 112, 255, 0.05);
}

.log-entry:last-child {
  border-bottom: none;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.log-type {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.log-type.type-user_offline {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.log-type.type-user_online {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.log-type.type-goal_completed {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.log-type.type-currency_given {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.log-type.type-currency_removed {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.log-type.type-xp_given {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.log-type.type-xp_removed {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.log-type.type-level_up {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.log-time {
  font-size: 12px;
  color: #666;
}

.log-description {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 4px;
  line-height: 1.4;
}

.log-details {
  color: var(--text-secondary);
  font-size: 11px;
  background: rgba(0, 0, 0, 0.1);
  padding: 6px 8px;
  border-radius: 3px;
  margin-top: 6px;
  overflow-x: auto;
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

/* Shop Section */
.shop-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.tab-btn {
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 14px;
}

.tab-btn.active {
  color: #5170ff;
  border-bottom-color: #5170ff;
}

.tab-btn:hover {
  color: #7192ff;
}

.shop-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.shop-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.item-card {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card:hover {
  border-color: rgba(81, 112, 255, 0.4);
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%);
  transform: translateY(-2px);
}

.item-card.custom {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.item-card.custom:hover {
  border-color: rgba(168, 85, 247, 0.4);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.item-header h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.item-price {
  font-size: 13px;
  font-weight: 600;
  color: #fbbf24;
  white-space: nowrap;
}

.item-status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.item-status.approved {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.item-description {
  font-size: 13px;
  color: #bbb;
  line-height: 1.4;
  margin: 0;
}

.item-detail {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 10px;
  border-radius: 6px;
}

.item-btn {
  padding: 8px 12px;
  background: rgba(81, 112, 255, 0.2);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 6px;
  color: #5170ff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.item-btn:hover {
  background: rgba(81, 112, 255, 0.3);
  border-color: rgba(81, 112, 255, 0.5);
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.item-btn.primary {
  flex: 1;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border: 1px solid rgba(81, 112, 255, 0.4);
  border-radius: 6px;
  color: #5170ff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.item-btn.primary:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.5) 0%, rgba(139, 92, 246, 0.5) 100%);
  border-color: rgba(81, 112, 255, 0.6);
  transform: translateY(-1px);
}

.item-btn.secondary {
  flex: 1;
  padding: 8px 12px;
  background: rgba(81, 112, 255, 0.1);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 6px;
  color: #7192ff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.item-btn.secondary:hover {
  background: rgba(81, 112, 255, 0.15);
  border-color: rgba(81, 112, 255, 0.3);
}

.approve-btn {
  flex: 1;
  padding: 8px 12px;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  color: #22c55e;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.approve-btn:hover {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
}

.reject-btn {
  flex: 1;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #ef4444;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.reject-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237192ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 20px;
  padding-right: 32px;
}

.form-group select option {
  background: #1a1a2e;
  color: var(--text-primary);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: rgba(81, 112, 255, 0.4);
  background: rgba(81, 112, 255, 0.05);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #5170ff 0%, #8b5cf6 100%);
  border: none;
  border-radius: 6px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(81, 112, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border: 1px solid rgba(81, 112, 255, 0.4);
  color: #5170ff;
}

.btn-small:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.5) 0%, rgba(139, 92, 246, 0.5) 100%);
  border-color: rgba(81, 112, 255, 0.6);
  transform: translateY(-1px);
}

.purchases-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.purchase-item {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 0.2s ease;
}

.purchase-item:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: rgba(81, 112, 255, 0.3);
}

.purchase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.purchase-item-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.purchase-status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

.purchase-status.redeemed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.purchase-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.purchase-details span {
  display: flex;
  gap: 4px;
}

.purchase-details strong {
  color: var(--text-primary);
}

.purchase-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.redeem-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border: 1px solid rgba(81, 112, 255, 0.4);
  border-radius: 6px;
  color: #5170ff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.redeem-btn:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%);
  border-color: rgba(81, 112, 255, 0.6);
  transform: translateY(-1px);
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
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.rank-level {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
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
  max-height: calc(100vh - 180px);
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
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.settings-box {
  background: rgba(30, 30, 35, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 15px;
}

.input-field {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.input-field:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.input-field:focus {
  background: rgba(81, 112, 255, 0.1);
  border-color: #5170ff;
  box-shadow: 0 0 0 3px rgba(81, 112, 255, 0.2);
}

.input-field.textarea {
  min-height: 100px;
  resize: none;
  font-family: inherit;
}

.input-field:disabled {
  color: var(--text-secondary);
}

.channel-selector {
  display: flex;
  gap: 8px;
}

.channel-selector .input-field {
  flex: 1;
}

.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  pointer-events: none;
}

.input-with-icon {
  padding-left: 36px !important;
}

.select-btn {
  width: 50px;
  padding: 10px 12px;
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  border-radius: 8px;
  color: var(--text-primary);
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
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.preview-content {
  color: var(--text-secondary);
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
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.button-group {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
}

.save-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #5170ff 0%, #5170ff 100%);
  border: none;
  border-radius: 6px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 0 1 auto;
}

.save-btn:hover {
  background: linear-gradient(135deg, #6080ff 0%, #6080ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(81, 112, 255, 0.4);
}

.save-btn.save-success {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border: none;
  color: var(--text-primary);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.update-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #f59e0b 100%);
  border: none;
  border-radius: 6px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 0 1 auto;
}

.update-btn:hover {
  background: linear-gradient(135deg, #fbb34f 0%, #fbb34f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.update-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--text-primary);
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
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text-primary);
}

.preset-btn {
  padding: 8px 12px;
  background: rgba(81, 112, 255, 0.15);
  border: 1px solid rgba(81, 112, 255, 0.4);
  border-radius: 6px;
  color: #5170ff;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background: rgba(81, 112, 255, 0.3);
  border-color: #5170ff;
}

.small-btn {
  padding: 6px 12px;
  background: rgba(81, 112, 255, 0.15);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 6px;
  color: #5170ff;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.small-btn:hover {
  background: rgba(81, 112, 255, 0.25);
  border-color: rgba(81, 112, 255, 0.5);
}

.delete-btn {
  padding: 6px 12px;
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid #dc3545;
  border-radius: 6px;
  color: #dc3545;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
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
  color: var(--text-secondary);
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
  color: var(--text-primary);
  font-size: 14px;
}

.member-id {
  font-size: 12px;
  color: var(--text-secondary);
}

.member-option {
  border: none;
  background: transparent;
  padding: 0;
}

.member-option-label:hover {
  background: rgba(81, 112, 255, 0.1);
}

.formula-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.formula-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(81, 112, 255, 0.05);
  border: 2px solid rgba(81, 112, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.formula-option:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: rgba(81, 112, 255, 0.4);
}

.formula-radio {
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.formula-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.formula-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.formula-description {
  font-size: 12px;
  color: var(--text-secondary);
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
  color: var(--text-primary);
}

.confirm-btn:hover {
  background: rgba(81, 112, 255, 0.35);
}

.cancel-btn {
  background: rgba(128, 128, 128, 0.2);
  border-color: #808080;
  color: var(--text-primary);
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
  color: var(--text-primary);
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
  background: var(--text-primary);
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

  [style*="grid-template-columns: 1fr 1.2fr"] > div:nth-child(2) {
    order: 3;
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
    gap: 10px;
    justify-items: center;
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
    width: 44px;
    height: 44px;
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

/* Remove number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Language Selector Styles */
.language-selector-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
}

.language-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-selector label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-dropdown {
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.language-dropdown:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.language-dropdown:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(81, 112, 255, 0.1);
}

.language-note {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}

/* Section Transition Animations */
.section-fade-enter-active,
.section-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.section-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.section-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.section-fade-enter-to,
.section-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Placeholders Button */
.placeholders-btn {
  padding: 10px 16px;
  background: rgba(81, 112, 255, 0.15);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 6px;
  color: #5170ff;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
}

.placeholders-btn:hover {
  background: rgba(81, 112, 255, 0.25);
  border-color: rgba(81, 112, 255, 0.5);
}
</style>
