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
    '--bg-primary': '#000000',
    '--bg-secondary': '#111111',
    '--bg-tertiary': '#222222',
    '--accent-gradient-1': '#444444',
    '--accent-gradient-2': '#222222',
    '--glow-color-1': 'rgba(120, 120, 120, 0.2)',
    '--glow-color-2': 'rgba(120, 120, 120, 0.1)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#bbbbbb',
    '--border-color': '#444444',
  },
  light: {
    name: 'Light',
    '--primary-color': '#2630b6',
    '--primary-light': '#1e24a0',
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f5f5f5',
    '--bg-tertiary': '#e0e0e0',
    '--accent-gradient-1': '#e0e0e0',
    '--accent-gradient-2': '#b0b0b0',
    '--glow-color-1': 'rgba(38, 48, 182, 0.08)',
    '--glow-color-2': 'rgba(38, 48, 182, 0.04)',
    '--text-primary': '#000000',
    '--text-secondary': '#222222',
    '--border-color': '#bbbbbb',
  },
  sunset: {
    name: 'Sunset',
    '--primary-color': '#ff9f43',
    '--primary-light': '#ffb6b6',
    '--bg-primary': '#ffb86b',
    '--bg-secondary': '#ff9f43',
    '--bg-tertiary': '#b86bff',
    '--accent-gradient-1': '#ff9f43',
    '--accent-gradient-2': '#b86bff',
    '--glow-color-1': 'rgba(255, 159, 67, 0.3)',
    '--glow-color-2': 'rgba(184, 107, 255, 0.2)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#f8e1ff',
    '--border-color': '#b86bff',
  },
  obsidian: {
    name: 'Obsidian',
    '--primary-color': '#8e44ad',
    '--primary-light': '#9b59b6',
    '--bg-primary': '#0b0b0b',
    '--bg-secondary': '#1a1a1a',
    '--bg-tertiary': '#2d1436',
    '--accent-gradient-1': '#8e44ad',
    '--accent-gradient-2': '#4d4d4d',
    '--glow-color-1': 'rgba(142, 68, 173, 0.3)',
    '--glow-color-2': 'rgba(142, 68, 173, 0.15)',
    '--text-primary': '#ffffff',
    '--text-secondary': '#d1b3ff',
    '--border-color': '#8e44ad',
  },
  sapphire: {
    name: 'Sapphire',
    '--primary-color': '#0b3cff',
    '--primary-light': '#5ba3ff',
    '--bg-primary': '#0a1628',
    '--bg-secondary': '#1a233a',
    '--bg-tertiary': '#223366',
    '--accent-gradient-1': '#0b3cff',
    '--accent-gradient-2': '#5ba3ff',
    '--glow-color-1': 'rgba(11, 60, 255, 0.3)',
    '--glow-color-2': 'rgba(91, 163, 255, 0.2)',
    '--text-primary': '#e0e8ff',
    '--text-secondary': '#b3c7ff',
    '--border-color': '#5ba3ff',
  },
  parrot: {
    name: 'Parrot',
    '--primary-color': '#00bcd4',
    '--primary-light': '#ffe066',
    '--bg-primary': '#eafffa',
    '--bg-secondary': '#b2fefa',
    '--bg-tertiary': '#ffe066',
    '--accent-gradient-1': '#00bcd4',
    '--accent-gradient-2': '#ffe066',
    '--glow-color-1': 'rgba(0, 188, 212, 0.2)',
    '--glow-color-2': 'rgba(255, 224, 102, 0.15)',
    '--text-primary': '#333333',
    '--text-secondary': '#ffe066',
    '--border-color': '#ffe066',
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
    '--primary-light': '#eaffb0',
    '--bg-primary': '#eaffb0',
    '--bg-secondary': '#d0ffb0',
    '--bg-tertiary': '#b0ff6d',
    '--accent-gradient-1': '#b0ff6d',
    '--accent-gradient-2': '#eaffb0',
    '--glow-color-1': 'rgba(176, 255, 109, 0.15)',
    '--glow-color-2': 'rgba(234, 255, 176, 0.12)',
    '--text-primary': '#333333',
    '--text-secondary': '#7be35a',
    '--border-color': '#b0ff6d',
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
