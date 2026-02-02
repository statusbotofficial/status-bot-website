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
    thumbnail: 'https://play-lh.googleusercontent.com/6_Qan3RBgpJUj0C_2dMrdkQl4LXJLGljzqh5d8n8BnL_MkYqQv6M8vE3-1iX2n5s5UE',
    url: 'https://slope-game.github.io/slope-ball/',
    rating: 4.8,
    plays: 2500000,
    badge: { type: 'hot', text: 'HOT' },
    category: 'arcade'
  },
  {
    id: 'tetris-unblocked',
    name: 'Tetris Unblocked',
    thumbnail: 'https://www.retrogames.cc/embed/40010-tetris-usa.png',
    url: 'https://tetris.com/games-content/play-tetris-content/index.html',
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
    name: 'Slope',
    description: 'Control a ball rolling down a slope',
    thumbnail: 'https://play-lh.googleusercontent.com/6_Qan3RBgpJUj0C_2dMrdkQl4LXJLGljzqh5d8n8BnL_MkYqQv6M8vE3-1iX2n5s5UE',
    url: 'https://slope-game.github.io/slope-ball/',
    category: 'action',
    rating: 4.8,
    plays: 2500000
  },
  {
    id: 'tunnel-rush',
    name: 'Tunnel Rush',
    description: 'Speed through colorful tunnels',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMTgxOTQwLzg0NzQwNy5wbmc=/315x250%23c/8gEVJj.png',
    url: 'https://funhtml5games.com?embed=tunnelrush',
    category: 'action',
    rating: 4.6,
    plays: 1890000
  },
  {
    id: 'run3',
    name: 'Run 3',
    description: 'Run and jump through space tunnels',
    thumbnail: 'https://images.crazygames.com/run-3/20191216052311/run-3-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=315&h=250&fit=crop',
    url: 'https://www.mathplayground.com/run3/run3.html',
    category: 'action',
    rating: 4.5,
    plays: 1900000
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    description: 'Jump and fly through obstacles',
    thumbnail: 'https://images.crazygames.com/geometry-dash-lite/20200318133351/geometry-dash-lite-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=315&h=250&fit=crop',
    url: 'https://ubg98.github.io/GeometryDash/',
    category: 'action',
    rating: 4.7,
    plays: 1650000
  },
  {
    id: 'vex-5',
    name: 'Vex 5',
    description: 'Platform jumping adventure',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzQyNzEwLzE3MzY5NDcucG5n/315x250%23c/Ij1OQs.png',
    url: 'https://advanced-channeler.02.gz-associates.com/?t=tmm_vex5',
    category: 'action',
    rating: 4.4,
    plays: 950000
  },
  {
    id: 'stickman-hook',
    name: 'Stickman Hook',
    description: 'Swing like Spider-Man',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzA1ODE0LzE1MTcwNzIucG5n/315x250%23c/x8FHIS.png',
    url: 'https://html5games.com/Game/Stickman-Hook/e4f53c26-4e1c-4020-8b86-4f5b1c3e4a4e',
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
    thumbnail: 'https://www.retrogames.cc/embed/40010-tetris-usa.png',
    url: 'https://chvin.github.io/react-tetris/?lan=en',
    category: 'puzzle',
    rating: 4.8,
    plays: 2100000
  },
  {
    id: 'cut-the-rope',
    name: 'Cut the Rope',
    description: 'Cut ropes to feed Om Nom candy',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMjAyMDQyLzk1NzEzMi5wbmc=/315x250%23c/h7xQ7V.png',
    url: 'https://www.cuttherope.net/embed',
    category: 'puzzle',
    rating: 4.3,
    plays: 750000
  },
  {
    id: 'bloxorz',
    name: 'Bloxorz',
    description: 'Roll the block into the hole',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMTk1NjczLzkyNzM4OC5wbmc=/315x250%23c/YJh4DV.png',
    url: 'https://www.albinoblacksheep.com/games/bloxorz',
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
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzE4NzA0LzE1ODM5OTEucG5n/315x250%23c/9g4NjH.png',
    url: 'https://playsnake.org/',
    category: 'arcade',
    rating: 4.4,
    plays: 950000
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Navigate through pipes without crashing',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMjE5Nzk2LzEwNDQ4MDMucG5n/315x250%23c/XhUe4P.png',
    url: 'https://flappybird.io/',
    category: 'arcade',
    rating: 4.3,
    plays: 1200000
  },
  {
    id: 'dino-game',
    name: 'Chrome Dino Game',
    description: 'Jump over cacti in this endless runner',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzMxOTY2LzE2NTQzNzAucG5n/315x250%23c/L4aVFM.png',
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
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzA5NjE0LzE1NDQyMTYucG5n/315x250%23c/Fhp6zd.png',
    url: 'https://www.drifthunters.io/',
    category: 'racing',
    rating: 4.8,
    plays: 1400000
  },
  {
    id: 'moto-x3m',
    name: 'Moto X3M',
    description: 'Stunt bike racing game',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTQ2LzE2MzM4OTMucG5n/315x250%23c/8jVP1z.png',
    url: 'https://html5games.com/Game/Moto-X3M/bfc1ecaf-1df1-4f05-b39e-f4b8b4e9a4c0',
    category: 'racing',
    rating: 4.6,
    plays: 1100000
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    description: 'Endless running on subway tracks',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzE4NzE1LzE1ODQwMTkucG5n/315x250%23c/tGNRqv.png',
    url: 'https://subwaysurfers.github.io/',
    category: 'racing',
    rating: 4.7,
    plays: 3200000
  },
  
  // Strategy Games
  {
    id: 'tower-defense',
    name: 'Bloons TD',
    description: 'Pop balloons with monkey towers',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTQ5LzE2MzM4OTYucG5n/315x250%23c/QZm3hJ.png',
    url: 'https://btd4.ninja-kiwi.com/html5/',
    category: 'strategy',
    rating: 4.9,
    plays: 2300000
  },
  {
    id: 'chess-online',
    name: 'Chess',
    description: 'Play chess against the computer',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTQ3LzE2MzM4OTQucG5n/315x250%23c/pJnXhV.png',
    url: 'https://lichess.org/embed/',
    category: 'strategy',
    rating: 4.8,
    plays: 1850000
  },
  
  // Multiplayer Games
  {
    id: 'slither-io',
    name: 'Slither.io',
    description: 'Grow your snake in multiplayer',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzE4NzA0LzE1ODM5OTEucG5n/315x250%23c/9g4NjH.png',
    url: 'https://slither.io/',
    category: 'multiplayer',
    rating: 4.4,
    plays: 6200000
  },
  {
    id: 'agar-io',
    name: 'Agar.io',
    description: 'Grow your cell and absorb others',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzE4NzA1LzE1ODM5OTIucG5n/315x250%23c/WGCB8D.png',
    url: 'https://agar.io/',
    category: 'multiplayer',
    rating: 4.5,
    plays: 5800000
  },
  {
    id: 'krunker-io',
    name: 'Krunker.io',
    description: 'Fast-paced multiplayer FPS',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzE4NzA2LzE1ODM5OTMucG5n/315x250%23c/8YVx1M.png',
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
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTUwLzE2MzM4OTcucG5n/315x250%23c/qLzB4V.png',
    url: 'https://basketball-legends.github.io/',
    category: 'sports',
    rating: 4.3,
    plays: 890000
  },
  {
    id: 'football-legends',
    name: 'Football Legends',
    description: 'Score goals as football legends',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTUxLzE2MzM4OTgucG5n/315x250%23c/m9N3Kj.png',
    url: 'https://football-legends.github.io/',
    category: 'sports',
    rating: 4.4,
    plays: 720000
  },
  
  // Classic Games
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    description: 'Defend Earth from alien invasion',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTUyLzE2MzM4OTkucG5n/315x250%23c/fN8xQd.png',
    url: 'https://freeinvaders.org/',
    category: 'classic',
    rating: 4.2,
    plays: 650000
  },
  {
    id: 'asteroids',
    name: 'Asteroids',
    description: 'Blast asteroids in space',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTUzLzE2MzM5MDAucG5n/315x250%23c/H7vB2z.png',
    url: 'https://freeasteroids.org/',
    category: 'classic',
    rating: 4.1,
    plays: 480000
  },
  {
    id: 'frogger',
    name: 'Frogger',
    description: 'Help the frog cross safely',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTU0LzE2MzM5MDEucG5n/315x250%23c/x9pL4V.png',
    url: 'https://freefrogger.org/',
    category: 'classic',
    rating: 4.0,
    plays: 420000
  },
  
  // More Popular Games
  {
    id: 'happy-wheels',
    name: 'Happy Wheels',
    description: 'Ragdoll physics obstacle course',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTU1LzE2MzM5MDIucG5n/315x250%23c/qB8vxL.png',
    url: 'https://www.totaljerkface.com/happy_wheels.tjf',
    category: 'action',
    rating: 4.7,
    plays: 4100000
  },
  {
    id: 'tank-trouble',
    name: 'Tank Trouble',
    description: 'Battle tanks in a maze',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTU2LzE2MzM5MDMucG5n/315x250%23c/v4P8hK.png',
    url: 'https://tanktrouble.github.io/',
    category: 'action',
    rating: 4.3,
    plays: 980000
  },
  {
    id: 'fireboy-watergirl',
    name: 'Fireboy and Watergirl',
    description: 'Cooperative puzzle platformer',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMzI4NTU3LzE2MzM5MDQucG5n/315x250%23c/Jz1MrD.png',
    url: 'https://fireboyandwatergirl.github.io/1/',
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