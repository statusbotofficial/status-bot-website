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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.placeholders-modal {
  background: #2a2a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
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
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #fff;
}

.placeholders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.placeholder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.placeholder-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
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
  padding: 8px 12px;
  background: rgba(81, 112, 255, 0.15);
  border: 1px solid rgba(81, 112, 255, 0.3);
  border-radius: 6px;
  color: #5170ff;
  font-weight: 500;
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
  background: rgba(81, 112, 255, 0.25);
  border-color: rgba(81, 112, 255, 0.5);
}
</style>
