<template>
  <div class="login-container">
    <div class="login-box">
      <h1>🥊 MMA Live</h1>
      <h2>Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Usuario</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="Ingrese su usuario"
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Ingrese su contraseña"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn-login">
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="demo-credentials">
        <p><strong>Credenciales de Demo:</strong></p>
        <ul>
          <li>Admin: <code>admin / admin123</code></li>
          <li>Juez: <code>juez1 / juez123</code></li>
          <li>Supervisor: <code>supervisor / super123</code></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  console.log('Iniciando login...', new Date().toISOString())

  try {
    console.log('Llamando a authStore.login...', new Date().toISOString())
    const startTime = Date.now()
    
    const result = await authStore.login(username.value, password.value)
    
    const elapsedTime = Date.now() - startTime
    console.log(`Login completado en ${elapsedTime}ms`, new Date().toISOString())

    if (result.success) {
      console.log('Login exitoso, redirigiendo...', new Date().toISOString())
      // Redirigir inmediatamente sin esperar WebSocket
      const redirect = route.query.redirect || '/dashboard'
      router.push(redirect)
      
      // NO conectar WebSocket automáticamente - solo cuando sea necesario
      // El WebSocket se conectará cuando el usuario acceda a páginas que lo requieran
    } else {
      error.value = result.message || 'Error al iniciar sesión'
      loading.value = false
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Error de conexión'
    error.value = `Error: ${errorMessage}. Verifica que el backend esté corriendo en http://localhost:8081`
    loading.value = false
    console.error('Error en login:', err)
    console.error('Detalles del error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      code: err.code
    })
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.demo-credentials {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.demo-credentials p {
  margin-bottom: 0.5rem;
  color: #666;
}

.demo-credentials ul {
  list-style: none;
  padding: 0;
}

.demo-credentials li {
  margin: 0.5rem 0;
  color: #666;
}

.demo-credentials code {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: monospace;
}
</style>
