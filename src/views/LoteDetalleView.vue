<template>
  <div v-if="lote">
    <div class="flex items-center justify-between mb-5">
      <div>
        <router-link to="/" class="text-xs text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1">
          <Icon icon="ph:caret-left" class="w-4 h-4" /> Volver
        </router-link>
        <h1 class="text-xl font-bold text-gray-800">{{ lote.nombre }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <router-link :to="`/lote/${lote.id}/editar`" class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition">
          <Icon icon="ph:pencil-fill" class="w-4 h-4 text-gray-400" />
        </router-link>
        <button @click="toggleActivo" class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition" :class="lote.activo === false ? 'text-mp-green' : 'text-red-400'">
          <Icon :icon="lote.activo === false ? 'ph:check-circle-fill' : 'ph:prohibit-fill'" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-if="lote.activo === false" class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700 flex items-center gap-2">
      <Icon icon="ph:warning-circle-fill" class="w-5 h-5 flex-shrink-0" />
      Lote desactivado. No aparece en el listado principal.
    </div>

    <div v-if="lote.ubicacion" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-start gap-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Icon icon="ph:map-pin-fill" class="w-4 h-4 text-mp-blue" /> Ubicación</h2>
          <p class="text-sm text-gray-700 font-medium truncate">{{ lote.ubicacion.nombre || 'Sin referencia' }}</p>
          <p class="text-xs text-gray-400 mb-3">{{ lote.ubicacion.lat.toFixed(6) }}, {{ lote.ubicacion.lng.toFixed(6) }}</p>
          <a
            :href="`https://www.google.com/maps?q=${lote.ubicacion.lat},${lote.ubicacion.lng}`"
            target="_blank"
            class="inline-block bg-mp-blue text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-mp-blue-dark transition shadow-sm"
          >
            Ver en Google Maps
          </a>
        </div>
        <div ref="miniMap" class="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 relative z-0"></div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-gray-700 flex items-center gap-1.5"><Icon icon="ph:plant-fill" class="w-4 h-4 text-mp-blue" /> Siembras</h2>
        <button @click="editarSiembra = {}" class="text-xs bg-mp-blue text-white font-semibold px-4 py-2 rounded-xl hover:bg-mp-blue-dark transition shadow-sm">
          + Agregar
        </button>
      </div>
      <div v-if="lote.siembras && lote.siembras.length > 0" class="space-y-2">
        <div v-for="(s, i) in lote.siembras" :key="i" class="text-sm bg-gray-50 rounded-xl p-3 flex justify-between items-start gap-2">
          <div>
            <p class="font-medium text-gray-700">{{ s.variedad }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ s.fecha }}</p>
          </div>
          <button @click="eliminarSiembra(i)" class="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5">
            <Icon icon="ph:trash-fill" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Sin registrar</p>
    </div>

    <ModalSiembraCosecha
      v-if="editarSiembra !== null"
      titulo="Registrar Siembra"
      :datos="editarSiembra"
      @guardar="onGuardarSiembra"
      @cerrar="editarSiembra = null"
    />

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-gray-700 flex items-center gap-1.5"><Icon icon="ph:grains-fill" class="w-4 h-4 text-mp-blue" /> Cosechas</h2>
        <button @click="editarCosecha = {}" class="text-xs bg-mp-blue text-white font-semibold px-4 py-2 rounded-xl hover:bg-mp-blue-dark transition shadow-sm">
          + Agregar
        </button>
      </div>
      <div v-if="lote.cosechas && lote.cosechas.length > 0" class="space-y-2">
        <div v-for="(c, i) in lote.cosechas" :key="i" class="text-sm bg-gray-50 rounded-xl p-3 flex justify-between items-start gap-2">
          <div>
            <p class="font-medium text-gray-700">{{ c.variedad }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ c.fecha }}</p>
          </div>
          <button @click="eliminarCosecha(i)" class="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5">
            <Icon icon="ph:trash-fill" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Sin registrar</p>
    </div>

    <ModalSiembraCosecha
      v-if="editarCosecha !== null"
      titulo="Registrar Cosecha"
      :datos="editarCosecha"
      @guardar="onGuardarCosecha"
      @cerrar="editarCosecha = null"
    />

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-gray-700 flex items-center gap-1.5"><Icon icon="ph:flask-fill" class="w-4 h-4 text-mp-blue" /> Líquidos aplicados</h2>
        <button @click="editarLiquido = {}" class="text-xs bg-mp-blue text-white font-semibold px-4 py-2 rounded-xl hover:bg-mp-blue-dark transition shadow-sm">
          + Agregar
        </button>
      </div>
      <div v-if="lote.liquidos && lote.liquidos.length > 0" class="space-y-2">
        <div v-for="(liq, i) in lote.liquidos" :key="i" class="text-sm bg-gray-50 rounded-xl p-3 flex justify-between items-start gap-2">
          <div>
            <p class="font-medium text-gray-700">{{ liq.tipo || '—' }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ liq.fecha }} · {{ liq.litrosXHa }} L/ha</p>
            <p class="text-xs text-gray-400">{{ liq.maquinista }}</p>
          </div>
          <button @click="eliminarLiquido(i)" class="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5">
            <Icon icon="ph:trash-fill" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Sin registrar</p>
    </div>

    <ModalLiquido
      v-if="editarLiquido !== null"
      :datos="editarLiquido"
      @guardar="onGuardarLiquido"
      @cerrar="editarLiquido = null"
    />

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-gray-700 flex items-center gap-1.5"><Icon icon="ph:cloud-rain-fill" class="w-4 h-4 text-mp-blue" /> Lluvias</h2>
        <button @click="editarLluvia = {}" class="text-xs bg-mp-blue text-white font-semibold px-4 py-2 rounded-xl hover:bg-mp-blue-dark transition shadow-sm">
          + Agregar
        </button>
      </div>
      <div v-if="lote.lluvias && lote.lluvias.length > 0" class="space-y-2">
        <div v-for="(lluvia, i) in lote.lluvias" :key="i" class="text-sm bg-gray-50 rounded-xl p-3 flex justify-between items-center gap-2">
          <span class="text-gray-700">{{ lluvia.fecha }}</span>
          <div class="flex items-center gap-2">
            <span class="font-bold text-mp-blue">{{ lluvia.mm }} mm</span>
            <button @click="eliminarLluvia(i)" class="text-gray-300 hover:text-red-400 transition">
              <Icon icon="ph:trash-fill" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Sin registrar</p>
      <div v-if="lote.lluvias && lote.lluvias.length > 0" class="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>Total acumulado: <strong class="text-mp-blue font-bold">{{ lluviasTotal }} mm</strong></span>
        <span>Últimos 30 días: <strong class="text-mp-blue font-bold">{{ lluvias30d }} mm</strong></span>
      </div>
    </div>

    <ModalLluvia
      v-if="editarLluvia !== null"
      :datos="editarLluvia"
      @guardar="onGuardarLluvia"
      @cerrar="editarLluvia = null"
    />

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-gray-700 flex items-center gap-1.5"><Icon icon="ph:wallet-fill" class="w-4 h-4 text-mp-blue" /> Desembolsos</h2>
        <button @click="editarDesembolso = {}" class="text-xs bg-mp-blue text-white font-semibold px-4 py-2 rounded-xl hover:bg-mp-blue-dark transition shadow-sm">
          + Agregar
        </button>
      </div>
      <div v-if="lote.desembolsos && lote.desembolsos.length > 0" class="space-y-2">
        <div v-for="(d, i) in lote.desembolsos" :key="i" class="text-sm bg-gray-50 rounded-xl p-3 flex justify-between items-start gap-2">
          <div>
            <p class="font-medium text-gray-700">{{ d.descripcion }}</p>
            <p class="text-sm font-bold text-mp-green mt-0.5">{{ formatearMonto(d) }}</p>
            <p class="text-xs text-gray-400">{{ d.metodoPago }}</p>
          </div>
          <button @click="eliminarDesembolso(i)" class="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5">
            <Icon icon="ph:trash-fill" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Sin registrar</p>
      <div v-if="lote.desembolsos && lote.desembolsos.length > 0" class="mt-3 pt-3 border-t border-gray-200 space-y-1">
        <div v-if="totalDesembolsos.ARS" class="flex justify-between text-sm font-bold text-gray-700">
          <span>Total ARS</span>
          <span class="text-mp-blue">{{ totalDesembolsos.ARS }}</span>
        </div>
        <div v-if="totalDesembolsos.USD" class="flex justify-between text-sm font-bold text-gray-700">
          <span>Total USD</span>
          <span class="text-mp-blue">{{ totalDesembolsos.USD }}</span>
        </div>
      </div>
    </div>

    <ModalDesembolso
      v-if="editarDesembolso !== null"
      :datos="editarDesembolso"
      @guardar="onGuardarDesembolso"
      @cerrar="editarDesembolso = null"
    />
  </div>
  <div v-else class="text-center py-12 text-gray-400">
    <Icon icon="ph:spinner-fill" class="w-8 h-8 mx-auto mb-2 animate-spin text-mp-blue" />
    Cargando...
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLotesStore } from '../stores/lotes'
import ModalSiembraCosecha from '../components/ModalSiembraCosecha.vue'
import ModalLiquido from '../components/ModalLiquido.vue'
import ModalLluvia from '../components/ModalLluvia.vue'
import ModalDesembolso from '../components/ModalDesembolso.vue'

export default {
  name: 'LoteDetalleView',

  components: {
    ModalSiembraCosecha,
    ModalLiquido,
    ModalLluvia,
    ModalDesembolso
  },

  data() {
    return {
      store: useLotesStore(),
      miniMapa: null,
      miniMarker: null,
      editarSiembra: null,
      editarCosecha: null,
      editarLiquido: null,
      editarLluvia: null,
      editarDesembolso: null
    }
  },

  computed: {
    lote() {
      return this.store.getLoteById(this.$route.params.id)
    },

    totalDesembolsos() {
      if (!this.lote?.desembolsos) return { ARS: null, USD: null }
      let ARS = 0, USD = 0
      for (const d of this.lote.desembolsos) {
        const m = Number(d.monto)
        if (isNaN(m)) continue
        const moneda = d.moneda || (m % 1 !== 0 ? 'USD' : 'ARS')
        if (moneda === 'USD') USD += m
        else ARS += m
      }
      ARS = Math.round(ARS * 100) / 100
      USD = Math.round(USD * 100) / 100
      const fmt = (v, mon) => {
        try {
          if (v <= 0) return null
          if (mon === 'USD') return `US$ ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(v)}`
          return `$ ${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(v)}`
        } catch { return null }
      }
      return { ARS: fmt(ARS, 'ARS'), USD: fmt(USD, 'USD') }
    },

    lluviasTotal() {
      if (!this.lote?.lluvias) return 0
      return Math.round(this.lote.lluvias.reduce((s, ll) => s + (Number(ll.mm) || 0), 0) * 10) / 10
    },

    lluvias30d() {
      if (!this.lote?.lluvias) return 0
      const hace30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const total = this.lote.lluvias
        .filter(ll => ll.fecha && new Date(ll.fecha) >= hace30)
        .reduce((s, ll) => s + (Number(ll.mm) || 0), 0)
      return Math.round(total * 10) / 10
    }
  },

  created() {
    this.store.cargarLotes()
  },

  watch: {
    lote: {
      immediate: true,
      handler(val) {
        if (!val) return
        let dirty = false
        if (val.siembra && !val.siembras) {
          val.siembras = [{ ...val.siembra, id: Date.now() }]
          delete val.siembra
          dirty = true
        }
        if (val.cosecha && !val.cosechas) {
          val.cosechas = [{ ...val.cosecha, id: Date.now() + 1 }]
          delete val.cosecha
          dirty = true
        }
        if (dirty) {
          this.store.guardarLote(val)
        }
        this.$nextTick(() => this.initMiniMap())
      }
    }
  },

  beforeUnmount() {
    if (this.miniMapa) {
      this.miniMapa.remove()
      this.miniMapa = null
    }
  },

  methods: {
    initMiniMap() {
      if (!this.lote?.ubicacion || !this.$refs.miniMap) return
      if (this.miniMapa) {
        this.miniMapa.remove()
        this.miniMapa = null
      }
      const { lat, lng } = this.lote.ubicacion
      this.miniMapa = L.map(this.$refs.miniMap, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false
      }).setView([lat, lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.miniMapa)

      this.miniMarker = L.marker([lat, lng]).addTo(this.miniMapa)
    },

    async onGuardarSiembra(datos) {
      if (!this.lote.siembras) this.lote.siembras = []
      if (datos.id !== undefined) {
        const idx = this.lote.siembras.findIndex(s => s.id === datos.id)
        if (idx !== -1) this.lote.siembras[idx] = datos
      } else {
        datos.id = Date.now()
        this.lote.siembras.push(datos)
      }
      await this.store.guardarLote(this.lote)
      this.editarSiembra = null
    },

    async onGuardarCosecha(datos) {
      if (!this.lote.cosechas) this.lote.cosechas = []
      if (datos.id !== undefined) {
        const idx = this.lote.cosechas.findIndex(c => c.id === datos.id)
        if (idx !== -1) this.lote.cosechas[idx] = datos
      } else {
        datos.id = Date.now()
        this.lote.cosechas.push(datos)
      }
      await this.store.guardarLote(this.lote)
      this.editarCosecha = null
    },

    async onGuardarLiquido(datos) {
      if (!this.lote.liquidos) this.lote.liquidos = []
      if (datos.id !== undefined) {
        const idx = this.lote.liquidos.findIndex(l => l.id === datos.id)
        if (idx !== -1) this.lote.liquidos[idx] = datos
      } else {
        datos.id = Date.now()
        this.lote.liquidos.push(datos)
      }
      await this.store.guardarLote(this.lote)
      this.editarLiquido = null
    },

    async onGuardarLluvia(datos) {
      if (!this.lote.lluvias) this.lote.lluvias = []
      if (datos.id !== undefined) {
        const idx = this.lote.lluvias.findIndex(l => l.id === datos.id)
        if (idx !== -1) this.lote.lluvias[idx] = datos
      } else {
        datos.id = Date.now()
        this.lote.lluvias.push(datos)
      }
      await this.store.guardarLote(this.lote)
      this.editarLluvia = null
    },

    async onGuardarDesembolso(datos) {
      if (!this.lote.desembolsos) this.lote.desembolsos = []
      if (datos.id !== undefined) {
        const idx = this.lote.desembolsos.findIndex(d => d.id === datos.id)
        if (idx !== -1) this.lote.desembolsos[idx] = datos
      } else {
        datos.id = Date.now()
        this.lote.desembolsos.push(datos)
      }
      await this.store.guardarLote(this.lote)
      this.editarDesembolso = null
    },

    eliminarSiembra(index) {
      this.lote.siembras.splice(index, 1)
      this.store.guardarLote(this.lote)
    },

    eliminarCosecha(index) {
      this.lote.cosechas.splice(index, 1)
      this.store.guardarLote(this.lote)
    },

    eliminarLiquido(index) {
      this.lote.liquidos.splice(index, 1)
      this.store.guardarLote(this.lote)
    },

    eliminarLluvia(index) {
      this.lote.lluvias.splice(index, 1)
      this.store.guardarLote(this.lote)
    },

    eliminarDesembolso(index) {
      this.lote.desembolsos.splice(index, 1)
      this.store.guardarLote(this.lote)
    },

    formatearMonto(d) {
      const monto = Number(d.monto)
      if (isNaN(monto)) return `$${d.monto}`
      const moneda = d.moneda || (monto % 1 !== 0 ? 'USD' : 'ARS')
      try {
        if (moneda === 'USD') {
          const num = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto)
          return `US$ ${num}`
        }
        const num = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto)
        return `$ ${num}`
      } catch {
        return `${moneda === 'USD' ? 'US$' : '$'}${monto}`
      }
    },

    async toggleActivo() {
      await this.store.toggleActivoLote(this.lote.id)
    }
  }
}
</script>