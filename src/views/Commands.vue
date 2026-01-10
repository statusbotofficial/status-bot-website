<template>
  <div class="page-section">
    <div class="container">
      <h1>Commands</h1>
      <p>Explore all available Status Bot commands to enhance your Discord server.</p>
      
      <div class="commands-grid">
        <div class="command-card" v-for="cmd in commands" :key="cmd.id">
          <h3>{{ cmd.name }}</h3>
          <p>{{ cmd.description }}</p>
          <code>/{{ cmd.usage }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const commands = ref([
  {
    id: 1,
    name: 'status',
    description: 'Check user status information',
    usage: 'status @user'
  },
  {
    id: 2,
    name: 'xp',
    description: 'View or manage XP points',
    usage: 'xp add @user 100'
  },
  {
    id: 3,
    name: 'balance',
    description: 'Check account balance',
    usage: 'balance @user'
  },
  {
    id: 4,
    name: 'quest',
    description: 'View and track quests',
    usage: 'quest list'
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

.commands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.command-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 25px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.command-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.1);
}

.command-card h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.command-card p {
  color: var(--text-secondary);
  margin-bottom: 15px;
  line-height: 1.5;
}

.command-card code {
  display: block;
  background-color: var(--bg-primary);
  padding: 10px;
  border-radius: 4px;
  color: #69f0ae;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 20px;
  }

  .container h1 {
    font-size: 2rem;
  }

  .commands-grid {
    grid-template-columns: 1fr;
  }
}
</style>
