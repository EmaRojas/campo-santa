import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/lote/nuevo',
    name: 'NuevoLote',
    component: () => import('../views/LoteFormView.vue')
  },
  {
    path: '/lote/:id',
    name: 'LoteDetalle',
    component: () => import('../views/LoteDetalleView.vue')
  },
  {
    path: '/lote/:id/editar',
    name: 'EditarLote',
    component: () => import('../views/LoteFormView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
