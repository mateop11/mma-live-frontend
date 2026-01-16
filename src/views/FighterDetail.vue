<template>
  <div class="container">
    <div v-if="fighterStore.loading" class="loading">Cargando...</div>
    <div v-else-if="fighterStore.error" class="error">{{ fighterStore.error }}</div>
    <div v-else-if="fighterStore.currentFighter" class="fighter-detail">
      <router-link to="/fighters" class="back-link">← Volver a Peleadores</router-link>
      
      <div class="fighter-header">
        <h1>{{ fighterStore.currentFighter.name }}</h1>
        <div class="fighter-stats">
          <div class="stat">
            <span class="stat-label">Record</span>
            <span class="stat-value">
              {{ fighterStore.currentFighter.wins }}-{{ fighterStore.currentFighter.losses }}-{{ fighterStore.currentFighter.draws }}
            </span>
          </div>
          <div class="stat">
            <span class="stat-label">Peso</span>
            <span class="stat-value">{{ fighterStore.currentFighter.weight }} kg</span>
          </div>
          <div class="stat">
            <span class="stat-label">Estilo</span>
            <span class="stat-value">{{ fighterStore.currentFighter.style }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">País</span>
            <span class="stat-value">{{ fighterStore.currentFighter.country }}</span>
          </div>
        </div>
      </div>

      <div class="fighter-details">
        <div class="detail-section">
          <h3>Información Personal</h3>
          <p><strong>Edad:</strong> {{ fighterStore.currentFighter.age || 'N/A' }}</p>
          <p><strong>Altura:</strong> {{ fighterStore.currentFighter.height || 'N/A' }}</p>
          <p><strong>Alcance:</strong> {{ fighterStore.currentFighter.reach || 'N/A' }}</p>
        </div>

        <div class="detail-section">
          <h3>Estadísticas</h3>
          <div class="stats-bar">
            <div class="stat-bar">
              <span>Victorias: {{ fighterStore.currentFighter.wins }}</span>
              <div class="bar" :style="{ width: getWinPercentage() + '%' }"></div>
            </div>
            <div class="stat-bar">
              <span>Derrotas: {{ fighterStore.currentFighter.losses }}</span>
              <div class="bar loss" :style="{ width: getLossPercentage() + '%' }"></div>
            </div>
            <div class="stat-bar">
              <span>Empates: {{ fighterStore.currentFighter.draws }}</span>
              <div class="bar draw" :style="{ width: getDrawPercentage() + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFighterStore } from '../stores/fighters'

const route = useRoute()
const fighterStore = useFighterStore()

onMounted(async () => {
  await fighterStore.fetchById(route.params.id)
})

const getTotalFights = () => {
  const fighter = fighterStore.currentFighter
  return fighter.wins + fighter.losses + fighter.draws
}

const getWinPercentage = () => {
  const total = getTotalFights()
  return total > 0 ? (fighterStore.currentFighter.wins / total) * 100 : 0
}

const getLossPercentage = () => {
  const total = getTotalFights()
  return total > 0 ? (fighterStore.currentFighter.losses / total) * 100 : 0
}

const getDrawPercentage = () => {
  const total = getTotalFights()
  return total > 0 ? (fighterStore.currentFighter.draws / total) * 100 : 0
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #667eea;
  text-decoration: none;
}

.fighter-header {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.fighter-header h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

.fighter-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.fighter-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.detail-section h3 {
  color: #333;
  margin-bottom: 1rem;
}

.detail-section p {
  margin: 0.75rem 0;
  color: #666;
}

.stats-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-bar {
  position: relative;
}

.stat-bar span {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.bar {
  height: 30px;
  background: #667eea;
  border-radius: 5px;
  transition: width 0.3s;
}

.bar.loss {
  background: #e74c3c;
}

.bar.draw {
  background: #f39c12;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #e74c3c;
}
</style>
