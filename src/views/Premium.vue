<template>
  <div class="page-section">
    <div class="container">
      <h1>Premium</h1>
      <p>Unlock exclusive features with Status Bot Premium.</p>
      
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Free</h3>
          <p class="price">Always Free</p>
          <ul class="features-list">
            <li>✓ Basic status tracking</li>
            <li>✓ Core XP system</li>
            <li>✓ Limited economy features</li>
            <li>✗ Advanced quests</li>
          </ul>
          <button class="btn" disabled>Current Plan</button>
        </div>
        <div class="pricing-card featured">
          <span class="badge">Most Popular</span>
          <h3>Premium</h3>
          <p class="price">$4.99/month</p>
          <ul class="features-list">
            <li>✓ Advanced status tracking</li>
            <li>✓ Full XP customization</li>
            <li>✓ Complete economy system</li>
            <li>✓ Unlimited quests</li>
            <li>✓ Custom commands</li>
            <li>✓ Priority support</li>
          </ul>
          <button class="btn">Upgrade Now</button>
        </div>
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
  margin-bottom: 20px;
}

.container > p {
  font-size: 1.1rem;
  margin-bottom: 60px;
  max-width: 600px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 900px;
}

.pricing-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card.featured {
  border-color: var(--primary-color);
  transform: scale(1.05);
  box-shadow: 0 16px 32px rgba(81, 112, 255, 0.2);
}

.pricing-card .badge {
  position: absolute;
  top: -12px;
  left: 20px;
  background-color: var(--primary-color);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pricing-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.pricing-card .price {
  font-size: 2rem;
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 30px;
}

.features-list {
  list-style: none;
  margin-bottom: 30px;
}

.features-list li {
  padding: 10px 0;
  color: var(--text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.features-list li:last-child {
  border-bottom: none;
}

.pricing-card button {
  width: 100%;
}

.pricing-card button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .pricing-card.featured {
    transform: scale(1);
  }
}
</style>
