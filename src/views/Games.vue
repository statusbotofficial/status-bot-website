<template>
  <div class="games-page">
    <!-- Header Section -->
    <div class="games-header">
      <div class="container">
        <h1>🎮 Game Hub</h1>
        <p>Collection of fun offline games for when you're bored</p>
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
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div class="games-container">
      <div class="container">
        <!-- Game Selection -->
        <div v-if="!currentGame" class="games-grid">
          <div 
            v-for="game in games" 
            :key="game.id" 
            class="game-card" 
            @click="selectGame(game.id)"
          >
            <div class="game-icon">{{ game.icon }}</div>
            <h3>{{ game.name }}</h3>
            <p>{{ game.description }}</p>
            <div class="game-stats">
              <span class="plays">{{ game.plays }} plays</span>
              <span class="difficulty" :class="game.difficulty">{{ game.difficulty }}</span>
            </div>
            <button class="play-btn">Play Now</button>
          </div>
        </div>

        <!-- Game Area -->
        <div v-else class="game-area">
          <div class="game-controls">
            <button @click="backToMenu" class="back-btn">
              <i class="fas fa-arrow-left"></i> Back to Games
            </button>
            <div class="game-info">
              <h2>{{ getCurrentGame().name }}</h2>
              <span class="score" v-if="gameScore !== null">Score: {{ gameScore }}</span>
            </div>
          </div>

          <!-- Tic Tac Toe -->
          <div v-if="currentGame === 'tictactoe'" class="tic-tac-toe">
            <div class="game-status">{{ ticTacToeStatus }}</div>
            <div class="board">
              <div 
                v-for="(cell, index) in ticTacToeBoard" 
                :key="index"
                class="cell"
                @click="makeMove(index)"
                :class="{ 'winner': winningCells.includes(index) }"
              >
                {{ cell }}
              </div>
            </div>
            <button @click="resetTicTacToe" class="reset-btn">New Game</button>
          </div>

          <!-- Snake Game -->
          <div v-if="currentGame === 'snake'" class="snake-game">
            <div class="snake-controls">
              <div class="snake-stats">
                <span>Score: {{ snakeScore }}</span>
                <span>High Score: {{ snakeHighScore }}</span>
              </div>
              <button @click="toggleSnakeGame" class="snake-btn">
                {{ snakeGameRunning ? 'Pause' : 'Start' }}
              </button>
            </div>
            <div class="snake-board" ref="snakeCanvas">
              <canvas 
                ref="snakeCanvasEl" 
                width="400" 
                height="400"
                @keydown="handleSnakeKeypress"
                tabindex="0"
              ></canvas>
            </div>
            <div class="snake-instructions">
              Use WASD or Arrow Keys to move • Eat food to grow • Don't hit walls or yourself!
            </div>
          </div>

          <!-- Memory Game -->
          <div v-if="currentGame === 'memory'" class="memory-game">
            <div class="memory-controls">
              <div class="memory-stats">
                <span>Moves: {{ memoryMoves }}</span>
                <span>Matches: {{ memoryMatches }}/{{ memoryCards.length / 2 }}</span>
                <span>Time: {{ memoryTime }}s</span>
              </div>
              <button @click="resetMemoryGame" class="reset-btn">New Game</button>
            </div>
            <div class="memory-board">
              <div 
                v-for="(card, index) in memoryCards" 
                :key="index"
                class="memory-card"
                @click="flipCard(index)"
                :class="{ 
                  'flipped': card.flipped, 
                  'matched': card.matched,
                  'no-click': memoryFlipped.length >= 2
                }"
              >
                <div class="card-front">?</div>
                <div class="card-back">{{ card.symbol }}</div>
              </div>
            </div>
          </div>

          <!-- Rock Paper Scissors -->
          <div v-if="currentGame === 'rps'" class="rps-game">
            <div class="rps-stats">
              <div class="stat">Wins: {{ rpsStats.wins }}</div>
              <div class="stat">Losses: {{ rpsStats.losses }}</div>
              <div class="stat">Draws: {{ rpsStats.draws }}</div>
            </div>
            <div class="rps-arena">
              <div class="player-choice">
                <h3>You</h3>
                <div class="choice-display">{{ playerChoice || '?' }}</div>
              </div>
              <div class="vs">VS</div>
              <div class="computer-choice">
                <h3>Computer</h3>
                <div class="choice-display">{{ computerChoice || '?' }}</div>
              </div>
            </div>
            <div class="rps-result" v-if="rpsResult">{{ rpsResult }}</div>
            <div class="rps-choices">
              <button @click="makeRPSChoice('🪨')" class="choice-btn">🪨 Rock</button>
              <button @click="makeRPSChoice('📄')" class="choice-btn">📄 Paper</button>
              <button @click="makeRPSChoice('✂️')" class="choice-btn">✂️ Scissors</button>
            </div>
          </div>

          <!-- Number Guessing -->
          <div v-if="currentGame === 'guess'" class="guess-game">
            <div class="guess-info">
              <h3>Guess the number between 1 and 100!</h3>
              <p>Attempts: {{ guessAttempts }}</p>
              <p v-if="guessHint">{{ guessHint }}</p>
            </div>
            <div class="guess-input">
              <input 
                v-model.number="guessInput" 
                type="number" 
                min="1" 
                max="100" 
                placeholder="Enter your guess"
                @keyup.enter="makeGuess"
              >
              <button @click="makeGuess" :disabled="!guessInput">Guess</button>
            </div>
            <div class="guess-history" v-if="guessHistory.length">
              <h4>Previous Guesses:</h4>
              <div class="guesses">
                <span 
                  v-for="(guess, index) in guessHistory" 
                  :key="index"
                  class="guess-item"
                  :class="{ 'too-high': guess.hint === 'Too high!', 'too-low': guess.hint === 'Too low!' }"
                >
                  {{ guess.number }}
                </span>
              </div>
            </div>
            <button @click="resetGuessGame" class="reset-btn">New Game</button>
          </div>

          <!-- Connect 4 -->
          <div v-if="currentGame === 'connect4'" class="connect4-game">
            <div class="connect4-status">
              <span>Current Player: <span :class="currentPlayer">{{ currentPlayer === 'red' ? '🔴' : '🟡' }}</span></span>
              <span v-if="connect4Winner">Winner: {{ connect4Winner === 'red' ? '🔴' : '🟡' }}</span>
            </div>
            <div class="connect4-board">
              <div 
                v-for="col in 7" 
                :key="col"
                class="connect4-column"
                @click="dropPiece(col - 1)"
              >
                <div 
                  v-for="row in 6" 
                  :key="row"
                  class="connect4-cell"
                  :class="connect4Board[row - 1][col - 1]"
                >
                  {{ connect4Board[row - 1][col - 1] === 'red' ? '🔴' : connect4Board[row - 1][col - 1] === 'yellow' ? '🟡' : '' }}
                </div>
              </div>
            </div>
            <button @click="resetConnect4" class="reset-btn">New Game</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// General game state
const currentGame = ref(null)
const gameScore = ref(null)
const totalGamesPlayed = ref(localStorage.getItem('totalGamesPlayed') || 0)

const games = ref([
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game',
    icon: '⭕',
    difficulty: 'easy',
    plays: localStorage.getItem('tictactoe_plays') || 0
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Eat food and grow longer',
    icon: '🐍',
    difficulty: 'medium',
    plays: localStorage.getItem('snake_plays') || 0
  },
  {
    id: 'memory',
    name: 'Memory Cards',
    description: 'Match pairs of cards',
    icon: '🧠',
    difficulty: 'medium',
    plays: localStorage.getItem('memory_plays') || 0
  },
  {
    id: 'rps',
    name: 'Rock Paper Scissors',
    description: 'Beat the computer',
    icon: '✂️',
    difficulty: 'easy',
    plays: localStorage.getItem('rps_plays') || 0
  },
  {
    id: 'guess',
    name: 'Number Guessing',
    description: 'Guess the secret number',
    icon: '🔢',
    difficulty: 'easy',
    plays: localStorage.getItem('guess_plays') || 0
  },
  {
    id: 'connect4',
    name: 'Connect 4',
    description: 'Connect four pieces in a row',
    icon: '🔴',
    difficulty: 'hard',
    plays: localStorage.getItem('connect4_plays') || 0
  }
])

const gamesAvailable = computed(() => games.value.length)

// Tic Tac Toe state
const ticTacToeBoard = ref(Array(9).fill(''))
const ticTacToeCurrentPlayer = ref('X')
const ticTacToeStatus = ref("Player X's turn")
const winningCells = ref([])

// Snake game state
const snakeGameRunning = ref(false)
const snakeScore = ref(0)
const snakeHighScore = ref(localStorage.getItem('snakeHighScore') || 0)
const snakeCanvas = ref(null)
const snakeCanvasEl = ref(null)
let snakeGame = null

// Memory game state
const memoryCards = ref([])
const memoryFlipped = ref([])
const memoryMatches = ref(0)
const memoryMoves = ref(0)
const memoryTime = ref(0)
let memoryTimer = null

// Rock Paper Scissors state
const playerChoice = ref('')
const computerChoice = ref('')
const rpsResult = ref('')
const rpsStats = ref({
  wins: localStorage.getItem('rps_wins') || 0,
  losses: localStorage.getItem('rps_losses') || 0,
  draws: localStorage.getItem('rps_draws') || 0
})

// Number guessing state
const guessTarget = ref(Math.floor(Math.random() * 100) + 1)
const guessInput = ref('')
const guessAttempts = ref(0)
const guessHint = ref('')
const guessHistory = ref([])

// Connect 4 state
const connect4Board = ref(Array(6).fill(null).map(() => Array(7).fill('')))
const currentPlayer = ref('red')
const connect4Winner = ref('')

// Methods
const selectGame = (gameId) => {
  currentGame.value = gameId
  gameScore.value = null
  
  // Initialize specific games
  if (gameId === 'memory') {
    initMemoryGame()
  } else if (gameId === 'snake') {
    nextTick(() => {
      initSnakeGame()
    })
  }
  
  // Track plays
  const game = games.value.find(g => g.id === gameId)
  game.plays++
  localStorage.setItem(`${gameId}_plays`, game.plays)
  totalGamesPlayed.value++
  localStorage.setItem('totalGamesPlayed', totalGamesPlayed.value)
}

const getCurrentGame = () => {
  return games.value.find(g => g.id === currentGame.value)
}

const backToMenu = () => {
  currentGame.value = null
  if (snakeGame) {
    clearInterval(snakeGame)
    snakeGame = null
  }
  if (memoryTimer) {
    clearInterval(memoryTimer)
    memoryTimer = null
  }
}

// Tic Tac Toe methods
const makeMove = (index) => {
  if (ticTacToeBoard.value[index] !== '' || winningCells.value.length > 0) return
  
  ticTacToeBoard.value[index] = ticTacToeCurrentPlayer.value
  
  if (checkWinner()) {
    ticTacToeStatus.value = `Player ${ticTacToeCurrentPlayer.value} wins!`
    gameScore.value = ticTacToeCurrentPlayer.value === 'X' ? 1 : 0
  } else if (ticTacToeBoard.value.every(cell => cell !== '')) {
    ticTacToeStatus.value = "It's a draw!"
    gameScore.value = 0.5
  } else {
    ticTacToeCurrentPlayer.value = ticTacToeCurrentPlayer.value === 'X' ? 'O' : 'X'
    ticTacToeStatus.value = `Player ${ticTacToeCurrentPlayer.value}'s turn`
  }
}

const checkWinner = () => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ]
  
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    if (ticTacToeBoard.value[a] && 
        ticTacToeBoard.value[a] === ticTacToeBoard.value[b] && 
        ticTacToeBoard.value[a] === ticTacToeBoard.value[c]) {
      winningCells.value = pattern
      return true
    }
  }
  return false
}

const resetTicTacToe = () => {
  ticTacToeBoard.value = Array(9).fill('')
  ticTacToeCurrentPlayer.value = 'X'
  ticTacToeStatus.value = "Player X's turn"
  winningCells.value = []
  gameScore.value = null
}

// Snake game methods
const initSnakeGame = () => {
  if (!snakeCanvasEl.value) return
  
  const canvas = snakeCanvasEl.value
  const ctx = canvas.getContext('2d')
  
  let snake = [{x: 200, y: 200}]
  let food = {x: 100, y: 100}
  let dx = 20
  let dy = 0
  
  const gameLoop = () => {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Move snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}
    snake.unshift(head)
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      snakeScore.value++
      gameScore.value = snakeScore.value
      // Generate new food
      food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
      }
    } else {
      snake.pop()
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      gameOver()
      return
    }
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver()
        return
      }
    }
    
    // Draw food
    ctx.fillStyle = '#ff4444'
    ctx.fillRect(food.x, food.y, 18, 18)
    
    // Draw snake
    ctx.fillStyle = '#5170ff'
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#5170ff' : '#7c9dff'
      ctx.fillRect(segment.x, segment.y, 18, 18)
    })
  }
  
  const gameOver = () => {
    snakeGameRunning.value = false
    if (snakeScore.value > snakeHighScore.value) {
      snakeHighScore.value = snakeScore.value
      localStorage.setItem('snakeHighScore', snakeHighScore.value)
    }
    clearInterval(snakeGame)
    snakeGame = null
  }
  
  // Keyboard controls
  const handleKeyPress = (e) => {
    if (!snakeGameRunning.value) return
    
    const key = e.key.toLowerCase()
    if ((key === 'arrowup' || key === 'w') && dy === 0) { dx = 0; dy = -20 }
    else if ((key === 'arrowdown' || key === 's') && dy === 0) { dx = 0; dy = 20 }
    else if ((key === 'arrowleft' || key === 'a') && dx === 0) { dx = -20; dy = 0 }
    else if ((key === 'arrowright' || key === 'd') && dx === 0) { dx = 20; dy = 0 }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  
  snakeGame = setInterval(gameLoop, 200)
}

const toggleSnakeGame = () => {
  if (!snakeGameRunning.value) {
    snakeScore.value = 0
    gameScore.value = 0
    snakeGameRunning.value = true
    if (!snakeGame) {
      initSnakeGame()
    }
  } else {
    snakeGameRunning.value = false
    if (snakeGame) {
      clearInterval(snakeGame)
      snakeGame = null
    }
  }
}

// Memory game methods
const initMemoryGame = () => {
  const symbols = ['🎮', '🎯', '🎲', '🎭', '🎨', '🎪', '🎸', '🎺']
  const cards = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map(symbol => ({ symbol, flipped: false, matched: false }))
  
  memoryCards.value = cards
  memoryFlipped.value = []
  memoryMatches.value = 0
  memoryMoves.value = 0
  memoryTime.value = 0
  
  memoryTimer = setInterval(() => {
    memoryTime.value++
  }, 1000)
}

const flipCard = (index) => {
  if (memoryCards.value[index].flipped || memoryCards.value[index].matched || memoryFlipped.value.length >= 2) return
  
  memoryCards.value[index].flipped = true
  memoryFlipped.value.push(index)
  
  if (memoryFlipped.value.length === 2) {
    memoryMoves.value++
    const [first, second] = memoryFlipped.value
    
    if (memoryCards.value[first].symbol === memoryCards.value[second].symbol) {
      memoryCards.value[first].matched = true
      memoryCards.value[second].matched = true
      memoryMatches.value++
      memoryFlipped.value = []
      
      if (memoryMatches.value === memoryCards.value.length / 2) {
        clearInterval(memoryTimer)
        gameScore.value = Math.max(0, 100 - memoryMoves.value - memoryTime.value)
      }
    } else {
      setTimeout(() => {
        memoryCards.value[first].flipped = false
        memoryCards.value[second].flipped = false
        memoryFlipped.value = []
      }, 1000)
    }
  }
}

const resetMemoryGame = () => {
  if (memoryTimer) {
    clearInterval(memoryTimer)
  }
  initMemoryGame()
}

// Rock Paper Scissors methods
const makeRPSChoice = (choice) => {
  const choices = ['🪨', '📄', '✂️']
  playerChoice.value = choice
  computerChoice.value = choices[Math.floor(Math.random() * 3)]
  
  let result = ''
  if (playerChoice.value === computerChoice.value) {
    result = "It's a draw!"
    rpsStats.value.draws++
    localStorage.setItem('rps_draws', rpsStats.value.draws)
  } else if (
    (playerChoice.value === '🪨' && computerChoice.value === '✂️') ||
    (playerChoice.value === '📄' && computerChoice.value === '🪨') ||
    (playerChoice.value === '✂️' && computerChoice.value === '📄')
  ) {
    result = 'You win!'
    rpsStats.value.wins++
    localStorage.setItem('rps_wins', rpsStats.value.wins)
    gameScore.value = (gameScore.value || 0) + 1
  } else {
    result = 'You lose!'
    rpsStats.value.losses++
    localStorage.setItem('rps_losses', rpsStats.value.losses)
  }
  
  rpsResult.value = result
  
  setTimeout(() => {
    playerChoice.value = ''
    computerChoice.value = ''
    rpsResult.value = ''
  }, 2000)
}

// Number guessing methods
const makeGuess = () => {
  if (!guessInput.value) return
  
  guessAttempts.value++
  const guess = parseInt(guessInput.value)
  
  let hint = ''
  if (guess === guessTarget.value) {
    guessHint.value = '🎉 Correct! You found the number!'
    gameScore.value = Math.max(0, 100 - guessAttempts.value)
  } else if (guess < guessTarget.value) {
    hint = 'Too low!'
    guessHint.value = 'Too low! Try a higher number.'
  } else {
    hint = 'Too high!'
    guessHint.value = 'Too high! Try a lower number.'
  }
  
  guessHistory.value.push({ number: guess, hint })
  guessInput.value = ''
}

const resetGuessGame = () => {
  guessTarget.value = Math.floor(Math.random() * 100) + 1
  guessInput.value = ''
  guessAttempts.value = 0
  guessHint.value = ''
  guessHistory.value = []
  gameScore.value = null
}

// Connect 4 methods
const dropPiece = (col) => {
  if (connect4Winner.value) return
  
  for (let row = 5; row >= 0; row--) {
    if (connect4Board.value[row][col] === '') {
      connect4Board.value[row][col] = currentPlayer.value
      
      if (checkConnect4Winner(row, col)) {
        connect4Winner.value = currentPlayer.value
        gameScore.value = currentPlayer.value === 'red' ? 1 : 0
      } else {
        currentPlayer.value = currentPlayer.value === 'red' ? 'yellow' : 'red'
      }
      break
    }
  }
}

const checkConnect4Winner = (row, col) => {
  const player = connect4Board.value[row][col]
  
  // Check horizontal
  let count = 1
  for (let c = col - 1; c >= 0 && connect4Board.value[row][c] === player; c--) count++
  for (let c = col + 1; c < 7 && connect4Board.value[row][c] === player; c++) count++
  if (count >= 4) return true
  
  // Check vertical
  count = 1
  for (let r = row + 1; r < 6 && connect4Board.value[r][col] === player; r++) count++
  if (count >= 4) return true
  
  // Check diagonal /
  count = 1
  for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && connect4Board.value[r][c] === player; r--, c--) count++
  for (let r = row + 1, c = col + 1; r < 6 && c < 7 && connect4Board.value[r][c] === player; r++, c++) count++
  if (count >= 4) return true
  
  // Check diagonal \
  count = 1
  for (let r = row - 1, c = col + 1; r >= 0 && c < 7 && connect4Board.value[r][c] === player; r--, c++) count++
  for (let r = row + 1, c = col - 1; r < 6 && c >= 0 && connect4Board.value[r][c] === player; r++, c--) count++
  if (count >= 4) return true
  
  return false
}

const resetConnect4 = () => {
  connect4Board.value = Array(6).fill(null).map(() => Array(7).fill(''))
  currentPlayer.value = 'red'
  connect4Winner.value = ''
  gameScore.value = null
}

onUnmounted(() => {
  if (snakeGame) clearInterval(snakeGame)
  if (memoryTimer) clearInterval(memoryTimer)
})
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #fff;
}

.games-header {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1) 0%, rgba(127, 157, 255, 0.05) 100%);
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

.games-container {
  padding: 80px 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.game-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.game-card:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: #5170ff;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(81, 112, 255, 0.2);
}

.game-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
}

.game-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}

.game-card p {
  color: #b0b0b0;
  margin-bottom: 20px;
  line-height: 1.5;
}

.game-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.plays {
  color: #888;
}

.difficulty {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.difficulty.easy {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.difficulty.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.difficulty.hard {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.play-btn {
  background: linear-gradient(135deg, #5170ff, #7c9dff);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.4);
}

.game-area {
  max-width: 800px;
  margin: 0 auto;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.game-info {
  text-align: center;
}

.game-info h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.score {
  color: #5170ff;
  font-weight: 600;
}

/* Tic Tac Toe Styles */
.tic-tac-toe {
  text-align: center;
}

.game-status {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: #5170ff;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  max-width: 300px;
  margin: 0 auto 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
}

.cell {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cell:hover {
  background: rgba(81, 112, 255, 0.2);
}

.cell.winner {
  background: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.reset-btn {
  background: linear-gradient(135deg, #5170ff, #7c9dff);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

/* Snake Game Styles */
.snake-game {
  text-align: center;
}

.snake-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.snake-stats {
  display: flex;
  gap: 20px;
}

.snake-stats span {
  font-weight: 600;
  color: #5170ff;
}

.snake-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.snake-board {
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
}

canvas {
  border: 2px solid #5170ff;
  border-radius: 8px;
  background: #1a1a1a;
}

.snake-instructions {
  color: #888;
  font-size: 0.9rem;
}

/* Memory Game Styles */
.memory-game {
  text-align: center;
}

.memory-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.memory-stats {
  display: flex;
  gap: 20px;
}

.memory-stats span {
  font-weight: 600;
  color: #5170ff;
}

.memory-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.memory-card {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  perspective: 1000px;
}

.memory-card:hover {
  transform: scale(1.05);
}

.memory-card.no-click {
  pointer-events: none;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 8px;
  backface-visibility: hidden;
  transition: transform 0.3s ease;
}

.card-front {
  background: rgba(81, 112, 255, 0.2);
  color: #5170ff;
}

.card-back {
  background: rgba(255, 255, 255, 0.1);
  transform: rotateY(180deg);
}

.memory-card.flipped .card-front {
  transform: rotateY(180deg);
}

.memory-card.flipped .card-back {
  transform: rotateY(0);
}

.memory-card.matched {
  background: rgba(34, 197, 94, 0.2);
  pointer-events: none;
}

/* Rock Paper Scissors Styles */
.rps-game {
  text-align: center;
}

.rps-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.stat {
  font-weight: 600;
  color: #5170ff;
}

.rps-arena {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
}

.player-choice, .computer-choice {
  text-align: center;
}

.player-choice h3, .computer-choice h3 {
  margin-bottom: 20px;
  color: #fff;
}

.choice-display {
  width: 120px;
  height: 120px;
  border: 3px solid #5170ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: rgba(81, 112, 255, 0.1);
}

.vs {
  font-size: 2rem;
  font-weight: 800;
  color: #5170ff;
}

.rps-result {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #22c55e;
}

.rps-choices {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.choice-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.choice-btn:hover {
  background: rgba(81, 112, 255, 0.2);
  border-color: #5170ff;
}

/* Number Guessing Styles */
.guess-game {
  text-align: center;
}

.guess-info {
  margin-bottom: 30px;
}

.guess-info h3 {
  color: #5170ff;
  margin-bottom: 15px;
}

.guess-info p {
  color: #b0b0b0;
  margin: 5px 0;
}

.guess-input {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.guess-input input {
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1.1rem;
  width: 200px;
}

.guess-input button {
  background: linear-gradient(135deg, #5170ff, #7c9dff);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.guess-history {
  margin-bottom: 30px;
}

.guess-history h4 {
  color: #5170ff;
  margin-bottom: 15px;
}

.guesses {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.guess-item {
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.guess-item.too-high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.guess-item.too-low {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

/* Connect 4 Styles */
.connect4-game {
  text-align: center;
}

.connect4-status {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.connect4-status .red {
  color: #ef4444;
}

.connect4-status .yellow {
  color: #eab308;
}

.connect4-board {
  display: inline-grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  background: rgba(81, 112, 255, 0.2);
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.connect4-column {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 4px;
  cursor: pointer;
}

.connect4-cell {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.connect4-column:hover .connect4-cell {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .games-header {
    padding: 60px 20px 40px;
  }
  
  .games-header h1 {
    font-size: 2.5rem;
  }
  
  .games-container {
    padding: 60px 20px;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .game-controls {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .stats {
    gap: 20px;
  }
  
  .rps-arena {
    flex-direction: column;
    gap: 20px;
  }
  
  .rps-choices {
    flex-direction: column;
    align-items: center;
  }
  
  .guess-input {
    flex-direction: column;
    align-items: center;
  }
  
  .memory-controls, .snake-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  canvas {
    max-width: 100%;
  }
}
</style>