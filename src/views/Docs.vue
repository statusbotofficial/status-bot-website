<template>
  <div class="docs-wrapper">
    <div class="docs-container">
      <div class="docs-header">
        <h1>Documentation</h1>
        <p>Complete guide to Status Bot features and setup</p>
        <hr>
      </div>

      <div class="docs-main">
        <aside class="docs-sidebar">
          <nav class="sidebar-nav">
            <div class="sidebar-title">Navigation</div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search sections..." 
              class="sidebar-search"
            >
            <ul>
              <li><a href="#what-is" @click.prevent="scrollToSection('what-is')">What is Status Bot?</a></li>
              <li><a href="#getting-started" @click.prevent="scrollToSection('getting-started')">Getting Started</a></li>
              <li><a href="#core-features" @click.prevent="scrollToSection('core-features')">Core Features</a></li>
              <li><a href="#command-reference" @click.prevent="scrollToSection('command-reference')">Command Reference</a></li>
              <li><a href="#setup-monitoring" @click.prevent="scrollToSection('setup-monitoring')">Setting Up Monitoring</a></li>
              <li><a href="#status-updates" @click.prevent="scrollToSection('status-updates')">Understanding Status Updates</a></li>
              <li><a href="#premium" @click.prevent="scrollToSection('premium')">Premium Features</a></li>
              <li><a href="#troubleshooting" @click.prevent="scrollToSection('troubleshooting')">Troubleshooting</a></li>
              <li><a href="#best-practices" @click.prevent="scrollToSection('best-practices')">Best Practices</a></li>
              <li><a href="#faq" @click.prevent="scrollToSection('faq')">FAQ</a></li>
              <li><a href="#contact" @click.prevent="scrollToSection('contact')">Contact & Support</a></li>
            </ul>
          </nav>
        </aside>

        <main class="docs-content">
      <div class="docs-section" id="what-is">
        <h2>What is Status Bot?</h2>
        <p><strong>Status Bot</strong> is a comprehensive Discord bot designed to enhance your server with user status tracking, member leveling systems, economy mechanics, welcome automation, and powerful server management tools.</p>
        <p>With Status Bot, you can:</p>
        <ul>
          <li>Track user statuses (Online, Idle, DND, Offline) with instant notifications</li>
          <li>Implement a complete leveling system with titles and rewards</li>
          <li>Create a server economy with custom currency and mini-games</li>
          <li>Automate welcome messages with customizable embeds</li>
          <li>Manage multiple servers with per-guild configuration</li>
          <li>Earn premium features for enhanced capabilities</li>
        </ul>
      </div>

      <div class="docs-section" id="getting-started">
        <h2>Getting Started</h2>
        <p>Follow these steps to set up Status Bot in your Discord server:</p>
        <ul>
          <li><strong>Invite the Bot:</strong> Use the invite button on our website to add Status Bot to your server. You need administrator or manage server permissions.</li>
          <li><strong>Access Dashboard:</strong> Visit the Status Bot dashboard and connect your Discord account to manage your servers.</li>
          <li><strong>Configure Features:</strong> Select your server and enable the systems you want to use (Leveling, Economy, etc.) directly from the dashboard.</li>
          <li><strong>Customize Settings:</strong> Adjust XP rates, currency symbols, notification channels, and more through the intuitive dashboard interface.</li>
          <li><strong>Save & Deploy:</strong> Your settings apply immediately to your server.</li>
        </ul>
      </div>

      <div class="docs-section" id="core-features">
        <h2>Core Features</h2>
        <ul>
          <li>
            <strong>User Status Tracking:</strong> Monitor user statuses (Online, Idle, DND, Offline) with real-time updates. Get notified instantly when users change status.
          </li>
          <li>
            <strong>XP & Leveling System:</strong> Members earn XP through messages and voice chat. Automatic leveling with custom titles (Newbie, Rookie, Hunter, Assassin, Elite, Apex, Emperor, Omniscient).
          </li>
          <li>
            <strong>Economy System:</strong> Create a server economy with custom currency. Includes daily rewards, streaks, mini-games (Coinflip, Lootbox, Clicker), and per-message earnings.
          </li>
          <li>
            <strong>Welcome Messages:</strong> Customize welcome embeds for new members with images, titles, descriptions, and member goal tracking.
          </li>
          <li>
            <strong>Server Management:</strong> Per-guild configuration for all features. Enable/disable systems as needed, customize channels and settings.
          </li>
          <li>
            <strong>Premium System:</strong> Unlock exclusive features with premium memberships including enhanced limits and priority support.
          </li>
        </ul>
      </div>

      <div class="docs-section" id="command-reference">
        <h2>Command Reference</h2>
        <p>Status Bot uses slash commands for easy interaction. All configuration is done through the dashboard, but here are the commands members use to interact with the bot:</p>
        
        <p><strong>Leveling Commands</strong></p>
        <ul>
          <li><strong>/rank</strong> - View your current level, XP progress, and rank in the server</li>
          <li><strong>/leaderboard</strong> - See the top leveled members in your server</li>
        </ul>
        
        <p><strong>Economy Commands</strong></p>
        <ul>
          <li><strong>/balance</strong> - Check your or another user's currency balance</li>
          <li><strong>/pay</strong> - Send currency to another server member</li>
          <li><strong>/daily</strong> - Claim your daily currency reward with streak bonuses</li>
          <li><strong>/slots</strong> - Play slots for currency</li>
          <li><strong>/blackjack</strong> - Play blackjack against the dealer</li>
          <li><strong>/coinflip</strong> - Flip a coin for currency</li>
          <li><strong>/clicker</strong> - Click your way to earnings</li>
          <li><strong>/lootbox</strong> - Open a mystery lootbox for random rewards</li>
        </ul>
        
        <p><strong>Utility Commands</strong></p>
        <ul>
          <li><strong>/profile</strong> - View your server profile with stats and achievements</li>
          <li><strong>/help</strong> - Display all available commands</li>
          <li><strong>/invite</strong> - Get the invite link to add Status Bot to another server</li>
          <li><strong>/about</strong> - Learn about Status Bot</li>
        </ul>
      </div>

      <div class="docs-section" id="setup-monitoring">
        <h2>Configuring Your Server</h2>
        <p>All configuration is done through the Status Bot dashboard. Here's what you can customize:</p>
        
        <p><strong>Leveling System</strong></p>
        <ul>
          <li>Enable or disable the leveling system for your server</li>
          <li>Set XP earned per message</li>
          <li>Configure voice chat XP (if enabled)</li>
          <li>Choose which channels to track XP in (optional)</li>
        </ul>
        
        <p><strong>Economy System</strong></p>
        <ul>
          <li>Enable or disable the economy system</li>
          <li>Set currency earned per message</li>
          <li>Customize your currency symbol</li>
          <li>Control which mini-games are available</li>
        </ul>
        
        <p><strong>In-Game Commands</strong></p>
        <p>Once configured in the dashboard, members use these slash commands to interact with the systems:</p>
        <ul>
          <li><strong>/rank</strong> - View your current level and XP</li>
          <li><strong>/balance</strong> - Check your currency balance</li>
          <li><strong>/daily</strong> - Claim daily currency reward</li>
          <li><strong>/profile</strong> - View your server profile</li>
          <li>Economy games: <strong>/coinflip</strong>, <strong>/slots</strong>, <strong>/blackjack</strong>, and more</li>
        </ul>
      </div>

      <div class="docs-section" id="status-updates">
        <h2>Leveling & Progression</h2>
        <p>The leveling system is designed to reward active members in your server:</p>
        <ul>
          <li><strong>XP Earn Rate:</strong> Default 10 XP per message, configurable per server</li>
          <li><strong>Voice Chat:</strong> Members earn XP while in voice channels</li>
          <li><strong>Premium Multiplier:</strong> Premium members earn 2x XP</li>
          <li><strong>Automatic Titles:</strong> Users receive titles based on level:
            <ul>
              <li>Levels 1-9: NEWBIE</li>
              <li>Levels 10-24: ROOKIE</li>
              <li>Levels 25-49: HUNTER</li>
              <li>Levels 50-99: ASSASSIN</li>
              <li>Levels 100-149: ELITE</li>
              <li>Levels 150-249: APEX</li>
              <li>Levels 250-349: EMPEROR</li>
              <li>Level 350+: OMNISCIENT</li>
            </ul>
          </li>
          <li><strong>Role Rewards:</strong> Optionally assign roles at certain levels</li>
        </ul>
      </div>

      <div class="docs-section" id="premium">
        <h2>Premium Features</h2>
        <p>Upgrade to a Premium membership to unlock advanced features:</p>
        <ul>
          <li><strong>2x XP Multiplier:</strong> Earn double XP on messages and voice chat</li>
          <li><strong>Economy Perks:</strong> Increased daily rewards and bonus mini-game earnings</li>
          <li><strong>Exclusive Items:</strong> Access to premium-only items and cosmetics</li>
          <li><strong>Priority Support:</strong> Get faster responses to questions and issues</li>
          <li><strong>Enhanced Limits:</strong> Increase limits on tracked users and settings</li>
          <li><strong>Custom Prefix:</strong> Set a custom command prefix for your server (Premium servers)</li>
        </ul>
        <p>See the <router-link to="/premium">Premium page</router-link> for pricing and membership tiers.</p>
      </div>

      <div class="docs-section" id="troubleshooting">
        <h2>Troubleshooting</h2>
        <p><strong>Bot not responding to commands?</strong></p>
        <ul>
          <li>Make sure the bot is in your server and has proper permissions</li>
          <li>Try using <code>/help</code> to see available commands</li>
          <li>Check that your server has the bot enabled in the dashboard</li>
        </ul>
        <p><strong>XP or currency not being earned?</strong></p>
        <ul>
          <li>Verify that Leveling or Economy is enabled in the dashboard for your server</li>
          <li>Make sure you're sending messages in allowed channels</li>
          <li>Check the bot has message read permissions in your channels</li>
        </ul>
        <p><strong>Commands not showing in Discord?</strong></p>
        <ul>
          <li>Invite the bot to your server again with the correct permissions</li>
          <li>Refresh your Discord client or app</li>
          <li>Clear your Discord cache and restart</li>
        </ul>
        <p><strong>Need more help?</strong></p>
        <p>Visit our <router-link to="/support">Support page</router-link> to get in touch with our team or check the FAQ.</p>
      </div>

      <div class="docs-section" id="best-practices">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Configure in Dashboard:</strong> Use the dashboard to enable/disable systems and customize settings for your server</li>
          <li><strong>Enable Systems Gradually:</strong> Start with one system (e.g., leveling) and expand as you get comfortable with the features</li>
          <li><strong>Customize for Your Community:</strong> Adjust XP rates and currency earnings to fit your server's size and activity level</li>
          <li><strong>Set Reasonable XP Rates:</strong> Higher rates can cause members to level up too quickly; find the right balance for your community</li>
          <li><strong>Communicate Changes:</strong> Let members know when you enable new systems or change rates</li>
          <li><strong>Review Settings Periodically:</strong> Check your dashboard settings to ensure they still meet your server's needs</li>
          <li><strong>Encourage Engagement:</strong> Use premium features to reward your most active members and encourage participation</li>
          <li><strong>Monitor System Health:</strong> Check the commands page to see all available features and keep members informed</li>
        </ul>
      </div>

      <div class="docs-section" id="faq">
        <h2>FAQ</h2>
        <p><strong>Q: How much XP do I earn per message?</strong></p>
        <p>A: The default is 10 XP per message, but server admins can customize this in the dashboard. Premium members earn 2x XP.</p>
        
        <p><strong>Q: How do I check my level and XP?</strong></p>
        <p>A: Use <code>/rank</code> to see your personal stats or <code>/leaderboard</code> to see server rankings.</p>
        
        <p><strong>Q: Can I earn currency while AFK?</strong></p>
        <p>A: The bot requires actual message activity to earn currency. Voice chat does not earn economy currency.</p>
        
        <p><strong>Q: What can I do with my currency?</strong></p>
        <p>A: Use currency for mini-games like Coinflip, Slots, Blackjack, Lootbox, and Clicker. Premium members can earn more!</p>
        
        <p><strong>Q: Do I lose XP or currency if I leave the server?</strong></p>
        <p>A: Your data is stored per-guild. If you leave and rejoin, your progress will be there unless the server admin has cleared old data.</p>
        
        <p><strong>Q: How do I enable/disable systems in my server?</strong></p>
        <p>A: Visit the Status Bot dashboard, select your server, and enable/disable Leveling and Economy systems as you prefer.</p>
      </div>

      <div class="docs-section" id="contact">
        <h2>Contact & Support</h2>
        <p>Need help, have questions, or want to report a bug? We're here to help!</p>
        <ul>
          <li>Visit our <router-link to="/support">Support page</router-link> for live chat and AI assistance</li>
          <li>Join our <a href="https://discord.gg/statusbot" target="_blank">Discord server</a> for community help and updates</li>
          <li>Check the <router-link to="/commands">Commands page</router-link> for detailed command documentation</li>
          <li>Review our <router-link to="/privacy">Privacy Policy</router-link> and <router-link to="/terms">Terms of Service</router-link></li>
        </ul>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const searchQuery = ref('')

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('discordUser')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    authStore.setUser(user)
  }
  document.title = 'Documentation | Status Bot'
})
</script>

<style scoped>
.docs-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.docs-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.docs-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 60px;
}

.docs-main {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.docs-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-nav {
  background: rgba(81, 112, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.sidebar-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #5170ff;
  margin-bottom: 15px;
  letter-spacing: 0.5px;
}

.sidebar-search {
  width: 100%;
  padding: 10px 12px;
  background: rgba(81, 112, 255, 0.08);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  margin-bottom: 15px;
  transition: all 0.2s ease;
}

.sidebar-search::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.sidebar-search:focus {
  outline: none;
  border-color: #5170ff;
  background: rgba(81, 112, 255, 0.12);
  box-shadow: 0 0 0 2px rgba(81, 112, 255, 0.1);
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0;
}

.sidebar-nav a {
  display: block;
  padding: 10px 15px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-bottom: 3px;
}

.sidebar-nav a:hover {
  background: rgba(81, 112, 255, 0.1);
  color: #5170ff;
  transform: translateX(4px);
}

.docs-content {
  width: 100%;
}

.docs-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  color: #fff;
}

.docs-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.docs-header hr {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  border: none;
  margin-top: 20px;
}

.docs-section {
  margin-bottom: 50px;
  padding: 0;
}

.docs-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
}

.docs-section p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.docs-section ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.docs-section li {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
}

.docs-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.docs-section ul ul {
  margin-left: 20px;
  margin-top: 15px;
}

.docs-section strong {
  color: #fff;
  font-weight: 600;
}

.docs-section code {
  background-color: rgba(81, 112, 255, 0.1);
  color: #8a9fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
}

.docs-section a {
  color: #5170ff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.docs-section a:hover {
  color: #8a9fff;
}

/* Responsive Design */
@media (max-width: 1439px) and (min-width: 1024px) {
  .docs-header h1 {
    font-size: 44px;
  }

  .docs-section h2 {
    font-size: 26px;
  }

  .docs-section p,
  .docs-section li {
    font-size: 15px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .docs-wrapper {
    padding: 50px 30px;
  }

  .docs-header {
    margin-bottom: 50px;
  }

  .docs-header h1 {
    font-size: 38px;
  }

  .docs-main {
    grid-template-columns: 220px 1fr;
    gap: 30px;
  }

  .sidebar-nav {
    padding: 15px;
  }

  .sidebar-nav a {
    padding: 8px 12px;
    font-size: 13px;
  }

  .docs-section {
    margin-bottom: 40px;
  }

  .docs-section h2 {
    font-size: 24px;
    margin-bottom: 12px;
  }

  .docs-section p,
  .docs-section li {
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 16px;
  }
}

@media (max-width: 767px) and (min-width: 480px) {
  .docs-wrapper {
    padding: 35px 20px;
  }

  .docs-header {
    margin-bottom: 30px;
  }

  .docs-header h1 {
    font-size: 32px;
    line-height: 1.2;
  }

  .docs-main {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    position: static;
  }

  .docs-section {
    margin-bottom: 30px;
  }

  .docs-section h2 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .docs-section p,
  .docs-section li {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 14px;
  }
}

@media (max-width: 479px) {
  .docs-wrapper {
    padding: 20px 15px;
  }

  .docs-header {
    margin-bottom: 25px;
  }

  .docs-header h1 {
    font-size: 26px;
    line-height: 1.2;
    word-break: break-word;
  }

  .docs-main {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    position: static;
  }

  .sidebar-nav {
    padding: 12px;
    margin-bottom: 20px;
  }

  .sidebar-nav a {
    padding: 8px 10px;
    font-size: 12px;
  }

  .docs-section {
    margin-bottom: 25px;
  }

  .docs-section h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .docs-section p,
  .docs-section li {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .docs-section li {
    padding-left: 22px;
  }

  .docs-section code {
    font-size: 0.9em;
  }
}
</style>
