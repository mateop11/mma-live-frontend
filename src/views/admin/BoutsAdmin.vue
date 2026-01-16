<template>
  <div class="container">
    <div class="page-header">
      <h1>Gestionar Peleas</h1>
      <button @click="showModal = true" class="btn-primary">+ Agregar Pelea</button>
    </div>

    <div v-if="boutStore.loading" class="loading">Cargando...</div>
    <div v-else-if="boutStore.error" class="error">{{ boutStore.error }}</div>
    <div v-else class="bouts-list">
      <div v-for="bout in boutStore.bouts" :key="bout.id" class="bout-admin-card">
        <div class="bout-info">
          <h3>{{ bout.fighter1?.name }} vs {{ bout.fighter2?.name }}</h3>
          <p><strong>Estado:</strong> {{ bout.status }}</p>
          <p><strong>Rounds:</strong> {{ bout.totalRounds }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(bout.scheduledDate) }}</p>
        </div>
        <div class="bout-actions">
          <button @click="editBout(bout)" class="btn-edit">Editar</button>
          <button @click="deleteBout(bout.id)" class="btn-delete">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar pelea -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <h2>{{ editingBout ? 'Editar' : 'Nueva' }} Pelea</h2>
        <form @submit.prevent="saveBout">
          <div class="form-group">
            <label>Peleador 1 ID</label>
            <input v-model.number="form.fighter1Id" type="number" required />
          </div>
          <div class="form-group">
            <label>Peleador 2 ID</label>
            <input v-model.number="form.fighter2Id" type="number" required />
          </div>
          <div class="form-group">
            <label>Rounds</label>
            <input v-model.number="form.totalRounds" type="number" required />
          </div>
          <div class="form-group">
            <label>Fecha Programada</label>
            <input v-model="form.scheduledDate" type="datetime-local" required />
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
import { useBoutStore } from '../../stores/bouts'

const boutStore = useBoutStore()
const showModal = ref(false)
const editingBout = ref(null)

const form = reactive({
  fighter1Id: null,
  fighter2Id: null,
  totalRounds: 3,
  scheduledDate: ''
})

onMounted(() => {
  boutStore.fetchAll()
})

const editBout = (bout) => {
  editingBout.value = bout
  form.fighter1Id = bout.fighter1?.id
  form.fighter2Id = bout.fighter2?.id
  form.totalRounds = bout.totalRounds
  form.scheduledDate = bout.scheduledDate ? new Date(bout.scheduledDate).toISOString().slice(0, 16) : ''
  showModal.value = true
}

const resetForm = () => {
  editingBout.value = null
  Object.assign(form, {
    fighter1Id: null,
    fighter2Id: null,
    totalRounds: 3,
    scheduledDate: ''
  })
}

const saveBout = async () => {
  try {
    if (editingBout.value) {
      await boutStore.updateBout(editingBout.value.id, form)
    } else {
      await boutStore.createBout(form)
    }
    showModal.value = false
    resetForm()
  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const deleteBout = async (id) => {
  if (confirm('¿Está seguro de eliminar esta pelea?')) {
    try {
      await boutStore.deleteBout(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.bouts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bout-admin-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bout-info h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.bout-info p {
  color: #666;
  margin: 0.25rem 0;
}

.bout-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
