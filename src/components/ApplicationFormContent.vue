<template>
  <div class="form-content-wrapper">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading forms...</p>
    </div>

    <div v-else-if="!form && !forms.length" class="empty-state">
      <h2>No Applications Available</h2>
      <p>There are no open staff applications at this time.</p>
    </div>

    <div v-else-if="!form" class="forms-selection">
      <div class="selection-header">
        <h1>Staff Applications</h1>
        <p>Select an application to complete</p>
      </div>
      <div class="forms-grid">
        <div 
          v-for="availableForm in forms" 
          :key="availableForm.id"
          class="form-card"
          @click="selectForm(availableForm)"
        >
          <h3>{{ availableForm.title }}</h3>
          <p>{{ availableForm.description }}</p>
          <span class="question-count">{{ availableForm.questions.length }} questions</span>
          <button class="btn-apply">Apply Now</button>
        </div>
      </div>
    </div>

    <div v-else class="form-submission">
      <div class="form-header">
        <button class="back-btn" @click="form = null">Back</button>
        <div class="form-info">
          <h1>{{ form.title }}</h1>
          <p>{{ form.description }}</p>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="form-content">
        <div 
          v-for="(question, index) in form.questions"
          :key="question.id"
          class="question-block"
        >
          <label class="question-label">
            <span class="question-text">{{ question.text }}</span>
            <span v-if="question.required" class="required-badge">*</span>
          </label>

          <!-- Short Text -->
          <input
            v-if="question.type === 'short'"
            v-model="responses[question.id]"
            type="text"
            class="input-field"
            :required="question.required"
            placeholder="Enter your answer"
          />

          <!-- Long Text -->
          <textarea
            v-if="question.type === 'long'"
            v-model="responses[question.id]"
            class="textarea-field"
            rows="5"
            :required="question.required"
            placeholder="Enter your answer"
          ></textarea>

          <!-- Multiple Choice -->
          <div v-if="question.type === 'multiple'" class="radio-group">
            <label 
              v-for="(option, idx) in question.options" 
              :key="idx"
              class="radio-label"
            >
              <input
                type="radio"
                :value="option"
                v-model="responses[question.id]"
                class="radio-input"
                :required="question.required"
              />
              <span>{{ option }}</span>
            </label>
          </div>

          <!-- Checkboxes -->
          <div v-if="question.type === 'checkbox'" class="checkbox-group">
            <label 
              v-for="(option, idx) in question.options" 
              :key="idx"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :value="option"
                @change="updateCheckboxes(question.id, $event)"
                class="checkbox-input"
              />
              <span>{{ option }}</span>
            </label>
          </div>

          <!-- Dropdown -->
          <select
            v-if="question.type === 'dropdown'"
            v-model="responses[question.id]"
            class="select-field"
            :required="question.required"
          >
            <option value="">Select an option</option>
            <option 
              v-for="(option, idx) in question.options" 
              :key="idx"
              :value="option"
            >
              {{ option }}
            </option>
          </select>

          <!-- Rating -->
          <div v-if="question.type === 'rating'" class="rating-group">
            <div class="rating-options">
              <button
                v-for="rating in 5"
                :key="rating"
                type="button"
                class="rating-btn"
                :class="{ active: responses[question.id] === rating.toString() }"
                @click="responses[question.id] = rating.toString()"
              >
                {{ rating }}
              </button>
            </div>
          </div>

          <!-- Date -->
          <input
            v-if="question.type === 'date'"
            v-model="responses[question.id]"
            type="date"
            class="input-field"
            :required="question.required"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="form = null">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="submitting">
            <span v-if="submitting" class="spinner-small"></span>
            {{ submitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success-modal">
        <div class="success-icon">✓</div>
        <h2>Application Submitted!</h2>
        <p>Thank you for applying. We'll review your application and get back to you soon.</p>
        <button class="btn-primary" @click="resetForm">View More Applications</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE_URL } from '../config'

const forms = ref([])
const form = ref(null)
const responses = ref({})
const loading = ref(true)
const submitting = ref(false)
const showSuccessModal = ref(false)

const selectForm = (selectedForm) => {
  form.value = selectedForm
  responses.value = {}
  selectedForm.questions.forEach(q => {
    if (q.type === 'checkbox') {
      responses.value[q.id] = []
    } else {
      responses.value[q.id] = ''
    }
  })
}

const updateCheckboxes = (questionId, event) => {
  const value = event.target.value
  if (!responses.value[questionId]) {
    responses.value[questionId] = []
  }
  if (event.target.checked) {
    responses.value[questionId].push(value)
  } else {
    responses.value[questionId] = responses.value[questionId].filter(v => v !== value)
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    // Validate required fields
    for (const question of form.value.questions) {
      if (question.required && !responses.value[question.id]) {
        alert(`Please answer: ${question.text}`)
        submitting.value = false
        return
      }
    }

    const submission = {
      formId: form.value.id,
      formTitle: form.value.title,
      timestamp: new Date().toISOString(),
      responses: responses.value,
      status: form.value.requiresApproval ? 'pending' : 'submitted',
    }

    const response = await fetch(`${API_BASE_URL}/api/staff/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    })

    if (response.ok) {
      showSuccessModal.value = true
    } else {
      alert('Failed to submit application')
    }
  } catch (error) {
    alert('Error submitting application')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  showSuccessModal.value = false
  form.value = null
  responses.value = {}
  loadForms()
}

const loadForms = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API_BASE_URL}/api/staff/forms/active`)

    if (response.ok) {
      forms.value = await response.json()
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadForms()
})
</script>

<style scoped>
.form-content-wrapper {
  width: 100%;
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

.forms-selection .selection-header {
  text-align: center;
  margin-bottom: 50px;
}

.selection-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.selection-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.form-card {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(81, 112, 255, 0.15);
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.05) 0%, var(--bg-tertiary) 100%);
}

.form-card h3 {
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.form-card p {
  color: var(--text-secondary);
  margin-bottom: 15px;
  min-height: 40px;
  font-size: 0.95rem;
}

.question-count {
  display: inline-block;
  font-size: 0.85rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 15px;
}

.btn-apply {
  width: 100%;
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-apply:hover {
  background: var(--primary-light);
}

.form-submission {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  margin-bottom: 40px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: var(--primary-light);
}

.form-info h1 {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-info p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.question-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-label {
  display: flex;
  gap: 5px;
  font-weight: 600;
  color: var(--text-primary);
}

.question-text {
  flex: 1;
}

.required-badge {
  color: #ff6b6b;
}

.input-field,
.textarea-field,
.select-field {
  width: 100%;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.3s ease;
}

.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(81, 112, 255, 0.1);
}

.textarea-field {
  resize: vertical;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.radio-label:hover,
.checkbox-label:hover {
  background: var(--bg-secondary);
}

.radio-input,
.checkbox-input {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.rating-group {
  display: flex;
  gap: 10px;
}

.rating-options {
  display: flex;
  gap: 10px;
}

.rating-btn {
  width: 50px;
  height: 50px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.rating-btn:hover {
  border-color: var(--primary-color);
}

.rating-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  opacity: 0.7;
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

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

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
  padding: 40px;
  text-align: center;
  max-width: 400px;
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

.success-modal .success-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-modal h2 {
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.success-modal p {
  color: var(--text-secondary);
  margin-bottom: 25px;
}

.success-modal .btn-primary {
  width: 100%;
}

@media (max-width: 768px) {
  .forms-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .rating-options {
    justify-content: space-between;
  }

  .rating-btn {
    flex: 1;
  }
}
</style>
