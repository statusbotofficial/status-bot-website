<template>
  <div class="privacy-wrapper">
    <div class="privacy-container">
      <div class="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: 11/30/2025</p>
        <hr>
      </div>

      <div class="privacy-section">
        <h2>Information We Collect</h2>
        <p>Status Bot is committed to minimizing data collection. We only collect and store data strictly necessary for the operation of our custom tracking and status system.</p>
        <ul>
          <li><strong>Discord Identifiers:</strong> We collect and store your Discord User ID, Guild (Server) IDs, and the IDs of any channels configured for status notifications. These are essential for associating tracking data with the correct user and delivering status updates to the correct location.</li>
          <li><strong>Tracking Configuration Data:</strong> This includes the external URLs or identifiers you provide for the custom bots or services you wish to track. This data is used solely to perform the automated status checks.</li>
          <li><strong>Transaction Data:</strong> For Premium and Custom Bot purchases, we collect non-personally identifiable transaction IDs and subscription status from third-party payment processors (e.g., PayPal, Stripe, etc.) to manage your access to paid features. We do not store your full payment card details.</li>
        </ul>
      </div>

      <div class="privacy-section">
        <h2>How We Use Your Information</h2>
        <p>The information collected is used exclusively for the following purposes related to the Status Bot service:</p>
        <ul>
          <li><strong>Service Operation:</strong> To initiate and maintain the custom tracking system, perform automated status checks on provided URLs, and post status updates in configured Discord channels.</li>
          <li><strong>Feature Access:</strong> To verify and manage access to Premium features and to fulfill the terms of any Custom Bot development agreement.</li>
          <li><strong>Improvement:</strong> To monitor bot performance, diagnose errors, and make operational improvements. Aggregated, anonymized data (e.g., total number of users, command usage statistics) may be used for internal analysis.</li>
        </ul>
      </div>

      <div class="privacy-section">
        <h2>Data Storage and Security</h2>
        <p>Your data is stored securely in databases managed by the Status Bot team. We implement reasonable administrative, technical, and physical safeguards designed to protect the information we collect.</p>
        <ul>
          <li><strong>Data Retention:</strong> We retain collected information only for as long as necessary to provide the service or as required by law. If you remove Status Bot from your server or request data deletion, all associated tracking configuration data will be purged.</li>
          <li><strong>Access Control:</strong> Access to sensitive user data is restricted to core development and administrative personnel who require it to perform their duties.</li>
        </ul>
      </div>

      <div class="privacy-section">
        <h2>Data Sharing and Disclosure</h2>
        <p>Status Bot will not sell, rent, or trade your information with any third parties. We only share or disclose information under the following limited circumstances:</p>
        <ul>
          <li><strong>Service Providers:</strong> We may share minimal, necessary data with third-party hosting, database, and payment processing services solely for the purpose of running Status Bot. These third parties are contractually obligated to protect your information.</li>
          <li><strong>Legal Requirements:</strong> If required to do so by law, or in the good faith belief that such action is necessary to comply with legal processes or protect the rights, property, or safety of Status Bot or the public.</li>
          <li><strong>Discord's Policies:</strong> All data handling complies with the <a href="https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service" target="_blank">Discord Developer Terms of Service</a> and <a href="https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy" target="_blank">Privacy Policy</a>.</li>
        </ul>
      </div>

      <div class="privacy-section">
        <h2>Your Rights and Controls</h2>
        <p>You have the right to control the data Status Bot holds:</p>
        <ul>
          <li><strong>Access and Correction:</strong> You can typically view and modify all tracking configurations directly through our Discord commands or (if available) our dashboard.</li>
          <li><strong>Data Deletion:</strong> If you wish to delete all data associated with your Discord account or a specific server, you must contact us via our official Support Discord server. Upon verification, we will permanently delete all stored data associated with your ID within 30 days.</li>
        </ul>
      </div>

      <div class="privacy-section">
        <h2>Changes to This Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of the policy. You are advised to review this Privacy Policy periodically for any changes. Continued use of Status Bot after any change constitutes acceptance of the new Privacy Policy.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  const storedUser = localStorage.getItem('discordUser')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    authStore.setUser(user)
  }
  document.title = 'Privacy Policy | Status Bot'
})
</script>

<style scoped>
.privacy-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.privacy-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.privacy-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 60px;
}

.privacy-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  color: var(--text-primary);
}

.privacy-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.privacy-header hr {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  border: none;
  margin-top: 20px;
}

.privacy-section {
  margin-bottom: 50px;
  padding: 0;
}

.privacy-section h2 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.privacy-section p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 20px;
}

.privacy-section ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.privacy-section li {
  color: var(--text-secondary);
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
  line-height: 1.8;
}

.privacy-section li:before {
  content: '•';
  color: #5170ff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.privacy-section a {
  color: #5170ff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.privacy-section a:hover {
  color: #8a9fff;
}

/* Responsive Design */
@media (max-width: 1439px) and (min-width: 1024px) {
  .privacy-header h1 {
    font-size: 44px;
  }

  .privacy-section h2 {
    font-size: 26px;
  }

  .privacy-section p,
  .privacy-section li {
    font-size: 15px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .privacy-wrapper {
    padding: 50px 30px;
  }

  .privacy-header {
    margin-bottom: 50px;
  }

  .privacy-header h1 {
    font-size: 38px;
  }

  .privacy-section {
    margin-bottom: 40px;
  }

  .privacy-section h2 {
    font-size: 24px;
    margin-bottom: 12px;
  }

  .privacy-section p,
  .privacy-section li {
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 16px;
  }
}

@media (max-width: 767px) and (min-width: 480px) {
  .privacy-wrapper {
    padding: 35px 20px;
  }

  .privacy-header {
    margin-bottom: 30px;
  }

  .privacy-header h1 {
    font-size: 32px;
    line-height: 1.2;
  }

  .privacy-section {
    margin-bottom: 30px;
  }

  .privacy-section h2 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .privacy-section p,
  .privacy-section li {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 14px;
  }
}

@media (max-width: 479px) {
  .privacy-wrapper {
    padding: 20px 15px;
  }

  .privacy-header {
    margin-bottom: 25px;
  }

  .privacy-header h1 {
    font-size: 26px;
    line-height: 1.2;
    word-break: break-word;
  }

  .privacy-section {
    margin-bottom: 25px;
  }

  .privacy-section h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .privacy-section p,
  .privacy-section li {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .privacy-section li {
    padding-left: 22px;
  }
}
</style>
