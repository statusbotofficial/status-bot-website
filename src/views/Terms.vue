<template>
  <div class="terms-wrapper">
    <div class="terms-container">
      <div class="terms-header">
        <h1>Terms of Service</h1>
        <p>Last updated: 11/30/2025</p>
        <hr>
      </div>

      <div class="terms-section">
        <h2>Acceptance of Terms</h2>
        <p>By inviting or using <strong>Status Bot</strong>, accessing our website, or purchasing any premium or custom services, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing our services. These terms may be updated at any time without prior notice.</p>
      </div>

      <div class="terms-section">
        <h2>Service Description and Usage</h2>
        <p><strong>Status Bot</strong> is a Discord bot designed to provide a custom tracking system for Discord users' personal bots or other projects. The core functionality is intended for monitoring and status reporting.</p>
        <ul>
          <li><strong>Prohibited Use:</strong> You agree not to use the Bot for any illegal, abusive, harmful, or unauthorized purposes, including but not limited to spamming, harassment, distributing malicious content, or violating Discord's Terms of Service.</li>
          <li><strong>Service Availability:</strong> While we strive for 100% uptime, the Bot is provided "as is" and "as available." We make no guarantees regarding the continuous availability of the Bot or the speed of its responses, except where explicitly covered by a Premium plan.</li>
          <li><strong>Data:</strong> You understand that the Bot stores minimal, necessary data related to your configured tracking settings (e.g., bot IDs, tracking URLs, configured channels, user IDs). We do not collect or store private message content.</li>
        </ul>
      </div>

      <div class="terms-section">
        <h2>Premium and Custom Services</h2>
        <p>We offer paid services to enhance your experience with Status Bot:</p>
        <ul>
          <li><strong>Premium Plans:</strong> Purchasing a Premium plan grants access to specific locked features and provides a higher priority processing queue, resulting in <strong>faster responses</strong> from the Bot. Premium features are subject to change, addition, or removal at our discretion, though we will provide notice for significant changes.</li>
          <li><strong>Custom Bot Development:</strong> The Custom plan provides a custom-made bot developed by the Status Bot team to meet your unique requirements.
            <ul>
              <li><strong>Development Scope:</strong> The scope of work will be defined and agreed upon in a separate written agreement (e.g., a contract or statement of work) before development begins.</li>
              <li><strong>Ownership:</strong> Ownership and intellectual property rights for the custom-developed bot will be explicitly stated in the separate agreement. Unless otherwise agreed, Status Bot retains the rights to any underlying code, libraries, and general methodologies.</li>
              <li><strong>Refunds:</strong> Custom bot development fees are generally non-refundable once development has commenced.</li>
            </ul>
          </li>
          <li><strong>Refunds (General):</strong> All purchases, including Premium subscriptions, are final and non-refundable, except in cases where the service fails to function as described for a prolonged period, as determined solely by the Status Bot team. Disputes related to refunds must be initiated within 7 days of the purchase.</li>
        </ul>
      </div>

      <div class="terms-section">
        <h2>Limitation of Liability</h2>
        <p>In no event shall <strong>Status Bot or its suppliers</strong> be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Bot or its services, even if Status Bot or a Status Bot authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
      </div>

      <div class="terms-section">
        <h2>Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of the State of Georgia, United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
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
})
</script>

<style scoped>
.terms-wrapper {
  width: 100%;
  padding: 60px 50px;
  min-height: calc(100vh - 200px);
}

.terms-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.terms-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 60px;
}

.terms-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  color: #fff;
}

.terms-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.terms-header hr {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  border: none;
  margin-top: 20px;
}

.terms-section {
  margin-bottom: 50px;
  padding: 0;
}

.terms-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
}

.terms-section p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.terms-section ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.terms-section li {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
}

.terms-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.terms-section ul ul {
  margin-left: 20px;
  margin-top: 15px;
}

.terms-section strong {
  color: #fff;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1439px) and (min-width: 1024px) {
  .terms-header h1 {
    font-size: 44px;
  }

  .terms-section h2 {
    font-size: 26px;
  }

  .terms-section p,
  .terms-section li {
    font-size: 15px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .terms-wrapper {
    padding: 50px 30px;
  }

  .terms-header {
    margin-bottom: 50px;
  }

  .terms-header h1 {
    font-size: 38px;
  }

  .terms-section {
    margin-bottom: 40px;
  }

  .terms-section h2 {
    font-size: 24px;
    margin-bottom: 12px;
  }

  .terms-section p,
  .terms-section li {
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 16px;
  }
}

@media (max-width: 767px) and (min-width: 480px) {
  .terms-wrapper {
    padding: 35px 20px;
  }

  .terms-header {
    margin-bottom: 30px;
  }

  .terms-header h1 {
    font-size: 32px;
    line-height: 1.2;
  }

  .terms-section {
    margin-bottom: 30px;
  }

  .terms-section h2 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .terms-section p,
  .terms-section li {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 14px;
  }
}

@media (max-width: 479px) {
  .terms-wrapper {
    padding: 20px 15px;
  }

  .terms-header {
    margin-bottom: 25px;
  }

  .terms-header h1 {
    font-size: 26px;
    line-height: 1.2;
    word-break: break-word;
  }

  .terms-section {
    margin-bottom: 25px;
  }

  .terms-section h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .terms-section p,
  .terms-section li {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .terms-section li {
    padding-left: 22px;
  }
}
</style>
