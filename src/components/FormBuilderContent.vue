<template>
  <div class="builder-wrapper">
    <div v-if="!canCreateForms()" class="access-denied">
      <div class="denied-icon">🔒</div>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>

    <template v-else>
      <div v-if="!currentForm" class="forms-list-view">
      <div class="list-header">
        <h1>Form Builder</h1>
        <button class="btn-primary" @click="createNewForm">Create Form</button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading forms...</p>
      </div>

      <div v-else-if="forms.length === 0" class="empty-state">
        <h2>No Forms Yet</h2>
        <p>Create your first staff application form</p>
      </div>

      <table v-else class="forms-table">
        <thead>
          <tr>
            <th>Form Name</th>
            <th>Questions</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in forms" :key="f.id">
            <td>
              <strong>{{ f.title }}</strong>
              <div class="form-desc">{{ f.description }}</div>
            </td>
            <td>{{ f.questions.length }}</td>
            <td>
              <span class="status-badge" :class="f.active ? 'active' : 'inactive'">
                {{ f.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ formatDate(f.createdAt) }}</td>
            <td class="actions-cell">
              <button class="btn-action edit" @click="editForm(f)" title="Edit">✎</button>
              <button class="btn-action delete" @click="deleteForm(f.id)" title="Delete">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="builder-view">
      <div class="builder-header">
        <button class="back-btn" @click="currentForm = null">Back</button>
        <div class="header-info">
          <h1>{{ editingForm.title || 'New Form' }}</h1>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" @click="duplicateForm">Duplicate</button>
        </div>
      </div>

      <div class="builder-container">
        <div class="form-settings">
          <h2>Form Settings</h2>
          <div class="setting-group">
            <label>Form Title *</label>
            <input v-model="editingForm.title" placeholder="Enter form title" class="setting-input" />
          </div>
          <div class="setting-group">
            <label>Description</label>
            <textarea v-model="editingForm.description" placeholder="Form description" class="setting-textarea"></textarea>
          </div>
          <div class="setting-group checkbox">
            <label>
              <input v-model="editingForm.active" type="checkbox" />
              <span>Form is Active</span>
            </label>
          </div>
          <div class="setting-group checkbox">
            <label>
              <input v-model="editingForm.requiresApproval" type="checkbox" />
              <span>Requires Approval</span>
            </label>
          </div>
        </div>

        <div class="questions-editor">
          <h2>Questions</h2>
          
          <div v-if="editingForm.questions.length === 0" class="no-questions">
            <p>No questions yet. Add one to get started!</p>
          </div>

          <div v-for="(question, index) in editingForm.questions" :key="question.id" class="question-editor">
            <div class="question-header">
              <span class="q-number">Q{{ index + 1 }}</span>
              <input 
                v-model="question.text" 
                placeholder="Question text"
                class="question-text-input"
              />
              <button class="btn-icon delete-q" @click="removeQuestion(index)" title="Delete question">✕</button>
            </div>

            <div class="question-settings">
              <div class="setting-group">
                <label>Question Type</label>
                <select v-model="question.type" class="question-type-select">
                  <option value="short">Short Text</option>
                  <option value="long">Long Text</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="checkbox">Checkboxes</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="rating">Rating (1-5)</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div v-if="['multiple', 'checkbox', 'dropdown'].includes(question.type)" class="setting-group">
                <label>Options</label>
                <div class="options-list">
                  <div 
                    v-for="(option, optIdx) in question.options" 
                    :key="optIdx"
                    class="option-input-row"
                  >
                    <input 
                      v-model="question.options[optIdx]"
                      placeholder="Option text"
                      class="option-input"
                    />
                    <button class="btn-icon delete-opt" @click="removeOption(index, optIdx)">✕</button>
                  </div>
                  <button 
                    class="btn-secondary small"
                    @click="addOption(index)"
                  >
                    + Add Option
                  </button>
                </div>
              </div>

              <div class="setting-group checkbox">
                <label>
                  <input v-model="question.required" type="checkbox" />
                  <span>Required Question</span>
                </label>
              </div>
            </div>
          </div>

          <button class="btn-secondary add-question" @click="addQuestion">
            + Add Question
          </button>
        </div>
      </div>

      <div class="builder-footer">
        <button class="btn-secondary" @click="currentForm = null">Cancel</button>
        <button class="btn-primary" @click="saveForm" :disabled="!editingForm.title">
          {{ editingForm.id ? 'Update Form' : 'Create Form' }}
        </button>
      </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE_URL } from '../config'

const authStore = useAuthStore()
const forms = ref([])
const currentForm = ref(null)
const loading = ref(true)
const editingForm = ref({
  title: '',
  description: '',
  active: true,
  requiresApproval: false,
  questions: [],
})

// User ID allowed to create forms
const AUTHORIZED_USER_ID = '1362553254117904496'

const canCreateForms = () => {
  return authStore.user && authStore.user.id === AUTHORIZED_USER_ID
}

const createNewForm = () => {
  editingForm.value = {
    title: '',
    description: '',
    active: true,
    requiresApproval: false,
    questions: [],
  }
  currentForm.value = 'new'
}

const editForm = (form) => {
  editingForm.value = JSON.parse(JSON.stringify(form))
  currentForm.value = 'edit'
}

const duplicateForm = () => {
  const duplicate = JSON.parse(JSON.stringify(editingForm.value))
  duplicate.id = undefined
  duplicate.title = `${duplicate.title} (Copy)`
  editingForm.value = duplicate
  currentForm.value = 'new'
}

const addQuestion = () => {
  const newQuestion = {
    id: `q_${Date.now()}`,
    type: 'short',
    text: '',
    required: false,
    options: [],
  }
  editingForm.value.questions.push(newQuestion)
}

const removeQuestion = (index) => {
  editingForm.value.questions.splice(index, 1)
}

const addOption = (questionIndex) => {
  editingForm.value.questions[questionIndex].options.push('')
}

const removeOption = (questionIndex, optionIndex) => {
  editingForm.value.questions[questionIndex].options.splice(optionIndex, 1)
}

const saveForm = async () => {
  if (!editingForm.value.title.trim()) {
    alert('Please enter a form title')
    return
  }

  if (editingForm.value.questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  try {
    const method = editingForm.value.id ? 'PUT' : 'POST'
    const response = await fetch(`${API_BASE_URL}/api/staff/forms`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('discord_token')}`,
      },
      body: JSON.stringify(editingForm.value),
    })

    if (response.ok) {
      await loadForms()
      currentForm.value = null
      alert('Form saved successfully!')
    } else {
      alert('Failed to save form')
    }
  } catch (error) {
    console.error('Error saving form:', error)
    alert('Error saving form')
  }
}

const deleteForm = async (formId) => {
  if (confirm('Are you sure you want to delete this form?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('discord_token')}`,
        },
      })

      if (response.ok) {
        await loadForms()
        alert('Form deleted successfully')
      } else {
        alert('Failed to delete form')
      }
    } catch (error) {
      console.error('Error deleting form:', error)
      alert('Error deleting form')
    }
  }
}

const loadForms = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API_BASE_URL}/api/staff/forms`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('discord_token')}`,
      },
    })

    if (response.ok) {
      forms.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading forms:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(() => {
  loadForms()
})
</script>

<style scoped>
.builder-wrapper {
  width: 100%;
}

.access-denied {
  text-align: center;
  padding: 80px 40px;
}

.denied-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.access-denied h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.access-denied p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.forms-list-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 400px;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.forms-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.forms-table thead {
  background: var(--bg-tertiary);
}

.forms-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.forms-table td {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
}

.forms-table tbody tr:hover {
  background: var(--bg-tertiary);
}

.form-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 5px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(52, 211, 153, 0.1);
  color: #10b981;
}

.status-badge.inactive {
  background: rgba(107, 114, 128, 0.1);
  color: var(--text-secondary);
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-action {
  background: rgba(81, 112, 255, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: var(--primary-color);
}

.btn-action:hover {
  background: rgba(81, 112, 255, 0.2);
}

.btn-action.delete {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.btn-action.delete:hover {
  background: rgba(255, 107, 107, 0.2);
}

.builder-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.builder-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: var(--primary-light);
}

.header-info {
  flex: 1;
}

.header-info h1 {
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.builder-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
}

.form-settings,
.questions-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-settings h2,
.questions-editor h2 {
  font-size: 1.3rem;
  margin: 0;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group label {
  font-weight: 600;
  color: var(--text-primary);
}

.setting-input,
.setting-textarea {
  padding: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.setting-input:focus,
.setting-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.setting-textarea {
  resize: vertical;
  min-height: 80px;
}

.setting-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
}

.setting-group.checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.no-questions {
  text-align: center;
  padding: 40px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
}

.question-editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.q-number {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 35px;
}

.question-text-input {
  flex: 1;
  padding: 10px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-weight: 500;
}

.question-text-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.delete-q {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.delete-q:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: #ff6b6b;
}

.question-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question-type-select {
  padding: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
}

.question-type-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.option-input {
  flex: 1;
  padding: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
}

.option-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.delete-opt {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 6px;
  width: 32px;
  height: 32px;
}

.delete-opt:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: #ff6b6b;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.add-question {
  align-self: flex-start;
}

.builder-footer {
  display: flex;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

.btn-secondary.small {
  flex: none;
  width: 100%;
  padding: 8px;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .builder-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .builder-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-header {
    flex-direction: column;
    gap: 15px;
  }

  .list-header h1 {
    font-size: 1.8rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .forms-table {
    font-size: 0.9rem;
  }

  .forms-table th,
  .forms-table td {
    padding: 10px;
  }
}
</style>
