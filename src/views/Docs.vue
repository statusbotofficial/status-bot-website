<template>
  <div class="docs-wrapper">
    <div class="docs-container">
      <!-- Hero Section -->
      <div class="docs-hero">
        <div class="hero-content">
          <h1>Status Bot Documentation</h1>
          <p>Everything you need to know to get the most out of Status Bot</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">1000+</span>
              <span class="stat-label">Servers</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">50k+</span>
              <span class="stat-label">Users</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Start Cards -->
      <section class="quick-start">
        <h2>Quick Start</h2>
        <div class="quick-start-grid">
          <div class="quick-card" @click="scrollToSection('getting-started')">
            <div class="quick-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <h3>Getting Started</h3>
            <p>Set up Status Bot in under 5 minutes</p>
            <div class="quick-arrow">→</div>
          </div>
          <div class="quick-card" @click="scrollToSection('setup-monitoring')">
            <div class="quick-icon">
              <i class="fas fa-cogs"></i>
            </div>
            <h3>Configuration</h3>
            <p>Customize features for your server</p>
            <div class="quick-arrow">→</div>
          </div>
          <div class="quick-card" @click="scrollToSection('command-reference')">
            <div class="quick-icon">
              <i class="fas fa-terminal"></i>
            </div>
            <h3>Commands</h3>
            <p>Complete command reference</p>
            <div class="quick-arrow">→</div>
          </div>
          <div class="quick-card" @click="scrollToSection('troubleshooting')">
            <div class="quick-icon">
              <i class="fas fa-life-ring"></i>
            </div>
            <h3>Support</h3>
            <p>Get help when you need it</p>
            <div class="quick-arrow">→</div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="docs-main">
        <!-- Sidebar -->
        <aside class="docs-sidebar">
          <div class="sidebar-content">
            <div class="sidebar-search">
              <i class="fas fa-search"></i>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search documentation..." 
              />
            </div>
            
            <nav class="sidebar-nav">
              <div class="nav-section">
                <div class="nav-title">Getting Started</div>
                <ul class="nav-list">
                  <li><a href="#getting-started" @click.prevent="scrollToSection('getting-started')">
                    <i class="fas fa-play"></i> Setup & Installation
                  </a></li>
                  <li><a href="#what-is" @click.prevent="scrollToSection('what-is')">
                    <i class="fas fa-question-circle"></i> What is Status Bot?
                  </a></li>
                </ul>
              </div>

              <div class="nav-section">
                <div class="nav-title">Features</div>
                <ul class="nav-list">
                  <li><a href="#core-features" @click.prevent="scrollToSection('core-features')">
                    <i class="fas fa-star"></i> Core Features
                  </a></li>
                  <li><a href="#status-updates" @click.prevent="scrollToSection('status-updates')">
                    <i class="fas fa-chart-line"></i> Leveling System
                  </a></li>
                  <li><a href="#status-tracking" @click.prevent="scrollToSection('status-tracking')">
                    <i class="fas fa-circle"></i> Status Tracking
                  </a></li>
                  <li><a href="#economy-system" @click.prevent="scrollToSection('economy-system')">
                    <i class="fas fa-coins"></i> Economy System
                  </a></li>
                  <li><a href="#welcome-system" @click.prevent="scrollToSection('welcome-system')">
                    <i class="fas fa-door-open"></i> Welcome Messages
                  </a></li>
                  <li><a href="#premium" @click.prevent="scrollToSection('premium')">
                    <i class="fas fa-crown"></i> Premium Features
                  </a></li>
                </ul>
              </div>

              <div class="nav-section">
                <div class="nav-title">Configuration</div>
                <ul class="nav-list">
                  <li><a href="#setup-monitoring" @click.prevent="scrollToSection('setup-monitoring')">
                    <i class="fas fa-wrench"></i> Server Setup
                  </a></li>
                  <li><a href="#command-reference" @click.prevent="scrollToSection('command-reference')">
                    <i class="fas fa-code"></i> Commands
                  </a></li>
                </ul>
              </div>

              <div class="nav-section">
                <div class="nav-title">Support</div>
                <ul class="nav-list">
                  <li><a href="#troubleshooting" @click.prevent="scrollToSection('troubleshooting')">
                    <i class="fas fa-tools"></i> Troubleshooting
                  </a></li>
                  <li><a href="#best-practices" @click.prevent="scrollToSection('best-practices')">
                    <i class="fas fa-lightbulb"></i> Best Practices
                  </a></li>
                  <li><a href="#faq" @click.prevent="scrollToSection('faq')">
                    <i class="fas fa-comments"></i> FAQ
                  </a></li>
                  <li><a href="#contact" @click.prevent="scrollToSection('contact')">
                    <i class="fas fa-headset"></i> Contact
                  </a></li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        <!-- Content -->
        <main class="docs-content">
          <!-- What is Status Bot -->
          <section class="content-section" id="what-is">
            <div class="section-header">
              <h2>What is Status Bot?</h2>
              <div class="section-badge">Overview</div>
            </div>
            <div class="content-card">
              <p><strong>Status Bot</strong> is a comprehensive Discord bot designed to enhance your server with user status tracking, member leveling systems, economy mechanics, welcome automation, and powerful server management tools.</p>
              
              <div class="feature-grid">
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-circle" style="color: #10b981;"></i>
                  </div>
                  <div>
                    <h4>Status Tracking</h4>
                    <p>Monitor user activity with real-time status updates</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-chart-line" style="color: #5170ff;"></i>
                  </div>
                  <div>
                    <h4>Leveling System</h4>
                    <p>Reward active members with XP and titles</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-coins" style="color: #f59e0b;"></i>
                  </div>
                  <div>
                    <h4>Economy System</h4>
                    <p>Create engaging currency and mini-games</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-door-open" style="color: #8b5cf6;"></i>
                  </div>
                  <div>
                    <h4>Welcome Messages</h4>
                    <p>Automate member onboarding with custom embeds</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Getting Started -->
          <section class="content-section" id="getting-started">
            <div class="section-header">
              <h2>Getting Started</h2>
              <div class="section-badge">Setup</div>
            </div>
            <div class="content-card">
              <p>Follow these simple steps to set up Status Bot in your Discord server:</p>
              
              <div class="steps-container">
                <div class="step-item">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>Invite the Bot</h4>
                    <p>Use the invite button on our website to add Status Bot to your server. You need administrator or manage server permissions.</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>Access Dashboard</h4>
                    <p>Visit the Status Bot dashboard and connect your Discord account to manage your servers.</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>Configure Features</h4>
                    <p>Select your server and enable the systems you want to use (Leveling, Economy, etc.) directly from the dashboard.</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h4>Customize Settings</h4>
                    <p>Adjust XP rates, currency symbols, notification channels, and more through the intuitive dashboard interface.</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">5</div>
                  <div class="step-content">
                    <h4>Save & Deploy</h4>
                    <p>Your settings apply immediately to your server. Start enjoying Status Bot!</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Core Features -->
          <section class="content-section" id="core-features">
            <div class="section-header">
              <h2>Core Features</h2>
              <div class="section-badge">Features</div>
            </div>
            <div class="feature-cards">
              <div class="feature-card">
                <div class="card-icon">
                  <i class="fas fa-circle" style="color: #10b981;"></i>
                </div>
                <h3>Status Tracking</h3>
                <p>Monitor user statuses (Online, Idle, DND, Offline) with real-time updates. Get notified instantly when users change status.</p>
              </div>
              
              <div class="feature-card">
                <div class="card-icon">
                  <i class="fas fa-chart-line" style="color: #5170ff;"></i>
                </div>
                <h3>XP & Leveling System</h3>
                <p>Members earn XP through messages and voice chat. Automatic leveling with custom titles from Newbie to Omniscient.</p>
              </div>
              
              <div class="feature-card">
                <div class="card-icon">
                  <i class="fas fa-coins" style="color: #f59e0b;"></i>
                </div>
                <h3>Economy System</h3>
                <p>Create a server economy with custom currency. Includes daily rewards, streaks, mini-games, and per-message earnings.</p>
              </div>
              
              <div class="feature-card">
                <div class="card-icon">
                  <i class="fas fa-door-open" style="color: #8b5cf6;"></i>
                </div>
                <h3>Welcome Messages</h3>
                <p>Customize welcome embeds for new members with images, titles, descriptions, and member goal tracking.</p>
              </div>
            </div>
          </section>

          <!-- Commands -->
          <section class="content-section" id="command-reference">
            <div class="section-header">
              <h2>Command Reference</h2>
              <div class="section-badge">Commands</div>
            </div>
            <div class="content-card">
              <p>Status Bot uses slash commands for easy interaction. All configuration is done through the dashboard, but here are the commands members use:</p>
              
              <div class="command-groups">
                <div class="command-group">
                  <h3><i class="fas fa-chart-line"></i> Leveling Commands</h3>
                  <div class="command-list">
                    <div class="command-item">
                      <div class="command-name">/rank</div>
                      <div class="command-desc">View a user's rank card</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/leaderboard</div>
                      <div class="command-desc">View the server leaderboard</div>
                    </div>
                  </div>
                </div>

                <div class="command-group">
                  <h3><i class="fas fa-coins"></i> Economy Commands</h3>
                  <div class="command-list">
                    <div class="command-item">
                      <div class="command-name">/balance</div>
                      <div class="command-desc">Check your balance</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/pay</div>
                      <div class="command-desc">Pay another user</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/daily</div>
                      <div class="command-desc">Claim your daily reward</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/slots</div>
                      <div class="command-desc">Play the slot machine</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/blackjack</div>
                      <div class="command-desc">Play blackjack against the dealer!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/clicker</div>
                      <div class="command-desc">Click to earn currency!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/lootbox</div>
                      <div class="command-desc">Roll a lootbox for rare rewards!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/robbery</div>
                      <div class="command-desc">Attempt to rob another user!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/invest</div>
                      <div class="command-desc">Invest money to earn daily interest</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/withdraw</div>
                      <div class="command-desc">Withdraw your investment</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/interest</div>
                      <div class="command-desc">Check your investment and earned interest</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/dice</div>
                      <div class="command-desc">Roll the dice and bet on your luck!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/mine</div>
                      <div class="command-desc">Mine for rare gems and currency!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/fish</div>
                      <div class="command-desc">Fish for valuable catches!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/roulette</div>
                      <div class="command-desc">Spin the roulette wheel!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/heist</div>
                      <div class="command-desc">Plan a heist to steal from random guild members!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/lottery</div>
                      <div class="command-desc">Buy a lottery ticket for a chance to win big!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/duel</div>
                      <div class="command-desc">Challenge someone to a duel for their fortune!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/spin</div>
                      <div class="command-desc">Spin the mystery wheel for random rewards!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/flip</div>
                      <div class="command-desc">Flip a coin and guess the outcome!</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/auction</div>
                      <div class="command-desc">Auction off your items to other players!</div>
                    </div>
                  </div>
                </div>

                <div class="command-group">
                  <h3><i class="fas fa-tools"></i> Utility Commands</h3>
                  <div class="command-list">
                    <div class="command-item">
                      <div class="command-name">/profile</div>
                      <div class="command-desc">View your global profile</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/help</div>
                      <div class="command-desc">Show all available commands and their usage</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/invite</div>
                      <div class="command-desc">Get the bot's invite link</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/about</div>
                      <div class="command-desc">Learn more about Status Bot</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/info</div>
                      <div class="command-desc">Get detailed info about a user</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/dad-joke</div>
                      <div class="command-desc">Get a random dad joke</div>
                    </div>
                  </div>
                </div>

                <div class="command-group">
                  <h3><i class="fas fa-shield-alt"></i> Admin Commands</h3>
                  <div class="command-list">
                    <div class="command-item">
                      <div class="command-name">/give</div>
                      <div class="command-desc">Give XP or balance to a user</div>
                    </div>
                    <div class="command-item">
                      <div class="command-name">/take</div>
                      <div class="command-desc">Take XP or balance from a user</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Configuration -->
          <section class="content-section" id="setup-monitoring">
            <div class="section-header">
              <h2>Server Configuration</h2>
              <div class="section-badge">Setup</div>
            </div>
            <div class="config-cards">
              <div class="config-card">
                <div class="config-header">
                  <h3><i class="fas fa-circle"></i> Status Tracking</h3>
                </div>
                <div class="config-content">
                  <ul class="config-list">
                    <li>Select users to track status changes for</li>
                    <li>Set update delay for tracking frequency</li>
                    <li>Configure tracking channel for notifications</li>
                    <li>Customize offline messages and automatic updates</li>
                    <li>Choose between simple messages or rich embeds</li>
                  </ul>
                </div>
              </div>

              <div class="config-card">
                <div class="config-header">
                  <h3><i class="fas fa-chart-line"></i> Leveling System</h3>
                </div>
                <div class="config-content">
                  <ul class="config-list">
                    <li>Enable or disable the leveling system for your server</li>
                    <li>Set XP earned per message (default: 10 XP)</li>
                    <li>Configure voice chat XP (if enabled)</li>
                    <li>Choose which channels to track XP in (optional)</li>
                  </ul>
                </div>
              </div>

              <div class="config-card">
                <div class="config-header">
                  <h3><i class="fas fa-coins"></i> Economy System</h3>
                </div>
                <div class="config-content">
                  <ul class="config-list">
                    <li>Enable or disable the economy system</li>
                    <li>Set currency earned per message</li>
                    <li>Customize your currency symbol</li>
                    <li>Control which mini-games are available</li>
                  </ul>
                </div>
              </div>

              <div class="config-card">
                <div class="config-header">
                  <h3><i class="fas fa-door-open"></i> Welcome Messages</h3>
                </div>
                <div class="config-content">
                  <ul class="config-list">
                    <li>Design custom welcome embeds for new members</li>
                    <li>Set welcome channel and customize message content</li>
                    <li>Add images, titles, and descriptions</li>
                    <li>Track member count and goals automatically</li>
                    <li>Use placeholders for dynamic content</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- Leveling System -->
          <section class="content-section" id="status-updates">
            <div class="section-header">
              <h2>Leveling & Progression</h2>
              <div class="section-badge">System</div>
            </div>
            <div class="content-card">
              <p>The leveling system is designed to reward active members in your server:</p>
              
              <div class="level-info">
                <div class="level-item">
                  <h4>XP Earning</h4>
                  <p>Default <strong>10 XP per message</strong>, configurable per server. Premium members earn <strong>2x XP</strong>.</p>
                </div>
                <div class="level-item">
                  <h4>Voice Chat</h4>
                  <p>Members earn XP while active in voice channels with other members.</p>
                </div>
              </div>

              <div class="title-progression">
                <h4>Title Progression</h4>
                <div class="title-list">
                  <div class="title-tier">
                    <span class="title-range">1-9</span>
                    <span class="title-name newbie">NEWBIE</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">10-24</span>
                    <span class="title-name rookie">ROOKIE</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">25-49</span>
                    <span class="title-name hunter">HUNTER</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">50-99</span>
                    <span class="title-name assassin">ASSASSIN</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">100-149</span>
                    <span class="title-name elite">ELITE</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">150-249</span>
                    <span class="title-name apex">APEX</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">250-349</span>
                    <span class="title-name emperor">EMPEROR</span>
                  </div>
                  <div class="title-tier">
                    <span class="title-range">350+</span>
                    <span class="title-name omniscient">OMNISCIENT</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Status Tracking System -->
          <section class="content-section" id="status-tracking">
            <div class="section-header">
              <h2>Status Tracking System</h2>
              <div class="section-badge">System</div>
            </div>
            <div class="content-card">
              <p>Track user status changes in real-time with customizable notifications:</p>
              
              <div class="status-tracking-grid">
                <div class="status-feature-card">
                  <div class="status-icon">
                    <i class="fas fa-circle pulsing-dot"></i>
                  </div>
                  <h4>Real-Time Monitoring</h4>
                  <p>Automatically detect when tracked users go online, idle, DND, or offline.</p>
                </div>
                <div class="status-feature-card">
                  <div class="status-icon">
                    <i class="fas fa-comment-alt"></i>
                  </div>
                  <h4>Custom Messages</h4>
                  <p>Set personalized offline messages and choose between simple text or rich embeds.</p>
                </div>
                <div class="status-feature-card">
                  <div class="status-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <h4>Multiple Users</h4>
                  <p>Track multiple users simultaneously with individual settings for each.</p>
                </div>
                <div class="status-feature-card">
                  <div class="status-icon">
                    <i class="fas fa-hashtag"></i>
                  </div>
                  <h4>Channel Control</h4>
                  <p>Direct status updates to specific channels with configurable delays.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Economy System -->
          <section class="content-section" id="economy-system">
            <div class="section-header">
              <h2>Economy System</h2>
              <div class="section-badge">System</div>
            </div>
            <div class="content-card">
              <p>Create a thriving server economy with currency, games, and rewards:</p>
              
              <div class="economy-features">
                <div class="economy-section">
                  <h4>Earn Currency From:</h4>
                  <div class="currency-methods">
                    <span class="currency-method">Messages</span>
                    <span class="currency-method">Daily Rewards</span>
                    <span class="currency-method">Mini-Games</span>
                    <span class="currency-method">Investments</span>
                  </div>
                </div>
                
                <div class="economy-section">
                  <h4>Available Games</h4>
                  <div class="games-grid">
                    <div class="game-item">🎰 Slots</div>
                    <div class="game-item">🃏 Blackjack</div>
                    <div class="game-item">🎲 Dice</div>
                    <div class="game-item">🪙 Coinflip</div>
                    <div class="game-item">📦 Lootbox</div>
                    <div class="game-item">🔨 Mining</div>
                    <div class="game-item">🎣 Fishing</div>
                    <div class="game-item">🎡 Roulette</div>
                    <div class="game-item">⚔️ Dueling</div>
                    <div class="game-item">🏆 Heists</div>
                    <div class="game-item">🎪 Spin Wheel</div>
                    <div class="game-item">🎟️ Lottery</div>
                  </div>
                </div>

                <div class="economy-section">
                  <h4>Advanced Features</h4>
                  <p>Investment system with daily interest, robbery mechanics, and auction house for trading items between players.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Welcome Messages System -->
          <section class="content-section" id="welcome-system">
            <div class="section-header">
              <h2>Welcome Messages System</h2>
              <div class="section-badge">System</div>
            </div>
            <div class="content-card">
              <p>Greet new members with beautiful, customizable welcome messages:</p>
              
              <div class="welcome-features-grid">
                <div class="welcome-feature-card">
                  <div class="welcome-icon">
                    <i class="fas fa-palette"></i>
                  </div>
                  <h4>Rich Embeds</h4>
                  <p>Create stunning welcome cards with custom colors, images, titles, and descriptions.</p>
                </div>
                <div class="welcome-feature-card">
                  <div class="welcome-icon">
                    <i class="fas fa-code"></i>
                  </div>
                  <h4>Dynamic Placeholders</h4>
                  <p>Use placeholders like <code>{user}</code>, <code>{server}</code>, and <code>{member_count}</code> for personalized messages.</p>
                </div>
                <div class="welcome-feature-card">
                  <div class="welcome-icon">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <h4>Member Tracking</h4>
                  <p>Automatically update voice channels with current member count and member goals.</p>
                </div>
                <div class="welcome-feature-card">
                  <div class="welcome-icon">
                    <i class="fas fa-bullseye"></i>
                  </div>
                  <h4>Goal Progress</h4>
                  <p>Set member count goals and track progress with dynamic channel names.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Premium -->
          <section class="content-section" id="premium">
            <div class="section-header">
              <h2>Premium Features</h2>
              <div class="section-badge premium">Premium</div>
            </div>
            <div class="premium-card">
              <div class="premium-header">
                <i class="fas fa-crown"></i>
                <h3>Upgrade to Premium</h3>
                <p>Unlock advanced features and support development</p>
              </div>
              
              <div class="premium-features">
                <div class="premium-feature">
                  <i class="fas fa-bolt"></i>
                  <div>
                    <h4>2x XP Multiplier</h4>
                    <p>Earn double XP on messages and voice chat</p>
                  </div>
                </div>
                <div class="premium-feature">
                  <i class="fas fa-coins"></i>
                  <div>
                    <h4>Economy Perks</h4>
                    <p>Increased daily rewards and bonus mini-game earnings</p>
                  </div>
                </div>
                <div class="premium-feature">
                  <i class="fas fa-gem"></i>
                  <div>
                    <h4>Exclusive Items</h4>
                    <p>Access to premium-only items and cosmetics</p>
                  </div>
                </div>
                <div class="premium-feature">
                  <i class="fas fa-headset"></i>
                  <div>
                    <h4>Priority Support</h4>
                    <p>Get faster responses to questions and issues</p>
                  </div>
                </div>
              </div>
              
              <div class="premium-cta">
                <router-link to="/premium" class="premium-btn">View Premium Plans</router-link>
              </div>
            </div>
          </section>

          <!-- Support Sections -->
          <div class="support-grid">
            <section class="content-section" id="troubleshooting">
              <div class="section-header">
                <h2>Troubleshooting</h2>
                <div class="section-badge">Support</div>
              </div>
              <div class="troubleshoot-card">
                <div class="trouble-item">
                  <h4><i class="fas fa-robot"></i> Bot not responding?</h4>
                  <ul>
                    <li>Check bot permissions in your server</li>
                    <li>Try <code>/help</code> to see available commands</li>
                    <li>Verify the bot is enabled in dashboard</li>
                  </ul>
                </div>
                <div class="trouble-item">
                  <h4><i class="fas fa-coins"></i> Not earning XP/Currency?</h4>
                  <ul>
                    <li>Enable systems in your dashboard</li>
                    <li>Check channel permissions</li>
                    <li>Verify you're in allowed channels</li>
                  </ul>
                </div>
                <div class="trouble-item">
                  <h4><i class="fas fa-question-circle"></i> Need more help?</h4>
                  <p>Visit our <router-link to="/support">Support page</router-link> for live chat assistance.</p>
                </div>
              </div>
            </section>

            <section class="content-section" id="faq">
              <div class="section-header">
                <h2>FAQ</h2>
                <div class="section-badge">Help</div>
              </div>
              <div class="faq-card">
                <div class="faq-item">
                  <h4>How much XP do I earn per message?</h4>
                  <p>Default is 10 XP per message, but server admins can customize this. Premium members earn 2x XP.</p>
                </div>
                <div class="faq-item">
                  <h4>How do I check my progress?</h4>
                  <p>Use <code>/rank</code> for personal stats or <code>/leaderboard</code> for server rankings.</p>
                </div>
                <div class="faq-item">
                  <h4>Do I lose progress if I leave?</h4>
                  <p>Your data is stored per-guild. If you rejoin, your progress will be restored.</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Contact -->
          <section class="content-section" id="contact">
            <div class="section-header">
              <h2>Contact & Support</h2>
              <div class="section-badge">Help</div>
            </div>
            <div class="contact-card">
              <p>Need help, have questions, or want to report a bug? We're here to help!</p>
              
              <div class="contact-options">
                <div class="contact-option">
                  <div class="contact-icon">
                    <i class="fas fa-comments"></i>
                  </div>
                  <div>
                    <h4>Live Support</h4>
                    <p>Get instant help with our AI assistant</p>
                    <router-link to="/support" class="contact-link">Visit Support →</router-link>
                  </div>
                </div>
                
                <div class="contact-option">
                  <div class="contact-icon">
                    <i class="fab fa-discord"></i>
                  </div>
                  <div>
                    <h4>Discord Community</h4>
                    <p>Join our server for community help</p>
                    <a href="https://discord.gg/statusbot" target="_blank" class="contact-link">Join Discord →</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const searchQuery = ref('')

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('discordUser')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    authStore.setUser(user)
  }
  document.title = 'Documentation | Status Bot'
})
</script>

<style scoped>
/* Main Layout */
.docs-wrapper {
  width: 100%;
  min-height: calc(100vh - 200px);
  background: var(--bg-primary);
}

.docs-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* Hero Section */
.docs-hero {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1) 0%, rgba(81, 112, 255, 0.05) 100%);
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
  padding: 80px 50px;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 15px 0;
}

.hero-content p {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0 0 40px 0;
}

.hero-stats {
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
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(81, 112, 255, 0.2);
}

/* Quick Start */
.quick-start {
  padding: 60px 50px;
  background: var(--bg-primary);
}

.quick-start h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin: 0 0 40px 0;
}

.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.quick-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 12px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.quick-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 12px 32px rgba(81, 112, 255, 0.15);
}

.quick-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.2), rgba(81, 112, 255, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.quick-icon i {
  font-size: 24px;
  color: var(--primary-color);
}

.quick-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.quick-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.quick-arrow {
  position: absolute;
  bottom: 20px;
  right: 25px;
  font-size: 18px;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.quick-card:hover .quick-arrow {
  transform: translateX(4px);
}

/* Main Content Layout */
.docs-main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  min-height: calc(100vh - 400px);
}

/* Sidebar */
.docs-sidebar {
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(81, 112, 255, 0.1);
  padding: 40px 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-content {
  padding: 0 30px;
}

.sidebar-search {
  position: relative;
  margin-bottom: 30px;
}

.sidebar-search i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 14px;
}

.sidebar-search input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
}

.sidebar-search input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(81, 112, 255, 0.1);
}

.nav-section {
  margin-bottom: 30px;
}

.nav-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-color);
  margin-bottom: 15px;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.nav-list a:hover {
  background: rgba(81, 112, 255, 0.1);
  color: var(--primary-color);
  transform: translateX(4px);
}

.nav-list i {
  font-size: 14px;
  width: 16px;
}

/* Content */
.docs-content {
  padding: 40px 50px;
  background: var(--bg-primary);
}

.content-section {
  margin-bottom: 60px;
  max-width: 900px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.section-badge {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.6));
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-badge.premium {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(251, 191, 36, 0.6));
}

/* Content Cards */
.content-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
}

.content-card p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 8px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon i {
  font-size: 18px;
}

.feature-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.feature-item p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Steps */
.steps-container {
  margin-top: 30px;
}

.step-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.step-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.2), rgba(81, 112, 255, 0.1));
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--primary-color);
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.step-content p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* Feature Cards */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(81, 112, 255, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.card-icon i {
  font-size: 20px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.feature-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* Command Groups */
.command-groups {
  margin-top: 30px;
}

.command-group {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.command-group h3 {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1), rgba(81, 112, 255, 0.05));
  padding: 20px 25px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.command-group h3 i {
  margin-right: 10px;
}

.command-list {
  padding: 20px 25px;
}

.command-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(81, 112, 255, 0.05);
}

.command-item:last-child {
  border-bottom: none;
}

.command-name {
  background: rgba(81, 112, 255, 0.1);
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 14px;
  min-width: 120px;
  text-align: center;
}

.command-desc {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  padding-top: 2px;
}

/* Config Cards */
.config-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.config-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.config-header {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.1), rgba(81, 112, 255, 0.05));
  padding: 20px 25px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.config-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.config-header h3 i {
  margin-right: 10px;
}

.config-content {
  padding: 20px 25px;
}

.config-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.config-list li {
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  padding-left: 20px;
}

.config-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

/* Level System */
.level-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.level-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
}

.level-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.level-item p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.title-progression {
  margin-top: 30px;
}

.title-progression h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px 0;
}

.title-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.title-tier {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 8px;
}

.title-range {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
}

.title-name {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.title-name.newbie { background: rgba(115, 115, 115, 0.2); color: #737373; }
.title-name.rookie { background: rgba(0, 191, 99, 0.2); color: #00bf63; }
.title-name.hunter { background: rgba(255, 145, 77, 0.2); color: #ff914d; }
.title-name.assassin { background: rgba(255, 255, 255, 0.7); color: #000000; border: 1px solid rgba(0, 0, 0, 0.1); }
.title-name.elite { background: rgba(0, 74, 173, 0.2); color: #004aad; }
.title-name.apex { background: rgba(255, 0, 0, 0.2); color: #ff0000; }
.title-name.emperor { 
  background: linear-gradient(45deg, rgba(255, 222, 89, 0.7), rgba(255, 145, 77, 0.7)); 
  color: #000000;
  font-weight: 600;
}
.title-name.omniscient { 
  background: linear-gradient(45deg, rgba(169, 227, 255, 0.7), rgba(255, 170, 255, 0.7), rgba(255, 171, 240, 0.7)); 
  color: #000000;
  font-weight: 600;
}

/* Premium Card */
.premium-card {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05));
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  padding: 30px;
}

.premium-header {
  text-align: center;
  margin-bottom: 30px;
}

.premium-header i {
  font-size: 48px;
  color: #fbbf24;
  margin-bottom: 15px;
}

.premium-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.premium-header p {
  color: var(--text-secondary);
  margin: 0;
}

.premium-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.premium-feature {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 8px;
}

.premium-feature i {
  font-size: 20px;
  color: #fbbf24;
  margin-top: 2px;
}

.premium-feature h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.premium-feature p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.premium-cta {
  text-align: center;
}

.premium-btn {
  display: inline-block;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.3);
}

/* Support Grid */
.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

/* Troubleshooting */
.troubleshoot-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
}

.trouble-item {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.trouble-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.trouble-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 15px 0;
}

.trouble-item h4 i {
  margin-right: 8px;
  color: var(--primary-color);
}

.trouble-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trouble-item ul li {
  padding: 6px 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  padding-left: 20px;
}

.trouble-item ul li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

.trouble-item p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.trouble-item code {
  background: rgba(81, 112, 255, 0.1);
  color: var(--primary-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* FAQ */
.faq-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
}

.faq-item {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.faq-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.faq-item p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.faq-item code {
  background: rgba(81, 112, 255, 0.1);
  color: var(--primary-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Contact */
.contact-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
}

.contact-card p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.contact-option {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 8px;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background: rgba(81, 112, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon i {
  font-size: 18px;
  color: var(--primary-color);
}

.contact-option h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.contact-option p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #8a9fff;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .docs-main {
    grid-template-columns: 280px 1fr;
  }
  
  .sidebar-content {
    padding: 0 20px;
  }
  
  .docs-content {
    padding: 40px 40px;
  }
}

@media (max-width: 1024px) {
  .hero-stats {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .quick-start {
    padding: 50px 30px;
  }
  
  .docs-main {
    grid-template-columns: 1fr;
  }
  
  .docs-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(81, 112, 255, 0.1);
    padding: 30px 0;
  }
  
  .docs-content {
    padding: 40px 30px;
  }
  
  .config-cards {
    grid-template-columns: 1fr;
  }
  
  .support-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .docs-hero {
    padding: 60px 30px;
  }
  
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .quick-start {
    padding: 40px 20px;
  }
  
  .quick-start-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .docs-content {
    padding: 30px 20px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
  
  .feature-cards,
  .command-groups,
  .premium-features,
  .contact-options {
    grid-template-columns: 1fr;
  }
  
  .title-list {
    grid-template-columns: 1fr;
  }
  
  .level-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .docs-hero {
    padding: 40px 15px;
  }
  
  .hero-content h1 {
    font-size: 28px;
  }
  
  .quick-start {
    padding: 30px 15px;
  }
  
  .quick-card {
    padding: 20px;
  }
  
  .docs-content {
    padding: 20px 15px;
  }
  
  .content-card,
  .troubleshoot-card,
  .faq-card,
  .contact-card,
  .premium-card {
    padding: 20px;
  }
  
  .sidebar-content {
    padding: 0 15px;
  }
  
  .command-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .command-name {
    min-width: auto;
    align-self: flex-start;
  }
}

/* Economy System Styles */
.economy-features {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.economy-section h4 {
  margin-bottom: 15px;
  color: var(--text-primary);
  font-weight: 600;
}

.currency-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.currency-method {
  background: rgba(81, 112, 255, 0.1);
  color: #5170ff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.game-item {
  background: rgba(245, 158, 11, 0.1);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

/* Status Tracking System Styles */
.status-tracking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.status-feature-card {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.status-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
}

.status-icon {
  width: 50px;
  height: 50px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 20px;
  color: #10b981;
}

.pulsing-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

.status-feature-card h4 {
  margin-bottom: 10px;
  color: var(--text-primary);
  font-weight: 600;
}

.status-feature-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 14px;
}

/* Welcome System Styles */
.welcome-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.welcome-feature-card {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.welcome-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
}

.welcome-icon {
  width: 50px;
  height: 50px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 20px;
  color: #8b5cf6;
}

.welcome-feature-card h4 {
  margin-bottom: 10px;
  color: var(--text-primary);
  font-weight: 600;
}

.welcome-feature-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 14px;
}

.welcome-feature-card code {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

/* Responsive adjustments for new sections */
@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }
  
  .game-item {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .currency-methods {
    gap: 8px;
  }
  
  .currency-method {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .status-tracking-grid,
  .welcome-features-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .status-feature-card,
  .welcome-feature-card {
    padding: 15px;
  }
  
  .status-icon,
  .welcome-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
    margin-bottom: 12px;
  }
}
</style>
