<template>
  <div class="page-section">
    <div class="container">
      <h1>Terms of Service</h1>
      
      <div class="policy-content">
        <h2>Agreement</h2>
        <p>By using Status Bot, you agree to comply with these Terms of Service. If you do not agree to any part of these terms, please discontinue use of the bot.</p>

        <h2>Use License</h2>
        <p>We grant you a limited, non-exclusive, non-transferable license to use Status Bot for personal, non-commercial purposes on Discord servers where you have the authority to authorize bot usage.</p>

        <h2>Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the bot for illegal activities or harassment</li>
          <li>Attempt to reverse engineer or modify the bot</li>
          <li>Use the bot to spam or abuse Discord services</li>
          <li>Violate Discord's Terms of Service</li>
          <li>Bypass security features or rate limiting</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>All content, features, and functionality of Status Bot are owned by Status Bot, protected by copyright, trademark, and other intellectual property laws.</p>

        <h2>Disclaimer of Warranties</h2>
        <p>Status Bot is provided "as is" without warranties of any kind, either express or implied. We do not guarantee the bot will be error-free or uninterrupted.</p>

        <h2>Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Status Bot shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the bot.</p>

        <h2>Termination</h2>
        <p>We reserve the right to terminate or suspend your access to Status Bot at any time for violation of these Terms of Service or for any other reason.</p>

        <h2>Changes to Terms</h2>
        <p>We may modify these Terms of Service at any time. Your continued use of the bot constitutes acceptance of the modified terms.</p>

        <h2>Contact</h2>
        <p>For questions about these Terms of Service, contact us through our support channels.</p>

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
