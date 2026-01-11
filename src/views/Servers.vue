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
            class="server-button view"
            @click.stop="selectServer(server)"
          >
            Configure
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
                  {{ selectedServer?.name.charAt(0).toUpperCase() }}
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
                Server Overview
              </h2>
              <div v-if="loading" style="color: #999; text-align: center; padding: 40px;">
                Loading...
              </div>
              <div v-else style="color: #ccc;">
                <p>Members: {{ selectedServer?.memberCount || 0 }}</p>
                <p v-if="overviewLeaderboard.length > 0">Top {{ overviewLeaderboard.length }} users loaded</p>
              </div>
            </div>

            <!-- Leaderboard Section -->
            <div v-else-if="activeSection === 'leaderboard'">
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">
                Leaderboard
              </h2>
              <div v-if="leaderboard.length > 0" style="color: #ccc;">
                <p>{{ leaderboard.length }} users in leaderboard</p>
              </div>
              <div v-else style="color: #999; text-align: center; padding: 40px;">
                Loading leaderboard...
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
  if (!authStore.user) {
    router.push("/");
    return;
  }

  loading.value = true;
  try {
    const response = await fetch(`${BACKEND_URL}/api/bot-guilds`, {
      headers: {
        Authorization: `Bearer ${authStore.discordToken}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load servers");

    const data = await response.json();
    servers.value = data.guilds || [];
  } catch (error) {
    console.error("Error loading servers:", error);
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

const loadServerOverview = async (guildId) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/server-overview/${guildId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.discordToken}`,
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
          Authorization: `Bearer ${authStore.discordToken}`,
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

.server-button:hover {
  background: rgba(81, 112, 255, 0.35);
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
