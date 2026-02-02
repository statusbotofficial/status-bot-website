<template>
  <div class="commands-container">
    <div class="commands-header" style="text-align: center;">
      <h1 style="background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(81, 112, 255, 0.15) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Bot Commands</h1>
      <p style="text-align: center;">View all of Status Bot's available commands.</p>
    </div>

    <div class="commands-controls">
      <button 
        v-for="category in categories" 
        :key="category"
        class="category-btn"
        :class="{ active: activeCategory === category }"
        @click="activeCategory = category"
        :data-category="category"
      >
        {{ category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1) }}
      </button>
      <div class="search-container">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          v-model="searchTerm"
          type="text" 
          class="search-box" 
          placeholder="Search"
        >
      </div>
    </div>

    <div class="commands-grid">
      <div 
        v-for="cmd in filteredCommands" 
        :key="cmd.id"
        class="command-card"
        :data-category="cmd.category"
      >
        <div class="command-header">
          <h3>{{ cmd.name }}</h3>
          <div class="header-controls">
            <span v-if="cmd.premium" class="premium-badge">Premium</span>
            <button 
              class="copy-btn"
              @click="copyCommand(cmd.name)"
              :title="`Copy ${cmd.name}`"
            >
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
        <p>{{ cmd.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

onMounted(() => {
  document.title = 'Commands | Status Bot'
})

const activeCategory = ref('all')
const searchTerm = ref('')

const categories = ['all', 'leveling', 'economy', 'misc', 'admin']

const commands = ref([
  { id: 1, name: '/rank', description: "View a user's rank card and XP stats.", category: 'leveling' },
  { id: 2, name: '/leaderboard', description: "View the server XP leaderboard.", category: 'leveling' },
  
  { id: 3, name: '/balance', description: "Check your currency balance.", category: 'economy' },
  { id: 4, name: '/pay', description: "Send currency to another user.", category: 'economy' },
  { id: 5, name: '/daily', description: "Claim your daily currency reward.", category: 'economy' },
  { id: 6, name: '/slots', description: "Play the slot machine mini-game.", category: 'economy' },
  { id: 7, name: '/blackjack', description: "Play blackjack against the dealer.", category: 'economy' },
  { id: 8, name: '/clicker', description: "Click to earn currency.", category: 'economy' },
  { id: 9, name: '/lootbox', description: "Roll a lootbox for rare rewards.", category: 'economy' },
  { id: 10, name: '/robbery', description: "Attempt to rob another user.", category: 'economy' },
  { id: 11, name: '/invest', description: "Invest money to earn daily interest.", category: 'economy' },
  { id: 12, name: '/withdraw', description: "Withdraw your investment.", category: 'economy' },
  { id: 13, name: '/interest', description: "Check your investment and earned interest.", category: 'economy' },
  { id: 14, name: '/dice', description: "Roll the dice and bet on your luck!", category: 'economy' },
  { id: 15, name: '/mine', description: "Mine for rare gems and currency!", category: 'economy' },
  { id: 16, name: '/fish', description: "Fish for valuable catches!", category: 'economy' },
  { id: 17, name: '/roulette', description: "Spin the roulette wheel!", category: 'economy' },
  { id: 18, name: '/heist', description: "Plan a heist to steal from random guild members!", category: 'economy', premium: true },
  { id: 19, name: '/duel', description: "Challenge someone to a duel for their fortune!", category: 'economy' },
  { id: 20, name: '/spin', description: "Spin the mystery wheel for random rewards!", category: 'economy' },
  { id: 21, name: '/flip', description: "Flip a coin and guess the outcome!", category: 'economy' },
  { id: 22, name: '/auction', description: "Auction off your items to other players!", category: 'economy', premium: true },
  { id: 23, name: '/treasure', description: "Hunt for hidden treasure!", category: 'economy', premium: true },
  
  { id: 24, name: '/profile', description: "View your global profile and stats.", category: 'misc' },
  { id: 25, name: '/help', description: "Display all available commands.", category: 'misc' },
  { id: 26, name: '/invite', description: "Get the bot's invite link.", category: 'misc' },
  { id: 27, name: '/about', description: "Learn more about Status Bot.", category: 'misc' },
  { id: 28, name: '/info', description: "Get detailed info about a user (roles, permissions, etc).", category: 'misc' },
  { id: 29, name: '/dad-joke', description: "Get a random dad joke that never repeats.", category: 'misc' },
  
  { id: 30, name: '/give', description: "Give XP or balance to a user.", category: 'admin' },
  { id: 31, name: '/take', description: "Take XP or balance from a user.", category: 'admin' }
])

const filteredCommands = computed(() => {
  return commands.value.filter(cmd => {
    const matchesCategory = activeCategory.value === 'all' || cmd.category === activeCategory.value
    const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
                          cmd.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const copyCommand = async (commandName) => {
  try {
    await navigator.clipboard.writeText(commandName)
  } catch (err) {
  }
}
</script>

<style scoped>
.commands-container {
  width: 100%;
  max-width: 1200px;
  padding: 0 50px;
  display: flex;
  flex-direction: column;
  margin: 30px auto 0;
}

.commands-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 50px;
}

.commands-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
}

.commands-header p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.commands-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: transparent;
  padding: 20px 0;
  z-index: 50;
  border-bottom: 1px solid var(--border-color);
}

.category-btn {
  background-color: rgba(80, 80, 80, 0.2);
  color: #fff;
  border: 2px solid var(--primary-color);
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background-color: rgba(80, 80, 80, 0.4);
}

.category-btn.active {
  background-color: rgba(80, 80, 80, 0.6);
  box-shadow: 0 0 20px rgba(81, 112, 255, 0.8);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(80, 80, 80, 0.1);
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  padding: 2px 12px;
  max-width: 280px;
  transition: all 0.3s ease;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.search-box {
  background: transparent;
  border: none;
  color: #fff;
  font-weight: 500;
  font-size: 13px;
  flex: 0;
  transition: all 0.3s ease;
}

.search-box::placeholder {
  color: #666;
}

.search-box:focus {
  outline: none;
}

.search-container:focus-within {
  background-color: rgba(80, 80, 80, 0.2);
  box-shadow: 0 0 15px rgba(81, 112, 255, 0.6);
}

.commands-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

.command-card {
  background-color: rgba(30, 30, 40, 0.8);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.command-card:hover {
  background-color: rgba(40, 40, 55, 0.9);
  border-color: var(--primary-color);
}

.command-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.premium-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

.command-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #fff;
  flex: 1;
}

.copy-btn {
  background-color: rgba(80, 80, 80, 0.2);
  border: 1px solid rgba(81, 112, 255, 0.5);
  color: #5170ff;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-btn:hover {
  background-color: rgba(80, 80, 80, 0.4);
  border-color: rgba(81, 112, 255, 0.8);
  box-shadow: 0 0 10px rgba(81, 112, 255, 0.6);
}

.copy-btn i {
  font-size: 14px;
}

.command-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 1024px) {
  .commands-container {
    padding: 0 30px;
  }

  .commands-grid {
    gap: 20px;
  }

  .command-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .commands-container {
    padding: 0 20px;
    margin-top: 20px;
  }

  .commands-header {
    margin-bottom: 30px;
  }

  .commands-header h1 {
    font-size: 32px;
  }

  .commands-header p {
    font-size: 14px;
  }

  .commands-controls {
    gap: 12px;
    margin-bottom: 30px;
    padding: 15px 0;
    position: relative;
    top: auto;
    background-color: transparent;
    border: none;
  }

  .category-btn {
    padding: 10px 16px;
    font-size: 13px;
    flex: 1;
    min-width: fit-content;
  }

  .search-container {
    flex: 1;
    min-width: 100%;
  }

  .search-box {
    font-size: 13px;
  }

  .commands-grid {
    gap: 15px;
    grid-template-columns: 1fr;
  }

  .command-card {
    padding: 18px;
  }

  .command-card h3 {
    font-size: 16px;
  }

  .command-card p {
    font-size: 13px;
  }
}
</style>
