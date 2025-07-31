import { createRouter, createWebHistory } from 'vue-router'
import AddCompany from '../components/Compony/AddCompany.vue'

const routes = [
  {
    path: '/my-companys',
    name: 'AddCompany',
    component: AddCompany,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
