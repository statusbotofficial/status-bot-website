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
    '--bg-secondary': '#d5d5d5',
    '--bg-tertiary': '#c0c0c0',
    '--accent-gradient-1': '#000000',
    '--accent-gradient-2': '#2630b6',
    '--glow-color-1': 'rgba(81, 112, 255, 0.15)',
    '--glow-color-2': 'rgba(81, 112, 255, 0.1)',
    '--border-color': '#999999',
    '--text-primary': '#000000',
    '--text-secondary': '#333333',
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
