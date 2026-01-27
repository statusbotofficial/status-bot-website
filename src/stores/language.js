import { defineStore } from 'pinia'
import { ref } from 'vue'

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.commands': 'Commands',
    'nav.premium': 'Premium',
    'nav.support': 'Support',
    'nav.invite': 'Invite',
    'nav.status': 'Status',
    'nav.servers': 'Servers',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.leaderboard': 'Leaderboard',
    'dashboard.totalXp': 'Total XP',
    'dashboard.totalCurrency': 'Total Currency',
    'dashboard.members': 'Members',
    'dashboard.yourRank': 'Your Rank',
    'dashboard.level': 'Level',
    'dashboard.howXpWorks': 'How XP works',
    'dashboard.howXpWorksText': 'First to enable the XP system go to the Leveling section, toggle in on. Then set up your preferences for the XP rewards. Then, when a user sends a message, or spends time in a voice chat, they earn XP.',
    'dashboard.selectServer': 'Select a Server',
    'dashboard.botLanguage': 'Bot Language',
    'dashboard.languageNote': 'This will change the bot\'s responses and website language for you.',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account, preferences, and Status Bot experience',
    'settings.accountInfo': 'Account Info',
    'settings.premium': 'Premium',
    'settings.notifications': 'Notifications',
    'settings.appearance': 'Appearance',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.loginRequired': 'Please log in to use this feature',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.commands': 'Comandos',
    'nav.premium': 'Premium',
    'nav.support': 'Soporte',
    'nav.invite': 'Invitar',
    'nav.status': 'Estado',
    'nav.servers': 'Servidores',
    'nav.settings': 'Configuración',
    
    // Dashboard
    'dashboard.overview': 'Resumen',
    'dashboard.leaderboard': 'Tabla de clasificación',
    'dashboard.totalXp': 'XP Total',
    'dashboard.totalCurrency': 'Moneda Total',
    'dashboard.members': 'Miembros',
    'dashboard.yourRank': 'Tu Rango',
    'dashboard.level': 'Nivel',
    'dashboard.howXpWorks': 'Cómo funciona la XP',
    'dashboard.howXpWorksText': 'Primero para habilitar el sistema de XP ve a la sección de Nivelación, actívalo. Luego configura tus preferencias para las recompensas de XP. Entonces, cuando un usuario envía un mensaje o pasa tiempo en un chat de voz, gana XP.',
    'dashboard.selectServer': 'Seleccionar un Servidor',
    'dashboard.botLanguage': 'Idioma del Bot',
    'dashboard.languageNote': 'Esto cambiará las respuestas del bot y el idioma del sitio web para ti.',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Administra tu cuenta, preferencias y experiencia de Status Bot',
    'settings.accountInfo': 'Información de la Cuenta',
    'settings.premium': 'Premium',
    'settings.notifications': 'Notificaciones',
    'settings.appearance': 'Apariencia',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.loginRequired': 'Por favor inicia sesión para usar esta función',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.commands': 'Commandes',
    'nav.premium': 'Premium',
    'nav.support': 'Support',
    'nav.invite': 'Inviter',
    'nav.status': 'Statut',
    'nav.servers': 'Serveurs',
    'nav.settings': 'Paramètres',
    
    // Dashboard
    'dashboard.overview': 'Aperçu',
    'dashboard.leaderboard': 'Classement',
    'dashboard.totalXp': 'XP Total',
    'dashboard.totalCurrency': 'Devise Totale',
    'dashboard.members': 'Membres',
    'dashboard.yourRank': 'Votre Rang',
    'dashboard.level': 'Niveau',
    'dashboard.howXpWorks': 'Comment fonctionne l\'XP',
    'dashboard.howXpWorksText': 'D\'abord pour activer le système d\'XP, allez dans la section Nivelage, activez-le. Ensuite, configurez vos préférences pour les récompenses d\'XP. Alors, quand un utilisateur envoie un message ou passe du temps dans un chat vocal, il gagne de l\'XP.',
    'dashboard.selectServer': 'Sélectionner un Serveur',
    'dashboard.botLanguage': 'Langue du Bot',
    'dashboard.languageNote': 'Ceci changera les réponses du bot et la langue du site web pour vous.',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Gérez votre compte, préférences et expérience Status Bot',
    'settings.accountInfo': 'Informations du Compte',
    'settings.premium': 'Premium',
    'settings.notifications': 'Notifications',
    'settings.appearance': 'Apparence',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.success': 'Succès',
    'common.error': 'Erreur',
    'common.loginRequired': 'Veuillez vous connecter pour utiliser cette fonction',
  }
}

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref(localStorage.getItem('userLanguage') || 'en')
  
  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('userLanguage', lang)
    }
  }
  
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage.value]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    
    // Fallback to English if translation not found
    if (value === undefined) {
      let fallback = translations.en
      for (const k of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = fallback[k]
        } else {
          fallback = key // Return key if no translation found
          break
        }
      }
      value = fallback
    }
    
    return value || key
  }
  
  const getSupportedLanguages = () => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ]
  }
  
  return {
    currentLanguage,
    setLanguage,
    t,
    getSupportedLanguages
  }
})