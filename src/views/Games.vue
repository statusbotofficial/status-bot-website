<template>
  <div class="games-page">
    <!-- Header Section -->
    <div class="games-header">
      <div class="container">
        <h1>🎮 Unblocked Games Hub</h1>
        <p>Play popular games anywhere, anytime - No restrictions!</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalGamesPlayed }}</span>
            <span class="stat-label">Games Played</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ gamesAvailable }}</span>
            <span class="stat-label">Games Available</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ onlineUsers }}</span>
            <span class="stat-label">Online Players</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Categories -->
    <div class="categories-section">
      <div class="container">
        <div class="category-filters">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="{ active: selectedCategory === category.id }"
            class="category-btn"
          >
            {{ category.icon }} {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div class="games-container">
      <div class="container">
        <!-- Featured Games Banner -->
        <div v-if="selectedCategory === 'all'" class="featured-games">
          <h2>🔥 Trending Now</h2>
          <div class="featured-grid">
            <div 
              v-for="game in featuredGames" 
              :key="game.id"
              class="featured-game-card"
              @click="playGame(game)"
            >
              <div class="game-thumbnail">
                <img :src="game.thumbnail" :alt="game.name">
                <div class="play-overlay">
                  <div class="play-icon">▶</div>
                </div>
                <div class="game-badge" :class="game.badge?.type">{{ game.badge?.text }}</div>
              </div>
              <div class="game-info">
                <h3>{{ game.name }}</h3>
                <div class="game-meta">
                  <span class="rating">⭐ {{ game.rating }}</span>
                  <span class="plays">{{ formatNumber(game.plays) }} plays</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Games Grid -->
        <div class="all-games-section">
          <h2 v-if="selectedCategory !== 'all'">{{ getCurrentCategory().name }}</h2>
          <h2 v-else>🎯 All Games</h2>
          
          <div class="games-grid">
            <div 
              v-for="game in filteredGames" 
              :key="game.id"
              class="game-card"
              @click="playGame(game)"
            >
              <div class="game-thumbnail">
                <img :src="game.thumbnail" :alt="game.name" loading="lazy">
                <div class="play-overlay">
                  <div class="play-icon">▶</div>
                </div>
                <div v-if="game.badge" class="game-badge" :class="game.badge.type">{{ game.badge.text }}</div>
              </div>
              <div class="game-info">
                <h3>{{ game.name }}</h3>
                <p>{{ game.description }}</p>
                <div class="game-meta">
                  <span class="category">{{ game.category }}</span>
                  <span class="rating">⭐ {{ game.rating }}</span>
                  <span class="plays">{{ formatNumber(game.plays) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Modal -->
    <div v-if="currentGame" class="game-modal" @click="closeGame">
      <div class="game-modal-content" @click.stop>
        <div class="game-modal-header">
          <div class="game-title">
            <h2>{{ currentGame.name }}</h2>
            <div class="game-controls">
              <button @click="toggleFullscreen" class="control-btn" title="Fullscreen">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
              <button @click="closeGame" class="control-btn close-btn" title="Close">✕</button>
            </div>
          </div>
          <div class="game-rating">
            <span>⭐ {{ currentGame.rating }}</span>
            <span>{{ formatNumber(currentGame.plays) }} plays</span>
          </div>
        </div>
        <div class="game-container">
          <iframe 
            :src="currentGame.url" 
            ref="gameFrame"
            frameborder="0"
            allowfullscreen
            @load="onGameLoad"
          ></iframe>
          <div v-if="gameLoading" class="game-loading">
            <div class="spinner"></div>
            <p>Loading {{ currentGame.name }}...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="pageLoading" class="page-loading">
      <div class="spinner"></div>
      <p>Loading games...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Game state
const currentGame = ref(null)
const selectedCategory = ref('all')
const totalGamesPlayed = ref(localStorage.getItem('totalGamesPlayed') || 0)
const onlineUsers = ref(Math.floor(Math.random() * 200) + 50) // Simulated online users
const gameLoading = ref(false)
const pageLoading = ref(false)

// Categories
const categories = ref([
  { id: 'all', name: 'All Games', icon: '🎮' },
  { id: 'action', name: 'Action', icon: '⚔️' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
  { id: 'strategy', name: 'Strategy', icon: '♟️' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'racing', name: 'Racing', icon: '🏎️' },
  { id: 'arcade', name: 'Arcade', icon: '🕹️' },
  { id: 'multiplayer', name: 'Multiplayer', icon: '👥' },
  { id: 'classic', name: 'Classic', icon: '🎲' }
])

// Featured games for the banner
const featuredGames = ref([
  {
    id: 'slope-unblocked',
    name: 'Slope Unblocked',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/444346/embed/',
    rating: 4.8,
    plays: 2500000,
    badge: { type: 'hot', text: 'HOT' },
    category: 'arcade'
  },
  {
    id: 'tetris-unblocked',
    name: 'Tetris Unblocked',
    thumbnail: 'https://chvin.github.io/react-tetris/icon.png',
    url: 'https://chvin.github.io/react-tetris/?lan=en',
    rating: 4.7,
    plays: 1800000,
    badge: { type: 'trending', text: 'TRENDING' },
    category: 'puzzle'
  },
  {
    id: '2048-unblocked',
    name: '2048 Unblocked',
    thumbnail: 'https://play2048.co/meta/apple-touch-icon.png',
    url: 'https://play2048.co/',
    rating: 4.9,
    plays: 5200000,
    badge: { type: 'popular', text: 'POPULAR' },
    category: 'puzzle'
  }
])

// Main games collection
const games = ref([
  // Action Games
  {
    id: 'slope-game',
    name: 'Ball Game',
    description: 'Control a ball and avoid obstacles',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/444346/embed/',
    category: 'action',
    rating: 4.8,
    plays: 2500000
  },
  {
    id: 'tunnel-rush',
    name: 'Tunnel Game',
    description: 'Navigate through tunnels',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/158493/embed/',
    category: 'action',
    rating: 4.6,
    plays: 1890000
  },
  {
    id: 'run3',
    name: 'Platformer',
    description: 'Jump and run through platforms',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/171111/embed/',
    category: 'action',
    rating: 4.5,
    plays: 1900000
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Game',
    description: 'Navigate geometric obstacles',
    thumbnail: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=315&h=250&fit=crop&auto=format',
    url: 'https://scratch.mit.edu/projects/105500895/embed',
    category: 'action',
    rating: 4.7,
    plays: 1650000
  },
  {
    id: 'vex-5',
    name: 'Stickman Adventure',
    description: 'Stickman platformer game',
    thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=315&h=250&fit=crop&auto=format',
    url: 'https://scratch.mit.edu/projects/60917032/embed',
    category: 'action',
    rating: 4.4,
    plays: 950000
  },
  {
    id: 'stickman-hook',
    name: 'Swing Game',
    description: 'Swing from point to point',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/432909/embed/',
    category: 'action',
    rating: 4.5,
    plays: 1200000
  },
  
  // Puzzle Games
  {
    id: '2048-game',
    name: '2048',
    description: 'Combine tiles to reach 2048',
    thumbnail: 'https://play2048.co/meta/apple-touch-icon.png',
    url: 'https://play2048.co/',
    category: 'puzzle',
    rating: 4.6,
    plays: 890000
  },
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Classic falling blocks puzzle',
    thumbnail: 'https://chvin.github.io/react-tetris/icon.png',
    url: 'https://chvin.github.io/react-tetris/?lan=en',
    category: 'puzzle',
    rating: 4.8,
    plays: 2100000
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Number puzzle game',
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=315&h=250&fit=crop&auto=format',
    url: 'https://nine.websudoku.com/',
    category: 'puzzle',
    rating: 4.3,
    plays: 750000
  },
  {
    id: 'word-search',
    name: 'Word Search',
    description: 'Find hidden words in the grid',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=315&h=250&fit=crop&auto=format',
    url: 'https://thewordsearch.com/puzzle/708639/difficult/',
    category: 'puzzle',
    rating: 4.4,
    plays: 680000
  },

  // Arcade Games
  {
    id: 'pacman',
    name: 'Pac-Man',
    description: 'Classic arcade maze game',
    thumbnail: 'https://www.google.com/logos/2010/pacman10-hp.png',
    url: 'https://www.google.com/logos/2010/pacman10-i.html',
    category: 'arcade',
    rating: 4.7,
    plays: 1850000
  },
  {
    id: 'snake-game',
    name: 'Snake',
    description: 'Grow your snake by eating apples',
    thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=315&h=250&fit=crop&auto=format',
    url: 'https://playsnake.org/',
    category: 'arcade',
    rating: 4.4,
    plays: 950000
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Navigate through pipes without crashing',
    thumbnail: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=315&h=250&fit=crop&auto=format',
    url: 'https://scratch.mit.edu/projects/47341342/embed',
    category: 'arcade',
    rating: 4.3,
    plays: 1200000
  },
  {
    id: 'asteroids-game',
    name: 'Asteroids',
    description: 'Classic space shooter',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=315&h=250&fit=crop&auto=format',
    url: 'https://freeasteroids.org/',
    category: 'arcade',
    rating: 4.5,
    plays: 2800000
  },

  // Racing Games
  {
    id: 'car-racing',
    name: 'Car Racing',
    description: 'Simple car racing game',
    thumbnail: 'https://images.unsplash.com/photo-1580414652986-2e5ef527f8d4?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/159274/embed/',
    category: 'racing',
    rating: 4.8,
    plays: 1400000
  },
  {
    id: 'bike-race',
    name: 'Bike Race',
    description: 'Motorcycle racing game',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=315&h=250&fit=crop&auto=format',
    url: 'https://openprocessing.org/sketch/161883/embed/',
    category: 'racing',
    rating: 4.6,
    plays: 1100000
  },
  {
    id: 'runner-game',
    name: 'Endless Runner',
    description: 'Run and jump endlessly',
    thumbnail: 'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?w=315&h=250&fit=crop&auto=format',
    url: 'https://scratch.mit.edu/projects/118477143/embed',
    category: 'racing',
    rating: 4.7,
    plays: 3200000
  },
  
  // Strategy Games
  {
    id: 'chess-online',
    name: 'Chess',
    description: 'Play chess against the computer',
    thumbnail: 'https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=315&h=250&fit=crop&auto=format',
    url: 'https://lichess.org/embed/',
    category: 'strategy',
    rating: 4.8,
    plays: 1850000
  },
  {
    id: 'checkers',
    name: 'Checkers',
    description: 'Classic board game',
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=315&h=250&fit=crop&auto=format',
    url: 'https://www.247checkers.com/',
    category: 'strategy',
    rating: 4.9,
    plays: 2300000
  },
  
  // Multiplayer Games
  {
    id: 'slither-io',
    name: 'Slither.io',
    description: 'Grow your snake in multiplayer',
    thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=315&h=250&fit=crop&auto=format',
    url: 'https://slither.io/',
    category: 'multiplayer',
    rating: 4.4,
    plays: 6200000
  },
  {
    id: 'agar-io',
    name: 'Agar.io',
    description: 'Grow your cell and absorb others',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=315&h=250&fit=crop&auto=format',
    url: 'https://agar.io/',
    category: 'multiplayer',
    rating: 4.5,
    plays: 5800000
  },
  {
    id: 'krunker-io',
    name: 'Krunker.io',
    description: 'Fast-paced multiplayer FPS',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=315&h=250&fit=crop&auto=format',
    url: 'https://krunker.io/',
    category: 'multiplayer',
    rating: 4.6,
    plays: 4100000
  },
  
  // Sports Games
  {
    id: 'basketball',
    name: 'Basketball',
    description: 'Shoot hoops and score points',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=315&h=250&fit=crop&auto=format',
    url: 'https://scratch.mit.edu/projects/107355234/embed',
    category: 'sports',
    rating: 4.3,
    plays: 890000
  },
  {
    id: 'soccer',
    name: 'Soccer',
    description: 'Score goals and win matches',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=315&h=250&fit=crop&auto=format',
    url: 'https://scratch.mit.edu/projects/145777448/embed',
    category: 'sports',
    rating: 4.4,
    plays: 720000
  },
  
  // Classic Games
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    description: 'Defend Earth from alien invasion',
    thumbnail: 'https://images.unsplash.com/photo-1446776876599-33d1a2d28906?w=315&h=250&fit=crop&auto=format',
    url: 'https://freeinvaders.org/',
    category: 'classic',
    rating: 4.2,
    plays: 650000
  },
  {
    id: 'pong',
    name: 'Pong',
    description: 'Classic paddle ball game',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=315&h=250&fit=crop&auto=format',
    url: 'https://ponggame.org/',
    category: 'classic',
    rating: 4.1,
    plays: 480000
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Break bricks with a ball',
    thumbnail: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=315&h=250&fit=crop&auto=format',
    url: 'https://elgoog.im/breakout/',
    category: 'classic',
    rating: 4.0,
    plays: 420000
  }
])

// Computed properties
const gamesAvailable = computed(() => games.value.length + featuredGames.value.length)

const filteredGames = computed(() => {
  if (selectedCategory.value === 'all') {
    return games.value
  }
  return games.value.filter(game => game.category === selectedCategory.value)
})

const getCurrentCategory = () => {
  return categories.value.find(cat => cat.id === selectedCategory.value) || categories.value[0]
}

// Methods
const playGame = (game) => {
  currentGame.value = game
  gameLoading.value = true
  
  // Track plays
  game.plays++
  totalGamesPlayed.value++
  localStorage.setItem('totalGamesPlayed', totalGamesPlayed.value)
}

const closeGame = () => {
  currentGame.value = null
  gameLoading.value = false
}

const onGameLoad = () => {
  gameLoading.value = false
}

const toggleFullscreen = () => {
  const iframe = document.querySelector('.game-container iframe')
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen()
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen()
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen()
  }
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return Math.floor(num / 100000) / 10 + 'M'
  } else if (num >= 1000) {
    return Math.floor(num / 100) / 10 + 'K'
  }
  return num.toString()
}

// Simulate online users updating
setInterval(() => {
  onlineUsers.value = Math.floor(Math.random() * 50) + Math.max(50, onlineUsers.value - 25)
}, 10000)

onMounted(() => {
  // Preload some game thumbnails
  games.value.slice(0, 6).forEach(game => {
    const img = new Image()
    img.src = game.thumbnail
  })
})
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  color: #fff;
}

.games-header {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.15) 0%, rgba(127, 157, 255, 0.08) 100%);
  padding: 80px 50px 60px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.games-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #5170ff, #7c9dff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.games-header p {
  font-size: 1.2rem;
  color: #b0b0b0;
  margin-bottom: 40px;
}

.stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #5170ff;
}

.stat-label {
  font-size: 0.9rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

.categories-section {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px 50px;
}

.category-filters {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.category-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 10px 20px;
  color: #b0b0b0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: #5170ff;
  color: #fff;
}

.category-btn.active {
  background: linear-gradient(135deg, #5170ff, #7c9dff);
  border-color: #5170ff;
  color: #fff;
  box-shadow: 0 4px 15px rgba(81, 112, 255, 0.3);
}

.games-container {
  padding: 60px 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.featured-games {
  margin-bottom: 60px;
}

.featured-games h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 20px;
}

.featured-game-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.featured-game-card:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: #5170ff;
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(81, 112, 255, 0.2);
}

.all-games-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.game-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.game-card:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: #5170ff;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(81, 112, 255, 0.2);
}

.game-thumbnail {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.featured-game-card .game-thumbnail {
  height: 200px;
}

.game-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-thumbnail img,
.featured-game-card:hover .game-thumbnail img {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.game-card:hover .play-overlay,
.featured-game-card:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 3rem;
  color: #5170ff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.game-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.game-badge.hot {
  background: linear-gradient(135deg, #ff4444, #ff6b6b);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
}

.game-badge.trending {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #fff;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.game-badge.popular {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.game-info {
  padding: 20px;
}

.featured-game-card .game-info {
  padding: 25px;
}

.game-info h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
}

.featured-game-card .game-info h3 {
  font-size: 1.5rem;
}

.game-info p {
  color: #b0b0b0;
  margin-bottom: 15px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #888;
}

.rating {
  color: #fbbf24;
  font-weight: 600;
}

.plays {
  color: #5170ff;
  font-weight: 600;
}

.category {
  background: rgba(81, 112, 255, 0.2);
  color: #7c9dff;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
}

/* Game Modal Styles */
.game-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.game-modal-content {
  background: #1a1a2e;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.game-modal-header {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.game-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.game-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-btn {
  background: rgba(255, 68, 68, 0.2) !important;
  border-color: #ff4444 !important;
  color: #ff4444 !important;
}

.close-btn:hover {
  background: rgba(255, 68, 68, 0.3) !important;
}

.game-rating {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 0.9rem;
}

.game-rating span:first-child {
  color: #fbbf24;
  font-weight: 600;
}

.game-rating span:last-child {
  color: #5170ff;
  font-weight: 600;
}

.game-container {
  flex: 1;
  position: relative;
  background: #000;
}

.game-container iframe {
  width: 100%;
  height: 70vh;
  min-height: 500px;
}

.game-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 35, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(81, 112, 255, 0.3);
  border-top: 4px solid #5170ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .games-header {
    padding: 60px 20px 40px;
  }
  
  .games-header h1 {
    font-size: 2.5rem;
  }
  
  .categories-section {
    padding: 20px;
  }
  
  .category-filters {
    gap: 10px;
  }
  
  .category-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .games-container {
    padding: 40px 20px;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stats {
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .game-modal {
    padding: 10px;
  }
  
  .game-modal-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .game-title {
    flex-direction: column;
    gap: 10px;
  }
  
  .game-container iframe {
    height: 60vh;
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  .games-header h1 {
    font-size: 2rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
  }
  
  .game-info h3 {
    font-size: 1.1rem;
  }
  
  .featured-game-card .game-info h3 {
    font-size: 1.3rem;
  }
}
</style>