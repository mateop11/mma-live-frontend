<template>
  <div class="container">
    <div class="page-header">
      <h1>Peleas</h1>
      <router-link to="/bouts/live" class="btn-primary">🔴 Ver Peleas en Vivo</router-link>
    </div>

    <div v-if="boutStore.loading" class="loading">Cargando...</div>
    <div v-else-if="boutStore.error" class="error">{{ boutStore.error }}</div>
    <div v-else-if="boutStore.bouts.length === 0" class="empty">
      No se encontraron peleas
    </div>
    <div v-else class="bouts-list">
      <div
        v-for="bout in boutStore.bouts"
        :key="bout.id"
        class="bout-card"
        @click="$router.push(`/bouts/${bout.id}`)"
      >
        <div class="bout-header">
          <span :class="['status-badge', bout.status.toLowerCase()]">
            {{ bout.status }}
          </span>
          <span class="bout-date">{{ formatDate(bout.scheduledDate) }}</span>
        </div>
        <div class="bout-fighters">
          <div class="fighter-card">
            <h3>{{ bout.fighter1?.name }}</h3>
            <p>{{ bout.fighter1?.record }}</p>
          </div>
          <div class="vs">VS</div>
          <div class="fighter-card">
            <h3>{{ bout.fighter2?.name }}</h3>
            <p>{{ bout.fighter2?.record }}</p>
          </div>
        </div>
        <div v-if="bout.winner" class="bout-result">
          <strong>Ganador: {{ bout.winner.name }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBoutStore } from '../stores/bouts'

const boutStore = useBoutStore()

onMounted(() => {
  boutStore.fetchAll()
})

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  color: #333;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.bouts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bout-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.bout-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.bout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  animation: pulse 2s infinite;
}

.status-badge.scheduled {
  background: #3498db;
  color: white;
}

.status-badge.finished {
  background: #95a5a6;
  color: white;
}

.bout-date {
  color: #666;
}

.bout-fighters {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1rem;
}

.fighter-card {
  text-align: center;
}

.fighter-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.fighter-card p {
  color: #666;
  font-size: 0.9rem;
}

.vs {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.bout-result {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
  text-align: center;
  color: #667eea;
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
