<template>
  <div class="container">
    <h1>Panel del Juez</h1>
    
    <div v-if="boutStore.loading" class="loading">Cargando...</div>
    <div v-else-if="boutStore.error" class="error">{{ boutStore.error }}</div>
    <div v-else class="judge-bouts">
      <h2>Peleas Asignadas</h2>
      <div v-if="boutStore.bouts.length === 0" class="empty">
        No hay peleas asignadas
      </div>
      <div v-else class="bouts-grid">
        <div
          v-for="bout in boutStore.bouts"
          :key="bout.id"
          class="bout-card"
        >
          <div class="bout-header">
            <span :class="['status-badge', bout.status.toLowerCase()]">
              {{ bout.status }}
            </span>
          </div>
          
          <div class="bout-fighters">
            <div class="fighter">
              <h3>{{ bout.fighter1?.name }}</h3>
              <p>{{ bout.fighter1?.record }}</p>
            </div>
            <div class="vs">VS</div>
            <div class="fighter">
              <h3>{{ bout.fighter2?.name }}</h3>
              <p>{{ bout.fighter2?.record }}</p>
            </div>
          </div>

          <div class="bout-info">
            <p>Round: {{ bout.currentRound }} / {{ bout.totalRounds }}</p>
            <p>Fecha: {{ formatDate(bout.scheduledDate) }}</p>
          </div>

          <div class="bout-actions">
            <router-link :to="`/bouts/${bout.id}`" class="btn-control">
              Gestionar Pelea
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBoutStore } from '../../stores/bouts'

const boutStore = useBoutStore()

onMounted(async () => {
  // Cargar peleas asignadas al juez
  await boutStore.fetchAll()
})

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES')
}
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.bouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.bout-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.bout-header {
  margin-bottom: 1.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.live {
  background: #e74c3c;
  color: white;
}

.status-badge.scheduled {
  background: #3498db;
  color: white;
}

.bout-fighters {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.fighter {
  text-align: center;
}

.fighter h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.fighter p {
  color: #666;
  font-size: 0.9rem;
}

.vs {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.bout-info {
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.bout-info p {
  color: #666;
  margin: 0.5rem 0;
}

.bout-actions {
  display: flex;
  justify-content: center;
}

.btn-control {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: transform 0.2s;
  display: inline-block;
}

.btn-control:hover {
  transform: translateY(-2px);
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #e74c3c;
}
</style>
