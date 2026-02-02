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
    thumbnail: 'https://slope-game.github.io/img/slope.png',
    url: 'https://slope-game.github.io/',
    rating: 4.8,
    plays: 2500000,
    badge: { type: 'hot', text: 'HOT' },
    category: 'arcade'
  },
  {
    id: 'run3-unblocked',
    name: 'Run 3 Unblocked',
    thumbnail: 'https://images.crazygames.com/run-3/20191216052311/run-3-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-run-3/play',
    rating: 4.7,
    plays: 1800000,
    badge: { type: 'trending', text: 'TRENDING' },
    category: 'action'
  },
  {
    id: 'tetris-unblocked',
    name: 'Tetris Unblocked',
    thumbnail: 'https://images.crazygames.com/tetris/20200929101036/tetris-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://tetris.com/games-content/play-tetris-content/index.html',
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
    name: 'Slope',
    description: 'Control a ball rolling down a slope',
    thumbnail: 'https://slope-game.github.io/img/slope.png',
    url: 'https://slope-game.github.io/',
    category: 'action',
    rating: 4.8,
    plays: 2500000
  },
  {
    id: 'tunnel-rush',
    name: 'Tunnel Rush',
    description: 'Speed through colorful tunnels',
    thumbnail: 'https://images.crazygames.com/tunnel-rush/20210929132536/tunnel-rush-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/tunnel-rush',
    category: 'action',
    rating: 4.6,
    plays: 1890000
  },
  {
    id: 'run3',
    name: 'Run 3',
    description: 'Run and jump through space tunnels',
    thumbnail: 'https://images.crazygames.com/run-3/20191216052311/run-3-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-run-3/play',
    category: 'action',
    rating: 4.5,
    plays: 1900000
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    description: 'Jump and fly through obstacles',
    thumbnail: 'https://images.crazygames.com/geometry-dash-lite/20200318133351/geometry-dash-lite-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://scratch.mit.edu/projects/105500895/fullscreen/',
    category: 'action',
    rating: 4.7,
    plays: 1650000
  },
  {
    id: 'vex-5',
    name: 'Vex 5',
    description: 'Platform jumping adventure',
    thumbnail: 'https://images.crazygames.com/vex-5/20200421152038/vex-5-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/vex-5',
    category: 'action',
    rating: 4.4,
    plays: 950000
  },
  {
    id: 'stickman-hook',
    name: 'Stickman Hook',
    description: 'Swing like Spider-Man',
    thumbnail: 'https://images.crazygames.com/stickman-hook/20191219045324/stickman-hook-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/stickman-hook',
    category: 'action',
    rating: 4.5,
    plays: 1200000
  },
  
  // Puzzle Games
  {
    id: '2048-game',
    name: '2048',
    description: 'Combine tiles to reach 2048',
    thumbnail: 'https://images.crazygames.com/2048-1/20200320133018/2048-1-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://2048game.com/',
    category: 'puzzle',
    rating: 4.6,
    plays: 890000
  },
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Classic falling blocks puzzle',
    thumbnail: 'https://images.crazygames.com/tetris/20200929101036/tetris-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://tetris.com/games-content/play-tetris-content/index.html',
    category: 'puzzle',
    rating: 4.8,
    plays: 2100000
  },
  {
    id: 'cut-the-rope',
    name: 'Cut the Rope',
    description: 'Cut ropes to feed Om Nom candy',
    thumbnail: 'https://images.crazygames.com/cut-the-rope/20200318135946/cut-the-rope-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/cut-the-rope',
    category: 'puzzle',
    rating: 4.3,
    plays: 750000
  },
  {
    id: 'bloxorz',
    name: 'Bloxorz',
    description: 'Roll the block into the hole',
    thumbnail: 'https://images.crazygames.com/bloxorz/20210624131939/bloxorz-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-bloxorz/play',
    category: 'puzzle',
    rating: 4.4,
    plays: 680000
  },
  
  // Arcade Games
  {
    id: 'pacman',
    name: 'Pac-Man',
    description: 'Classic arcade maze game',
    thumbnail: 'https://images.crazygames.com/pac-man/20211119085756/pac-man-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.google.com/logos/2010/pacman10-i.html',
    category: 'arcade',
    rating: 4.7,
    plays: 1850000
  },
  {
    id: 'snake-game',
    name: 'Snake',
    description: 'Grow your snake by eating apples',
    thumbnail: 'https://images.crazygames.com/snake-io/20191216052315/snake-io-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://playsnake.org/',
    category: 'arcade',
    rating: 4.4,
    plays: 950000
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Navigate through pipes without crashing',
    thumbnail: 'https://images.crazygames.com/flappy-bird/20200318133349/flappy-bird-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://flappybird.io/',
    category: 'arcade',
    rating: 4.3,
    plays: 1200000
  },
  {
    id: 'dino-game',
    name: 'Chrome Dino Game',
    description: 'Jump over cacti in this endless runner',
    thumbnail: 'https://images.crazygames.com/t-rex-runner/20200318134722/t-rex-runner-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://chromedino.com/',
    category: 'arcade',
    rating: 4.5,
    plays: 2800000
  },
  
  // Racing Games
  {
    id: 'drift-hunters',
    name: 'Drift Hunters',
    description: '3D car drifting simulation',
    thumbnail: 'https://images.crazygames.com/drift-hunters/20191219045313/drift-hunters-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://drifthunters.io/',
    category: 'racing',
    rating: 4.8,
    plays: 1400000
  },
  {
    id: 'moto-x3m',
    name: 'Moto X3M',
    description: 'Stunt bike racing game',
    thumbnail: 'https://images.crazygames.com/moto-x3m/20191219045317/moto-x3m-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/moto-x3m',
    category: 'racing',
    rating: 4.6,
    plays: 1100000
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    description: 'Endless running on subway tracks',
    thumbnail: 'https://images.crazygames.com/subway-surfers/20220301113748/subway-surfers-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/subway-surfers',
    category: 'racing',
    rating: 4.7,
    plays: 3200000
  },
  
  // Strategy Games
  {
    id: 'tower-defense',
    name: 'Bloons TD 6',
    description: 'Pop balloons with monkey towers',
    thumbnail: 'https://images.crazygames.com/bloons-td-6/20220519144023/bloons-td-6-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://btd6.io/',
    category: 'strategy',
    rating: 4.9,
    plays: 2300000
  },
  {
    id: 'chess-online',
    name: 'Chess',
    description: 'Play chess against the computer',
    thumbnail: 'https://images.crazygames.com/chess/20200318134718/chess-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.chess.com/play/computer',
    category: 'strategy',
    rating: 4.8,
    plays: 1850000
  },
  
  // Multiplayer Games
  {
    id: 'slither-io',
    name: 'Slither.io',
    description: 'Grow your snake in multiplayer',
    thumbnail: 'https://images.crazygames.com/slither-io/20191216052312/slither-io-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://slither.io/',
    category: 'multiplayer',
    rating: 4.4,
    plays: 6200000
  },
  {
    id: 'agar-io',
    name: 'Agar.io',
    description: 'Grow your cell and absorb others',
    thumbnail: 'https://images.crazygames.com/agar-io/20191216052308/agar-io-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://agar.io/',
    category: 'multiplayer',
    rating: 4.5,
    plays: 5800000
  },
  {
    id: 'krunker-io',
    name: 'Krunker.io',
    description: 'Fast-paced multiplayer FPS',
    thumbnail: 'https://images.crazygames.com/krunker-io/20191216052316/krunker-io-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://krunker.io/',
    category: 'multiplayer',
    rating: 4.6,
    plays: 4100000
  },
  
  // Sports Games
  {
    id: 'basketball-legends',
    name: 'Basketball Legends',
    description: 'Play as famous basketball players',
    thumbnail: 'https://images.crazygames.com/basketball-legends-2020/20200427104449/basketball-legends-2020-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/basketball-legends',
    category: 'sports',
    rating: 4.3,
    plays: 890000
  },
  {
    id: 'football-legends',
    name: 'Football Legends',
    description: 'Score goals as football legends',
    thumbnail: 'https://images.crazygames.com/football-legends-2021/20210325134251/football-legends-2021-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/football-legends-2021',
    category: 'sports',
    rating: 4.4,
    plays: 720000
  },
  
  // Classic Games
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    description: 'Defend Earth from alien invasion',
    thumbnail: 'https://images.crazygames.com/space-invaders/20200318134720/space-invaders-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-space-invaders/play',
    category: 'classic',
    rating: 4.2,
    plays: 650000
  },
  {
    id: 'asteroids',
    name: 'Asteroids',
    description: 'Blast asteroids in space',
    thumbnail: 'https://images.crazygames.com/asteroids/20200318134717/asteroids-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-asteroids/play',
    category: 'classic',
    rating: 4.1,
    plays: 480000
  },
  {
    id: 'frogger',
    name: 'Frogger',
    description: 'Help the frog cross safely',
    thumbnail: 'https://images.crazygames.com/frogger/20200318134719/frogger-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-frogger/play',
    category: 'classic',
    rating: 4.0,
    plays: 420000
  },
  
  // More Popular Games
  {
    id: 'happy-wheels',
    name: 'Happy Wheels',
    description: 'Ragdoll physics obstacle course',
    thumbnail: 'https://images.crazygames.com/happy-wheels/20191216052314/happy-wheels-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.totaljerkface.com/happy_wheels.tjf',
    category: 'action',
    rating: 4.7,
    plays: 4100000
  },
  {
    id: 'tank-trouble',
    name: 'Tank Trouble',
    description: 'Battle tanks in a maze',
    thumbnail: 'https://images.crazygames.com/tank-trouble/20200318135948/tank-trouble-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://poki.com/en/g/tank-trouble',
    category: 'action',
    rating: 4.3,
    plays: 980000
  },
  {
    id: 'fireboy-watergirl',
    name: 'Fireboy and Watergirl',
    description: 'Cooperative puzzle platformer',
    thumbnail: 'https://images.crazygames.com/fireboy-and-watergirl-the-forest-temple/20200318133350/fireboy-and-watergirl-the-forest-temple-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
    url: 'https://www.coolmathgames.com/0-fireboy-and-watergirl-forest-temple/play',
    category: 'puzzle',
    rating: 4.5,
    plays: 1500000
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