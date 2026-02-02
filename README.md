# Status Bot Website & Discord Bot

My comprehensive Discord bot with a modern web dashboard for status tracking, leveling, economy systems, and server management.

## About This Project

I've built Status Bot as a full-stack solution combining:
- **Discord Bot**: Python-based bot with leveling, economy, status tracking, and welcome systems
- **Web Dashboard**: Vue.js frontend with Express.js backend for server management and user authentication

## What It Does

### The Discord Bot
- Real-time status tracking and monitoring
- XP and leveling system with voice chat integration  
- Comprehensive economy system with 15+ mini-games
- Customizable welcome/leave messages
- Premium membership system with multipliers
- Server leaderboards and user profiles

### The Web Dashboard
- Discord OAuth2 authentication
- Real-time server management interface
- Bot configuration and settings
- User profiles and statistics
- Premium subscription management
- Mobile-responsive design with dark/light themes

## Project Structure

```
├── src/                    # Frontend Vue.js application
│   ├── components/         # Reusable Vue components
│   ├── views/             # Page components
│   ├── stores/            # State management
│   └── styles/            # Global CSS
├── public/                # Static assets
├── *.py                   # Discord bot Python modules
├── backend.js             # Express.js API server
├── package.json           # Node.js dependencies
├── requirements.txt       # Python dependencies
└── vite.config.js         # Build configuration
```

## Getting Started

If you want to run this project locally or contribute, here's how to set everything up:

### What You'll Need
- Node.js (v16 or higher)
- Python 3.8+
- Discord application with bot token

### Setting Up The Frontend

1. Clone and install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
# Create .env file with your configuration
VITE_API_BASE_URL=your_backend_url
VITE_DISCORD_CLIENT_ID=your_discord_client_id
VITE_WEBSITE_URL=your_website_url
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Setting Up The Bot

1. Install Python requirements:
```bash
pip install -r requirements.txt
```

2. Configure your bot settings in `config.py`

3. Start the bot:
```bash
python main.py
```

## Configuration

### Environment Variables You'll Need
- `DISCORD_BOT_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your Discord application client ID
- `DISCORD_CLIENT_SECRET` - Your Discord OAuth2 secret
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret

### How The Bot Configuration Works
I've organized the bot settings through:
- `config.py` - Core bot configuration
- JSON data files for user data and settings
- Web dashboard for runtime configuration

## How To Use It

### Web Dashboard
1. Visit the website and authenticate with Discord
2. Select a server to manage
3. Configure bot features through the interface
4. Monitor server statistics and user activity

### Discord Commands
Users interact with the bot through slash commands:
- `/rank` - View level progress
- `/balance` - Check economy balance
- `/daily` - Claim daily rewards
- `/help` - View all commands

## Development

### Frontend Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### How I Organized The Bot
I've structured the bot with separate modules for each feature:
- `leveling.py` - XP and level management
- `economy.py` - Currency and mini-games
- `status.py` - Status tracking functionality
- `welcome.py` - Welcome/leave messages

## Deployment

### Frontend (I use Netlify)
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Bot Hosting
The bot can be deployed on any Python hosting platform. I've included configuration for Discloud hosting.

## Contributing

If you'd like to contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This is my proprietary software. All rights reserved.

## Support

If you have questions about this project:
- Open an issue on GitHub
- Join my Discord support server
- Contact through the website support system
