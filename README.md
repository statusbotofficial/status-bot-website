# Status Bot Website

A modern Discord bot website built with Vue 3 and Vite.

## Features

- Modern, responsive design with theme switching
- Discord OAuth2 authentication
- Server management dashboard
- Command documentation
- Premium pricing page
- Status monitoring
- Fully configurable via environment variables
- No hardcoded URLs or API keys

## Project Structure

```
src/
├── components/        # Shared components
├── views/            # Page components
├── stores/           # Pinia state management
├── styles/          # Global styles
├── config.js        # Configuration management
├── router.js        # Vue Router setup
└── main.js          # Application entry point

public/             # Static assets
dist/              # Build output
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
VITE_API_BASE_URL=https://status-bot-backend.onrender.com
VITE_WEBSITE_URL=https://status-bot.xyz
VITE_DISCORD_CLIENT_ID=your_client_id
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Configuration

All configuration is managed through environment variables in the `.env` file. See `.env.example` for all available options.

Key configurations:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_WEBSITE_URL` - Your website URL
- `VITE_DISCORD_CLIENT_ID` - Discord OAuth client ID

## Deployment

### Netlify

The site is optimized for Netlify hosting:

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

The `_redirects` file handles SPA routing automatically.

## Technologies

- Vue 3 - Progressive JavaScript framework
- Vite - Fast build tool
- Vue Router - Client-side routing
- Pinia - State management
- CSS3 - Responsive styling

## Support

For issues or questions, contact us through our Discord server
