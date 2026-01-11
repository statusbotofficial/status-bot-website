<template>
  <label class="toggle-switch">
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
    <div class="switch">
      <div class="dot"></div>
    </div>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.toggle-switch input {
  display: none;
}

.switch {
  width: 50px;
  height: 28px;
  background: #5170ff;
  border: 2px solid #5170ff;
  border-radius: 14px;
  padding: 2px;
  position: relative;
  transition: all 0.3s ease;
}

.dot {
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 12px;
  position: absolute;
  left: 2px;
  top: 0px;
  transition: left 0.3s ease;
}

.toggle-switch input:checked ~ .switch {
  background: #5170ff;
  border-color: #5170ff;
}

.toggle-switch input:checked ~ .switch .dot {
  left: 24px;
}

.toggle-switch input:not(:checked) ~ .switch {
  background: rgba(81, 112, 255, 0.3);
  border-color: rgba(81, 112, 255, 0.3);
}
</style>
