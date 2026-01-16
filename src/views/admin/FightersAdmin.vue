<template>
  <div class="container">
    <div class="page-header">
      <h1>Gestionar Peleadores</h1>
      <button @click="showModal = true" class="btn-primary">+ Agregar Peleador</button>
    </div>

    <div v-if="fighterStore.loading" class="loading">Cargando...</div>
    <div v-else-if="fighterStore.error" class="error">{{ fighterStore.error }}</div>
    <div v-else class="fighters-table">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Peso</th>
            <th>Estilo</th>
            <th>Record</th>
            <th>País</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fighter in fighterStore.fighters" :key="fighter.id">
            <td>{{ fighter.name }}</td>
            <td>{{ fighter.weight }} kg</td>
            <td>{{ fighter.style }}</td>
            <td>{{ fighter.wins }}-{{ fighter.losses }}-{{ fighter.draws }}</td>
            <td>{{ fighter.country }}</td>
            <td>
              <button @click="editFighter(fighter)" class="btn-edit">Editar</button>
              <button @click="deleteFighter(fighter.id)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <h2>{{ editingFighter ? 'Editar' : 'Nuevo' }} Peleador</h2>
        <form @submit.prevent="saveFighter">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Peso (kg)</label>
            <input v-model.number="form.weight" type="number" required />
          </div>
          <div class="form-group">
            <label>Estilo</label>
            <input v-model="form.style" required />
          </div>
          <div class="form-group">
            <label>Victorias</label>
            <input v-model.number="form.wins" type="number" required />
          </div>
          <div class="form-group">
            <label>Derrotas</label>
            <input v-model.number="form.losses" type="number" required />
          </div>
          <div class="form-group">
            <label>Empates</label>
            <input v-model.number="form.draws" type="number" required />
          </div>
          <div class="form-group">
            <label>País</label>
            <input v-model="form.country" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useFighterStore } from '../../stores/fighters'

const fighterStore = useFighterStore()
const showModal = ref(false)
const editingFighter = ref(null)

const form = reactive({
  name: '',
  weight: 0,
  style: '',
  wins: 0,
  losses: 0,
  draws: 0,
  country: ''
})

onMounted(() => {
  fighterStore.fetchAll()
})

const editFighter = (fighter) => {
  editingFighter.value = fighter
  Object.assign(form, fighter)
  showModal.value = true
}

const resetForm = () => {
  editingFighter.value = null
  Object.assign(form, {
    name: '',
    weight: 0,
    style: '',
    wins: 0,
    losses: 0,
    draws: 0,
    country: ''
  })
}

const saveFighter = async () => {
  try {
    if (editingFighter.value) {
      await fighterStore.updateFighter(editingFighter.value.id, form)
    } else {
      await fighterStore.createFighter(form)
    }
    showModal.value = false
    resetForm()
  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const deleteFighter = async (id) => {
  if (confirm('¿Está seguro de eliminar este peleador?')) {
    try {
      await fighterStore.deleteFighter(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #333;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

.fighters-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #667eea;
  color: white;
}

th, td {
  padding: 1rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e0e0e0;
}

tbody tr:hover {
  background: #f5f5f5;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-save {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-save {
  background: #667eea;
  color: white;
}
</style>
