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
    '--glow-color-1': 'rgba(81, 112, 255, 0.15)',
    '--glow-color-2': 'rgba(81, 112, 255, 0.1)',
    '--border-color': '#888888',
    '--text-primary': '#000000',
    '--text-secondary': '#333333',
  },
  sunset: {
    name: 'Sunset',
    '--primary-color': '#ff6b35',
    '--primary-light': '#ff7b47',
    '--bg-primary': '#2a1810',
    '--bg-secondary': '#3d241a',
    '--bg-tertiary': '#4d2d20',
    '--accent-gradient-1': '#ffb085',
    '--accent-gradient-2': '#d946ef',
    '--glow-color-1': 'rgba(255, 107, 53, 0.4)',
    '--glow-color-2': 'rgba(217, 70, 239, 0.35)',
    '--border-color': '#5d3f2a',
    '--text-primary': '#ffb085',
    '--text-secondary': '#d4a574',
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
