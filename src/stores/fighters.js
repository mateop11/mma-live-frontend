import { defineStore } from 'pinia'
import { fighterService } from '../services/api'

export const useFighterStore = defineStore('fighters', {
  state: () => ({
    fighters: [],
    currentFighter: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.fighters = await fighterService.getAll()
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
        this.currentFighter = await fighterService.getById(id)
        return this.currentFighter
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async search(query) {
      this.loading = true
      this.error = null
      try {
        this.fighters = await fighterService.search(query)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createFighter(fighterData) {
      try {
        const newFighter = await fighterService.create(fighterData)
        this.fighters.push(newFighter)
        return newFighter
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateFighter(id, fighterData) {
      try {
        const updated = await fighterService.update(id, fighterData)
        const index = this.fighters.findIndex(f => f.id === id)
        if (index !== -1) {
          this.fighters[index] = updated
        }
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteFighter(id) {
      try {
        await fighterService.delete(id)
        this.fighters = this.fighters.filter(f => f.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})
