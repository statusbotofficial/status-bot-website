<template>
  <div class="hero-section">
    <div class="hero">
      <h1>Status Bot</h1>
      <p>A powerful Discord bot with User Status Tracking, XP Systems, an economy, welcome messages, and more!</p>
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
            <div class="stat-number">1.8k</div>
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

  <section class="server-showcase">
    <div class="showcase-card">
      <div class="card-top">
        <div class="server-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color: #5170ff; stroke-width: 2; filter: drop-shadow(0 0 6px rgba(81, 112, 255, 0.8));">
            <path d="M7 4l10 8-10 8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="top-text">
          <h3>Status Bot Support</h3>
          <p>Created 11/7/25</p>
        </div>
      </div>

      <div class="card-bottom">
        <div class="bot-avatar-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color: #5170ff; stroke-width: 2; filter: drop-shadow(0 0 6px rgba(81, 112, 255, 0.8));">
            <path d="M7 4l10 8-10 8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="bot-text">
          <div class="bot-name-line">
            <span class="bot-name">Status Bot</span>
            <span class="bot-time">now</span>
          </div>
          <div class="status-info">@Status Bot <span class="dot">●</span> Online</div>
          <div class="last-update">Last updated: just now</div>
        </div>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">
      <h2>Powerful Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-circle" style="color: #10b981;"></i></div>
          <h3>Status Tracking</h3>
          <p>Track user statuses and activity across your Discord server.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-star" style="color: #f59e0b;"></i></div>
          <h3>XP System</h3>
          <p>Reward active members with an engaging experience system.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-coins" style="color: #fbbf24;"></i></div>
          <h3>Economy</h3>
          <p>Create a server economy with custom currency and mini-games.</p>
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
  padding: 150px 50px 150px;
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
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
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--primary-color);
  padding: 30px;
  border-radius: 16px;
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
}

.feature-icon i {
  font-size: 3rem;
  color: #5170ff;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-card p {
  color: var(--text-secondary);
  margin-bottom: 0;
}

.server-showcase {
  padding: 60px 50px 100px;
  display: flex;
  justify-content: center;
}

.showcase-card {
  background: rgba(30, 30, 40, 0.8);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  max-width: 600px;
}

.card-top {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.2);
}

.server-icon-box {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 8px;
  background: rgba(81, 112, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.server-icon-box svg {
  width: 28px;
  height: 28px;
}

.top-text h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 3px 0;
  color: #fff;
}

.top-text p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.card-bottom {
  display: flex;
  gap: 15px;
}

.bot-avatar-box {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: rgba(81, 112, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-avatar-box svg {
  width: 24px;
  height: 24px;
}

.bot-text {
  flex: 1;
}

.bot-name-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.bot-name {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.bot-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.status-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.status-info .dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  margin: 0 5px;
}

.last-update {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.status-section {
  padding: 80px 50px;
  background-color: transparent;
}

.status-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
}

.status-card {
  max-width: 500px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(81, 112, 255, 0.2);
}

.card-header {
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-between;
}

.server-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.3), rgba(81, 112, 255, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.server-info {
  flex: 1;
  min-width: 0;
}

.server-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #fff;
}

.created-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.join-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 1px solid rgba(81, 112, 255, 0.6);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.join-btn:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 4px 12px rgba(81, 112, 255, 0.4);
  transform: translateY(-1px);
}

.card-divider {
  height: 1px;
  background: rgba(81, 112, 255, 0.2);
}

.card-status {
  padding: 25px;
}

.bot-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bot-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.4), rgba(81, 112, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;
}

.status-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  animation: pulse 2s infinite;
}

.last-update {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
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

  .server-showcase {
    padding: 40px 20px 60px;
  }

  .showcase-card {
    padding: 20px;
  }

  .header-info h3 {
    font-size: 1.1rem;
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

  .status-section {
    padding: 60px 20px;
  }

  .status-section h2 {
    font-size: 2rem;
  }

  .card-header {
    flex-wrap: wrap;
  }

  .join-btn {
    flex-basis: 100%;
  }
}
</style>
