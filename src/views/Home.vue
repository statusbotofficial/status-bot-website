<template>
  <div class="hero-section">
    <!-- Animated Background -->
    <div class="animated-bg">
      <!-- Simple background without floating shapes -->
    </div>
    <div class="hero">
      <div class="hero-badge">
        <i class="fas fa-check"></i>
        Trusted by multiple Discord Communities
      </div>
      <h1>Status Bot</h1>
      <p class="hero-subtitle">A comprehensive Discord bot for status tracking, and community engagement.</p>


      <div class="buttons">
        <a href="#" class="btn btn-primary">
          <span class="custom-grid-plus"></span>
          Dashboard
        </a>
        <a :href="discordServerUrl" class="btn btn-secondary" target="_blank">
          <svg class="discord-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3671a19.8062 19.8062 0 00-4.885-1.515.0741.0741 0 00-.0785.0371c-.211.3671-.445.847-.608 1.23a18.822 18.822 0 00-5.487 0c-.163-.38-.398-.863-.609-1.23a.077.077 0 00-.079-.037 19.7355 19.7355 0 00-4.885 1.515.0699.0699 0 00-.032.0277C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.0577c2.227 1.649 4.395 2.647 6.54 3.31.05.021.1.0018.129-.039.287-.468.544-.96.758-1.469.021-.037-.002-.077-.041-.088a13.201 13.201 0 01-1.881-.892.083.083 0 01-.008-.138c.126-.094.252-.192.372-.291a.084.084 0 01.088-.01c3.928 1.793 8.18 1.793 12.062 0a.084.084 0 01.088.009c.12.099.246.198.373.292a.083.083 0 01-.006.137c-.6.35-1.243.645-1.881.893a.083.083 0 00-.041.088c.215.509.472 1.001.759 1.468a.084.084 0 00.129.039c2.146-.663 4.314-1.661 6.541-3.31a.083.083 0 00.032-.0576c.503-4.761-.838-8.886-3.549-12.548a.061.061 0 00-.031-.028zM8.02 15.278c-1.063 0-1.936-.973-1.936-2.166 0-1.194.862-2.167 1.936-2.167 1.08 0 1.95.973 1.936 2.167 0 1.194-.862 2.166-1.936 2.166zm7.975 0c-1.063 0-1.936-.973-1.936-2.166 0-1.194.862-2.167 1.936-2.167 1.08 0 1.95.973 1.936 2.167 0 1.194-.862 2.166-1.936 2.166z"/>
          </svg>
          Join Discord
        </a>
        <router-link to="/docs" class="btn btn-secondary">
          <i class="fas fa-book"></i>
          Documentation
        </router-link>
      </div>

      <div class="social-proof">
        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">16+</div>
            <div class="stat-label">Total Servers</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">2k+</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Demo Preview Section -->
  <section class="demo-preview">
    <div class="container">
      <div class="demo-content">
        <div class="demo-text">
          <h2>Real-Time Status Tracking</h2>
          <p>Watch how Status Bot keeps your Discord server updated with real-time status information for all your members.</p>
          <div class="demo-features">
            <div class="demo-feature">
              <i class="fas fa-circle pulse-green"></i>
              <span>Live Status Updates</span>
            </div>
          </div>
          <router-link to="/servers" class="demo-cta">
            Try Status Tracking <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <div class="demo-visual">
          <div class="demo-image">
            <img src="https://i.postimg.cc/3xhwZrRG/image-2026-01-31-153128490.png" alt="Status Bot Discord Preview" class="status-preview-image">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">
      <div class="section-header">
        <h2>Status Bot Features</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card featured">
          <div class="feature-badge">Most Popular</div>
          <div class="feature-icon"><i class="fas fa-circle" style="color: #10b981;"></i></div>
          <h3>Status Tracking</h3>
          <ul class="feature-list">
            <li><i class="fas fa-check"></i> Real-time status updates</li>
            <li><i class="fas fa-check"></i> Custom notification messages</li>
            <li><i class="fas fa-check"></i> Multi-user tracking</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-chart-line" style="color: #5170ff;"></i></div>
          <h3>XP & Leveling System</h3>
          <ul class="feature-list">
            <li><i class="fas fa-check"></i> Customizable XP rates</li>
            <li><i class="fas fa-check"></i> 8 unique title ranks</li>
            <li><i class="fas fa-check"></i> Leaderboards & rank cards</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-coins" style="color: #fbbf24;"></i></div>
          <h3>Economy System</h3>
          <ul class="feature-list">
            <li><i class="fas fa-check"></i> 20+ fun mini-games</li>
            <li><i class="fas fa-check"></i> Daily rewards & streaks</li>
            <li><i class="fas fa-check"></i> Investment system</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-door-open" style="color: #8b5cf6;"></i></div>
          <h3>Welcome System</h3>
          <ul class="feature-list">
            <li><i class="fas fa-check"></i> Custom welcome messages</li>
            <li><i class="fas fa-check"></i> Member count tracking</li>
            <li><i class="fas fa-check"></i> Member goal progression</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-cogs" style="color: #6b7280;"></i></div>
          <h3>Easy Dashboard</h3>
          <ul class="feature-list">
            <li><i class="fas fa-check"></i> Web-based configuration</li>
            <li><i class="fas fa-check"></i> Real-time settings</li>
            <li><i class="fas fa-check"></i> Easy navigation</li>
          </ul>
        </div>
        <div class="feature-card premium">
          <div class="feature-badge premium-badge">Premium</div>
          <div class="feature-icon"><i class="fas fa-crown" style="color: #f59e0b;"></i></div>
          <h3>Premium Features</h3>
          <ul class="feature-list">
            <li><i class="fas fa-star"></i> 2x XP & Currency</li>
            <li><i class="fas fa-star"></i> Advanced tracking</li>
            <li><i class="fas fa-star"></i> Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="testimonials">
    <div class="container">
      <div class="testimonials-header">
        <h2>What Our Users Say</h2>
        <button v-if="canManageTestimonials" class="btn-admin" @click="openTestimonialForm">
          <i class="fas fa-plus"></i> Add Rating Comment
        </button>
      </div>
      
      <div class="testimonials-grid">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
          <div v-if="canManageTestimonials" class="admin-controls">
            <button @click="editTestimonial(testimonial)" class="btn-edit" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteTestimonial(testimonial.id)" class="btn-delete" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          
          <div class="testimonial-content">
            <div class="stars">
              <i v-for="(filled, index) in generateStars(testimonial.stars)" :key="index" 
                 class="fas fa-star" :class="{ filled: filled }"></i>
            </div>
            <p>"{{ testimonial.comment }}"</p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar">{{ testimonial.authorAvatar }}</div>
            <div class="author-info">
              <strong>{{ testimonial.authorName }}</strong>
              <span>{{ testimonial.authorRole }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Testimonial Form Modal -->
    <div v-if="showTestimonialForm" class="modal-overlay" @click="cancelTestimonialForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingTestimonial ? 'Edit' : 'Add' }} Testimonial</h3>
          <button class="modal-close" @click="cancelTestimonialForm">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveTestimonial" class="testimonial-form">
          <div class="form-group">
            <label>Stars Rating</label>
            <div class="star-selector">
              <button v-for="n in 5" :key="n" type="button" 
                      @click="testimonialForm.stars = n"
                      class="star-btn" :class="{ active: n <= testimonialForm.stars }">
                <i class="fas fa-star"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Comment</label>
            <textarea v-model="testimonialForm.comment" required 
                      placeholder="Enter the testimonial comment..." rows="4"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Author Name</label>
              <input v-model="testimonialForm.authorName" type="text" required 
                     placeholder="e.g., Alex">
            </div>
            
            <div class="form-group">
              <label>Author Role</label>
              <input v-model="testimonialForm.authorRole" type="text" required 
                     placeholder="e.g., Gaming Community Leader">
            </div>
          </div>
          
          <div class="form-group">
            <label>Author Avatar (Single Letter)</label>
            <input v-model="testimonialForm.authorAvatar" type="text" maxlength="1" required 
                   placeholder="A" class="avatar-input">
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelTestimonialForm" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ editingTestimonial ? 'Update' : 'Add' }} Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- Final CTA Section -->
  <section class="final-cta">
    <div class="container">
      <div class="cta-content">
        <h2>Ready to Transform Your Discord Server?</h2>
        <p>Join thousands of communities already using Status Bot. Get started in under 2 minutes.</p>
        <div class="cta-buttons">
          <router-link to="/servers" class="cta-primary">
            <i class="fas fa-rocket"></i>
            Start Free Now
          </router-link>
          <router-link to="/docs" class="cta-secondary">
            <i class="fas fa-book-open"></i>
            View Documentation
          </router-link>
        </div>
        <div class="cta-features">
          <div class="cta-feature">
            <i class="fas fa-check-circle"></i>
            <span>Free Forever</span>
          </div>
          <div class="cta-feature">
            <i class="fas fa-check-circle"></i>
            <span>2 Minute Setup</span>
          </div>
          <div class="cta-feature">
            <i class="fas fa-check-circle"></i>
            <span>No Credit Card</span>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { DISCORD_INVITE_URL, DISCORD_SERVER_URL } from '../config'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const discordServerUrl = DISCORD_SERVER_URL

// Testimonials Management State
const testimonials = ref([
  {
    id: 1,
    authorName: "Alex",
    authorAvatar: "A",
    authorRole: "Server Owner",
    stars: 5,
    comment: "Absolutely amazing bot! The status tracking features are incredible and helped our community stay organized. The uptime is fantastic too!"
  },
  {
    id: 2,
    authorName: "Sarah",
    authorAvatar: "S",
    authorRole: "Community Manager", 
    stars: 5,
    comment: "Status Bot has been a game-changer for our Discord server. Love the real-time updates and clean interface."
  },
  {
    id: 3,
    authorName: "Mike",
    authorAvatar: "M",
    authorRole: "Moderator",
    stars: 4,
    comment: "Great bot with excellent features. The developer is very responsive and constantly improving it."
  }
])

const showTestimonialForm = ref(false)
const editingTestimonial = ref(null)
const testimonialForm = ref({
  authorName: '',
  authorAvatar: '',
  authorRole: 'Community Member',
  stars: 5,
  comment: ''
})

// Admin check - replace with your actual Discord ID (get it from Discord Developer mode)
const isAdmin = computed(() => {
  // Temporarily allowing admin access for testing - replace 'YOUR_DISCORD_ID' with your actual Discord user ID
  return authStore.user?.id === 'YOUR_DISCORD_ID' || true // Remove "|| true" once you have your real Discord ID
})

const canManageTestimonials = computed(() => isAdmin.value)

// Testimonial Management Methods
const openTestimonialForm = () => {
  editingTestimonial.value = null
  testimonialForm.value = {
    authorName: '',
    authorAvatar: '',
    authorRole: 'Community Member',
    stars: 5,
    comment: ''
  }
  showTestimonialForm.value = true
}

const editTestimonial = (testimonial) => {
  editingTestimonial.value = testimonial.id
  testimonialForm.value = {
    authorName: testimonial.authorName,
    authorAvatar: testimonial.authorAvatar,
    authorRole: testimonial.authorRole || 'Community Member',
    stars: testimonial.stars,
    comment: testimonial.comment
  }
  showTestimonialForm.value = true
}

const deleteTestimonial = (id) => {
  if (confirm('Are you sure you want to delete this testimonial?')) {
    const index = testimonials.value.findIndex(t => t.id === id)
    if (index > -1) {
      testimonials.value.splice(index, 1)
    }
  }
}

const saveTestimonial = () => {
  if (!testimonialForm.value.authorName || !testimonialForm.value.comment) {
    alert('Please fill in all required fields')
    return
  }

  if (editingTestimonial.value) {
    // Edit existing testimonial
    const index = testimonials.value.findIndex(t => t.id === editingTestimonial.value)
    if (index > -1) {
      testimonials.value[index] = {
        ...testimonials.value[index],
        authorName: testimonialForm.value.authorName,
        authorAvatar: testimonialForm.value.authorAvatar || testimonialForm.value.authorName.charAt(0).toUpperCase(),
        authorRole: testimonialForm.value.authorRole || 'Community Member',
        stars: testimonialForm.value.stars,
        comment: testimonialForm.value.comment
      }
    }
  } else {
    // Add new testimonial
    const newId = Math.max(...testimonials.value.map(t => t.id)) + 1
    testimonials.value.push({
      id: newId,
      authorName: testimonialForm.value.authorName,
      authorAvatar: testimonialForm.value.authorAvatar || testimonialForm.value.authorName.charAt(0).toUpperCase(),
      authorRole: testimonialForm.value.authorRole || 'Community Member',
      stars: testimonialForm.value.stars,
      comment: testimonialForm.value.comment
    })
  }

  cancelTestimonialForm()
}

const cancelTestimonialForm = () => {
  showTestimonialForm.value = false
  editingTestimonial.value = null
  testimonialForm.value = {
    authorName: '',
    authorAvatar: '',
    authorRole: 'Community Member',
    stars: 5,
    comment: ''
  }
}

const generateStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => i + 1 <= rating)
}

onMounted(() => {
  document.title = 'Status Bot'
})
</script>

<style scoped>
/* Animated Background */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
}



/* Hero Section Enhanced */
.hero-section {
  padding: 120px 50px;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(81, 112, 255, 0.1);
  border: 1px solid rgba(81, 112, 255, 0.3);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 24px;
  animation: badge-glow 2s infinite alternate;
}

@keyframes badge-glow {
  from { box-shadow: 0 0 10px rgba(81, 112, 255, 0.2); }
  to { box-shadow: 0 0 20px rgba(81, 112, 255, 0.4); }
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 40px;
  color: var(--text-secondary);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 32px;
  color: var(--text-secondary);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: white;
  border: 2px solid rgba(81, 112, 255, 0.8);
}

.btn-primary:hover {
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: white;
  border: 2px solid rgba(81, 112, 255, 0.8);
}

.btn-secondary:hover {
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
  transform: translateY(-2px);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(81, 112, 255, 0.1);
  border: 1px solid rgba(81, 112, 255, 0.3);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 24px;
  animation: badge-glow 2s infinite alternate;
}

@keyframes badge-glow {
  from { box-shadow: 0 0 10px rgba(81, 112, 255, 0.2); }
  to { box-shadow: 0 0 20px rgba(81, 112, 255, 0.4); }
}

.custom-grid-plus {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  vertical-align: middle;
  top: 2px;
}

.custom-grid-plus::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 7px;
  height: 7px;
  background: currentColor;
  border-radius: 1px;
  box-shadow: 
    9px 0 0 currentColor,
    0 9px 0 currentColor,
    9px 9px 0 currentColor;
}

.discord-icon {
  width: 20px;
  height: 20px;
}

.social-proof {
  margin-top: 40px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(81, 112, 255, 0.2);
  align-self: center;
}

/* Demo Preview Section */
.demo-preview {
  padding: 100px 50px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%);
  border-top: 1px solid rgba(81, 112, 255, 0.1);
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-text h2 {
  font-size: 3rem;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-text p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.demo-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.demo-feature i {
  color: #10b981;
  font-size: 1.1rem;
}

.pulse-green {
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.demo-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: #fff;
  padding: 15px 30px;
  border: 2px solid rgba(81, 112, 255, 0.8);
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.demo-cta:hover {
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
  transform: translateY(-2px);
}

.demo-image {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
}

.status-preview-image {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.status-preview-image:hover {
  transform: translateY(-5px);
}

/* Enhanced Features Section */
.features {
  padding: 100px 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-header h2 {
  font-size: 3rem;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.05), rgba(139, 92, 246, 0.02));
  border: 2px solid rgba(81, 112, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  text-align: left;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(81, 112, 255, 0.1), transparent);
  transition: left 0.5s;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  border-color: rgba(81, 112, 255, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(81, 112, 255, 0.15);
}

.feature-card.featured {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02));
}

.feature-card.premium {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.02));
}

.feature-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.premium-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 24px;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.feature-list i {
  color: #10b981;
  font-size: 0.9rem;
}

.feature-card.premium .feature-list i {
  color: #f59e0b;
}

/* Testimonials Section */
.testimonials {
  padding: 100px 50px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%);
  border-top: 1px solid rgba(81, 112, 255, 0.1);
  border-bottom: 1px solid rgba(81, 112, 255, 0.1);
}

.testimonials h2 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 80px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(81, 112, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  border-color: rgba(81, 112, 255, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(81, 112, 255, 0.1);
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
}

.stars i {
  color: #fbbf24;
  font-size: 1.1rem;
}

.testimonial-content p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(139, 92, 246, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.author-info strong {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
}

.author-info span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Final CTA Section */
.final-cta {
  padding: 100px 50px;
  text-align: center;
}

.cta-content h2 {
  font-size: 3.5rem;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-content p {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.8) 100%);
  color: #fff;
  padding: 20px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid rgba(81, 112, 255, 0.8);
  box-shadow: 0 6px 20px rgba(81, 112, 255, 0.3);
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(81, 112, 255, 0.5);
}

.cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  padding: 20px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid rgba(81, 112, 255, 0.2);
}

.cta-secondary:hover {
  transform: translateY(-2px);
  background: rgba(81, 112, 255, 0.1);
  border-color: rgba(81, 112, 255, 0.4);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.cta-feature i {
  color: #10b981;
  font-size: 1.1rem;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.discord-btn, .docs-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid;
}

.discord-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: #fff;
  border-color: rgba(81, 112, 255, 0.8);
}

.docs-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: #fff;
  border-color: rgba(81, 112, 255, 0.8);
}

.discord-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
}

.docs-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
}

.discord-icon {
  width: 24px;
  height: 24px;
}

.stats-container {
  position: relative;
}

.stats-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  margin-bottom: 30px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.features {
  padding: 80px 50px;
  background-color: transparent;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--primary-color);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(81, 112, 255, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.feature-icon i {
  font-size: 3rem;
  color: #5170ff;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-card p {
  color: var(--text-secondary);
  margin-bottom: 0;
}

.status-section {
  padding: 80px 50px;
  background-color: transparent;
}

.status-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
}

.status-card {
  max-width: 500px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.4), rgba(80, 80, 80, 0.25));
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(81, 112, 255, 0.2);
}

.card-header {
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-between;
}

.server-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.3), rgba(81, 112, 255, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.server-info {
  flex: 1;
  min-width: 0;
}

.server-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #fff;
}

.created-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.join-btn {
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.8), rgba(81, 112, 255, 0.5));
  border: 1px solid rgba(81, 112, 255, 0.6);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.join-btn:hover {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1), rgba(81, 112, 255, 0.8));
  box-shadow: 0 4px 12px rgba(81, 112, 255, 0.4);
  transform: translateY(-1px);
}

.card-divider {
  height: 1px;
  background: rgba(81, 112, 255, 0.2);
}

.card-status {
  padding: 25px;
}

.bot-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bot-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(81, 112, 255, 0.4), rgba(81, 112, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;
}

.status-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  animation: pulse 2s infinite;
}

.last-update {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
    min-height: 80vh;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-benefits {
    flex-direction: column;
    gap: 16px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .btn {
    width: 85%;
    max-width: 250px;
    justify-content: center;
  }

  .primary-btn, .secondary-btn, .docs-btn {
    width: 85%;
    max-width: 250px;
    justify-content: center;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(81, 112, 255, 0.2);
    align-self: center;
  }

  .demo-preview {
    padding: 60px 20px;
  }

  .demo-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .demo-text h2 {
    font-size: 2.2rem;
  }

  .demo-text p {
    font-size: 1.1rem;
  }

  .demo-image {
    max-width: 100%;
    margin: 0 auto;
  }

  .features {
    padding: 60px 20px;
  }

  .section-header h2 {
    font-size: 2.2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .testimonials {
    padding: 60px 20px;
  }

  .testimonials h2 {
    font-size: 2.2rem;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .testimonial-card {
    padding: 24px;
  }

  .final-cta {
    padding: 60px 20px;
  }

  .cta-content h2 {
    font-size: 2.5rem;
  }

  .cta-content p {
    font-size: 1.1rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-primary, .cta-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .cta-features {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .demo-features {
    display: none;
  }

  .demo-text h2 {
    font-size: 1.8rem;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .testimonials h2 {
    font-size: 1.8rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }

  .feature-card {
    padding: 24px 16px;
  }

  .testimonial-card {
    padding: 20px;
  }

  .shape {
    display: none; /* Hide floating shapes on very small screens */
  }
}

/* Testimonials Management Styles */
.testimonials-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
}

.btn-admin {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: white;
  padding: 12px 24px;
  border: 2px solid rgba(81, 112, 255, 0.8);
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-admin:hover {
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
  transform: translateY(-2px);
}

.admin-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
}

.btn-edit {
  background: rgba(81, 112, 255, 0.1);
  color: var(--primary-color);
}

.btn-edit:hover {
  background: rgba(81, 112, 255, 0.2);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.testimonial-card {
  position: relative;
}

.stars .fa-star {
  color: #d1d5db;
}

.stars .fa-star.filled {
  color: #fbbf24;
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
  background: var(--bg-primary);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.testimonial-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.avatar-input {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 16px;
}

.star-selector {
  display: flex;
  gap: 4px;
}

.star-btn {
  background: none;
  border: none;
  color: #d1d5db;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.star-btn.active,
.star-btn:hover {
  color: #fbbf24;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.btn-primary {
  background: linear-gradient(135deg, rgba(81, 112, 255, 1) 0%, rgba(41, 52, 136, 0.5) 100%);
  color: white;
  padding: 12px 24px;
  border: 2px solid rgba(81, 112, 255, 0.8);
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 8px 24px rgba(81, 112, 255, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 2px solid rgba(81, 112, 255, 0.2);
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(81, 112, 255, 0.1);
  border-color: rgba(81, 112, 255, 0.4);
}

@media (max-width: 768px) {
  .testimonials-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 20px;
  }
}
</style>
