<template>
  <div class="page-section">
    <div class="container">
      <h1>Support</h1>
      <p>Get help with Status Bot or contact our support team.</p>
      
      <div class="support-content">
        <div class="support-card">
          <h3>Documentation</h3>
          <p>Read our comprehensive documentation and guides.</p>
          <a :href="DOCS_URL" target="_blank" class="btn secondary">View Docs</a>
        </div>
        <div class="support-card">
          <h3>Discord Server</h3>
          <p>Join our community Discord server for support and discussions.</p>
          <a :href="DISCORD_SERVER_URL" target="_blank" class="btn secondary">Join Discord</a>
        </div>
        <div class="support-card">
          <h3>Email Support</h3>
          <p>Need direct assistance? Email us for priority support.</p>
          <a :href="`mailto:${SUPPORT_EMAIL}`" class="btn secondary">Email Us</a>
        </div>
      </div>

      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-items">
          <div class="faq-item" v-for="item in faqs" :key="item.id" @click="item.open = !item.open">
            <h4>{{ item.question }}</h4>
            <p v-if="item.open" class="answer">{{ item.answer }}</p>
            <span class="toggle">{{ item.open ? '−' : '+' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DOCS_URL, DISCORD_SERVER_URL, SUPPORT_EMAIL } from '../config'

const faqs = ref([
  {
    id: 1,
    question: 'How do I invite Status Bot to my server?',
    answer: 'Click the "Invite" button on the navigation menu. You\'ll be taken to Discord\'s authorization page.',
    open: false
  },
  {
    id: 2,
    question: 'Is Status Bot free?',
    answer: 'Yes! Status Bot has a free tier with core features. We also offer a Premium plan.',
    open: false
  },
  {
    id: 3,
    question: 'How do I report a bug?',
    answer: 'Please report bugs in our Discord server or via email with details about the issue.',
    open: false
  }
])
</script>

<style scoped>
.page-section {
  padding: 80px 50px;
  min-height: calc(100vh - 200px);
}

.container h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.container > p {
  font-size: 1.1rem;
  margin-bottom: 60px;
  max-width: 600px;
}

.support-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.support-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.support-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
}

.support-card h3 {
  margin-bottom: 15px;
}

.support-card p {
  margin-bottom: 20px;
}

.faq-section {
  max-width: 700px;
}

.faq-section h2 {
  font-size: 2rem;
  margin-bottom: 30px;
}

.faq-items {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.faq-item {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item:hover {
  background-color: var(--bg-tertiary);
}

.faq-item h4 {
  font-size: 1.1rem;
  margin-bottom: 0;
  color: var(--text-primary);
}

.faq-item .answer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.faq-item .toggle {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 1.5rem;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .support-content {
    grid-template-columns: 1fr;
  }
}
</style>
