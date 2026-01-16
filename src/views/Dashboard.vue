<template>
  <div class="container">
    <h1>Dashboard - Administrador</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Peleadores</h3>
        <p class="stat-number">{{ fighterStore.fighters.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Peleas</h3>
        <p class="stat-number">{{ boutStore.bouts.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Peleas en Vivo</h3>
        <p class="stat-number">{{ boutStore.liveBouts.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Peleas Programadas</h3>
        <p class="stat-number">{{ scheduledBouts.length }}</p>
      </div>
    </div>

    <div class="dashboard-actions">
      <router-link to="/admin/fighters" class="action-card">
        <h3>Gestionar Peleadores</h3>
        <p>Crear, editar o eliminar peleadores</p>
      </router-link>
      
      <router-link to="/admin/bouts" class="action-card">
        <h3>Gestionar Peleas</h3>
        <p>Crear, editar o eliminar peleas</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFighterStore } from '../stores/fighters'
import { useBoutStore } from '../stores/bouts'

const fighterStore = useFighterStore()
const boutStore = useBoutStore()

const scheduledBouts = computed(() => {
  return boutStore.bouts.filter(b => b.status === 'SCHEDULED')
})

onMounted(async () => {
  await Promise.all([
    fighterStore.fetchAll(),
    boutStore.fetchAll(),
    boutStore.fetchLive()
  ])
})
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.dashboard-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.action-card h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #666;
}
</style>
