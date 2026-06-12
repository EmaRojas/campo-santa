<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/" class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
        <Icon icon="ph:caret-left" class="w-5 h-5 text-gray-400" />
      </router-link>
      <h1 class="text-xl font-bold text-gray-800">
        {{ esEdicion ? 'Editar Lote' : 'Nuevo Lote' }}
      </h1>
    </div>

    <form @submit.prevent="guardar" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del Lote</label>
        <input
          v-model="form.nombre"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none bg-gray-50/50"
          placeholder="Ej: Lote 4, Campo Norte..."
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Ubicación</label>
        <button
          type="button"
          @click="abrirMapa"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-left hover:bg-gray-50 transition bg-gray-50/50"
        >
          <span v-if="form.ubicacion" class="flex items-center gap-2">
            <Icon icon="ph:map-pin-fill" class="w-4 h-4 flex-shrink-0 text-mp-blue" />
            <span class="text-sm">{{ form.ubicacion.nombre || form.ubicacion.lat.toFixed(4) + ', ' + form.ubicacion.lng.toFixed(4) }}</span>
          </span>
          <span v-else class="text-sm text-gray-400">Seleccionar ubicación en el mapa</span>
        </button>
      </div>

      <GoogleMapPicker
        v-if="mostrarMapa"
        @seleccionar="onUbicacionSeleccionada"
        @cerrar="mostrarMapa = false"
      />

      <div class="flex gap-3 pt-2">
        <router-link to="/" class="flex-1 text-center font-semibold px-5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm">
          Cancelar
        </router-link>
        <button type="submit" class="flex-1 bg-mp-blue text-white font-semibold px-5 py-3 rounded-xl hover:bg-mp-blue-dark transition shadow-sm text-sm">
          {{ esEdicion ? 'Guardar Cambios' : 'Crear Lote' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useLotesStore } from '../stores/lotes'
import GoogleMapPicker from '../components/GoogleMapPicker.vue'

export default {
  name: 'LoteFormView',

  components: { GoogleMapPicker },

  data() {
    return {
      form: {
        nombre: '',
        ubicacion: null,
        activo: true,
        siembras: [],
        cosechas: [],
        liquidos: [],
        lluvias: [],
        desembolsos: []
      },
      mostrarMapa: false,
      store: useLotesStore()
    }
  },

  computed: {
    esEdicion() {
      return !!this.$route.params.id
    }
  },

  created() {
    if (this.esEdicion) {
      const lote = this.store.getLoteById(this.$route.params.id)
      if (lote) {
        this.form = { ...lote }
      }
    }
  },

  methods: {
    abrirMapa() {
      this.mostrarMapa = true
    },

    onUbicacionSeleccionada(ubicacion) {
      this.form.ubicacion = ubicacion
      this.mostrarMapa = false
    },

    async guardar() {
      if (this.esEdicion) {
        this.form.id = Number(this.$route.params.id)
      }
      await this.store.guardarLote(this.form)
      this.$router.push('/')
    }
  }
}
</script>