<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      {{ esEdicion ? 'Editar Lote' : 'Nuevo Lote' }}
    </h1>

    <form @submit.prevent="guardar" class="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-100 p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Lote</label>
        <input
          v-model="form.nombre"
          type="text"
          required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          placeholder="Ej: Lote 4, Campo Norte..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
        <button
          type="button"
          @click="abrirMapa"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition"
        >
          <span v-if="form.ubicacion" class="flex items-center gap-1.5">
            <Icon icon="ph:map-pin-fill" class="w-4 h-4 flex-shrink-0" />
            {{ form.ubicacion.nombre || form.ubicacion.lat.toFixed(4) + ', ' + form.ubicacion.lng.toFixed(4) }}
          </span>
          <span v-else>Seleccionar ubicación en el mapa</span>
        </button>
      </div>

      <GoogleMapPicker
        v-if="mostrarMapa"
        @seleccionar="onUbicacionSeleccionada"
        @cerrar="mostrarMapa = false"
      />

      <div class="flex gap-3 pt-2">
        <router-link to="/" class="flex-1 text-center font-medium px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Cancelar
        </router-link>
        <button type="submit" class="flex-1 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition shadow-sm">
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
