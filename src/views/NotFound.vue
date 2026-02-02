<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="go-back-btn">Go Back Home</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 150px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
  z-index: 2;
}

.not-found-page::before {
  content: '';
  position: fixed;
  top: 20%;
  left: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at 30% 30%, rgba(81, 112, 255, 0.4), rgba(81, 112, 255, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.not-found-page::after {
  content: '';
  position: fixed;
  bottom: 20%;
  right: 15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at 30% 30%, rgba(81, 112, 255, 0.35), rgba(81, 112, 255, 0.08) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.not-found-content h1 {
  font-size: 7rem;
  font-weight: 900;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(81, 112, 255, 0.15) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.not-found-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.not-found-content p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.go-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(81, 112, 255, 0.15) 100%);
  color: #fff;
  padding: 15px 30px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid rgba(81, 112, 255, 0.8);
}

.go-back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
}

@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 4rem;
  }

  .not-found-content h2 {
    font-size: 1.8rem;
  }

  .not-found-content p {
    font-size: 1rem;
  }
}
</style>
