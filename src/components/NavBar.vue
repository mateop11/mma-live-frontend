<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <router-link to="/" class="logo">
          🥊 MMA Live
        </router-link>
        
        <div class="nav-links">
          <router-link to="/">Inicio</router-link>
          <router-link to="/fighters">Peleadores</router-link>
          <router-link to="/bouts">Peleas</router-link>
          <router-link to="/bouts/live" class="live-link">🔴 En Vivo</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link v-if="authStore.isAdmin" to="/dashboard">Dashboard</router-link>
            <router-link v-if="authStore.isJudge" to="/judge/bouts">Panel Juez</router-link>
            <span class="user-info">{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="logout-btn">Salir</button>
          </template>
          <template v-else>
            <router-link to="/login">Iniciar Sesión</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    const wsService = (await import('../services/websocket')).default
    wsService.disconnect()
  } catch (error) {
    console.error('Error al desconectar WebSocket:', error)
  }
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.nav-links a.router-link-active {
  border-bottom: 2px solid white;
}

.live-link {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.user-info {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
