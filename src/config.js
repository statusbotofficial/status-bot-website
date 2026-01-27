export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-nwct.onrender.com'
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://status-bot.xyz'
export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '1436123870158520411'
export const DISCORD_SERVER_URL = import.meta.env.VITE_DISCORD_SERVER_URL || 'https://discord.gg/Kd2MckVxED'
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@example.com'
export const DOCS_URL = import.meta.env.VITE_DOCS_URL || 'https://docs.status-bot.xyz'

export const DISCORD_PERMISSIONS = '8'
export const DISCORD_SCOPES = 'bot applications.commands'

export const DISCORD_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${DISCORD_PERMISSIONS}&scope=${encodeURIComponent(DISCORD_SCOPES)}`

export const AUTH_SCOPES = ['identify', 'guilds']

export const THEME_STORAGE_KEY = 'site_theme'
export const AUTH_STORAGE_KEY = 'discordUser'
export const NOTIFICATION_BADGE_KEY = 'notificationBadgeDismissed'
