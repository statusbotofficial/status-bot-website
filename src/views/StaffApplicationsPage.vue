<template>
  <div class="staff-applications-page">
    <!-- Navigation Tabs -->
    <div class="staff-nav-tabs">
      <button 
        class="nav-tab"
        :class="{ active: currentSection === 'submit' }"
        @click="currentSection = 'submit'"
      >
        Submit Application
      </button>
      <button 
        v-if="hasReviewAccess"
        class="nav-tab"
        :class="{ active: currentSection === 'builder' }"
        @click="currentSection = 'builder'"
      >
        Form Builder
      </button>
      <button 
        v-if="hasReviewAccess"
        class="nav-tab"
        :class="{ active: currentSection === 'review' }"
        @click="currentSection = 'review'"
      >
        Review Applications
      </button>
    </div>

    <!-- Content Sections -->
    <div class="staff-content">
      <!-- Submit Application Section -->
      <div v-if="currentSection === 'submit'" class="section-content">
        <ApplicationFormContent @tab-change="currentSection = $event" />
      </div>

      <!-- Form Builder Section -->
      <div v-if="currentSection === 'builder'" class="section-content">
        <FormBuilderContent />
      </div>

      <!-- Review Applications Section -->
      <div v-if="currentSection === 'review'" class="section-content">
        <ApplicationsReviewContent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import ApplicationFormContent from '../components/ApplicationFormContent.vue'
import FormBuilderContent from '../components/FormBuilderContent.vue'
import ApplicationsReviewContent from '../components/ApplicationsReviewContent.vue'

const authStore = useAuthStore()
const currentSection = ref('submit')

// User IDs with permissions
const REVIEWER_IDS = ['1436802557111435324', '1436334619250393210']
const BUILDER_ID = '1436334619250393210'

const hasReviewAccess = computed(() => {
  return authStore.user && REVIEWER_IDS.includes(authStore.user.id)
})

const canBuild = computed(() => {
  return authStore.user && authStore.user.id === BUILDER_ID
})

onMounted(() => {
  // Redirect away from staff tabs if not authorized
  if (currentSection.value === 'builder' && !canBuild.value) {
    currentSection.value = 'submit'
  }
  if (currentSection.value === 'review' && !hasReviewAccess.value) {
    currentSection.value = 'submit'
  }
})
</script>

<style scoped>
.staff-applications-page {
  min-height: calc(100vh - 150px);
  padding: 0;
  background: var(--bg-primary);
}

.staff-nav-tabs {
  display: flex;
  gap: 10px;
  padding: 30px 30px 20px;
  border-bottom: 1px solid var(--border-color);
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.nav-tab {
  padding: 12px 24px;
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid transparent;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.nav-tab:hover {
  color: var(--text-primary);
  border-bottom-color: var(--primary-color);
}

.nav-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: rgba(81, 112, 255, 0.05);
}

.staff-content {
  min-height: calc(100vh - 250px);
  padding: 40px 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.section-content {
  width: 100%;
  max-width: 900px;
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

@media (max-width: 768px) {
  .staff-nav-tabs {
    padding: 20px 15px 15px;
  }

  .nav-tab {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .staff-content {
    padding: 20px 15px;
  }

  .section-content {
    max-width: 100%;
  }
}
</style>
