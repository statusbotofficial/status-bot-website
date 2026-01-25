<template>
  <div v-if="isOpen" class="placeholders-modal-overlay" @click="$emit('close')">
    <div class="placeholders-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="placeholders-list">
        <div v-for="placeholder in placeholders" :key="placeholder.name" class="placeholder-item">
          <div class="placeholder-info">
            <code class="placeholder-name">{{ placeholder.name }}</code>
            <p class="placeholder-description">{{ placeholder.description }}</p>
          </div>
          <button @click="copyPlaceholder(placeholder.name)" class="copy-btn">
            <i class="fas fa-copy"></i>
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Available Placeholders'
  },
  placeholders: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])

const copyPlaceholder = (placeholder) => {
  navigator.clipboard.writeText(placeholder).then(() => {
    // The button feedback is handled at the template level
  })
}
</script>

<style scoped>
.placeholders-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.placeholders-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #5170ff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(81, 112, 255, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(81, 112, 255, 0.2);
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: text-shadow 0.2s ease;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: -2px;
}

.close-btn:hover {
  text-shadow: 0 0 10px rgba(81, 112, 255, 0.6);
}

.placeholders-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
}

.placeholders-list::-webkit-scrollbar {
  width: 6px;
}

.placeholders-list::-webkit-scrollbar-track {
  background: transparent;
}

.placeholders-list::-webkit-scrollbar-thumb {
  background: rgba(81, 112, 255, 0.3);
  border-radius: 3px;
}

.placeholders-list::-webkit-scrollbar-thumb:hover {
  background: rgba(81, 112, 255, 0.5);
}

.placeholder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(80, 80, 80, 0.2);
  border: 1px solid transparent;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.placeholder-item:hover {
  background: rgba(80, 80, 80, 0.4);
  border-color: rgba(81, 112, 255, 0.3);
}

.placeholder-info {
  flex: 1;
}

.placeholder-name {
  display: block;
  color: #5170ff;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  background: rgba(81, 112, 255, 0.15);
  padding: 4px 8px;
  border-radius: 4px;
  width: fit-content;
}

.placeholder-description {
  color: #999;
  font-size: 13px;
  margin: 4px 0 0 0;
}

.copy-btn {
  padding: 8px 16px;
  background: rgba(80, 80, 80, 0.5);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 8px;
  color: #ccc;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: rgba(80, 80, 80, 0.7);
  color: #fff;
  transform: translateY(-2px);
  border-color: rgba(81, 112, 255, 0.5);
}

.copy-btn:active {
  transform: translateY(0);
}
</style>
