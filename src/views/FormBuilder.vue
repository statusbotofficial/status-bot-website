<template>
  <div class="form-builder-container">
    <div class="builder-header">
      <div class="header-content">
        <h1>Staff Application Form Builder</h1>
        <p>Create custom staff application forms</p>
      </div>
      <div class="header-actions">
        <button v-if="forms.length > 0" class="btn-secondary" @click="showFormsList = true">
          View Forms
        </button>
        <button class="btn-primary" @click="createNewForm">
          New Form
        </button>
      </div>
    </div>

    <!-- Forms List Modal -->
    <div v-if="showFormsList" class="modal-overlay" @click="showFormsList = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Your Forms</h2>
          <button class="close-btn" @click="showFormsList = false">✕</button>
        </div>
        <div v-if="forms.length > 0" class="forms-list">
          <div v-for="form in forms" :key="form.id" class="form-item">
            <div class="form-info">
              <h3>{{ form.title }}</h3>
              <p>{{ form.description }}</p>
              <span class="form-meta">{{ form.questions.length }} questions • Created {{ formatDate(form.createdAt) }}</span>
            </div>
            <div class="form-actions">
              <button class="btn-small" @click="editForm(form)">Edit</button>
              <button class="btn-small" @click="duplicateForm(form)">Duplicate</button>
              <button class="btn-small-danger" @click="deleteForm(form.id)">Delete</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No forms yet. Create one to get started!</p>
        </div>
      </div>
    </div>

    <!-- Form Editor -->
    <div v-if="currentForm" class="form-editor">
      <div class="editor-left">
        <div class="form-settings">
          <h3>Form Details</h3>
          <div class="form-group">
            <label>Form Title</label>
            <input v-model="currentForm.title" type="text" class="input-field">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="currentForm.description" class="textarea-field" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>
              <input v-model="currentForm.requiresApproval" type="checkbox" class="checkbox-field">
              <span>Require approval to submit</span>
            </label>
          </div>
          <button class="btn-primary btn-full" @click="saveForm">Save Form</button>
        </div>
      </div>

      <div class="editor-right">
        <div class="preview-section">
          <h3>Questions</h3>
          <div class="add-question-btn">
            <button @click="addQuestion">+ Add Question</button>
          </div>

          <div class="questions-list">
            <div 
              v-for="(question, index) in currentForm.questions" 
              :key="question.id"
              class="question-item"
              :class="{ active: selectedQuestion === index }"
              @click="selectedQuestion = index"
            >
              <div class="question-header">
                <span class="question-number">Q{{ index + 1 }}</span>
                <span class="question-type">{{ question.type }}</span>
              </div>
              <p class="question-preview">{{ question.text || 'Untitled question' }}</p>
              <button class="remove-question-btn" @click.stop="removeQuestion(index)">✕</button>
            </div>
          </div>
        </div>

        <!-- Question Editor -->
        <div v-if="selectedQuestion !== null" class="question-editor">
          <h3>Edit Question</h3>
          <div class="form-group">
            <label>Question Text</label>
            <input 
              v-model="currentForm.questions[selectedQuestion].text" 
              type="text"
              class="input-field"
              placeholder="Enter your question"
            >
          </div>

          <div class="form-group">
            <label>Answer Type</label>
            <select v-model="currentForm.questions[selectedQuestion].type" class="select-field">
              <option value="short">Short Text</option>
              <option value="long">Long Text</option>
              <option value="multiple">Multiple Choice</option>
              <option value="checkbox">Checkboxes</option>
              <option value="dropdown">Dropdown</option>
              <option value="rating">Rating (1-5)</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div v-if="['multiple', 'checkbox', 'dropdown'].includes(currentForm.questions[selectedQuestion].type)" class="form-group">
            <label>Options (one per line)</label>
            <textarea 
              :value="currentForm.questions[selectedQuestion].options.join('\n')"
              @input="updateOptions"
              class="textarea-field"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              <input 
                v-model="currentForm.questions[selectedQuestion].required" 
                type="checkbox"
                class="checkbox-field"
              >
              <span>Required</span>
            </label>
          </div>

          <div class="form-group">
            <label>
              <input 
                v-model="currentForm.questions[selectedQuestion].showInReview" 
                type="checkbox"
                class="checkbox-field"
              >
              <span>Show in staff review</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-large">
      <div class="empty-icon">📋</div>
      <h2>Create Your First Form</h2>
      <p>Build a custom staff application form to collect responses from potential staff members.</p>
      <button class="btn-primary btn-large" @click="createNewForm">Get Started</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE_URL } from '../config'

const authStore = useAuthStore()
const forms = ref([])
const currentForm = ref(null)
const selectedQuestion = ref(null)
const showFormsList = ref(false)

const createNewForm = () => {
  currentForm.value = {
    id: Date.now(),
    title: 'New Staff Application',
    description: 'Application form for staff positions',
    questions: [],
    requiresApproval: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  selectedQuestion.value = null
  showFormsList.value = false
  addQuestion()
}

const addQuestion = () => {
  if (!currentForm.value) return
  currentForm.value.questions.push({
    id: Date.now(),
    text: '',
    type: 'short',
    options: [],
    required: false,
    showInReview: true,
  })
  selectedQuestion.value = currentForm.value.questions.length - 1
}

const removeQuestion = (index) => {
  currentForm.value.questions.splice(index, 1)
  if (selectedQuestion.value === index) {
    selectedQuestion.value = currentForm.value.questions.length > 0 ? currentForm.value.questions.length - 1 : null
  }
}

const updateOptions = (event) => {
  const options = event.target.value.split('\n').filter(opt => opt.trim())
  currentForm.value.questions[selectedQuestion.value].options = options
}

const saveForm = async () => {
  if (!currentForm.value.title.trim()) {
    alert('Please enter a form title')
    return
  }

  if (currentForm.value.questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(currentForm.value),
    })

    if (response.ok) {
      const savedForm = await response.json()
      const existingIndex = forms.value.findIndex(f => f.id === currentForm.value.id)
      if (existingIndex >= 0) {
        forms.value[existingIndex] = savedForm
      } else {
        forms.value.push(savedForm)
      }
      alert('Form saved successfully!')
      currentForm.value = null
      selectedQuestion.value = null
    } else {
      alert('Failed to save form')
    }
  } catch (error) {
    console.error('Error saving form:', error)
    alert('Error saving form')
  }
}

const editForm = (form) => {
  currentForm.value = JSON.parse(JSON.stringify(form))
  selectedQuestion.value = null
  showFormsList.value = false
}

const duplicateForm = async (form) => {
  const newForm = JSON.parse(JSON.stringify(form))
  newForm.id = Date.now()
  newForm.title = `${form.title} (Copy)`
  newForm.createdAt = new Date().toISOString()
  newForm.updatedAt = new Date().toISOString()
  
  currentForm.value = newForm
  selectedQuestion.value = null
  showFormsList.value = false
}

const deleteForm = async (formId) => {
  if (!confirm('Are you sure you want to delete this form?')) return

  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/forms/${formId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      forms.value = forms.value.filter(f => f.id !== formId)
      alert('Form deleted successfully')
    }
  } catch (error) {
    console.error('Error deleting form:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const loadForms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/forms`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      forms.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading forms:', error)
  }
}

onMounted(() => {
  loadForms()
})
</script>

<style scoped>
.form-builder-container {
  min-height: calc(100vh - 150px);
  padding: 40px 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 30px;
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header-content p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.empty-state-large {
  text-align: center;
  padding: 100px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state-large h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.empty-state-large p {
  color: var(--text-secondary);
  max-width: 500px;
  margin-bottom: 30px;
}

.form-editor {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
}

.editor-left {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  height: fit-content;
}

.form-settings h3 {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.input-field,
.textarea-field,
.select-field {
  width: 100%;
  padding: 10px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
}

.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  outline: none;
  border-color: var(--primary-color);
}

.checkbox-field {
  margin-right: 8px;
  cursor: pointer;
}

.form-group label span {
  cursor: pointer;
}

.btn-full {
  width: 100%;
}

.preview-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
}

.preview-section h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.add-question-btn {
  margin-bottom: 20px;
}

.add-question-btn button {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-question-btn button:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-item {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.question-item:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.question-item.active {
  border-color: var(--primary-color);
  background: rgba(81, 112, 255, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.question-number {
  font-weight: 600;
  color: var(--primary-color);
}

.question-type {
  font-size: 0.85rem;
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--text-secondary);
}

.question-preview {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-question-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.remove-question-btn:hover {
  color: #ff6b6b;
}

.question-editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
}

.question-editor h3 {
  margin-bottom: 20px;
}

/* Modal Styles */
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
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
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
  padding: 25px;
  border-bottom: 1px solid var(--border-color);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.forms-list {
  padding: 20px;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.form-item:hover {
  border-color: var(--primary-color);
  background: var(--bg-tertiary);
}

.form-info h3 {
  margin-bottom: 5px;
}

.form-info p {
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

/* Button Styles */
.btn-primary,
.btn-secondary,
.btn-small,
.btn-small-danger {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.9rem;
  background: var(--primary-color);
  color: white;
}

.btn-small:hover {
  background: var(--primary-light);
}

.btn-small-danger {
  background: #ff6b6b;
  color: white;
}

.btn-small-danger:hover {
  background: #ff5252;
}

.btn-large {
  padding: 15px 40px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .form-builder-container {
    padding: 20px;
  }

  .builder-header {
    flex-direction: column;
  }

  .form-editor {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }
}
</style>
