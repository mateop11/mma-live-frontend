import { defineStore } from 'pinia'
import { authService } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Obtener datos de forma segura
    let user = null
    let token = null
    
    try {
      user = authService.getUser()
      token = authService.getToken()
    } catch (error) {
      console.error('Error al inicializar auth store:', error)
      user = null
      token = null
    }
    
    return {
      user,
      token,
      isAuthenticated: !!token
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isJudge: (state) => state.user?.role === 'JUDGE',
    isSupervisor: (state) => state.user?.role === 'SUPERVISOR',
    userRole: (state) => state.user?.role
  },

  actions: {
    async login(username, password) {
      try {
        console.log('authStore.login: Iniciando petición al backend...')
        const startTime = Date.now()
        
        const data = await authService.login(username, password)
        
        const elapsedTime = Date.now() - startTime
        console.log(`authStore.login: Respuesta recibida en ${elapsedTime}ms`)
        
        if (data.token) {
          this.user = data.user
          this.token = data.token
          this.isAuthenticated = true
          return { success: true }
        } else {
          return {
            success: false,
            message: 'No se recibió token del servidor'
          }
        }
      } catch (error) {
        console.error('authStore.login: Error capturado:', error)
        return {
          success: false,
          message: error.response?.data?.message || error.message || 'Error al iniciar sesión'
        }
      }
    },

    async fetchUser() {
      try {
        const user = await authService.me()
        this.user = user
        return user
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      authService.logout()
      this.user = null
      this.token = null
      this.isAuthenticated = false
    }
  }
})
