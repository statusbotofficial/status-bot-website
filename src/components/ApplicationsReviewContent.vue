<template>
  <div class="review-wrapper">
    <div v-if="!hasReviewAccess" class="access-denied">
      <div class="denied-icon">🔒</div>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>

    <template v-else>
      <div class="review-header">
        <h1>Application Reviews</h1>
        <p>Review and manage staff applications</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading applications...</p>
      </div>

      <div v-else class="review-container">
        <div class="filters-panel">
          <h3>Filters</h3>
          
          <div class="filter-group">
            <label>Status</label>
            <select v-model="selectedStatus" class="filter-select">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Form</label>
            <select v-model="selectedForm" class="filter-select">
              <option value="">All Forms</option>
              <option v-for="form in availableForms" :key="form" :value="form">
                {{ form }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Sort</label>
            <select v-model="sortBy" class="filter-select">
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>

        <div class="submissions-list">
          <div v-if="filteredSubmissions.length === 0" class="empty-state">
            <div class="empty-icon">📊</div>
            <h2>No Applications Found</h2>
            <p>No applications match the selected filters</p>
          </div>

          <div v-for="submission in filteredSubmissions" :key="submission.id" class="submission-card">
            <div class="card-header">
              <div class="card-title">
                <h3>{{ submission.formTitle }}</h3>
                <span class="submitted-date">{{ formatDate(submission.timestamp) }}</span>
              </div>
              <div class="status-badges">
                <span class="status-badge" :class="submission.status">
                  {{ formatStatus(submission.status) }}
                </span>
                <button 
                  class="btn-expand" 
                  @click="toggleExpanded(submission.id)"
                  :class="{ expanded: expandedId === submission.id }"
                >
                  ⋮
                </button>
              </div>
            </div>

            <div v-if="expandedId === submission.id" class="card-content expanded">
              <div class="responses-section">
                <h4>Responses</h4>
                <div v-for="(response, qIdx) in getResponses(submission)" :key="qIdx" class="response-item">
                  <label class="response-label">{{ response.question }}</label>
                  <div class="response-value">{{ formatResponse(response.value) }}</div>
                </div>
              </div>

              <div v-if="submission.status === 'pending'" class="action-section">
                <h4>Action Required</h4>
                <div class="action-buttons">
                  <button class="btn-approve" @click="approveSubmission(submission)">
                    ✓ Approve
                  </button>
                  <button class="btn-reject" @click="showRejectionModal(submission)">
                    ✗ Reject
                  </button>
                </div>
              </div>

              <div v-else-if="submission.status === 'rejected'" class="rejection-reason">
                <h4>Rejection Reason</h4>
                <p>{{ submission.rejectionReason || 'No reason provided' }}</p>
              </div>

              <div v-else-if="submission.status === 'approved'" class="approval-info">
                <h4>Approved</h4>
                <p>{{ submission.approvalNote || 'Application approved' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rejection Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h2>Reject Application</h2>
          <p>Enter a reason for rejection (optional):</p>
          <textarea 
            v-model="rejectionReason" 
            placeholder="Enter rejection reason..."
            class="modal-textarea"
          ></textarea>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeModal">Cancel</button>
            <button class="btn-reject" @click="confirmReject">Reject Application</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE_URL } from '../config'

const authStore = useAuthStore()
const submissions = ref([])
const forms = ref([])
const loading = ref(true)
const selectedStatus = ref('all')
const selectedForm = ref('')
const sortBy = ref('date-desc')
const expandedId = ref(null)
const showModal = ref(false)
const rejectionReason = ref('')
const rejectionTarget = ref(null)

// User ID allowed to review applications
const AUTHORIZED_USER_ID = '1362553254117904496'

const hasReviewAccess = computed(() => {
  return authStore.user && authStore.user.id === AUTHORIZED_USER_ID
})

const availableForms = computed(() => {
  return [...new Set(submissions.value.map(s => s.formTitle))]
})

const filteredSubmissions = computed(() => {
  let filtered = submissions.value

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(s => s.status === selectedStatus.value)
  }

  if (selectedForm.value) {
    filtered = filtered.filter(s => s.formTitle === selectedForm.value)
  }

  // Sort
  if (sortBy.value === 'date-asc') {
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  } else if (sortBy.value === 'date-desc') {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } else if (sortBy.value === 'status') {
    const statusOrder = { pending: 0, submitted: 1, approved: 2, rejected: 3 }
    filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
  }

  return filtered
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatResponse = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value || 'Not answered'
}

const getResponses = (submission) => {
  const responses = []
  const form = forms.value.find(f => f.id === submission.formId)
  
  if (form) {
    form.questions.forEach(question => {
      responses.push({
        question: question.text,
        value: submission.responses[question.id],
      })
    })
  }
  
  return responses
}

const toggleExpanded = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const showRejectionModal = (submission) => {
  rejectionTarget.value = submission
  rejectionReason.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  rejectionTarget.value = null
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!rejectionTarget.value) return
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/submissions/${rejectionTarget.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('discord_token')}`,
      },
      body: JSON.stringify({
        status: 'rejected',
        rejectionReason: rejectionReason.value,
      }),
    })

    if (response.ok) {
      await loadSubmissions()
      closeModal()
      alert('Application rejected')
    } else {
      alert('Failed to reject application')
    }
  } catch (error) {
    console.error('Error rejecting application:', error)
    alert('Error rejecting application')
  }
}

const approveSubmission = async (submission) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/submissions/${submission.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('discord_token')}`,
      },
      body: JSON.stringify({
        status: 'approved',
        approvalNote: 'Application approved',
      }),
    })

    if (response.ok) {
      await loadSubmissions()
      alert('Application approved')
    } else {
      alert('Failed to approve application')
    }
  } catch (error) {
    console.error('Error approving application:', error)
    alert('Error approving application')
  }
}

const loadSubmissions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff/submissions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('discord_token')}`,
      },
    })

    if (response.ok) {
      submissions.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading submissions:', error)
  }
}

const loadForms = async () => {
  try {
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
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([loadSubmissions(), loadForms()])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.review-wrapper {
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

.review-header {
  margin-bottom: 30px;
  text-align: center;
}

.review-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.review-header p {
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 400px;
  color: var(--text-secondary);
}

.review-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

.filters-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.filters-panel h3 {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.filter-select {
  padding: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
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

.submission-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.submission-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(81, 112, 255, 0.1);
}

.card-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  flex: 1;
}

.card-title h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.submitted-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.status-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.submitted {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.approved {
  background: rgba(52, 211, 153, 0.1);
  color: #10b981;
}

.status-badge.rejected {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.btn-expand {
  background: none;
  border: 1px solid var(--border-color);
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.btn-expand:hover {
  border-color: var(--primary-color);
}

.btn-expand.expanded {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.card-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.card-content.expanded {
  max-height: 2000px;
}

.responses-section,
.action-section,
.rejection-reason,
.approval-info {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.responses-section h4,
.action-section h4,
.rejection-reason h4,
.approval-info h4 {
  margin: 0 0 15px 0;
  font-size: 1rem;
}

.response-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.response-item:last-child {
  margin-bottom: 0;
}

.response-label {
  font-weight: 600;
  color: var(--text-primary);
}

.response-value {
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 6px;
  color: var(--text-secondary);
  word-break: break-word;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-approve,
.btn-reject {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
  background: #ff6b6b;
  color: white;
}

.btn-reject:hover {
  background: #ef4444;
}

.rejection-reason p {
  margin: 0;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 6px;
  color: var(--text-secondary);
  border-left: 3px solid #ff6b6b;
}

.approval-info p {
  margin: 0;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 6px;
  color: var(--text-secondary);
  border-left: 3px solid #10b981;
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
  padding: 30px;
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

.modal-content h2 {
  margin: 0 0 15px 0;
}

.modal-content p {
  color: var(--text-secondary);
  margin: 0 0 15px 0;
}

.modal-textarea {
  width: 100%;
  padding: 10px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 20px;
}

.modal-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  flex: 1;
  padding: 10px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

@media (max-width: 1024px) {
  .review-container {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    position: relative;
    top: auto;
  }
}

@media (max-width: 768px) {
  .review-header h1 {
    font-size: 1.8rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .status-badges {
    width: 100%;
    justify-content: space-between;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
