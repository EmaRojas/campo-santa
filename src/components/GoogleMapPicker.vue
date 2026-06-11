<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.15)] max-w-lg w-full max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="font-semibold">Seleccionar ubicación en el mapa</h3>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>

      <form @submit.prevent="buscarLugar" class="p-4 pb-3 space-y-2">
        <div class="flex gap-2">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar lugar (ej: San Antonio de Areco)..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            type="submit"
            class="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition whitespace-nowrap shadow-sm"
          >
            Buscar
          </button>
        </div>
        <div class="space-y-1">
          <span class="text-xs text-gray-400 font-medium">O pegá coordenadas:</span>
          <div class="flex gap-2">
            <input
              v-model="coordPegado"
              type="text"
              placeholder="Ej: (-31.4007153, -63.0671789)"
              class="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="button"
              @click="irACoordenadas"
              class="text-sm bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-600 transition shadow-sm"
            >
              Ir
            </button>
          </div>
        </div>
      </form>

      <div ref="mapContainer" class="h-80 w-full bg-gray-100"></div>

      <div class="p-4 border-t">
        <p v-if="ubicacion" class="text-sm text-gray-600 mb-1 flex items-center gap-1">
          <Icon icon="ph:map-pin-fill" class="w-4 h-4 flex-shrink-0" />
          <span class="font-medium">{{ ubicacion.nombre }}</span>
        </p>
        <p v-if="ubicacion" class="text-xs text-gray-400 mb-2">
          {{ ubicacion.lat.toFixed(6) }}, {{ ubicacion.lng.toFixed(6) }}
        </p>
        <p v-else class="text-sm text-gray-400 mb-2">Hacé clic en el mapa para seleccionar</p>
        <div class="flex gap-3">
          <button @click="$emit('cerrar')" class="flex-1 font-medium px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            :disabled="!ubicacion"
            @click="$emit('seleccionar', ubicacion)"
            class="flex-1 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50"
          >
            Confirmar ubicación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'GoogleMapPicker',

  emits: ['seleccionar', 'cerrar'],

  data() {
    return {
      busqueda: '',
      coordPegado: '',
      mapa: null,
      marker: null,
      ubicacion: null
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    initMap() {
      this.mapa = L.map(this.$refs.mapContainer).setView([-34.6037, -58.3816], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(this.mapa)

      this.mapa.on('click', (e) => {
        this.colocarMarcador(e.latlng.lat, e.latlng.lng)
      })
    },

    async colocarMarcador(lat, lng, nombre) {
      this.ubicacion = { lat, lng, nombre: nombre || '' }
      if (this.marker) {
        this.marker.setLatLng([lat, lng])
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.mapa)
      }
      this.mapa.setView([lat, lng], 14)
      if (!nombre) {
        await this.obtenerNombreUbicacion(lat, lng)
      }
    },

    async obtenerNombreUbicacion(lat, lng) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
          { headers: { 'User-Agent': 'CampoApp/1.0' } }
        )
        if (!res.ok) return
        const data = await res.json()
        console.log(data)
        if (data?.address) {
          const a = data.address
          const localidad = a.city || a.town || a.village || a.state_district || a.village || a.municipality
          const provincia = a.state || a.province
          this.ubicacion.nombre = [localidad, provincia, a.country]
            .filter(Boolean)
            .join(', ')
        }
      } catch {
        // silencioso
      }
    },

    async buscarLugar() {
      if (!this.busqueda.trim()) return
      try {
        const q = encodeURIComponent(this.busqueda)
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5`, {
          headers: {
            'User-Agent': 'CampoApp/1.0',
            'Accept-Language': 'es'
          }
        })
        if (!res.ok) throw new Error('Error en la búsqueda')
        const datos = await res.json()
        if (datos.length > 0) {
          const { lat, lon } = datos[0]
          this.colocarMarcador(parseFloat(lat), parseFloat(lon))
        }
      } catch (e) {
        alert('No se encontraron resultados o hubo un error. Probá escribiendo otra ubicación o hacé clic directamente en el mapa.')
      }
    },

    irACoordenadas() {
      const input = this.coordPegado.trim()
      const nums = input.match(/[-+]?\d+\.?\d*/g)
      if (!nums || nums.length < 2) {
        alert('Ingresá coordenadas válidas. Ej: (-31.4007153, -63.0671789)')
        return
      }
      const lat = parseFloat(nums[0])
      const lng = parseFloat(nums[1])
      if (isNaN(lat) || isNaN(lng)) {
        alert('Ingresá coordenadas válidas. Ej: (-31.4007153, -63.0671789)')
        return
      }
      this.colocarMarcador(lat, lng)
    }
  }
}
</script>
