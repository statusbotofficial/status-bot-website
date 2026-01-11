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
          <li><strong>Enable Systems:</strong> Configure which features you want to use (Status Tracking, Leveling, Economy, Welcome Messages).</li>
          <li><strong>Customize Settings:</strong> Use slash commands to set up notifications channels, XP rates, currency symbols, and more.</li>
          <li><strong>Test It Out:</strong> Run commands to verify everything is working correctly for your server.</li>
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
        <p>Status Bot uses slash commands for easy interaction. Here are the main command categories:</p>
        <ul>
          <li>
            <strong>/status track</strong> - Track a user's status
            <ul>
              <li>Usage: <code>/status track [user]</code></li>
              <li>Get notified when the user changes status</li>
            </ul>
          </li>
          <li>
            <strong>/leveling set</strong> - Configure XP settings
            <ul>
              <li>Set XP per message and voice time</li>
              <li>Configure allowed channels</li>
              <li>Enable/disable for your server</li>
            </ul>
          </li>
          <li>
            <strong>/economy set</strong> - Configure economy settings
            <ul>
              <li>Set per-message earnings</li>
              <li>Configure currency symbol</li>
              <li>Enable/disable mini-games</li>
            </ul>
          </li>
          <li>
            <strong>/balance</strong> - Check your server currency balance
            <ul>
              <li>Usage: <code>/balance [@user]</code></li>
              <li>View your or another user's balance</li>
            </ul>
          </li>
          <li>
            <strong>/daily</strong> - Claim daily currency reward
            <ul>
              <li>Claim once per day for currency</li>
              <li>Streak rewards for consecutive days</li>
            </ul>
          </li>
          <li>
            <strong>/coinflip</strong> - Flip a coin for currency
            <ul>
              <li>Usage: <code>/coinflip [amount]</code></li>
              <li>Double or lose your bet</li>
            </ul>
          </li>
          <li>
            <strong>/welcome set</strong> - Configure welcome messages
            <ul>
              <li>Set title, description, and images</li>
              <li>Configure notification channel</li>
              <li>Track member goals</li>
            </ul>
          </li>
          <li>
            <strong>/help</strong> - Display command help
            <ul>
              <li>Shows all available commands and usage</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="docs-section" id="setup-monitoring">
        <h2>Setting Up Systems</h2>
        <p><strong>Step 1: Enable Leveling System</strong></p>
        <ul>
          <li>Use <code>/leveling set enabled true</code></li>
          <li>Set XP per message with <code>/leveling set xp_per_message [amount]</code></li>
          <li>Optionally restrict to specific channels with <code>/leveling set allowed_channels [#channel]</code></li>
        </ul>
        <p><strong>Step 2: Set Up Economy</strong></p>
        <ul>
          <li>Use <code>/economy set enabled true</code></li>
          <li>Configure per-message earnings with <code>/economy set per_message [amount]</code></li>
          <li>Set currency symbol with <code>/economy set currency [symbol]</code></li>
        </ul>
        <p><strong>Step 3: Configure Welcome Messages</strong></p>
        <ul>
          <li>Use <code>/welcome set enabled true</code></li>
          <li>Set notification channel with <code>/welcome set channel [#channel]</code></li>
          <li>Customize message with title, description, and images</li>
        </ul>
        <p><strong>Step 4: Start Tracking Status</strong></p>
        <ul>
          <li>Use <code>/status track [user]</code> to monitor specific users</li>
          <li>Bot will notify when they change status</li>
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
          <li>Ensure Status Bot has permission to send messages in the channel</li>
          <li>Check that you're using the correct slash command syntax (start with <code>/</code>)</li>
          <li>Verify the bot is online by checking your server member list</li>
        </ul>
        <p><strong>Not earning XP or currency?</strong></p>
        <ul>
          <li>Check if the system is enabled: <code>/leveling set enabled</code> or <code>/economy set enabled</code></li>
          <li>Verify you're not in a cooldown period (60 second XP cooldown)</li>
          <li>Ensure the channel isn't excluded from earning (if restrictions are set)</li>
        </ul>
        <p><strong>Welcome messages not showing?</strong></p>
        <ul>
          <li>Verify the welcome system is enabled with <code>/welcome set enabled</code></li>
          <li>Check the notification channel is set and bot has permissions</li>
          <li>Ensure new member join events are being registered</li>
        </ul>
        <p><strong>Status tracking not working?</strong></p>
        <ul>
          <li>Verify the user is actually in the server</li>
          <li>Check bot has proper permissions in the channel</li>
          <li>Make sure notifications channel is configured</li>
        </ul>
        <p><strong>Need more help?</strong></p>
        <p>Visit our <router-link to="/support">Support page</router-link> to get in touch with our team or check the FAQ.</p>
      </div>

      <div class="docs-section" id="best-practices">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Enable Systems Gradually:</strong> Start with one system (e.g., leveling) and expand as you get comfortable with configuration</li>
          <li><strong>Customize for Your Community:</strong> Adjust XP rates, currency earnings, and messages to fit your server's size and culture</li>
          <li><strong>Use Dedicated Channels:</strong> Create separate channels for welcome messages and notifications to keep the server organized</li>
          <li><strong>Test Commands:</strong> After configuration, test commands in a private channel to ensure everything works</li>
          <li><strong>Set Reasonable XP Rates:</strong> Higher rates can cause members to level up too quickly; find the right balance</li>
          <li><strong>Regular Configuration Reviews:</strong> Periodically review your settings to ensure they still meet your server's needs</li>
          <li><strong>Communicate Changes:</strong> Let members know when you enable new systems or change rates</li>
          <li><strong>Consider Premium:</strong> Use Premium for enhanced features if you want to reward your most active members</li>
        </ul>
      </div>

      <div class="docs-section" id="faq">
        <h2>FAQ</h2>
        <p><strong>Q: How much XP do I earn per message?</strong></p>
        <p>A: The default is 10 XP per message, but server admins can customize this. Premium members earn 2x XP.</p>
        
        <p><strong>Q: How do I check my level and XP?</strong></p>
        <p>A: Use the <code>/leaderboard</code> command to see server rankings or check your profile for personal stats.</p>
        
        <p><strong>Q: Can I earn currency while AFK?</strong></p>
        <p>A: The bot requires actual message activity to earn currency. Just being in a voice channel earns voice XP but not economy rewards.</p>
        
        <p><strong>Q: What can I do with my currency?</strong></p>
        <p>A: Use currency for mini-games like Coinflip, Lootbox, and Clicker. Premium members have access to additional cosmetics and items.</p>
        
        <p><strong>Q: Do I lose XP or currency if I leave the server?</strong></p>
        <p>A: Your data is stored per-guild. If you leave and rejoin, your progress will be there if the data hasn't been purged.</p>
        
        <p><strong>Q: How do status notifications work?</strong></p>
        <p>A: When you track a user, the bot monitors their status. Any change (online, idle, DND, offline) triggers a notification in your configured channel.</p>
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
