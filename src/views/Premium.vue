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
        <button class="plan-button">Get Started</button>
      </div>

      <!-- Premium Plan -->
      <div class="plan-card premium-highlighted">
        <div class="plan-badge">Most Popular</div>
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
        <button class="plan-button premium-button" @click="showPremiumModal = true">Get Premium</button>
      </div>

      <!-- Custom Bot Plan -->
      <div class="plan-card">
        <div class="plan-name">
          Custom Bot<span></span>
        </div>
        <div class="plan-price">$7.99<span class="plan-period">/m</span></div>
        <div class="plan-divider">or</div>
        <div class="plan-boost">
          <span class="boost-icon">🚀</span>
          Boost Our Server
        </div>
        <h3 class="plan-features-title">Features:</h3>
        <ul class="plan-features">
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Everything in Premium
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Custom bot branding
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Dedicated support team
          </li>
          <li class="plan-feature">
            <span class="feature-checkmark">✓</span>
            Custom commands & automations
          </li>
        </ul>
        <button class="plan-button">Get Custom Bot</button>
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
import { ref } from 'vue'

const showPremiumModal = ref(false)
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
  padding: 40px 30px;
  background: rgba(81, 112, 255, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.plan-card:hover {
  background: rgba(81, 112, 255, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(81, 112, 255, 0.2);
}

.plan-card.premium-highlighted {
  border-color: var(--primary-color);
  background: rgba(81, 112, 255, 0.15);
  transform: scale(1.05);
}

.plan-card.premium-highlighted:hover {
  background: rgba(81, 112, 255, 0.2);
  box-shadow: 0 25px 50px rgba(81, 112, 255, 0.3);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--primary-color), rgba(81, 112, 255, 0.8));
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-name {
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 20px 0;
}

.plan-price {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #fff;
  text-align: center;
}

.plan-period {
  font-size: 14px;
  font-weight: 500;
}

.plan-divider {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 5px 0 20px 0;
  text-align: center;
  font-weight: 500;
}

.plan-boost {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.boost-icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.plan-features-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #fff;
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-grow: 1;
  margin: 0;
  padding: 0;
}

.plan-feature {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
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
  padding: 14px 28px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
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
    padding: 0 20px;
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
</style>
