<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content nickname-modal" @click.stop>
      <div class="modal-header">
        <h3>✨ Change Your Nickname</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-body">
        <p class="modal-subtitle">You've purchased a nickname change! Enter the nickname you'd like to use.</p>

        <div class="form-group">
          <label>New Nickname</label>
          <input
            v-model="nicknameInput"
            type="text"
            placeholder="Enter your new nickname (1-32 characters)"
            maxlength="32"
            @keyup.enter="submitNickname"
            ref="nicknameInput"
          />
          <div class="char-count">
            {{ nicknameInput.length }}/32
          </div>
        </div>

        <div class="info-box">
          <i class="fas fa-info-circle"></i>
          <span>Nicknames must be 1-32 characters. Inappropriate nicknames may be reset by admins.</span>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="btn-cancel">Cancel</button>
        <button
          @click="submitNickname"
          class="btn-submit"
          :disabled="!nicknameInput.trim() || isSubmitting"
        >
          {{ isSubmitting ? 'Applying...' : 'Apply Nickname' }}
        </button>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  guildId: String,
  userId: String,
  purchaseId: String
})

const emit = defineEmits(['close', 'success'])

const BACKEND_URL = 'https://status-bot-backend.onrender.com'
const BACKEND_SECRET = 'status-bot-stats-secret-key'

const nicknameInput = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nicknameInput.value = ''
    errorMessage.value = ''
    successMessage.value = ''
    setTimeout(() => {
      nicknameInput.value?.focus()
    }, 100)
  }
})

const close = () => {
  emit('close')
}

const submitNickname = async () => {
  if (!nicknameInput.value.trim()) {
    errorMessage.value = 'Please enter a nickname'
    return
  }

  if (nicknameInput.value.length < 1 || nicknameInput.value.length > 32) {
    errorMessage.value = 'Nickname must be between 1 and 32 characters'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Send nickname to backend via bot command
    const response = await fetch(`${BACKEND_URL}/api/shop/${props.guildId}/purchases/${props.purchaseId}/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BACKEND_SECRET}`
      },
      body: JSON.stringify({
        nickname: nicknameInput.value,
        user_id: props.userId
      })
    })

    if (response.ok) {
      successMessage.value = 'Nickname applied successfully! You may need to refresh Discord.'
      setTimeout(() => {
        emit('success')
        close()
      }, 1500)
    } else {
      const data = await response.json()
      errorMessage.value = data.error || 'Failed to apply nickname. Please try again.'
    }
  } catch (err) {
    console.error('Error submitting nickname:', err)
    errorMessage.value = 'An error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.15);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-subtitle {
  font-size: 14px;
  color: #aaa;
  margin: 0;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #ddd;
}

.form-group input {
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(81, 112, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(81, 112, 255, 0.5);
  background: rgba(81, 112, 255, 0.05);
  box-shadow: 0 0 8px rgba(81, 112, 255, 0.1);
}

.char-count {
  font-size: 11px;
  color: #666;
  text-align: right;
}

.info-box {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #7dd3fc;
  font-size: 12px;
  line-height: 1.4;
}

.info-box i {
  min-width: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(81, 112, 255, 0.15);
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(81, 112, 255, 0.2);
  color: #aaa;
}

.btn-cancel:hover {
  background: rgba(81, 112, 255, 0.1);
  color: #ddd;
}

.btn-submit {
  background: linear-gradient(135deg, #5170ff 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(81, 112, 255, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  padding: 0 24px 12px;
  text-align: center;
  animation: slideDown 0.2s ease;
}

.success-message {
  color: #22c55e;
  font-size: 12px;
  padding: 0 24px 12px;
  text-align: center;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
