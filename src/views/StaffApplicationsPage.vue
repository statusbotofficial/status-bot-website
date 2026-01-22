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
        <ApplicationsReviewContent :key="currentSection" />
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
const AUTHORIZED_USER_ID = '1362553254117904496'
const AUTHORIZED_USER_IDS = ['1362553254117904496', '863089744563798046']

const hasReviewAccess = computed(() => {
  return authStore.user && AUTHORIZED_USER_IDS.includes(authStore.user.id)
})

const canBuild = computed(() => {
  return authStore.user && authStore.user.id === AUTHORIZED_USER_ID
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
  position: relative;
  z-index: 2;
}

.staff-applications-page::before {
  content: '';
  position: fixed;
  top: 20%;
  left: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at 30% 30%, rgba(81, 112, 255, 0.4), rgba(81, 112, 255, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.staff-applications-page::after {
  content: '';
  position: fixed;
  bottom: 20%;
  right: 15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at 30% 30%, rgba(81, 112, 255, 0.35), rgba(81, 112, 255, 0.08) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
}

.staff-nav-tabs {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 40px 20px 30px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.nav-tab {
  padding: 10px 0;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tab::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.nav-tab:hover {
  color: var(--text-primary);
}

.nav-tab.active {
  color: var(--primary-color);
}

.nav-tab.active::after {
  transform: scaleX(1);
}

.staff-content {
  min-height: calc(100vh - 250px);
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.section-content {
  width: 100%;
  max-width: 1000px;
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
    padding: 30px 15px 20px;
    gap: 20px;
  }

  .nav-tab {
    padding: 8px 0;
    font-size: 0.9rem;
  }

  .staff-content {
    padding: 40px 15px;
  }

  .section-content {
    max-width: 100%;
  }
}
</style>
