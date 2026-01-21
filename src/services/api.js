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

// Convierte peso en kg a categoría de peso del backend (MAYÚSCULAS)
const weightToCategory = (weight) => {
  if (!weight) return 'LIGHTWEIGHT'
  const w = parseInt(weight)
  if (w <= 52) return 'STRAWWEIGHT'
  if (w <= 57) return 'FLYWEIGHT'
  if (w <= 61) return 'BANTAMWEIGHT'
  if (w <= 66) return 'FEATHERWEIGHT'
  if (w <= 70) return 'LIGHTWEIGHT'
  if (w <= 77) return 'WELTERWEIGHT'
  if (w <= 84) return 'MIDDLEWEIGHT'
  if (w <= 93) return 'LIGHT_HEAVYWEIGHT'
  if (w <= 120) return 'HEAVYWEIGHT'
  return 'SUPER_HEAVYWEIGHT'
}

// Convierte categoría del backend a peso aproximado
const categoryToWeight = (category) => {
  if (!category) return 70
  const cat = category.toUpperCase()
  if (cat.includes('STRAW')) return 52
  if (cat.includes('FLY')) return 57
  if (cat.includes('BANTAM')) return 61
  if (cat.includes('FEATHER')) return 66
  if (cat.includes('LIGHT') && cat.includes('HEAVY')) return 93
  if (cat.includes('LIGHT')) return 70
  if (cat.includes('WELTER')) return 77
  if (cat.includes('MIDDLE')) return 84
  if (cat.includes('HEAVY')) return 120
  return 70
}

// Convierte datos del FRONTEND al formato del BACKEND
const fighterToBackend = (data) => {
  // Parsear nombre si viene como un solo campo
  let firstName = data.firstName || ''
  let lastName = data.lastName || ''
  
  if (data.name && !firstName) {
    const nameParts = data.name.trim().split(/\s+/)
    firstName = nameParts[0] || ''
    lastName = nameParts.slice(1).join(' ') || ''
  }
  
  // Si solo hay un nombre, usarlo como firstName
  if (!lastName && firstName) {
    lastName = ''
  }

  const backendData = {
    firstName: firstName,
    lastName: lastName,
    categoryWeight: weightToCategory(data.weight),
    club: data.style || data.club || '',
    recordW: parseInt(data.wins) || parseInt(data.recordW) || 0,
    recordL: parseInt(data.losses) || parseInt(data.recordL) || 0,
    recordD: parseInt(data.draws) || parseInt(data.recordD) || 0,
    status: data.status || 'Active'
  }
  
  console.log('fighterToBackend - Input:', data)
  console.log('fighterToBackend - Output:', backendData)
  
  return backendData
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
  
  // Admin: Crear peleador
  create: async (fighterData) => {
    const backendData = fighterToBackend(fighterData)
    const response = await api.post('/admin/fighters', backendData)
    return fighterToFrontend(response.data)
  },
  
  // Admin: Actualizar peleador
  update: async (id, fighterData) => {
    const backendData = fighterToBackend(fighterData)
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
