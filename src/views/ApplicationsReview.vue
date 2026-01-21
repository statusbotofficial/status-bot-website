<template>
  <div class="submissions-container">
    <div class="submissions-header">
      <div class="header-content">
        <h1>Staff Applications Review</h1>
        <p>Review and manage new staff applications</p>
      </div>
      <div class="header-filters">
        <select v-model="selectedForm" class="filter-select">
          <option value="">All Forms</option>
          <option v-for="form in forms" :key="form.id" :value="form.id">
            {{ form.title }}
          </option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="submitted">Submitted</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading applications...</p>
    </div>

    <div v-else-if="filteredSubmissions.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h2>No Applications</h2>
      <p>There are no applications matching your filters.</p>
    </div>

    <div v-else class="submissions-list">
      <div 
        v-for="submission in filteredSubmissions"
        :key="submission.id"
        class="submission-card"
        :class="{ active: selectedSubmission?.id === submission.id }"
        @click="selectSubmission(submission)"
      >
        <div class="submission-header">
          <div class="submission-info">
            <h3>{{ submission.formTitle }}</h3>
            <p class="submission-time">{{ formatDate(submission.timestamp) }}</p>
          </div>
          <div class="status-badge" :class="submission.status">
            {{ submission.status.toUpperCase() }}
          </div>
        </div>
        <div class="submission-preview">
          <p v-if="submission.responses" class="preview-text">
            {{ getPreviewText(submission) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Submission Detail Panel -->
    <div v-if="selectedSubmission" class="detail-panel">
      <div class="detail-header">
        <button class="close-btn" @click="selectedSubmission = null">✕</button>
        <h2>{{ selectedSubmission.formTitle }}</h2>
        <div class="status-badge" :class="selectedSubmission.status">
          {{ selectedSubmission.status.toUpperCase() }}
        </div>
      </div>

      <div class="detail-content">
        <div class="submitted-info">
          <span class="label">Submitted:</span>
          <span class="value">{{ formatDateTime(selectedSubmission.timestamp) }}</span>
        </div>

        <div class="responses-section">
          <h3>Responses</h3>
          <div class="responses-list">
            <div 
              v-for="(answer, questionId) in selectedSubmission.responses"
              :key="questionId"
              class="response-item"
            >
              <div class="response-question">
                {{ getQuestionText(selectedSubmission.formId, questionId) }}
              </div>
              <div class="response-answer">
                <span v-if="Array.isArray(answer)">{{ answer.join(', ') }}</span>
                <span v-else>{{ answer }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedSubmission.status === 'pending' || selectedSubmission.status === 'submitted'" class="action-buttons">
          <button class="btn-approve" @click="approveSubmission">
            <span v-if="actionLoading" class="spinner-small"></span>
            Approve Application
          </button>
          <button class="btn-reject" @click="showRejectModal = true">
            Reject Application
          </button>
        </div>

        <div v-else class="action-info">
          <p v-if="selectedSubmission.status === 'approved'" class="info-approved">
            ✓ This application has been approved
          </p>
          <p v-else-if="selectedSubmission.status === 'rejected'" class="info-rejected">
            ✗ This application has been rejected
          </p>
        </div>
      </div>

      <!-- Rejection Modal -->
      <div v-if="showRejectModal" class="modal-overlay" @click.self="showRejectModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Reject Application</h3>
            <button class="close-btn" @click="showRejectModal = false">✕</button>
          </div>
          <div class="modal-body">
            <label>Rejection Reason (optional)</label>
            <textarea 
              v-model="rejectionReason"
              class="textarea-field"
              rows="4"
              placeholder="Provide a reason for the rejection (will not be shared with applicant)"
            ></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="showRejectModal = false">Cancel</button>
            <button class="btn-danger" @click="rejectSubmission" :disabled="actionLoading">
              <span v-if="actionLoading" class="spinner-small"></span>
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE_URL } from '../config'

const authStore = useAuthStore()
const submissions = ref([])
const forms = ref([])
const selectedSubmission = ref(null)
const selectedForm = ref('')
const filterStatus = ref('')
const loading = ref(true)
const actionLoading = ref(false)
const showRejectModal = ref(false)
const rejectionReason = ref('')

const filteredSubmissions = computed(() => {
  return submissions.value.filter(sub => {
    if (selectedForm.value && sub.formId != selectedForm.value) return false
    if (filterStatus.value && sub.status !== filterStatus.value) return false
    return true
  })
})

const selectSubmission = (submission) => {
  selectedSubmission.value = submission
  rejectionReason.value = ''
}

const getPreviewText = (submission) => {
  if (!submission.responses) return 'No responses'
  const responses = Object.values(submission.responses)
  if (responses.length > 0) {
    let preview = responses[0]
    if (Array.isArray(preview)) {
      preview = preview.join(', ')
    }
    return preview.toString().substring(0, 50) + (preview.toString().length > 50 ? '...' : '')
  }
  return 'No responses'
}

const getQuestionText = (formId, questionId) => {
  const form = forms.value.find(f => f.id == formId)
  if (!form) return 'Unknown question'
  const question = form.questions.find(q => q.id == questionId)
  return question ? question.text : 'Unknown question'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const approveSubmission = async () => {
  if (!selectedSubmission.value) return

  actionLoading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/submissions/${selectedSubmission.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ status: 'approved' }),
    })

    if (response.ok) {
      const updated = await response.json()
      const index = submissions.value.findIndex(s => s.id === selectedSubmission.value.id)
      if (index >= 0) {
        submissions.value[index] = updated
        selectedSubmission.value = updated
      }
      alert('Application approved!')
    } else {
      alert('Failed to approve application')
    }
  } catch (error) {
    console.error('Error approving submission:', error)
    alert('Error approving application')
  } finally {
    actionLoading.value = false
  }
}

const rejectSubmission = async () => {
  if (!selectedSubmission.value) return

  actionLoading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/submissions/${selectedSubmission.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ 
        status: 'rejected',
        rejectionReason: rejectionReason.value 
      }),
    })

    if (response.ok) {
      const updated = await response.json()
      const index = submissions.value.findIndex(s => s.id === selectedSubmission.value.id)
      if (index >= 0) {
        submissions.value[index] = updated
        selectedSubmission.value = updated
      }
      showRejectModal.value = false
      rejectionReason.value = ''
      alert('Application rejected!')
    } else {
      alert('Failed to reject application')
    }
  } catch (error) {
    console.error('Error rejecting submission:', error)
    alert('Error rejecting application')
  } finally {
    actionLoading.value = false
  }
}

const loadSubmissions = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API_BASE_URL}/api/staff/submissions`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      submissions.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading submissions:', error)
  } finally {
    loading.value = false
  }
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
  loadSubmissions()
  loadForms()
})
</script>

<style scoped>
.submissions-container {
  min-height: calc(100vh - 150px);
  padding: 40px 30px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.submissions-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header-content p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.header-filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px 15px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.loading-state {
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 40px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  grid-column: 1;
}

.submission-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submission-card:hover {
  border-color: var(--primary-color);
  background: var(--bg-tertiary);
}

.submission-card.active {
  border-color: var(--primary-color);
  background: rgba(81, 112, 255, 0.1);
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.submission-info h3 {
  margin-bottom: 5px;
}

.submission-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-badge.approved {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-badge.rejected {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.status-badge.submitted {
  background: rgba(81, 112, 255, 0.2);
  color: #5170ff;
}

.submission-preview {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.preview-text {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Detail Panel */
.detail-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.detail-header h2 {
  margin: 0;
  flex: 1;
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

.detail-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.submitted-info {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.submitted-info .label {
  color: var(--text-secondary);
  font-weight: 600;
}

.submitted-info .value {
  color: var(--text-primary);
}

.responses-section {
  flex: 1;
  margin-bottom: 20px;
}

.responses-section h3 {
  margin-bottom: 15px;
  margin-top: 0;
  font-size: 1.1rem;
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.response-item {
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.response-question {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.response-answer {
  color: var(--text-secondary);
  word-break: break-word;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.btn-approve,
.btn-reject,
.btn-danger,
.btn-secondary {
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-approve {
  background: #4caf50;
  color: white;
}

.btn-approve:hover {
  background: #45a049;
}

.btn-reject {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-reject:hover {
  border-color: #f44336;
  color: #f44336;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #da190b;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

.action-info {
  margin-top: auto;
  text-align: center;
  padding: 15px;
  border-radius: 6px;
}

.info-approved {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  margin: 0;
}

.info-rejected {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  margin: 0;
}

/* Modal */
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
  width: 90%;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
}

.modal-body {
  padding: 20px;
}

.modal-body label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.textarea-field {
  width: 100%;
  padding: 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
}

.textarea-field:focus {
  outline: none;
  border-color: var(--primary-color);
}

.modal-actions {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.modal-actions button {
  flex: 1;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@media (max-width: 1024px) {
  .submissions-container {
    grid-template-columns: 1fr;
  }

  .submissions-list {
    grid-column: 1;
  }

  .detail-panel {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .submissions-container {
    padding: 20px;
  }

  .submissions-header {
    flex-direction: column;
  }

  .header-filters {
    flex-direction: column;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }
}
</style>
