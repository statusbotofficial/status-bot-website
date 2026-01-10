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
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  dark: {
    name: 'Dark',
    '--primary-color': '#888888',
    '--primary-light': '#666666',
    '--bg-primary': '#0b0b0b',
    '--bg-secondary': '#000000',
    '--bg-tertiary': '#2b2b2b',
    '--accent-gradient-1': '#0b0b0b',
    '--accent-gradient-2': '#2b2b2b',
    '--glow-color-1': 'rgba(100, 100, 100, 0.2)',
    '--glow-color-2': 'rgba(100, 100, 100, 0.1)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  light: {
    name: 'Light',
    '--primary-color': '#2630b6',
    '--primary-light': '#1e24a0',
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f5f5f5',
    '--bg-tertiary': '#e0e0e0',
    '--accent-gradient-1': '#ffffff',
    '--accent-gradient-2': '#f0f0f0',
    '--glow-color-1': 'rgba(38, 48, 182, 0.2)',
    '--glow-color-2': 'rgba(38, 48, 182, 0.1)',
    '--text-primary': '#000000',
    '--text-secondary': '#333333',
    '--border-color': '#cccccc',
  },
  sunset: {
    name: 'Sunset',
    '--primary-color': '#ffb86b',
    '--primary-light': '#ff9f43',
    '--bg-primary': '#1a0f0a',
    '--bg-secondary': '#0f0805',
    '--bg-tertiary': '#2b1810',
    '--accent-gradient-1': '#ffb86b',
    '--accent-gradient-2': '#7e4bb8',
    '--glow-color-1': 'rgba(255, 184, 107, 0.3)',
    '--glow-color-2': 'rgba(126, 75, 184, 0.2)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  obsidian: {
    name: 'Obsidian',
    '--primary-color': '#9b59b6',
    '--primary-light': '#8e44ad',
    '--bg-primary': '#0b0b0b',
    '--bg-secondary': '#050505',
    '--bg-tertiary': '#1a1a1a',
    '--accent-gradient-1': '#0b0b0b',
    '--accent-gradient-2': '#4d4d4d',
    '--glow-color-1': 'rgba(155, 89, 182, 0.3)',
    '--glow-color-2': 'rgba(155, 89, 182, 0.15)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  sapphire: {
    name: 'Sapphire',
    '--primary-color': '#00b0ff',
    '--primary-light': '#0b3cff',
    '--bg-primary': '#0a1628',
    '--bg-secondary': '#050d15',
    '--bg-tertiary': '#0f1f33',
    '--accent-gradient-1': '#00b0ff',
    '--accent-gradient-2': '#0b3cff',
    '--glow-color-1': 'rgba(0, 176, 255, 0.3)',
    '--glow-color-2': 'rgba(11, 60, 255, 0.25)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  parrot: {
    name: 'Parrot',
    '--primary-color': '#69f0ae',
    '--primary-light': '#00bcd4',
    '--bg-primary': '#0a1515',
    '--bg-secondary': '#050a0a',
    '--bg-tertiary': '#0f1f1f',
    '--accent-gradient-1': '#69f0ae',
    '--accent-gradient-2': '#00bcd4',
    '--glow-color-1': 'rgba(105, 240, 174, 0.3)',
    '--glow-color-2': 'rgba(0, 188, 212, 0.25)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  icicle: {
    name: 'Icicle',
    '--primary-color': '#8ec5ff',
    '--primary-light': '#5ba3ff',
    '--bg-primary': '#0a1420',
    '--bg-secondary': '#050a10',
    '--bg-tertiary': '#0f1828',
    '--accent-gradient-1': '#e0f7fa',
    '--accent-gradient-2': '#8ec5ff',
    '--glow-color-1': 'rgba(142, 197, 255, 0.3)',
    '--glow-color-2': 'rgba(91, 163, 255, 0.2)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
  lime: {
    name: 'Lime',
    '--primary-color': '#b0ff6d',
    '--primary-light': '#7be35a',
    '--bg-primary': '#0f1505',
    '--bg-secondary': '#080a03',
    '--bg-tertiary': '#1a2210',
    '--accent-gradient-1': '#b0ff6d',
    '--accent-gradient-2': '#7be35a',
    '--glow-color-1': 'rgba(176, 255, 109, 0.3)',
    '--glow-color-2': 'rgba(123, 227, 90, 0.2)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
  },
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
