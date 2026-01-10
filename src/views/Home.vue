<template>
  <div class="hero-section">
    <div class="hero">
      <h1>Status Bot</h1>
      <p>A powerful Discord bot with User Status Tracking, XP Systems, an economy, quest tracking, and more!</p>
      <a :href="discordServerUrl" class="discord-btn" target="_blank">
        <svg class="discord-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3671a19.8062 19.8062 0 00-4.885-1.515.0741.0741 0 00-.0785.0371c-.211.3671-.445.847-.608 1.23a18.822 18.822 0 00-5.487 0c-.163-.38-.398-.863-.609-1.23a.077.077 0 00-.079-.037 19.7355 19.7355 0 00-4.885 1.515.0699.0699 0 00-.032.0277C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.0577c2.227 1.649 4.395 2.647 6.54 3.31.05.021.1.0018.129-.039.287-.468.544-.96.758-1.469.021-.037-.002-.077-.041-.088a13.201 13.201 0 01-1.881-.892.083.083 0 01-.008-.138c.126-.094.252-.192.372-.291a.084.084 0 01.088-.01c3.928 1.793 8.18 1.793 12.062 0a.084.084 0 01.088.009c.12.099.246.198.373.292a.083.083 0 01-.006.137c-.6.35-1.243.645-1.881.893a.083.083 0 00-.041.088c.215.509.472 1.001.759 1.468a.084.084 0 00.129.039c2.146-.663 4.314-1.661 6.541-3.31a.083.083 0 00.032-.0576c.503-4.761-.838-8.886-3.549-12.548a.061.061 0 00-.031-.028zM8.02 15.278c-1.063 0-1.936-.973-1.936-2.166 0-1.194.862-2.167 1.936-2.167 1.08 0 1.95.973 1.936 2.167 0 1.194-.862 2.166-1.936 2.166zm7.975 0c-1.063 0-1.936-.973-1.936-2.166 0-1.194.862-2.167 1.936-2.167 1.08 0 1.95.973 1.936 2.167 0 1.194-.862 2.166-1.936 2.166z"/>
        </svg>
        Discord
      </a>
      <div class="stats-container">
        <div class="stats-divider"></div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">1.5k</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="features">
    <div class="container">
      <h2>Powerful Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <h3>Status Tracking</h3>
          <p>Track user statuses and activity across your Discord server.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3>XP System</h3>
          <p>Reward active members with an engaging experience point system.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm2 7h-4v-2h4v2z"/>
            </svg>
          </div>
          <h3>Economy</h3>
          <p>Create an in-game economy with custom currency and transactions.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DISCORD_INVITE_URL, DISCORD_SERVER_URL } from '../config'

const discordServerUrl = DISCORD_SERVER_URL
</script>

<style scoped>
.hero-section {
  padding: 100px 50px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 40px;
  color: var(--text-secondary);
}

.discord-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: #fff;
  padding: 15px 30px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 60px;
  text-decoration: none;
  border: 2px solid rgba(81, 112, 255, 0.8);
}

.discord-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
}

.discord-icon {
  width: 24px;
  height: 24px;
}

.stats-container {
  position: relative;
}

.stats-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  margin-bottom: 30px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.features {
  padding: 80px 50px;
  background-color: transparent;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(81, 112, 255, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-card p {
  color: var(--text-secondary);
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .stats {
    flex-direction: column;
    gap: 30px;
  }

  .features {
    padding: 60px 20px;
  }

  .features h2 {
    font-size: 2rem;
  }

  .cta {
    padding: 60px 20px;
  }

  .cta h2 {
    font-size: 2rem;
  }

  .cta .btn {
    display: block;
    margin: 10px 0;
  }
}
</style>
