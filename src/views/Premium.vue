<template>
  <div class="premium-container">
    <div class="premium-header">
      <h1 class="premium-title">
        Elevate your
        <span class="premium-title-highlight">Discord Experience</span>
      </h1>
      <h2 class="premium-subtitle">Choose your plan</h2>
      <p class="premium-description">Pick from one of our premium purchase plans for Status Bot.</p>
    </div>

    <!-- Premium Info Section -->
    <div class="premium-info-section">
      <div class="info-item">
        <span class="info-check">⚡</span>
        <span class="info-text">Instant activation</span>
      </div>
      <div class="info-item">
        <span class="info-check">🔄️</span>
        <span class="info-text">Cancel anytime</span>
      </div>
      <div class="info-item">
        <span class="info-check">💰</span>
        <span class="info-text">7-day refund</span>
      </div>
    </div>

    <div class="plans-container">
      <!-- Free Plan -->
      <div class="plan-card">
        <div class="plan-name">
          Free<span></span>
        </div>
        <div class="plan-price">$0</div>
        <div class="plan-divider">Always free</div>
        <h3 class="plan-features-title">Features:</h3>
        <ul class="plan-features">
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Basic commands
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Status tracking
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Leveling system
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Community support
          </li>
        </ul>
        <button class="plan-button" :disabled="!hasPremium" :class="{ 'current-plan': !hasPremium }">
          {{ !hasPremium ? 'Current Plan' : 'Downgrade' }}
        </button>
        <button class="see-features-btn" @click="scrollToFeatures('free')">See all features</button>
      </div>

      <!-- Premium Plan -->
      <div class="plan-card" :class="{ 'premium-highlighted': hasPremium }">
        <div v-if="hasPremium" class="plan-badge">Your Plan</div>
        <div v-else class="plan-badge">Most Popular</div>
        <div class="plan-name">
          Premium<span></span>
        </div>
        <div class="plan-price">$3.99<span class="plan-period">/m</span></div>
        <div class="plan-divider">or</div>
        <div class="plan-boost">
          <span class="boost-icon">🚀</span>
          Boost Our Server
        </div>
        <h3 class="plan-features-title">Features:</h3>
        <ul class="plan-features">
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Everything in Free
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Exclusive commands
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Luck boost in economy
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Priority support
          </li>
        </ul>
        <button v-if="hasPremium" class="plan-button" disabled :class="{ 'current-plan': true }">
          Current Plan
        </button>
        <button v-else class="plan-button premium-button" @click="showPremiumModal = true">
          Get Premium
        </button>
        <button class="see-features-btn" @click="scrollToFeatures('premium')">See all features</button>
      </div>
    </div>

    <!-- Full Features Section -->
    <div class="features-section" ref="featuresSection">
      <h2 class="features-title">All Features</h2>
      <div class="features-table">
        <div class="table-header">
          <div class="table-feature-name">Features</div>
          <div class="table-column-header">Free Plan</div>
          <div class="table-column-header premium">Premium Plan</div>
        </div>
        <div class="table-body">
          <div class="table-row">
            <div class="table-feature-name">Basic commands</div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row">
            <div class="table-feature-name">Status tracking</div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row">
            <div class="table-feature-name">Leveling system</div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row">
            <div class="table-feature-name">Economy mini-games</div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row">
            <div class="table-feature-name">Community support</div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row">
            <div class="table-feature-name">Voice chat XP</div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row premium-feature">
            <div class="table-feature-name">2x XP multiplier</div>
            <div class="table-cell"><span class="x-icon">✕</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row premium-feature">
            <div class="table-feature-name">Exclusive commands</div>
            <div class="table-cell"><span class="x-icon">✕</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row premium-feature">
            <div class="table-feature-name">Luck boost in economy</div>
            <div class="table-cell"><span class="x-icon">✕</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row premium-feature">
            <div class="table-feature-name">Priority support</div>
            <div class="table-cell"><span class="x-icon">✕</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
          <div class="table-row premium-feature">
            <div class="table-feature-name">Premium badge</div>
            <div class="table-cell"><span class="x-icon">✕</span></div>
            <div class="table-cell"><span class="check-icon">✓</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium Modal -->
    <div v-if="showPremiumModal" class="modal-overlay" @click.self="showPremiumModal = false">
      <div class="modal-content">
        <button class="modal-close" @click="showPremiumModal = false">✕</button>
        <h2>Get Premium</h2>
        <p>Choose how you'd like to support Status Bot:</p>
        
        <div class="modal-buttons">
          <a href="https://www.patreon.com/posts/status-bot-148075915" target="_blank" class="modal-btn patreon-btn">
            <span class="btn-icon">🎁</span>
            <span class="btn-text">Support on Patreon</span>
          </a>
          <a href="https://discord.gg/Kd2MckVxED" target="_blank" class="modal-btn boost-btn">
            <span class="btn-icon">🚀</span>
            <span class="btn-text">Server Boost</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const showPremiumModal = ref(false)
const hasPremium = ref(false)
const featuresSection = ref(null)

// Check if user has premium
onMounted(async () => {
  if (authStore.user?.id) {
    try {
      const response = await fetch(`https://status-bot-backend.onrender.com/api/user-premium/${authStore.user.id}`)
      if (response.ok) {
        const data = await response.json()
        hasPremium.value = data.hasPremium || false
      }
    } catch (err) {
      console.error('Error fetching premium status:', err)
    }
  }
})

const scrollToFeatures = (plan) => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.premium-container {
  width: 100%;
  max-width: 1200px;
  margin: 60px auto 0;
  padding: 0 50px 150px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.premium-header {
  text-align: center;
  width: 100%;
}

.premium-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
}

.premium-title-highlight {
  color: var(--primary-color);
}

.premium-subtitle {
  font-size: clamp(24px, 3vw, 42px);
  font-weight: 700;
  margin: 0 0 15px 0;
}

.premium-description {
  font-size: 16px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
}

.plan-card {
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  padding: 30px 24px;
  background: linear-gradient(180deg, rgba(81, 112, 255, 0.05) 0%, rgba(81, 112, 255, 0.02) 100%);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.plan-card:hover {
  background: linear-gradient(180deg, rgba(81, 112, 255, 0.12) 0%, rgba(81, 112, 255, 0.08) 100%);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(81, 112, 255, 0.2);
}

.plan-card:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 100%
  );
  animation: metalShine 0.8s ease-in-out forwards;
  pointer-events: none;
  border-radius: 14px;
}

@keyframes metalShine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.plan-card.premium-highlighted {
  border-color: var(--primary-color);
  background: linear-gradient(180deg, rgba(81, 112, 255, 0.12) 0%, rgba(81, 112, 255, 0.06) 100%);
  transform: scale(1.02);
}

.plan-card.premium-highlighted:hover {
  background: linear-gradient(180deg, rgba(81, 112, 255, 0.18) 0%, rgba(81, 112, 255, 0.12) 100%);
  box-shadow: 0 25px 50px rgba(81, 112, 255, 0.3);
}

.plan-badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: linear-gradient(135deg, var(--primary-color), rgba(81, 112, 255, 0.8));
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
}

.plan-name {
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 15px 0;
}

.plan-price {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
  text-align: center;
}

.plan-period {
  font-size: 13px;
  font-weight: 500;
}

.plan-divider {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 15px 0;
  text-align: center;
  font-weight: 500;
}

.plan-boost {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.plan-features-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #fff;
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  margin: 0;
  padding: 0;
}

.plan-feature {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.feature-checkmark {
  width: 20px;
  height: 20px;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: bold;
  margin-top: 2px;
}

.plan-button {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 2px solid var(--primary-color);
  color: #fff;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.plan-button:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 10px 25px rgba(81, 112, 255, 0.3);
}

.premium-button {
  background: linear-gradient(135deg, var(--primary-color), rgba(81, 112, 255, 0.8));
}

.premium-button:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), var(--primary-color));
  box-shadow: 0 15px 35px rgba(81, 112, 255, 0.4);
}

.plan-button:disabled,
.plan-button.current-plan {
  background: rgba(81, 112, 255, 0.15);
  border-color: rgba(81, 112, 255, 0.5);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.plan-button:disabled:hover,
.plan-button.current-plan:hover {
  background: rgba(81, 112, 255, 0.15);
  box-shadow: none;
  transform: none;
}

@media (max-width: 1024px) {
  .premium-container {
    padding: 0 30px;
    gap: 40px;
  }

  .premium-title {
    font-size: 48px;
  }

  .premium-subtitle {
    font-size: 26px;
  }

  .plans-container {
    gap: 25px;
  }

  .plan-card {
    padding: 30px 25px;
  }

  .plan-card.premium-highlighted {
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  .premium-container {
    padding: 0 20px 100px 20px;
    margin-top: 40px;
    gap: 35px;
  }

  .premium-title {
    font-size: 36px;
  }

  .premium-subtitle {
    font-size: 24px;
  }

  .plans-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .plan-card {
    padding: 28px 22px;
  }

  .plan-card.premium-highlighted {
    transform: scale(1);
  }

  .plan-name {
    font-size: 24px;
  }

  .plan-price {
    font-size: 18px;
  }

  .plan-divider {
    font-size: 14px;
    margin: 5px 0 18px 0;
  }

  .plan-boost {
    font-size: 15px;
    margin-bottom: 20px;
  }

  .plan-features-title {
    font-size: 17px;
  }

  .plan-feature {
    font-size: 14px;
    gap: 10px;
  }

  .plan-button {
    padding: 13px 26px;
    font-size: 15px;
    margin-top: 20px;
    width: 100%;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-tertiary);
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 5px;
}

.modal-close:hover {
  transform: scale(1.2);
}

.modal-content h2 {
  font-size: 28px;
  margin: 0 0 12px 0;
  color: var(--text-primary);
}

.modal-content p {
  color: var(--text-secondary);
  margin: 0 0 30px 0;
  font-size: 16px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.patreon-btn {
  background: linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 68, 68, 0.1));
  border-color: #ff4444;
  color: #ff6666;
}

.patreon-btn:hover {
  background: linear-gradient(135deg, rgba(255, 68, 68, 0.3), rgba(255, 68, 68, 0.2));
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 68, 68, 0.25);
}

.boost-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.2), rgba(81, 112, 255, 0.1));
  border-color: #5170ff;
  color: #7f9fff;
}

.boost-btn:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.3), rgba(81, 112, 255, 0.2));
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(81, 112, 255, 0.25);
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  font-size: 16px;
}

/* Premium Info Section */
.premium-info-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  width: 100%;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.info-check {
  font-size: 24px;
  color: var(--primary-color);
}

.info-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

/* Features Section */
.features-section {
  width: 100%;
  margin-top: 80px;
  padding-top: 60px;
  padding-bottom: 60px;
  border-top: 2px solid rgba(81, 112, 255, 0.2);
}

.features-title {
  text-align: center;
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 50px 0;
  color: var(--text-primary);
}

.features-table {
  max-width: 900px;
  margin: 0 auto;
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(81, 112, 255, 0.05);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background: rgba(81, 112, 255, 0.15);
  border-bottom: 2px solid var(--primary-color);
  padding: 0;
}

.table-column-header {
  padding: 20px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
  text-align: center;
}

.table-column-header.premium {
  color: var(--primary-color);
  background: rgba(81, 112, 255, 0.1);
}

.table-feature-name {
  padding: 20px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
  transition: background 0.2s ease;
}

.table-row:hover {
  background: rgba(81, 112, 255, 0.08);
}

.table-row.premium-feature {
  background: rgba(81, 112, 255, 0.05);
}

.table-row.premium-feature:hover {
  background: rgba(81, 112, 255, 0.12);
}

.table-row .table-feature-name {
  padding: 18px 20px;
  font-weight: 500;
  font-size: 15px;
  color: var(--text-secondary);
}

.table-cell {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.check-icon {
  color: #4ade80;
  font-weight: bold;
  font-size: 18px;
}

.x-icon {
  color: #ef4444;
  font-weight: bold;
  font-size: 18px;
  opacity: 0.6;
}

/* See All Features Button */
.see-features-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.15), rgba(81, 112, 255, 0.05));
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 25px;
  transition: all 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
}

.see-features-btn:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.25), rgba(81, 112, 255, 0.15));
  box-shadow: 0 8px 16px rgba(81, 112, 255, 0.2);
}

@media (max-width: 768px) {
  .premium-info-section {
    gap: 25px;
    margin-bottom: 30px;
  }

  .info-text {
    font-size: 14px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .features-title {
    font-size: 28px;
    margin-bottom: 35px;
  }

  .feature-column-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .feature-list-item {
    font-size: 15px;
  }

  .see-features-btn {
    width: 100%;
  }
}
</style>
