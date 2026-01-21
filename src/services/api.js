import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// HELPERS: Conversión Frontend <-> Backend
// ============================================

// Convierte peso en kg a categoría de peso del backend
const weightToCategory = (weight) => {
  if (!weight) return 'Lightweight'
  if (weight <= 52) return 'Strawweight'
  if (weight <= 57) return 'Flyweight'
  if (weight <= 61) return 'Bantamweight'
  if (weight <= 66) return 'Featherweight'
  if (weight <= 70) return 'Lightweight'
  if (weight <= 77) return 'Welterweight'
  if (weight <= 84) return 'Middleweight'
  if (weight <= 93) return 'Light_Heavyweight'
  if (weight <= 120) return 'Heavyweight'
  return 'Super_Heavyweight'
}

// Convierte categoría del backend a peso aproximado
const categoryToWeight = (category) => {
  if (!category) return 70
  const cat = category.toLowerCase()
  if (cat.includes('straw')) return 52
  if (cat.includes('fly')) return 57
  if (cat.includes('bantam')) return 61
  if (cat.includes('feather')) return 66
  if (cat.includes('light') && cat.includes('heavy')) return 93
  if (cat.includes('light')) return 70
  if (cat.includes('welter')) return 77
  if (cat.includes('middle')) return 84
  if (cat.includes('heavy')) return 120
  return 70
}

// Convierte datos del FRONTEND al formato del BACKEND
const fighterToBackend = (data) => {
  const nameParts = (data.name || '').trim().split(/\s+/)
  return {
    firstName: nameParts[0] || data.firstName || '',
    lastName: nameParts.slice(1).join(' ') || data.lastName || '',
    categoryWeight: weightToCategory(data.weight),
    club: data.club || data.style || '',
    recordW: data.wins ?? data.recordW ?? 0,
    recordL: data.losses ?? data.recordL ?? 0,
    recordD: data.draws ?? data.recordD ?? 0,
    status: data.status || 'Active'
  }
}

// Convierte datos del BACKEND al formato del FRONTEND
const fighterToFrontend = (data) => {
  return {
    id: data.id,
    name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    firstName: data.firstName,
    lastName: data.lastName,
    weight: data.weight || categoryToWeight(data.categoryWeight),
    categoryWeight: data.categoryWeight,
    style: data.style || data.club || '',
    club: data.club,
    wins: data.wins ?? data.recordW ?? 0,
    losses: data.losses ?? data.recordL ?? 0,
    draws: data.draws ?? data.recordD ?? 0,
    recordW: data.recordW,
    recordL: data.recordL,
    recordD: data.recordD,
    country: data.country || '',
    status: data.status
  }
}

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      console.log('Respuesta del servidor:', response.data)
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
        const user = {
          id: response.data.id,
          username: response.data.username,
          fullName: response.data.fullName,
          role: response.data.role
        }
        localStorage.setItem('user', JSON.stringify(user))
        return { token: response.data.token, user }
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message)
      throw error
    }
  },
  
  me: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  getToken: () => localStorage.getItem('token'),
  
  getUser: () => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr || userStr === 'undefined' || userStr === 'null') return null
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Error al parsear usuario:', error)
      localStorage.removeItem('user')
      return null
    }
  }
}

// ============================================
// SERVICIO DE PELEADORES
// ============================================
export const fighterService = {
  getAll: async () => {
    const response = await api.get('/public/fighters')
    // Convertir respuesta al formato del frontend
    return response.data.map(fighterToFrontend)
  },
  
  getById: async (id) => {
    const response = await api.get(`/public/fighters/${id}`)
    return fighterToFrontend(response.data)
  },
  
  search: async (query) => {
    const response = await api.get('/fighters/search', { params: { q: query } })
    return response.data.map(fighterToFrontend)
  },
  
  // Admin: Crear peleador (convierte formato)
  create: async (fighterData) => {
    console.log('Frontend data:', fighterData)
    const backendData = fighterToBackend(fighterData)
    console.log('Backend data:', backendData)
    const response = await api.post('/admin/fighters', backendData)
    return fighterToFrontend(response.data)
  },
  
  // Admin: Actualizar peleador (convierte formato)
  update: async (id, fighterData) => {
    console.log('Frontend data:', fighterData)
    const backendData = fighterToBackend(fighterData)
    console.log('Backend data:', backendData)
    const response = await api.put(`/admin/fighters/${id}`, backendData)
    return fighterToFrontend(response.data)
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/fighters/${id}`)
    return response.data
  }
}

// ============================================
// SERVICIO DE PELEAS
// ============================================
export const boutService = {
  getAll: async () => {
    const response = await api.get('/public/bouts')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/public/bouts/${id}`)
    return response.data
  },
  
  getLive: async () => {
    const response = await api.get('/public/bouts/live')
    return response.data
  },
  
  create: async (boutData) => {
    const response = await api.post('/admin/bouts', boutData)
    return response.data
  },
  
  update: async (id, boutData) => {
    const response = await api.put(`/admin/bouts/${id}`, boutData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/bouts/${id}`)
    return response.data
  },
  
  // Juez endpoints
  start: async (id) => {
    const response = await api.post(`/judge/bouts/${id}/start`)
    return response.data
  },
  
  pause: async (id) => {
    const response = await api.post(`/judge/bouts/${id}/pause`)
    return response.data
  },
  
  resume: async (id) => {
    const response = await api.post(`/judge/bouts/${id}/resume`)
    return response.data
  },
  
  nextRound: async (id) => {
    const response = await api.post(`/judge/bouts/${id}/next-round`)
    return response.data
  },
  
  finish: async (id, finishData) => {
    const response = await api.post(`/judge/bouts/${id}/finish`, finishData || {})
    return response.data
  },
  
  submitScore: async (boutId, scoreData) => {
    const response = await api.post(`/judge/bouts/${boutId}/score`, scoreData)
    return response.data
  },
  
  getScores: async (boutId) => {
    const response = await api.get(`/judge/bouts/${boutId}/scores`)
    return response.data
  },
  
  calculateResult: async (boutId) => {
    const response = await api.get(`/judge/bouts/${boutId}/calculate-result`)
    return response.data
  }
}

// ============================================
// SERVICIO DE EVENTOS
// ============================================
export const eventService = {
  getAll: async () => {
    const response = await api.get('/public/events')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/public/events/${id}`)
    return response.data
  }
}

// ============================================
// SERVICIO DE ESTADÍSTICAS
// ============================================
export const statsService = {
  getStats: async () => {
    const response = await api.get('/public/stats')
    return response.data
  }
}

export default api
