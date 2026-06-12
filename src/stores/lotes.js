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
    },

    resumenFinanciero(state) {
      let ARS = 0, USD = 0, cantidad = 0
      for (const lote of state.lotes) {
        if (lote.activo === false) continue
        for (const d of (lote.desembolsos || [])) {
          const m = Number(d.monto)
          if (isNaN(m)) continue
          const moneda = d.moneda || (m % 1 !== 0 ? 'USD' : 'ARS')
          if (moneda === 'USD') USD += m
          else ARS += m
          cantidad++
        }
      }
      return {
        ARS: Math.round(ARS * 100) / 100,
        USD: Math.round(USD * 100) / 100,
        cantidad
      }
    },

    ultimasActividades(state) {
      const eventos = []
      for (const lote of state.lotes) {
        if (lote.activo === false) continue
        for (const s of (lote.siembras || []))
          eventos.push({ tipo: 'siembra', icon: 'plant-fill', fecha: s.fecha, desc: s.variedad, loteNombre: lote.nombre, loteId: lote.id })
        for (const c of (lote.cosechas || []))
          eventos.push({ tipo: 'cosecha', icon: 'grains-fill', fecha: c.fecha, desc: c.variedad, loteNombre: lote.nombre, loteId: lote.id })
        for (const liq of (lote.liquidos || []))
          eventos.push({ tipo: 'liquido', icon: 'flask-fill', fecha: liq.fecha, desc: liq.tipo, loteNombre: lote.nombre, loteId: lote.id })
        for (const lluvia of (lote.lluvias || []))
          eventos.push({ tipo: 'lluvia', icon: 'cloud-rain-fill', fecha: lluvia.fecha, desc: `${lluvia.mm}mm`, loteNombre: lote.nombre, loteId: lote.id })
        for (const d of (lote.desembolsos || []))
          eventos.push({ tipo: 'desembolso', icon: 'wallet-fill', fecha: '', desc: d.descripcion, loteNombre: lote.nombre, loteId: lote.id })
      }
      return eventos
        .filter(e => e.fecha)
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, 5)
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
