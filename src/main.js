import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

const createMemoryStorage = () => {
	const store = new Map()
	return {
		getItem: (key) => (store.has(key) ? store.get(key) : null),
		setItem: (key, value) => {
			store.set(key, String(value))
		},
		removeItem: (key) => {
			store.delete(key)
		},
		clear: () => {
			store.clear()
		}
	}
}

const ensureLocalStorage = () => {
	if (typeof window === 'undefined') return

	try {
		const testKey = '__storage_test__'
		window.localStorage.setItem(testKey, testKey)
		window.localStorage.removeItem(testKey)
	} catch (err) {
		const memoryStorage = createMemoryStorage()
		try {
			Object.defineProperty(window, 'localStorage', {
				value: memoryStorage,
				configurable: true
			})
		} catch (defineErr) {
			try {
				window.localStorage.getItem = memoryStorage.getItem
				window.localStorage.setItem = memoryStorage.setItem
				window.localStorage.removeItem = memoryStorage.removeItem
				window.localStorage.clear = memoryStorage.clear
			} catch (patchErr) {
				// Ignore if the environment prevents storage patching
			}
		}
	}
}

// Some embedders sandbox the iframe and block storage APIs.
ensureLocalStorage()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
