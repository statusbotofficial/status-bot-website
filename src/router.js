import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Commands from './views/Commands.vue'
import Premium from './views/Premium.vue'
import Support from './views/Support.vue'
import Status from './views/Status.vue'
import Servers from './views/Servers.vue'
import Settings from './views/Settings.vue'
import Privacy from './views/Privacy.vue'
import Terms from './views/Terms.vue'
import Docs from './views/Docs.vue'
import Dev from './views/Dev.vue'
import Redirect from './views/Redirect.vue'
import FormBuilder from './views/FormBuilder.vue'
import ApplicationForm from './views/ApplicationForm.vue'
import ApplicationsReview from './views/ApplicationsReview.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/commands', component: Commands },
  { path: '/premium', component: Premium },
  { path: '/support', component: Support },
  { path: '/status', component: Status },
  { path: '/servers', component: Servers },
  { path: '/servers/:guildId', component: Servers },
  { path: '/settings', component: Settings },
  { path: '/privacy', component: Privacy },
  { path: '/terms', component: Terms },
  { path: '/docs', component: Docs },
  { path: '/dev', component: Dev },
  { path: '/redirect', component: Redirect },
  { path: '/staff-applications', component: ApplicationForm },
  { path: '/staff/form-builder', component: FormBuilder },
  { path: '/staff/applications-review', component: ApplicationsReview },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
