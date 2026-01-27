import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { THEME_STORAGE_KEY } from '../config'

const THEMES = {
  default: {
    name: 'Default',
    '--primary-color': '#5170ff',
    '--primary-light': '#4162ff',
    '--bg-primary': '#000000',
    '--bg-secondary': '#0a0a0a',
    '--bg-tertiary': '#1a1a1a',
    '--accent-gradient-1': '#ffffff',
    '--accent-gradient-2': '#2630b6',
    '--glow-color-1': 'rgba(81, 112, 255, 0.4)',
    '--glow-color-2': 'rgba(81, 112, 255, 0.35)',
    '--border-color': '#333333',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
  },
  light: {
    name: 'Light',
    '--primary-color': '#5170ff',
    '--primary-light': '#4162ff',
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#cccccc',
    '--bg-tertiary': '#b8b8b8',
    '--accent-gradient-1': '#000000',
    '--accent-gradient-2': '#2630b6',
    '--glow-color-1': 'rgba(81, 112, 255, 0.25)',
    '--glow-color-2': 'rgba(81, 112, 255, 0.2)',
    '--border-color': '#888888',
    '--text-primary': '#000000',
    '--text-secondary': '#333333',
  },
  sunset: {
    name: 'Sunset',
    '--primary-color': '#ff6b35',
    '--primary-light': '#ff7b47',
    '--bg-primary': '#1a1612',
    '--bg-secondary': '#221a16',
    '--bg-tertiary': '#2a1e1a',
    '--accent-gradient-1': '#ffb085',
    '--accent-gradient-2': '#d946ef',
    '--glow-color-1': 'rgba(255, 107, 53, 0.4)',
    '--glow-color-2': 'rgba(217, 70, 239, 0.35)',
    '--border-color': '#3a2a22',
    '--text-primary': '#ffffff',
    '--text-secondary': '#cccccc',
  },
  obsidian: {
    name: 'Obsidian',
    '--primary-color': '#8b5cf6',
    '--primary-light': '#a78bfa',
    '--bg-primary': '#0a0a0a',
    '--bg-secondary': '#141414',
    '--bg-tertiary': '#1e1e1e',
    '--accent-gradient-1': '#c4b5fd',
    '--accent-gradient-2': '#7c3aed',
    '--glow-color-1': 'rgba(139, 92, 246, 0.4)',
    '--glow-color-2': 'rgba(124, 58, 237, 0.35)',
    '--border-color': '#2a2a2a',
    '--text-primary': '#ffffff',
    '--text-secondary': '#d1d5db',
  },
  icicle: {
    name: 'Icicle',
    '--primary-color': '#3b82f6',
    '--primary-light': '#60a5fa',
    '--bg-primary': '#0f1419',
    '--bg-secondary': '#1e2a3a',
    '--bg-tertiary': '#2d3748',
    '--accent-gradient-1': '#7dd3fc',
    '--accent-gradient-2': '#0ea5e9',
    '--glow-color-1': 'rgba(59, 130, 246, 0.4)',
    '--glow-color-2': 'rgba(14, 165, 233, 0.35)',
    '--border-color': '#374151',
    '--text-primary': '#ffffff',
    '--text-secondary': '#e5e7eb',
  }
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(localStorage.getItem(THEME_STORAGE_KEY) || 'default')

  const applyTheme = (themeName) => {
    if (!THEMES[themeName]) return
    
    currentTheme.value = themeName
    localStorage.setItem(THEME_STORAGE_KEY, themeName)
    
    const root = document.documentElement
    const theme = THEMES[themeName]
    
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(key, value)
      }
    })
  }

  const initializeTheme = () => {
    applyTheme(currentTheme.value)
  }

  const getAvailableThemes = () => {
    return Object.entries(THEMES).map(([key, theme]) => ({
      id: key,
      name: theme.name
    }))
  }

  return {
    currentTheme,
    applyTheme,
    initializeTheme,
    getAvailableThemes
  }
})
