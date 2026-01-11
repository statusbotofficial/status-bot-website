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
              @input="filterSections"
            >
            <ul>
              <li v-for="section in filteredSections" :key="section.id">
                <a :href="`#${section.id}`" @click.prevent="scrollToSection(section.id)">{{ section.label }}</a>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="docs-content">
      <div class="docs-section" id="what-is">
        <h2>What is Status Bot?</h2>
        <p><strong>Status Bot</strong> is a powerful Discord bot designed to help you monitor and track the status of your bots, services, and projects. Whether you're running custom bots, web services, or third-party integrations, Status Bot provides real-time monitoring and automated status updates to your Discord server.</p>
        <p>With Status Bot, you can:</p>
        <ul>
          <li>Monitor multiple bots or services simultaneously</li>
          <li>Receive instant notifications when status changes occur</li>
          <li>Track uptime and performance metrics</li>
          <li>Access comprehensive status history and analytics</li>
          <li>Customize notifications and update frequency</li>
          <li>Integrate with your existing Discord workflow</li>
        </ul>
      </div>

      <div class="docs-section" id="getting-started">
        <h2>Getting Started</h2>
        <p>Follow these steps to set up Status Bot in your Discord server:</p>
        <ul>
          <li><strong>Invite the Bot:</strong> Click the <code>Invite</code> button on our home page to add Status Bot to your server. You'll need administrator or manage server permissions.</li>
          <li><strong>Configure Tracking:</strong> Use the available commands to set up which bots or services you want to monitor.</li>
          <li><strong>Set Notifications:</strong> Choose which channel should receive status updates.</li>
          <li><strong>Verify Setup:</strong> Run a test command to ensure everything is configured correctly.</li>
        </ul>
      </div>

      <div class="docs-section" id="core-features">
        <h2>Core Features</h2>
        <ul>
          <li>
            <strong>Real-Time Monitoring:</strong> Status Bot continuously monitors your tracked services and updates status every 30 seconds. Get instant alerts when services go down or come back online.
          </li>
          <li>
            <strong>Multi-Service Support:</strong> Track unlimited bots and services with a single Status Bot instance. Perfect for developers managing multiple projects.
          </li>
          <li>
            <strong>Customizable Alerts:</strong> Configure custom notification channels, mention roles or users, and set alert preferences per service.
          </li>
          <li>
            <strong>Status Dashboard:</strong> Visit our website to see a real-time status overview of all tracked services with detailed metrics.
          </li>
          <li>
            <strong>History Tracking:</strong> Status Bot maintains detailed logs of all incidents and status changes for compliance and analysis.
          </li>
          <li>
            <strong>Premium Features:</strong> Unlock faster updates, priority processing, and advanced analytics with a Premium subscription.
          </li>
        </ul>
      </div>

      <div class="docs-section" id="command-reference">
        <p>Status Bot uses slash commands for easy interaction. Here are the main command categories:</p>
        <ul>
          <li>
            <strong>/track add</strong> - Add a new service or bot to monitor
            <ul>
              <li>Usage: <code>/track add [name] [url/id]</code></li>
              <li>Example: <code>/track add "My Bot" https://api.example.com/status</code></li>
            </ul>
          </li>
          <li>
            <strong>/track remove</strong> - Remove a service from monitoring
            <ul>
              <li>Usage: <code>/track remove [service-name]</code></li>
              <li>Example: <code>/track remove "My Bot"</code></li>
            </ul>
          </li>
          <li>
            <strong>/track list</strong> - Display all tracked services
            <ul>
              <li>Shows service name, current status, and uptime</li>
            </ul>
          </li>
          <li>
            <strong>/notify channel</strong> - Set the notification channel
            <ul>
              <li>Usage: <code>/notify channel [#channel]</code></li>
              <li>Status updates will be sent to this channel</li>
            </ul>
          </li>
          <li>
            <strong>/notify role</strong> - Set a role to mention in notifications
            <ul>
              <li>Usage: <code>/notify role [role-name]</code></li>
              <li>The role will be mentioned when status changes occur</li>
            </ul>
          </li>
          <li>
            <strong>/stats</strong> - View monitoring statistics
            <ul>
              <li>Shows uptime percentage, incident count, and average response time</li>
            </ul>
          </li>
          <li>
            <strong>/help</strong> - Display command help
            <ul>
              <li>Shows all available commands and their usage</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="docs-section" id="setup-monitoring">
        <p><strong>Step 1: Add a Service</strong></p>
        <p>Use the <code>/track add</code> command to add a service you want to monitor. You'll need to provide:</p>
        <ul>
          <li>A descriptive name for the service</li>
          <li>The URL or identifier to monitor (HTTP endpoint, API, or bot ID)</li>
        </ul>
        <p><strong>Step 2: Configure Notifications</strong></p>
        <p>Set up where and how you want to receive status updates:</p>
        <ul>
          <li>Use <code>/notify channel</code> to specify a dedicated status channel</li>
          <li>Use <code>/notify role</code> to mention specific roles during incidents</li>
        </ul>
        <p><strong>Step 3: Verify Configuration</strong></p>
        <p>Run <code>/track list</code> to see all monitored services and <code>/stats</code> to verify everything is working correctly.</p>
      </div>

      <div class="docs-section" id="status-updates">
        <p>Status Bot provides detailed status information for each monitored service:</p>
        <ul>
          <li><strong>Online:</strong> Service is running and responding normally</li>
          <li><strong>Offline:</strong> Service is not responding or is down</li>
          <li><strong>Degraded:</strong> Service is responding slowly or with errors</li>
          <li><strong>Maintenance:</strong> Service is in planned maintenance (if supported)</li>
        </ul>
        <p>Each status update includes:</p>
        <ul>
          <li>Current service status with timestamp</li>
          <li>Uptime percentage for the past 24 hours</li>
          <li>Average response time</li>
          <li>Last change timestamp</li>
        </ul>
      </div>

      <div class="docs-section" id="premium">
        <p>Upgrade to a Premium plan to unlock advanced monitoring capabilities:</p>
        <ul>
          <li><strong>Faster Updates:</strong> Get status updates every 15 seconds instead of 30 (Premium plan)</li>
          <li><strong>Priority Processing:</strong> Your services are checked first in the rotation</li>
          <li><strong>Advanced Analytics:</strong> Detailed charts and analytics for uptime trends</li>
          <li><strong>Unlimited Services:</strong> Monitor as many services as you need</li>
          <li><strong>Custom Bot Development:</strong> Get a custom bot tailored to your specific needs</li>
          <li><strong>Priority Support:</strong> Get faster responses to support tickets</li>
        </ul>
        <p>See the <router-link to="/premium">Premium page</router-link> for pricing and plan details.</p>
      </div>

      <div class="docs-section" id="troubleshooting">
        <p><strong>Bot not responding to commands?</strong></p>
        <ul>
          <li>Ensure Status Bot has permission to send messages in the channel</li>
          <li>Check that you're using the correct slash command syntax</li>
          <li>Verify the bot is online by checking your server member list</li>
        </ul>
        <p><strong>Services showing as offline when they're actually online?</strong></p>
        <ul>
          <li>Verify the URL or identifier is correct and publicly accessible</li>
          <li>Check firewall rules aren't blocking the monitoring requests</li>
          <li>Ensure your service has the correct CORS headers if applicable</li>
        </ul>
        <p><strong>Not receiving notifications?</strong></p>
        <ul>
          <li>Verify the notification channel is set correctly with <code>/notify channel</code></li>
          <li>Check that Status Bot has send message permissions in that channel</li>
          <li>Ensure notifications are enabled for the service with <code>/track list</code></li>
        </ul>
        <p><strong>Need more help?</strong></p>
        <p>Visit our <router-link to="/support">Support page</router-link> to get in touch with our team or check the FAQ.</p>
      </div>

      <div class="docs-section" id="best-practices">
        <ul>
          <li><strong>Use Descriptive Names:</strong> Give your services clear, easy-to-understand names for quick identification</li>
          <li><strong>Dedicate a Status Channel:</strong> Create a separate channel just for status updates to keep them organized</li>
          <li><strong>Test Your Setup:</strong> After configuration, manually trigger a test to ensure everything works</li>
          <li><strong>Monitor Critical Services First:</strong> Start with your most important services and expand gradually</li>
          <li><strong>Set Appropriate Thresholds:</strong> Configure response time thresholds that match your service expectations</li>
          <li><strong>Regular Reviews:</strong> Periodically review your monitoring configuration to ensure it still meets your needs</li>
          <li><strong>Enable Backups:</strong> Consider Premium for critical services to get more frequent status checks</li>
        </ul>
      </div>

      <div class="docs-section" id="api">
        <p>For developers interested in building integrations, Status Bot exposes a REST API for programmatic access to status data:</p>
        <ul>
          <li><strong>Base URL:</strong> <code>https://status-bot-backend.onrender.com/api</code></li>
          <li><strong>Status Endpoint:</strong> <code>GET /api/bot-stats</code> - Returns current bot statistics</li>
          <li><strong>Response Format:</strong> JSON with status, uptime, and performance metrics</li>
        </ul>
        <p>For custom integrations or API documentation, contact us via the <router-link to="/support">Support page</router-link>.</p>
      </div>

      <div class="docs-section" id="faq">
        <p><strong>Q: How often does Status Bot check services?</strong></p>
        <p>A: By default, services are checked every 30 seconds. With Premium, this can be reduced to 15 seconds for faster updates.</p>
        
        <p><strong>Q: Can I monitor services outside of Discord?</strong></p>
        <p>A: Status Bot integrates with Discord, so notifications are sent to your Discord server. However, you can access the status dashboard on our website anytime.</p>
        
        <p><strong>Q: Is there a limit to how many services I can monitor?</strong></p>
        <p>A: Free plan includes monitoring for multiple services. Premium plans offer unlimited service monitoring.</p>
        
        <p><strong>Q: What happens if my service is down?</strong></p>
        <p>A: Status Bot will immediately send a notification to your configured channel and mark the service as offline in the status dashboard.</p>
        
        <p><strong>Q: Can I track historical uptime data?</strong></p>
        <p>A: Yes, Status Bot maintains 30 days of historical data. Premium plans include extended history retention.</p>
        
        <p><strong>Q: Do I need to configure anything on my service to be monitored?</strong></p>
        <p>A: For HTTP endpoints, Status Bot checks if the URL responds with a 2xx status code. For other integrations, specific configuration may be needed.</p>
      </div>

      <div class="docs-section" id="contact">
        <p>Need help or have questions? We're here to help!</p>
        <ul>
          <li>Visit our <router-link to="/support">Support page</router-link> for live chat support</li>
          <li>Join our <a href="https://discord.gg/statusbot" target="_blank">Discord server</a> for community help</li>
          <li>Check out the <router-link to="/commands">Commands page</router-link> for detailed command documentation</li>
          <li>Review our <router-link to="/privacy">Privacy Policy</router-link> and <router-link to="/terms">Terms of Service</router-link></li>
        </ul>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const searchQuery = ref('')

const sections = [
  { id: 'what-is', label: 'What is Status Bot?' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'core-features', label: 'Core Features' },
  { id: 'command-reference', label: 'Command Reference' },
  { id: 'setup-monitoring', label: 'Setting Up Monitoring' },
  { id: 'status-updates', label: 'Understanding Status Updates' },
  { id: 'premium', label: 'Premium Features' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'api', label: 'API Information' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact & Support' },
]

const filteredSections = computed(() => {
  if (!searchQuery.value.trim()) {
    return sections
  }
  const query = searchQuery.value.toLowerCase()
  return sections.filter(section => 
    section.label.toLowerCase().includes(query)
  )
})

const filterSections = () => {
  // Computed property handles filtering automatically
}

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
