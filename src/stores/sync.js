import { defineStore } from 'pinia'
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore'
import dbFirebase from '../db/firebase'
import db from '../db'
import { useLotesStore } from './lotes'

function traducirErrorFirebase(e) {
  const codigo = e.code || ''
  if (codigo === 'resource-exhausted' || codigo === 'quota-exceeded') {
    return 'Límite gratuito de Firestore alcanzado. Esperá al próximo mes o mejorá el plan en Firebase Console.'
  }
  if (codigo === 'permission-denied') {
    return 'Sin permisos. Revisá las reglas de seguridad en Firebase Console.'
  }
  if (codigo === 'unavailable') {
    return 'Firebase no responde. Revisá tu conexión a internet.'
  }
  if (codigo === 'deadline-exceeded') {
    return 'La operación tardó demasiado. Revisá tu conexión.'
  }
  return e.message || 'Error desconocido al sincronizar.'
}

export const useSyncStore = defineStore('sync', {
  state: () => ({
    subiendo: false,
    bajando: false,
    ultimaSync: null,
    error: null,
    errorLimpio: null
  }),

  actions: {
    async subirLotes() {
      this.subiendo = true
      this.error = null
      this.errorLimpio = null
      try {
        const lotesLocales = await db.lotes.toArray()
        const idsLocales = new Set(lotesLocales.map(l => String(l.id)))
        const querySnapshot = await getDocs(collection(dbFirebase, 'lotes'))
        const batch = writeBatch(dbFirebase)
        for (const docSnap of querySnapshot.docs) {
          if (!idsLocales.has(docSnap.id)) {
            batch.delete(docSnap.ref)
          }
        }
        for (const lote of lotesLocales) {
          const ref = doc(dbFirebase, 'lotes', String(lote.id))
          batch.set(ref, JSON.parse(JSON.stringify(lote)))
        }
        await batch.commit()
        this.ultimaSync = new Date().toLocaleString('es-AR')
      } catch (e) {
        this.error = e.message
        this.errorLimpio = traducirErrorFirebase(e)
        throw e
      } finally {
        this.subiendo = false
      }
    },

    async bajarLotes() {
      this.bajando = true
      this.error = null
      this.errorLimpio = null
      try {
        const querySnapshot = await getDocs(collection(dbFirebase, 'lotes'))
        const lotes = []
        querySnapshot.forEach((doc) => {
          lotes.push(doc.data())
        })
        if (lotes.length === 0) return
        await db.lotes.clear()
        await db.lotes.bulkAdd(lotes)
        const lotesStore = useLotesStore()
        await lotesStore.cargarLotes()
        this.ultimaSync = new Date().toLocaleString('es-AR')
      } catch (e) {
        this.error = e.message
        this.errorLimpio = traducirErrorFirebase(e)
        throw e
      } finally {
        this.bajando = false
      }
    }
  }
})
