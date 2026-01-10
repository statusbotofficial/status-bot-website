<template>
  <div class="page-section">
    <div class="container">
      <h1>Privacy Policy</h1>
      
      <div class="policy-content">
        <h2>Introduction</h2>
        <p>Status Bot respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information.</p>

        <h2>Data Collection</h2>
        <p>We collect data to improve our services and provide you with a better experience. This includes:</p>
        <ul>
          <li>Discord user ID and username</li>
          <li>Server information you authorize</li>
          <li>Service usage statistics</li>
          <li>Error logs for troubleshooting</li>
        </ul>

        <h2>Data Usage</h2>
        <p>Your data is used to:</p>
        <ul>
          <li>Provide and improve the bot services</li>
          <li>Understand usage patterns</li>
          <li>Debug and fix issues</li>
          <li>Communicate important updates</li>
        </ul>

        <h2>Data Protection</h2>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.</p>

        <h2>Third Parties</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. Your data is only shared with Discord API and our hosting provider as necessary for service operation.</p>

        <h2>Your Rights</h2>
        <p>You have the right to request, access, or delete your personal data. Please contact our support team for such requests.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes via our Discord server or email.</p>

        <h2>Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us through our support channels.</p>

        <p class="last-updated">Last updated: January 2026</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-section {
  padding: 80px 50px;
  min-height: calc(100vh - 200px);
}

.container h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.policy-content {
  max-width: 800px;
  line-height: 1.8;
}

.policy-content h2 {
  font-size: 1.5rem;
  margin-top: 40px;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.policy-content h2:first-of-type {
  margin-top: 0;
}

.policy-content p {
  margin-bottom: 15px;
  color: var(--text-secondary);
}

.policy-content ul {
  list-style: none;
  margin-bottom: 20px;
  padding-left: 20px;
}

.policy-content ul li {
  margin-bottom: 10px;
  color: var(--text-secondary);
}

.policy-content ul li:before {
  content: '•';
  color: var(--primary-color);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
  margin-right: 0.5em;
}

.last-updated {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .policy-content h2 {
    font-size: 1.25rem;
  }
}
</style>
