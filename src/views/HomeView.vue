<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Mis Lotes</h1>
      <router-link to="/lote/nuevo" class="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition shadow-sm">
        + Nuevo Lote
      </router-link>
    </div>

    <div v-if="store.loading" class="text-center py-8 text-gray-500">
      Cargando...
    </div>

    <div v-else-if="store.lotes.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-lg">No tenés lotes cargados aún.</p>
      <p class="mt-2">Presioná "+ Nuevo Lote" para empezar.</p>
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">{{ lotesVisibles.length }} lote{{ lotesVisibles.length !== 1 ? 's' : '' }}</p>
        <button v-if="lotesInactivos.length > 0" @click="mostrarInactivos = !mostrarInactivos" class="text-xs text-gray-400 hover:text-gray-600 transition">
          {{ mostrarInactivos ? 'Ocultar inactivos' : `Mostrar ${lotesInactivos.length} inactivo${lotesInactivos.length !== 1 ? 's' : ''}` }}
        </button>
      </div>
      <div class="space-y-3">
        <router-link
          v-for="lote in lotesVisibles"
          :key="lote.id"
          :to="`/lote/${lote.id}`"
          class="block bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-100 p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all"
          :class="{ 'opacity-50': lote.activo === false }"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg" :class="lote.activo === false ? 'text-gray-400' : 'text-gray-800'">{{ lote.nombre }}</h2>
              <p v-if="lote.ubicacion" class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Icon icon="ph:map-pin-fill" class="w-4 h-4" />
                {{ lote.ubicacion.nombre || lote.ubicacion.lat.toFixed(4) + ', ' + lote.ubicacion.lng.toFixed(4) }}
              </p>
            </div>
            <Icon icon="ph:caret-right-fill" class="w-5 h-5 text-gray-400" />
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { useLotesStore } from '../stores/lotes'

export default {
  name: 'HomeView',

  data() {
    return {
      store: useLotesStore(),
      mostrarInactivos: false
    }
  },

  computed: {
    lotesActivos() {
      return this.store.lotes.filter(l => l.activo !== false)
    },
    lotesInactivos() {
      return this.store.lotes.filter(l => l.activo === false)
    },
    lotesVisibles() {
      return this.mostrarInactivos ? this.store.lotes : this.lotesActivos
    }
  },

  created() {
    this.store.cargarLotes()
  }
}
</script>
