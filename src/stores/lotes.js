import { defineStore } from 'pinia'
import db from '../db'

export const useLotesStore = defineStore('lotes', {
  state: () => ({
    lotes: [],
    loading: false
  }),

  getters: {
    getLoteById: (state) => (id) => {
      return state.lotes.find(l => l.id === Number(id))
    }
  },

  actions: {
    async cargarLotes() {
      this.loading = true
      try {
        this.lotes = await db.lotes.toArray()
      } finally {
        this.loading = false
      }
    },

    async guardarLote(lote) {
      const data = JSON.parse(JSON.stringify(lote))
      if (data.id) {
        await db.lotes.put(data)
      } else {
        await db.lotes.add(data)
      }
      await this.cargarLotes()
    },

    async toggleActivoLote(id) {
      const lote = await db.lotes.get(id)
      if (lote) {
        lote.activo = lote.activo === false ? true : false
        await db.lotes.put(lote)
        await this.cargarLotes()
      }
    },

    async eliminarLote(id) {
      await db.lotes.delete(id)
      await this.cargarLotes()
    }
  }
})
