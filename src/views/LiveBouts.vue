<template>
  <div class="container">
    <div class="page-header">
      <h1>🔴 Peleas en Vivo</h1>
    </div>

    <div v-if="boutStore.loading" class="loading">Cargando...</div>
    <div v-else-if="boutStore.error" class="error">{{ boutStore.error }}</div>
    <div v-else-if="boutStore.liveBouts.length === 0" class="empty">
      No hay peleas en vivo en este momento
    </div>
    <div v-else class="live-bouts">
      <div
        v-for="bout in boutStore.liveBouts"
        :key="bout.id"
        class="live-bout-card"
        @click="$router.push(`/bouts/${bout.id}`)"
      >
        <div class="live-indicator">
          <span class="live-dot"></span>
          EN VIVO
        </div>
        
        <div class="bout-content">
          <div class="fighter-info">
            <h2>{{ bout.fighter1?.name }}</h2>
            <p>{{ bout.fighter1?.record }}</p>
          </div>
          
          <div class="vs-section">
            <div class="round-info">
              <p>Round {{ bout.currentRound }} / {{ bout.totalRounds }}</p>
            </div>
            <div class="vs">VS</div>
          </div>
          
          <div class="fighter-info">
            <h2>{{ bout.fighter2?.name }}</h2>
            <p>{{ bout.fighter2?.record }}</p>
          </div>
        </div>

        <div class="bout-actions">
          <button @click.stop="$router.push(`/bouts/${bout.id}`)" class="watch-btn">
            Ver Pelea
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBoutStore } from '../stores/bouts'
import wsService from '../services/websocket'

const boutStore = useBoutStore()

onMounted(async () => {
  await boutStore.fetchLive()
  
  // Conectar WebSocket y suscribirse a actualizaciones
  try {
    await wsService.connect()
    boutStore.subscribeToBouts()
  } catch (error) {
    console.error('Error al conectar WebSocket:', error)
  }
})
</script>

<style scoped>
.page-header h1 {
  color: #333;
  margin-bottom: 2rem;
}

.live-bouts {
  display: grid;
  gap: 2rem;
}

.live-bout-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 3px solid #e74c3c;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.live-bout-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(231, 76, 60, 0.3);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 1.5rem;
  width: fit-content;
  animation: pulse 2s infinite;
}

.live-dot {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.bout-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.fighter-info {
  text-align: center;
}

.fighter-info h2 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.fighter-info p {
  color: #666;
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.round-info {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
}

.vs {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

.bout-actions {
  display: flex;
  justify-content: center;
}

.watch-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.watch-btn:hover {
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
