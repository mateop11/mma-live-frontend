<template>
  <div class="container">
    <div class="page-header">
      <h1>Peleadores</h1>
      <div class="header-actions">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar peleador..."
          class="search-input"
        />
        <router-link v-if="authStore.isAdmin" to="/admin/fighters" class="btn-primary">
          + Agregar Peleador
        </router-link>
      </div>
    </div>

    <div v-if="fighterStore.loading" class="loading">Cargando...</div>
    <div v-else-if="fighterStore.error" class="error">{{ fighterStore.error }}</div>
    <div v-else-if="fighterStore.fighters.length === 0" class="empty">
      No se encontraron peleadores
    </div>
    <div v-else class="fighters-grid">
      <div
        v-for="fighter in fighterStore.fighters"
        :key="fighter.id"
        class="fighter-card"
        @click="$router.push(`/fighters/${fighter.id}`)"
      >
        <div class="fighter-info">
          <h3>{{ fighter.name }}</h3>
          <p class="fighter-detail"><strong>Peso:</strong> {{ fighter.weight }} kg</p>
          <p class="fighter-detail"><strong>Estilo:</strong> {{ fighter.style }}</p>
          <p class="fighter-detail"><strong>Record:</strong> {{ fighter.wins }}-{{ fighter.losses }}-{{ fighter.draws }}</p>
          <p class="fighter-detail"><strong>País:</strong> {{ fighter.country }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFighterStore } from '../stores/fighters'
import { useAuthStore } from '../stores/auth'

const fighterStore = useFighterStore()
const authStore = useAuthStore()
const searchQuery = ref('')

onMounted(() => {
  fighterStore.fetchAll()
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    fighterStore.search(searchQuery.value)
  } else {
    fighterStore.fetchAll()
  }
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  min-width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
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

.fighters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.fighter-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.fighter-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.fighter-info h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.fighter-detail {
  margin: 0.5rem 0;
  color: #666;
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
