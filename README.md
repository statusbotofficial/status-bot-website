# Status Bot Website & Discord Bot

A comprehensive Discord bot with a modern website dashboard built with Vue 3 and Vite. Status Bot provides leveling, economy, status tracking, and more for your Discord server.

## Features

### Website Features
- Modern, responsive design with dark/light theme switching
- Discord OAuth2 authentication
- Intuitive server management dashboard
- Command documentation and reference
- Premium pricing and subscription management
- Real-time server status monitoring
- User profile cards and rank tracking
- Full mobile responsiveness

### Discord Bot Features
- **Leveling System** - XP tracking through messages and voice chat with automatic rank progression
- **Economy System** - Custom currency with mini-games (Slots, Blackjack, Coinflip, Lootbox, Clicker)
- **Daily Rewards** - Streak-based currency rewards with bonus multipliers
- **Status Tracking** - Monitor user online/idle/DND/offline status changes in real-time
- **User Profiles** - Comprehensive profile cards with global stats and achievements
- **Leaderboards** - Server-wide ranking systems for levels and wealth
- **Premium System** - Enhanced features via premium membership or server boosting
- **Moderation** - Message management and server administration tools
- **Welcome Messages** - Customizable embeds for new member introductions

## Project Structure

```
src/
├── components/        # Shared Vue components
├── views/            # Page views (Home, Premium, Commands, Docs, etc.)
├── stores/           # Pinia state management (auth, theme)
├── styles/          # Global CSS styles
├── config.js        # Frontend configuration
├── router.js        # Vue Router setup
└── main.js          # Application entry point

public/              # Static assets
dist/               # Build output
backend.js          # Express.js backend API server
config.py           # Bot configuration
main.py             # Discord bot entry point
leveling.py         # Leveling system
economy.py          # Economy and mini-games
status.py           # Status tracking
premium.py          # Premium features
```

## Bot Commands

### Leveling
- `/rank` - View your current level and XP progress
- `/leaderboard` - See top leveled members

### Economy
- `/balance` - Check your currency balance
- `/pay` - Send currency to another member
- `/daily` - Claim daily currency reward
- `/slots` - Play slots for currency
- `/blackjack` - Play blackjack against the dealer
- `/coinflip` - Flip a coin for currency
- `/clicker` - Click-based earning game
- `/lootbox` - Open mystery lootbox for rewards

### Utility
- `/profile` - View your server profile with stats
- `/help` - Display all available commands
- `/invite` - Get bot invite link
- `/about` - Learn about Status Bot

## Setup

### Website Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
VITE_API_BASE_URL=your_backend_url
VITE_WEBSITE_URL=your_website_url
VITE_DISCORD_CLIENT_ID=your_discord_client_id
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Bot Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `config.py` with your Discord bot token and configuration

3. Run the bot:
```bash
python main.py
```

## Deployment

### Website - Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

### Bot - Discloud

The bot is configured for Discloud hosting with the included `discloud.config` file.

## Technologies

### Frontend
- Vue 3 - Progressive JavaScript framework
- Vite - Fast build tool
- Vue Router - Client-side routing
- Pinia - State management
- CSS3 - Responsive styling

### Backend
- Express.js - API server
- Discord.py - Discord bot library
- Pillow - Image generation for profile cards
- aiohttp - Async HTTP requests

## Configuration

All configuration is managed through environment variables. Key configurations:
- Database and file paths for user data
- Discord bot token and client ID
- API endpoints and URLs
- Premium features and pricing

## Support

For issues, questions, or feature requests, join our Discord community or create an issue on GitHub.
