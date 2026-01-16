<template>
  <div class="home">
    <div class="hero">
      <h1>🥊 MMA Live System</h1>
      <p>Sistema de gestión de peleas en tiempo real</p>
      <div class="hero-actions">
        <router-link to="/bouts/live" class="btn btn-primary">Ver Peleas en Vivo</router-link>
        <router-link to="/fighters" class="btn btn-secondary">Ver Peleadores</router-link>
      </div>
    </div>

    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Peleas Activas</h3>
          <p class="stat-number">{{ liveBouts.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Peleadores</h3>
          <p class="stat-number">{{ fighters.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Peleas Totales</h3>
          <p class="stat-number">{{ bouts.length }}</p>
        </div>
      </div>

      <section v-if="liveBouts.length > 0" class="live-section">
        <h2>🔴 Peleas en Vivo</h2>
        <div class="bouts-grid">
          <div
            v-for="bout in liveBouts"
            :key="bout.id"
            class="bout-card live"
            @click="$router.push(`/bouts/${bout.id}`)"
          >
            <div class="bout-header">
              <span class="status-badge live">EN VIVO</span>
            </div>
            <div class="bout-fighters">
              <div class="fighter">
                <strong>{{ bout.fighter1?.name || 'N/A' }}</strong>
                <span>vs</span>
                <strong>{{ bout.fighter2?.name || 'N/A' }}</strong>
              </div>
            </div>
            <div class="bout-info">
              <p>Round {{ bout.currentRound || 0 }} / {{ bout.totalRounds || 0 }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="recent-section">
        <h2>Peleas Recientes</h2>
        <div v-if="recentBouts.length === 0" class="empty-state">
          <p>No hay peleas disponibles</p>
        </div>
        <div v-else class="bouts-grid">
          <div
            v-for="bout in recentBouts"
            :key="bout.id"
            class="bout-card"
            @click="$router.push(`/bouts/${bout.id}`)"
          >
            <div class="bout-header">
              <span :class="['status-badge', (bout.status || 'SCHEDULED').toLowerCase()]">
                {{ bout.status || 'SCHEDULED' }}
              </span>
            </div>
            <div class="bout-fighters">
              <div class="fighter">
                <strong>{{ bout.fighter1?.name || 'N/A' }}</strong>
                <span>vs</span>
                <strong>{{ bout.fighter2?.name || 'N/A' }}</strong>
              </div>
            </div>
            <div class="bout-info">
              <p>{{ formatDate(bout.scheduledDate) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBoutStore } from '../stores/bouts'
import { useFighterStore } from '../stores/fighters'

const boutStore = useBoutStore()
const fighterStore = useFighterStore()

const liveBouts = computed(() => boutStore.liveBouts || [])
const bouts = computed(() => boutStore.bouts || [])
const fighters = computed(() => fighterStore.fighters || [])

const recentBouts = computed(() => {
  const allBouts = [...boutStore.bouts]
  return allBouts
    .sort((a, b) => {
      const dateA = a.scheduledDate ? new Date(a.scheduledDate) : new Date(0)
      const dateB = b.scheduledDate ? new Date(b.scheduledDate) : new Date(0)
      return dateB - dateA
    })
    .slice(0, 6)
})

onMounted(async () => {
  try {
    await Promise.all([
      boutStore.fetchAll(),
      boutStore.fetchLive(),
      fighterStore.fetchAll()
    ])
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return 'Fecha no disponible'
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
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

.live-section, .recent-section {
  margin: 3rem 0;
}

.live-section h2, .recent-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.bouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.bout-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.bout-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.bout-card.live {
  border: 2px solid #e74c3c;
}

.bout-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
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

.bout-fighters {
  margin-bottom: 1rem;
}

.fighter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.bout-info {
  color: #666;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
