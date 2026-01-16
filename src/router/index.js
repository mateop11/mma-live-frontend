import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true, hideNav: true }
  },
  {
    path: '/fighters',
    name: 'Fighters',
    component: () => import('../views/Fighters.vue')
  },
  {
    path: '/fighters/:id',
    name: 'FighterDetail',
    component: () => import('../views/FighterDetail.vue')
  },
  {
    path: '/bouts',
    name: 'Bouts',
    component: () => import('../views/Bouts.vue')
  },
  {
    path: '/bouts/live',
    name: 'LiveBouts',
    component: () => import('../views/LiveBouts.vue')
  },
  {
    path: '/bouts/:id',
    name: 'BoutDetail',
    component: () => import('../views/BoutDetail.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/fighters',
    name: 'AdminFighters',
    component: () => import('../views/admin/FightersAdmin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/bouts',
    name: 'AdminBouts',
    component: () => import('../views/admin/BoutsAdmin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/judge/bouts',
    name: 'JudgeBouts',
    component: () => import('../views/judge/JudgeBouts.vue'),
    meta: { requiresAuth: true, requiresJudge: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación simplificado
router.beforeEach((to, from, next) => {
  // Verificar autenticación usando localStorage directamente
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const isAuthenticated = !!token
  const isAdmin = user?.role === 'ADMIN'
  const isJudge = user?.role === 'JUDGE'

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Verificar si la ruta requiere ser admin
  if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Home' })
    return
  }

  // Verificar si la ruta requiere ser juez
  if (to.meta.requiresJudge && !isJudge) {
    next({ name: 'Home' })
    return
  }

  // Si el usuario está autenticado y trata de ir a login, redirigir a home
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
