import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Timeout de 10 segundos
})

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
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

// Servicio de autenticación
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      console.log('Respuesta del servidor:', response.data)
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
        
        // El backend devuelve: token, username, fullName, role, id
        // Necesitamos convertirlo al formato que espera el frontend
        const user = {
          id: response.data.id,
          username: response.data.username,
          fullName: response.data.fullName,
          role: response.data.role
        }
        localStorage.setItem('user', JSON.stringify(user))
        
        // Devolver en el formato esperado
        return {
          token: response.data.token,
          user: user
        }
      } else {
        throw new Error('Respuesta inválida del servidor: no se recibió token')
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
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null
      }
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Error al parsear usuario:', error)
      localStorage.removeItem('user')
      return null
    }
  }
}

// Servicio de peleadores (público)
export const fighterService = {
  getAll: async () => {
    const response = await api.get('/public/fighters')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/public/fighters/${id}`)
    return response.data
  },
  
  search: async (query) => {
    const response = await api.get('/fighters/search', {
      params: { q: query }
    })
    return response.data
  },
  
  // Admin endpoints
  create: async (fighterData) => {
    const response = await api.post('/admin/fighters', fighterData)
    return response.data
  },
  
  update: async (id, fighterData) => {
    const response = await api.put(`/admin/fighters/${id}`, fighterData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/fighters/${id}`)
    return response.data
  }
}

// Servicio de peleas
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
  
  // Admin endpoints
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
  
  finish: async (id) => {
    const response = await api.post(`/judge/bouts/${id}/finish`)
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

// Servicio de eventos
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

// Servicio de estadísticas
export const statsService = {
  getStats: async () => {
    const response = await api.get('/public/stats')
    return response.data
  }
}

export default api
