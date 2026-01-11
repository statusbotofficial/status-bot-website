<template>
  <div style="display: flex; flex-direction: column; height: 100vh; width: 100%; position: relative;">
    <!-- Servers List View -->
    <div v-if="!selectedServer" class="dashboard-container">
      <h1 class="dashboard-title">Select a Server</h1>
      <input
        v-model="searchQuery"
        type="text"
        class="search-box"
        placeholder="Search servers..."
      />
      <div class="servers-container">
        <div v-if="loading" class="loading">Loading servers...</div>
        <div
          v-for="server in filteredServers"
          :key="server.id"
          class="server-card"
          @click="selectServer(server)"
        >
          <div
            class="server-icon"
            :style="{
              backgroundImage: server.icon
                ? `url(${server.icon})`
                : 'none',
              backgroundColor: server.icon ? 'transparent' : '#5170ff',
            }"
          >
            <span v-if="!server.icon" style="font-size: 24px; font-weight: 700;">
              {{ (server.name || "").charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="server-name">{{ server.name || "Unnamed Server" }}</div>
          <button
            v-if="server.buttonType === 'no-access'"
            class="server-button no-access"
            disabled
          >
            No Access
          </button>
          <button
            v-else-if="server.buttonType === 'configure'"
            class="server-button configure"
            @click.stop="selectServer(server)"
          >
            Configure
          </button>
          <button
            v-else-if="server.buttonType === 'view'"
            class="server-button view"
            @click.stop="selectServer(server)"
          >
            View
          </button>
          <button
            v-else-if="server.buttonType === 'invite-bot'"
            class="server-button invite-bot"
            @click.stop="inviteBot(server)"
          >
            Invite Bot
          </button>
        </div>
      </div>
    </div>

    <!-- Server Configuration View -->
    <div v-else id="configView" style="display: flex; flex: 1; padding: 0; width: 100%; flex-direction: column;">
      <div style="display: flex; flex-direction: column; height: 100%;">
        <!-- Sidebar + Content -->
        <div style="display: flex; flex: 1; overflow: hidden;">
          <aside
            style="
              width: 250px;
              background-color: transparent;
              border-right: 1px solid #333;
              padding: 30px 0;
              display: flex;
              flex-direction: column;
              gap: 8px;
              overflow-y: auto;
              flex-shrink: 0;
            "
          >
            <ul style="list-style: none; padding: 0 15px; margin: 0;">
              <li
                v-for="section in configSections"
                :key="section.id"
                style="margin-bottom: 8px;"
              >
                <a
                  href="#"
                  :class="['config-nav-link', { active: activeSection === section.id }]"
                  @click.prevent="activeSection = section.id"
                  style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    color: #aaa;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    font-size: 15px;
                  "
                >
                  {{ section.label }}
                </a>
              </li>
            </ul>
          </aside>

          <!-- Main Content -->
          <div
            style="
              flex: 1;
              padding: 40px 50px;
              overflow-y: auto;
              min-width: 0;
            "
          >
            <!-- Server Header -->
            <div
              style="
                display: flex;
                align-items: center;
                gap: 24px;
                margin-bottom: 40px;
                padding-bottom: 24px;
                border-bottom: 1px solid rgba(81, 112, 255, 0.2);
              "
            >
              <div
                :style="{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: selectedServer?.icon
                    ? `url(${selectedServer.icon})`
                    : 'none',
                  backgroundColor: selectedServer?.icon
                    ? 'transparent'
                    : '#5170ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '32px',
                  border: '2px solid #5170ff',
                }"
              >
                <span v-if="!selectedServer?.icon">
                  {{ (selectedServer?.name || "").charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h1
                  style="
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 8px;
                  "
                >
                  {{ selectedServer?.name || "Loading..." }}
                </h1>
                <p style="color: #999; font-size: 14px; margin: 0;">
                  {{
                    selectedServer
                      ? `${selectedServer.memberCount || 0} members`
                      : "Loading server data..."
                  }}
                </p>
              </div>
            </div>

            <!-- Overview Section -->
            <div v-if="activeSection === 'overview'">
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">
                Top Users
              </h2>
              <div v-if="loading" style="color: #999; text-align: center; padding: 40px;">
                Loading...
              </div>
              <div v-else-if="overviewLeaderboard.length > 0">
                <div v-for="(user, index) in overviewLeaderboard" :key="user.id" 
                  style="
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 20px;
                    background: rgba(81, 112, 255, 0.05);
                    border: 1px solid rgba(81, 112, 255, 0.15);
                    border-radius: 8px;
                    margin-bottom: 12px;
                  "
                >
                  <div style="font-size: 20px; font-weight: 800; color: #5170ff; min-width: 40px;">
                    #{{ index + 1 }}
                  </div>
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.username" 
                    style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />
                  <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 600; color: #fff;">{{ user.username }}</p>
                    <p style="margin: 0; font-size: 12px; color: #999;">Level {{ user.level || 0 }}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="margin: 0; font-size: 14px; color: #fbbf24;">{{ user.xp || 0 }} XP</p>
                  </div>
                </div>
              </div>
              <div v-else style="color: #999; text-align: center; padding: 40px;">
                No user data available
              </div>
            </div>

            <!-- Leaderboard Section -->
            <div v-else-if="activeSection === 'leaderboard'">
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">
                Leaderboard
              </h2>
              <div v-if="loading" style="color: #999; text-align: center; padding: 40px;">
                Loading leaderboard...
              </div>
              <div v-else-if="leaderboard.length > 0">
                <div v-for="(user, index) in leaderboard" :key="user.id" 
                  style="
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 20px;
                    background: rgba(81, 112, 255, 0.05);
                    border: 1px solid rgba(81, 112, 255, 0.15);
                    border-radius: 8px;
                    margin-bottom: 12px;
                  "
                  :style="{
                    borderColor: index === 0 ? 'rgba(255, 215, 0, 0.3)' : index === 1 ? 'rgba(192, 192, 192, 0.3)' : index === 2 ? 'rgba(205, 127, 50, 0.3)' : 'rgba(81, 112, 255, 0.15)'
                  }"
                >
                  <div style="font-size: 20px; font-weight: 800; min-width: 40px;" :style="{
                    color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#5170ff'
                  }">
                    #{{ index + 1 }}
                  </div>
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.username" 
                    style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />
                  <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 600; color: #fff;">{{ user.username }}</p>
                    <p style="margin: 0; font-size: 12px; color: #999;">Level {{ user.level || 0 }}</p>
                  </div>
                  <div style="display: flex; gap: 24px; text-align: right;">
                    <div>
                      <p style="margin: 0; font-size: 11px; color: #999; text-transform: uppercase;">XP</p>
                      <p style="margin: 0; font-size: 14px; color: #fbbf24; font-weight: 700;">{{ user.xp || 0 }}</p>
                    </div>
                    <div>
                      <p style="margin: 0; font-size: 11px; color: #999; text-transform: uppercase;">Balance</p>
                      <p style="margin: 0; font-size: 14px; color: #4ade80; font-weight: 700;">{{ user.balance || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else style="color: #999; text-align: center; padding: 40px;">
                No leaderboard data available
              </div>
            </div>

            <!-- Other Sections -->
            <div v-else>
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">
                {{ activeSection.charAt(0).toUpperCase() + activeSection.slice(1) }}
              </h2>
              <div style="color: #999; text-align: center; padding: 40px;">
                {{ activeSection }} settings (implementation ready)
              </div>
            </div>

            <!-- Back Button -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(81, 112, 255, 0.2);">
              <button
                @click="selectedServer = null"
                style="
                  padding: 12px 24px;
                  background: rgba(81, 112, 255, 0.2);
                  border: 2px solid #5170ff;
                  border-radius: 8px;
                  color: #fff;
                  font-weight: 600;
                  font-size: 14px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                "
                @mouseenter="$event.target.style.background = 'rgba(81, 112, 255, 0.35)'"
                @mouseleave="$event.target.style.background = 'rgba(81, 112, 255, 0.2)'"
              >
                ← Back to Servers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(true);
const servers = ref([]);
const selectedServer = ref(null);
const searchQuery = ref("");
const activeSection = ref("overview");
const leaderboard = ref([]);
const overviewLeaderboard = ref([]);

const BACKEND_URL = "https://status-bot-backend.onrender.com";

const configSections = [
  { id: "overview", label: "Overview" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "leveling", label: "Leveling" },
  { id: "economy", label: "Economy" },
  { id: "statustracking", label: "Status Tracking" },
  { id: "welcome", label: "Welcome" },
];

// Computed
const filteredServers = computed(() => {
  return servers.value.filter((server) =>
    (server.name || "").toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Methods
const loadServers = async () => {
  if (!authStore.user || !authStore.token) {
    router.push("/");
    return;
  }

  loading.value = true;
  try {
    // Fetch user's guilds from Discord
    const userGuildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    if (!userGuildsResponse.ok) throw new Error("Failed to fetch user guilds");

    const userGuilds = await userGuildsResponse.json();

    // Fetch bot's guilds from backend
    const botGuildsResponse = await fetch(`${BACKEND_URL}/api/bot-guilds`);
    const botData = await botGuildsResponse.json();
    const botGuildIds = new Set((botData.guilds || []).map(g => g.id));

    // Map user guilds with icon URLs and permissions
    const MANAGE_GUILD = BigInt(0x20);
    const mappedServers = userGuilds
      .map((guild) => {
        const permissions = BigInt(guild.permissions || 0);
        const hasManagePermission = (permissions & MANAGE_GUILD) === MANAGE_GUILD;
        const isBotInGuild = botGuildIds.has(guild.id);
        
        // Construct Discord CDN icon URL
        const iconUrl = guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`
          : "";

        // Determine button type
        let buttonType = "no-access";
        if (hasManagePermission && isBotInGuild) buttonType = "configure";
        else if (!hasManagePermission && isBotInGuild) buttonType = "view";
        else if (hasManagePermission && !isBotInGuild) buttonType = "invite-bot";

        return {
          id: guild.id,
          name: guild.name,
          icon: iconUrl,
          permissions: hasManagePermission,
          botPresent: isBotInGuild,
          buttonType,
          priority: 
            buttonType === "configure" ? 1 :
            buttonType === "view" ? 2 :
            buttonType === "invite-bot" ? 3 : 4,
        };
      })
      .sort((a, b) => a.priority - b.priority);

    servers.value = mappedServers;
  } catch (error) {
    console.error("Error loading servers:", error);
    servers.value = [];
  } finally {
    loading.value = false;
  }
};

const selectServer = async (server) => {
  selectedServer.value = server;
  activeSection.value = "overview";

  // Load server data
  await Promise.all([
    loadServerOverview(server.id),
    loadLeaderboard(server.id),
  ]);
};

const inviteBot = (server) => {
  const DISCORD_CLIENT_ID = "1436123870158520411";
  const REDIRECT_URI = "https://status-bot.xyz/servers";
  const BOT_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&permissions=8&scope=bot%20applications.commands`;
  window.open(`${BOT_INVITE_URL}&guild_id=${server.id}`, "_blank");
};

const loadServerOverview = async (guildId) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/server-overview/${guildId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (selectedServer.value) {
        selectedServer.value.memberCount = data.memberCount;
      }
      overviewLeaderboard.value = data.topUsers || [];
    }
  } catch (error) {
    console.error("Error loading server overview:", error);
  }
};

const loadLeaderboard = async (guildId) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/server-leaderboard/${guildId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      leaderboard.value = data.leaderboard || [];
    }
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
};

// Lifecycle
onMounted(() => {
  loadServers();
});
</script>

<style scoped>
.dashboard-container {
  padding: 50px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.dashboard-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #aaaaaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.servers-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.server-card {
  background: linear-gradient(
    135deg,
    rgba(81, 112, 255, 0.15) 0%,
    rgba(81, 112, 255, 0.1) 100%
  );
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 14px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.server-card:hover {
  background: linear-gradient(
    135deg,
    rgba(81, 112, 255, 0.2) 0%,
    rgba(81, 112, 255, 0.15) 100%
  );
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
  margin-bottom: 16px;
  border: 2px solid rgba(81, 112, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.server-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.3;
}

.server-button {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  background: rgba(81, 112, 255, 0.2);
  border: 2px solid #5170ff;
  color: #fff;
}

.server-button:hover:not(:disabled) {
  background: rgba(81, 112, 255, 0.35);
}

.server-button.configure {
  background: rgba(59, 91, 219, 0.2);
  border-color: #3b5bdb;
  color: #fff;
}

.server-button.configure:hover {
  background: rgba(59, 91, 219, 0.35);
  box-shadow: 0 4px 12px rgba(59, 91, 219, 0.3);
}

.server-button.view {
  background: rgba(128, 128, 128, 0.2);
  border-color: #808080;
  color: #fff;
}

.server-button.view:hover {
  background: rgba(128, 128, 128, 0.35);
  box-shadow: 0 4px 12px rgba(128, 128, 128, 0.3);
}

.server-button.no-access {
  background: rgba(220, 53, 69, 0.2);
  border-color: #dc3545;
  color: #999;
  cursor: not-allowed;
}

.server-button.no-access:hover {
  background: rgba(220, 53, 69, 0.2);
}

.server-button.invite-bot {
  background: rgba(92, 184, 92, 0.2);
  border-color: #5cb85c;
  color: #fff;
}

.server-button.invite-bot:hover {
  background: rgba(92, 184, 92, 0.35);
  box-shadow: 0 4px 12px rgba(92, 184, 92, 0.3);
}

.config-nav-link.active {
  color: #5170ff !important;
  background: rgba(81, 112, 255, 0.1) !important;
}

.loading {
  color: #999;
  text-align: center;
  padding: 40px;
  font-size: 16px;
}
</style>
