<template>
  <div class="support-wrapper">
    <!-- Original Support Section -->
    <div class="support-section-old">
      <div class="support-container">
        <div class="support-header">
          <h1>Status Bot Support</h1>
          <p>Ask our AI support for help, or get help from a staff member in the <a href="https://discord.gg/Kd2MckVxED" style="color: var(--primary-color); text-decoration: none; border-bottom: 1px solid var(--primary-color);">Status Bot Support Server</a></p>
        </div>
      </div>
    </div>

    <!-- AI Chat Section -->
    <div class="support-section-chat">
      <div class="support-container">
        <div class="chat-header">
          <h2>AI Support Chat</h2>
          <p v-if="!isLoggedIn" class="login-required">Please log in to use the support chat</p>
        </div>

        <div class="support-chat-box">
          <div class="support-chat-area" id="chatArea">
            <div v-if="!isLoggedIn" class="chat-login-message">
              <p>Please log in to start chatting with our AI support</p>
            </div>
            <div v-else-if="messages.length === 0" class="chat-welcome">
              <p>Welcome to Status Bot Support! Ask me anything about Status Bot, and I'll help you out.</p>
            </div>
            <div v-for="(msg, idx) in messages" :key="idx" class="chat-message" :class="msg.sender">
              <div class="message-content" :class="msg.sender" v-html="msg.text"></div>
            </div>
          </div>

          <div class="support-input-container">
            <textarea 
              v-model="inputMessage"
              class="support-input"
              :class="{ disabled: !isLoggedIn }"
              placeholder="Ask anything"
              rows="1"
              :disabled="!isLoggedIn"
              @keydown.enter.prevent="!$event.shiftKey && isLoggedIn && sendMessage()"
            ></textarea>
            <button class="support-send-btn" @click="sendMessage" :disabled="!isLoggedIn || isLoading || !inputMessage.trim()" title="Send message">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.9702544,11.6889879 22.9702544,11.6889879 22.9702544,11.6889879 L4.13399899,1.1543831 C3.34915502,0.9051845 2.40734225,1.0122819 1.77946707,1.4835739 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5451061 3.19218622,10.7022035 3.50612381,10.7022035 L16.6915026,11.4876905 C16.6915026,11.4876905 17.1624089,11.4876905 17.1624089,11.4876905 C17.1624089,11.4876905 17.9268649,11.4876905 17.9268649,10.7024851 L17.9268649,12.6315722 C17.9268649,12.6315722 17.1624089,12.4744748 16.6915026,12.4744748 Z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Support Links -->
        <div class="support-links-section">
          <div class="support-links-grid">
            <div class="support-link-card">
              <h3>Discord Server</h3>
              <p>Join our community Discord server for support and discussions.</p>
              <a href="https://discord.gg/Kd2MckVxED" target="_blank" class="link-btn">Join Discord</a>
            </div>
            <div class="support-link-card">
              <h3>Email Support</h3>
              <p>Need direct assistance? Email us for priority support.</p>
              <a href="mailto:statusbotofficial@gmail.com" class="link-btn">Email Us</a>
            </div>
            <div class="support-link-card">
              <h3>Documentation</h3>
              <p>Read our comprehensive documentation and guides.</p>
              <a href="https://status-bot.xyz/docs" target="_blank" class="link-btn">View Docs</a>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-items">
            <div class="faq-item" v-for="item in faqs" :key="item.id" @click="item.open = !item.open">
              <h4>{{ item.question }}</h4>
              <p v-if="item.open" class="answer">{{ item.answer }}</p>
              <span class="toggle">{{ item.open ? '−' : '+' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const chatAreaEl = ref(null)

const faqs = ref([
  {
    id: 1,
    question: 'How do I invite Status Bot to my server?',
    answer: 'Click the "Invite" button on the navigation menu. You\'ll be taken to Discord\'s authorization page where you can select which server to add the bot to.',
    open: false
  },
  {
    id: 2,
    question: 'Is Status Bot free?',
    answer: 'Yes! Status Bot has a free tier with core features including status tracking, leveling system, and economy commands. We also offer a Premium plan for additional features and perks.',
    open: false
  },
  {
    id: 3,
    question: 'How do I report a bug?',
    answer: 'Please report bugs in our Discord server or via the support chat. Include as much detail as possible about what happened and how to reproduce the issue.',
    open: false
  },
  {
    id: 4,
    question: 'How do I get help with a command?',
    answer: 'You can use the /help command in your Discord server to view all available commands. You can also check our documentation or ask in the support chat.',
    open: false
  }
])

const BACKEND_URL = 'https://status-bot-backend.onrender.com'
const CHAT_STORAGE_KEY = 'supportChatHistory'
const CHAT_STORAGE_USER_KEY = (userId) => `${CHAT_STORAGE_KEY}_${userId}`

// Load chat history
const loadChatHistory = () => {
  if (!isLoggedIn.value || !authStore.user) return
  
  const storageKey = CHAT_STORAGE_USER_KEY(authStore.user.id)
  const saved = localStorage.getItem(storageKey)
  
  if (saved) {
    try {
      messages.value = JSON.parse(saved)
      setTimeout(() => scrollChatToBottom(), 100)
    } catch (e) {
      console.error('Error loading chat history:', e)
      messages.value = []
    }
  }
}

// Save chat history
const saveChatHistory = () => {
  if (!isLoggedIn.value || !authStore.user) return
  
  const storageKey = CHAT_STORAGE_USER_KEY(authStore.user.id)
  localStorage.setItem(storageKey, JSON.stringify(messages.value))
}

// Scroll chat to bottom
const scrollChatToBottom = () => {
  const chatArea = document.getElementById('chatArea')
  if (chatArea) {
    chatArea.scrollTop = chatArea.scrollHeight
  }
}

// Send message
const sendMessage = async () => {
  if (!isLoggedIn.value) return
  
  const text = inputMessage.value.trim()
  if (!text || isLoading.value) return

  // Add user message
  messages.value.push({
    text: text,
    sender: 'user'
  })
  inputMessage.value = ''
  isLoading.value = true
  
  setTimeout(() => scrollChatToBottom(), 50)
  saveChatHistory()

  try {
    const response = await fetch(`${BACKEND_URL}/api/support/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })

    if (!response.ok) throw new Error('Failed to get response')

    const data = await response.json()
    let aiResponse = data.reply || 'Sorry, I encountered an error. Please try again or contact support at our Discord server.'
    
    // Style all links with gradient text
    aiResponse = aiResponse.replace(/<a\s+([^>]*?)href=["']([^"']*)["']([^>]*?)>/gi, 
      '<a href="$2" style="background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; font-weight: 600;" $1 $3>')
    
    messages.value.push({
      text: aiResponse,
      sender: 'ai'
    })
    saveChatHistory()
  } catch (error) {
    console.error('Error getting AI response:', error)
    messages.value.push({
      text: 'Sorry, I encountered an error. Please try again or contact support at our <a href="https://discord.gg/Kd2MckVxED" target="_blank" style="background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; font-weight: 600;">Discord server</a>.',
      sender: 'ai'
    })
    saveChatHistory()
  } finally {
    isLoading.value = false
    setTimeout(() => scrollChatToBottom(), 50)
  }
}

// Load chat when logged in
watch(() => isLoggedIn.value, (newVal) => {
  if (newVal) {
    loadChatHistory()
  } else {
    messages.value = []
  }
}, { immediate: true })

onMounted(() => {
  loadChatHistory()
})
</script>

<style scoped>
.support-wrapper {
  width: 100%;
}

.support-section-old {
  padding: 60px 50px;
  background: linear-gradient(180deg, rgba(81, 112, 255, 0.05) 0%, rgba(81, 112, 255, 0.02) 100%);
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.support-section-chat {
  padding: 60px 50px;
  min-height: calc(100vh - 400px);
}

.support-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.support-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.support-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
}

.support-header p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.chat-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  width: 100%;
}

.chat-header h2 {
  font-size: 42px;
  font-weight: 900;
  margin: 0;
}

.login-required {
  font-size: 16px;
  color: var(--primary-color);
  margin: 0;
  font-weight: 600;
}

.login-prompt {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: var(--text-secondary);
}

.support-chat-box {
  width: 100%;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.4), rgba(81, 112, 255, 0.25));
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.support-chat-area {
  width: 100%;
  height: 320px;
  background-color: transparent;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.support-chat-area::-webkit-scrollbar {
  width: 8px;
}

.support-chat-area::-webkit-scrollbar-track {
  background: transparent;
}

.support-chat-area::-webkit-scrollbar-thumb {
  background: rgba(81, 112, 255, 0.6);
  border-radius: 4px;
}

.support-chat-area::-webkit-scrollbar-thumb:hover {
  background: rgba(81, 112, 255, 0.8);
}

.chat-welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--text-secondary);
  font-size: 16px;
}

.chat-login-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--text-secondary);
  font-size: 16px;
}

.support-links-section {
  width: 100%;
  margin-top: 40px;
}

.support-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  width: 100%;
}

.support-link-card {
  background-color: rgba(81, 112, 255, 0.05);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.support-link-card:hover {
  background-color: rgba(81, 112, 255, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(81, 112, 255, 0.15);
}

.support-link-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.support-link-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.link-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 2px solid var(--primary-color);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.link-btn:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 8px 20px rgba(81, 112, 255, 0.3);
}

.faq-section {
  width: 100%;
  margin-top: 60px;
}

.faq-section h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 30px 0;
  text-align: center;
}

.faq-items {
  display: grid;
  gap: 15px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.faq-item {
  background-color: rgba(81, 112, 255, 0.05);
  border: 2px solid var(--primary-color);
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.faq-item:hover {
  background-color: rgba(81, 112, 255, 0.1);
}

.faq-item h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

.faq-item .toggle {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 18px;
  color: var(--primary-color);
  font-weight: bold;
}

.faq-item .answer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(81, 112, 255, 0.3);
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.support-input {
  flex: 1;
  background-color: rgba(81, 112, 255, 0.1);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  padding: 12px 18px;
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: 'Fredoka', inherit;
  resize: none;
  max-height: 100px;
  overflow: hidden;
  vertical-align: middle;
}

.support-input.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-message {
  display: flex;
  gap: 10px;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.ai {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
}

.message-content.user {
  background-color: rgba(81, 112, 255, 0.4);
  border: 1px solid var(--primary-color);
  color: #fff;
}

.message-content.ai {
  background-color: rgba(50, 50, 70, 0.6);
  border: 1px solid #444;
  color: #fff;
}

.support-input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.support-input {
  flex: 1;
  background-color: rgba(81, 112, 255, 0.1);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  padding: 12px 18px;
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: 'Fredoka', inherit;
  resize: none;
  max-height: 100px;
  overflow: hidden;
  vertical-align: middle;
}

.support-input::placeholder {
  color: #888;
}

.support-input:focus {
  outline: none;
  background-color: rgba(81, 112, 255, 0.2);
  box-shadow: 0 0 15px rgba(81, 112, 255, 0.6);
}

.support-send-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 28px;
  height: 52px;
  width: 52px;
}

.support-send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  color: #fff;
}

.support-send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.support-send-btn:disabled {
  color: #555;
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .support-section-old {
    padding: 50px 30px;
  }

  .support-section-chat {
    padding: 50px 30px;
  }

  .support-header h1 {
    font-size: 44px;
  }

  .chat-header h2 {
    font-size: 36px;
  }

  .support-chat-box {
    padding: 30px;
    gap: 25px;
  }

  .support-chat-area {
    height: 280px;
  }

  .support-links-grid {
    gap: 20px;
  }

  .faq-section h2 {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .support-section-old {
    padding: 40px 20px;
  }

  .support-section-chat {
    padding: 40px 20px;
    min-height: calc(100vh - 300px);
  }

  .support-header h1 {
    font-size: 32px;
  }

  .support-header p {
    font-size: 14px;
  }

  .chat-header h2 {
    font-size: 28px;
  }

  .support-chat-box {
    padding: 25px;
    gap: 20px;
  }

  .support-chat-area {
    height: 240px;
  }

  .message-content {
    max-width: 85%;
    font-size: 13px;
  }

  .support-input {
    padding: 12px 15px;
    font-size: 14px;
  }

  .support-send-btn {
    height: 48px;
    width: 48px;
    font-size: 22px;
  }

  .support-links-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .support-link-card {
    padding: 20px;
  }

  .faq-section {
    margin-top: 40px;
  }

  .faq-section h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .faq-item {
    padding: 18px;
  }

  .faq-item h4 {
    font-size: 15px;
  }

  .faq-item .toggle {
    right: 15px;
    top: 15px;
  }

  .faq-item .answer {
    font-size: 13px;
    margin-top: 12px;
    padding-top: 12px;
  }
}

@media (max-width: 480px) {
  .support-section-old {
    padding: 30px 15px;
  }

  .support-section-chat {
    padding: 30px 15px;
  }

  .support-header h1 {
    font-size: 26px;
  }

  .support-header p {
    font-size: 13px;
  }

  .chat-header h2 {
    font-size: 22px;
  }

  .support-chat-box {
    padding: 20px;
    gap: 18px;
  }

  .support-chat-area {
    height: 200px;
  }

  .message-content {
    max-width: 90%;
    font-size: 13px;
    padding: 10px 14px;
  }

  .support-input {
    padding: 10px 12px;
    font-size: 13px;
  }

  .support-send-btn {
    height: 44px;
    width: 44px;
    font-size: 20px;
  }

  .login-prompt {
    padding: 40px 15px;
  }

  .support-links-grid {
    gap: 15px;
  }

  .support-link-card {
    padding: 18px;
  }

  .support-link-card h3 {
    font-size: 16px;
  }

  .support-link-card p {
    font-size: 13px;
  }

  .link-btn {
    padding: 9px 18px;
    font-size: 13px;
  }

  .faq-section {
    margin-top: 30px;
  }

  .faq-section h2 {
    font-size: 20px;
    margin-bottom: 18px;
  }

  .faq-items {
    gap: 12px;
  }

  .faq-item {
    padding: 16px;
  }

  .faq-item h4 {
    font-size: 14px;
  }

  .faq-item .toggle {
    right: 12px;
    top: 12px;
    font-size: 16px;
  }

  .faq-item .answer {
    font-size: 12px;
    margin-top: 10px;
    padding-top: 10px;
  }
}
</style>
