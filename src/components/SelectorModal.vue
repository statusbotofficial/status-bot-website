<template>
  <div v-if="isOpen" class="selector-modal-overlay" @click="handleClose">
    <div class="selector-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

      <div class="modal-search" v-if="searchable">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>

      <div class="modal-items">
        <div v-if="filteredItems.length === 0" class="no-items">
          <p>No items found</p>
        </div>

        <label v-for="item in filteredItems" :key="item.id" class="item-option">
          <input
            :type="multiple ? 'checkbox' : 'radio'"
            :name="multiple ? undefined : 'selector'"
            :value="item.id"
            v-model="selectedValues"
            class="item-input"
          />
          <div class="item-content">
            <div v-if="item.icon" class="item-icon">
              <img :src="item.icon" :alt="item.name" />
            </div>
            <div class="item-text">
              <span class="item-name">{{ item.name }}</span>
              <span v-if="item.description" class="item-desc">{{ item.description }}</span>
            </div>
          </div>
        </label>
      </div>

      <div class="modal-footer">
        <button @click="handleClose" class="btn-cancel">Cancel</button>
        <button @click="handleConfirm" class="btn-confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: true
  },
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: 'Search items...'
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const searchQuery = ref('')
const selectedValues = ref([...props.modelValue])

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.description && item.description.toLowerCase().includes(query))
  )
})

const handleConfirm = () => {
  emit('update:modelValue', selectedValues.value)
  emit('confirm', selectedValues.value)
  handleClose()
}

const handleClose = () => {
  searchQuery.value = ''
  selectedValues.value = [...props.modelValue]
  emit('close')
}
</script>

<style scoped>
.selector-modal-overlay {
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

.selector-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #5170ff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(81, 112, 255, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
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

.modal-search {
  padding: 16px 24px 0;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(80, 80, 80, 0.3);
  border: 2px solid rgba(81, 112, 255, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  background: rgba(80, 80, 80, 0.4);
  border-color: #5170ff;
  box-shadow: 0 0 20px rgba(81, 112, 255, 0.2);
}

.search-input::placeholder {
  color: #666;
}

.modal-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 380px;
}

.modal-items::-webkit-scrollbar {
  width: 6px;
}

.modal-items::-webkit-scrollbar-track {
  background: transparent;
}

.modal-items::-webkit-scrollbar-thumb {
  background: rgba(81, 112, 255, 0.3);
  border-radius: 3px;
}

.modal-items::-webkit-scrollbar-thumb:hover {
  background: rgba(81, 112, 255, 0.5);
}

.no-items {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.item-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(80, 80, 80, 0.2);
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-option:hover {
  background: rgba(80, 80, 80, 0.4);
  border-color: rgba(81, 112, 255, 0.3);
}

.item-option input:checked {
  accent-color: #5170ff;
}

.item-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #5170ff;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(81, 112, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.item-desc {
  font-size: 12px;
  color: #999;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid rgba(81, 112, 255, 0.2);
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(80, 80, 80, 0.5);
  color: #ccc;
}

.btn-cancel:hover {
  background: rgba(80, 80, 80, 0.7);
  color: #fff;
  transform: translateY(-2px);
}

.btn-confirm {
  background: linear-gradient(135deg, #5170ff, #4158d0);
  color: #fff;
  box-shadow: 0 4px 15px rgba(81, 112, 255, 0.3);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #6180ff, #5268e0);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(81, 112, 255, 0.4);
}

.btn-confirm:active {
  transform: translateY(0);
}
</style>
