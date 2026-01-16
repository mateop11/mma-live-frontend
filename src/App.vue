<template>
  <div id="app">
    <NavBar v-if="showNav" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'

const route = useRoute()
const authStore = useAuthStore()

const showNav = computed(() => {
  try {
    return !route.meta?.hideNav
  } catch (e) {
    return true
  }
})

onMounted(async () => {
  // Si hay token, verificar usuario
  if (authStore.token) {
    try {
      await authStore.fetchUser()
      // NO conectar WebSocket automáticamente - solo cuando sea necesario
    } catch (error) {
      console.error('Error al verificar usuario:', error)
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
