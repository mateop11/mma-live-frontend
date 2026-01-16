import { defineStore } from 'pinia'
import { boutService } from '../services/api'
import wsService from '../services/websocket'

export const useBoutStore = defineStore('bouts', {
  state: () => ({
    bouts: [],
    liveBouts: [],
    currentBout: null,
    loading: false,
    error: null
  }),

  getters: {
    getBoutById: (state) => (id) => {
      return state.bouts.find(b => b.id === id) || state.liveBouts.find(b => b.id === id)
    }
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.bouts = await boutService.getAll()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchLive() {
      this.loading = true
      this.error = null
      try {
        this.liveBouts = await boutService.getLive()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      this.error = null
      try {
        this.currentBout = await boutService.getById(id)
        return this.currentBout
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createBout(boutData) {
      try {
        const newBout = await boutService.create(boutData)
        this.bouts.push(newBout)
        return newBout
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateBout(id, boutData) {
      try {
        const updated = await boutService.update(id, boutData)
        const index = this.bouts.findIndex(b => b.id === id)
        if (index !== -1) {
          this.bouts[index] = updated
        }
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteBout(id) {
      try {
        await boutService.delete(id)
        this.bouts = this.bouts.filter(b => b.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Acciones del juez
    async startBout(id) {
      try {
        const updated = await boutService.start(id)
        this.updateBoutInState(updated)
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async pauseBout(id) {
      try {
        const updated = await boutService.pause(id)
        this.updateBoutInState(updated)
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async resumeBout(id) {
      try {
        const updated = await boutService.resume(id)
        this.updateBoutInState(updated)
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async nextRound(id) {
      try {
        const updated = await boutService.nextRound(id)
        this.updateBoutInState(updated)
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async finishBout(id) {
      try {
        const updated = await boutService.finish(id)
        this.updateBoutInState(updated)
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    updateBoutInState(updatedBout) {
      // Actualizar en lista de peleas
      const index = this.bouts.findIndex(b => b.id === updatedBout.id)
      if (index !== -1) {
        this.bouts[index] = updatedBout
      }

      // Actualizar en peleas en vivo
      const liveIndex = this.liveBouts.findIndex(b => b.id === updatedBout.id)
      if (liveIndex !== -1) {
        this.liveBouts[liveIndex] = updatedBout
      } else if (updatedBout.status === 'LIVE') {
        this.liveBouts.push(updatedBout)
      } else if (updatedBout.status !== 'LIVE') {
        this.liveBouts = this.liveBouts.filter(b => b.id !== updatedBout.id)
      }

      // Actualizar pelea actual
      if (this.currentBout?.id === updatedBout.id) {
        this.currentBout = updatedBout
      }
    },

    // WebSocket subscriptions
    subscribeToBouts() {
      wsService.subscribe('/topic/bouts', (data) => {
        this.updateBoutInState(data)
      })
    },

    subscribeToBout(boutId) {
      wsService.subscribe(`/topic/bout/${boutId}`, (data) => {
        this.updateBoutInState(data)
      })

      wsService.subscribe(`/topic/bout/${boutId}/scores`, (data) => {
        if (this.currentBout?.id === boutId) {
          this.currentBout.scores = data
        }
      })
    },

    unsubscribeFromBout(boutId) {
      wsService.unsubscribe(`/topic/bout/${boutId}`)
      wsService.unsubscribe(`/topic/bout/${boutId}/scores`)
    }
  }
})
