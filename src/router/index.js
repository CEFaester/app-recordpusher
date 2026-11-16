import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Mobil App
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'events', name: 'events', component: () => import('@/views/EventsView.vue') },
        { path: 'saved-events', name: 'saved-events', component: () => import('@/views/SavedEventsView.vue') },
        { path: 'points', name: 'points', component: () => import('@/views/PointsView.vue') },
        { path: 'profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
        { path: 'points/:id', name: 'purchase', component: () => import('@/views/PurchaseView.vue') }
      ]
    },
    // Admin (Desktop Layout)
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'events', name: 'admin-events', component: () => import('@/views/admin/AdminEventsView.vue') },
        { path: 'points', name: 'admin-points', component: () => import('@/views/admin/AdminPointsView.vue') }
      ]
    }
  ]
})

export default router
