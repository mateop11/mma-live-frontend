<template>
  <div class="container">
    <div v-if="boutStore.loading" class="loading">Cargando...</div>
    <div v-else-if="boutStore.error" class="error">{{ boutStore.error }}</div>
    <div v-else-if="boutStore.currentBout" class="bout-detail">
      <router-link to="/bouts" class="back-link">← Volver a Peleas</router-link>
      
      <div class="bout-header-card">
        <div v-if="boutStore.currentBout.status === 'LIVE'" class="live-banner">
          <span class="live-dot"></span>
          EN VIVO
        </div>
        
        <div class="bout-fighters-header">
          <div class="fighter-header">
            <h2>{{ boutStore.currentBout.fighter1?.name }}</h2>
            <p>{{ boutStore.currentBout.fighter1?.record }}</p>
          </div>
          <div class="vs-large">VS</div>
          <div class="fighter-header">
            <h2>{{ boutStore.currentBout.fighter2?.name }}</h2>
            <p>{{ boutStore.currentBout.fighter2?.record }}</p>
          </div>
        </div>

        <div class="bout-info">
          <p><strong>Estado:</strong> {{ boutStore.currentBout.status }}</p>
          <p><strong>Round:</strong> {{ boutStore.currentBout.currentRound }} / {{ boutStore.currentBout.totalRounds }}</p>
          <p v-if="boutStore.currentBout.winner">
            <strong>Ganador:</strong> {{ boutStore.currentBout.winner.name }}
          </p>
        </div>
      </div>

      <div
        v-if="authStore.isJudge && ['SCHEDULED', 'LIVE', 'PAUSED'].includes(boutStore.currentBout.status)"
        class="judge-controls"
      >
        <h3>Controles del Juez</h3>
        <div class="controls-grid">
          <button @click="handleStart" :disabled="boutStore.currentBout.status !== 'SCHEDULED'">Iniciar</button>
          <button @click="handlePause" :disabled="boutStore.currentBout.status !== 'LIVE'">Pausar</button>
          <button @click="handleResume" :disabled="boutStore.currentBout.status !== 'PAUSED'">Reanudar</button>
          <button @click="handleNextRound" :disabled="boutStore.currentBout.status !== 'LIVE'">Siguiente Round</button>
          <button @click="handleFinish" :disabled="boutStore.currentBout.status !== 'LIVE'">Finalizar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoutStore } from '../stores/bouts'
import { useAuthStore } from '../stores/auth'
import wsService from '../services/websocket'

const route = useRoute()
const boutStore = useBoutStore()
const authStore = useAuthStore()

onMounted(async () => {
  await boutStore.fetchById(route.params.id)
  
  // Conectar WebSocket y suscribirse a actualizaciones de esta pelea
  try {
    await wsService.connect()
    boutStore.subscribeToBout(route.params.id)
  } catch (error) {
    console.error('Error al conectar WebSocket:', error)
  }
})

onUnmounted(() => {
  boutStore.unsubscribeFromBout(route.params.id)
})

const handleStart = async () => {
  try {
    await boutStore.startBout(route.params.id)
  } catch (error) {
    alert('Error al iniciar la pelea: ' + error.message)
  }
}

const handlePause = async () => {
  try {
    await boutStore.pauseBout(route.params.id)
  } catch (error) {
    alert('Error al pausar la pelea: ' + error.message)
  }
}

const handleResume = async () => {
  try {
    await boutStore.resumeBout(route.params.id)
  } catch (error) {
    alert('Error al reanudar la pelea: ' + error.message)
  }
}

const handleNextRound = async () => {
  try {
    await boutStore.nextRound(route.params.id)
  } catch (error) {
    alert('Error al avanzar al siguiente round: ' + error.message)
  }
}

const handleFinish = async () => {
  if (confirm('¿Está seguro de finalizar esta pelea?')) {
    try {
      await boutStore.finishBout(route.params.id)
    } catch (error) {
      alert('Error al finalizar la pelea: ' + error.message)
    }
  }
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #667eea;
  text-decoration: none;
}

.bout-header-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
}

.live-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e74c3c;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 1.5rem;
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

.bout-fighters-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
}

.fighter-header {
  text-align: center;
}

.fighter-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.fighter-header p {
  color: #666;
}

.vs-large {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
}

.bout-info {
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.bout-info p {
  color: #666;
}

.judge-controls {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.judge-controls h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.controls-grid button {
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.controls-grid button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.controls-grid button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading, .error {
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
