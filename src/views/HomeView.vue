<template>
  <div>

    <div v-if="tab === 'actividad'">

      <div class="flex items-center gap-2 mb-4">
        <Icon icon="ph:clock-counter-clockwise" class="w-5 h-5 text-mp-blue" />
        <h1 class="text-lg font-bold text-gray-800">Actividad</h1>
      </div>

      <div v-if="store.loading" class="text-center py-8 text-gray-400">
        <Icon icon="ph:spinner-fill" class="w-8 h-8 mx-auto mb-2 animate-spin text-mp-blue" />
        <p class="text-sm">Cargando...</p>
      </div>

      <div v-else-if="actividades.length === 0" class="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        <div class="w-14 h-14 bg-mp-blue-light rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon icon="ph:clock-counter-clockwise" class="w-7 h-7 text-mp-blue" />
        </div>
        <p class="text-gray-700 font-semibold mb-1">Sin actividad aún</p>
        <p class="text-sm text-gray-400">Los eventos de siembras, cosechas, lluvias y más aparecerán acá.</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="act in actividades" :key="act.tipo + act.fecha + act.desc + act.loteId" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-mp-blue-light rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon :icon="'ph:' + act.icon" class="w-4 h-4 text-mp-blue" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold text-gray-700 truncate">{{ act.desc }}</p>
                <span class="text-xs text-gray-400 flex-shrink-0">{{ formatearFecha(act.fecha) }}</span>
              </div>
              <router-link :to="`/lote/${act.loteId}`" class="text-xs text-mp-blue hover:underline mt-0.5 inline-block">
                {{ act.loteNombre }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="tab === 'inicio'">

    <div v-if="!store.loading && store.lotes.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex items-center gap-2 mb-4">
        <Icon icon="ph:wallet-fill" class="w-5 h-5 text-mp-blue" />
        <h2 class="font-bold text-gray-800">Resumen Financiero</h2>
      </div>
      <div v-if="resumen.cantidad === 0" class="text-sm text-gray-400">Sin desembolsos registrados</div>
      <div v-else class="space-y-2">
        <div v-if="resumen.ARS > 0" class="flex items-center justify-between">
          <span class="text-sm text-gray-500">ARS</span>
          <span class="text-lg font-bold text-mp-blue">{{ formatearResumen(resumen.ARS, 'ARS') }}</span>
        </div>
        <div v-if="resumen.USD > 0" class="flex items-center justify-between">
          <span class="text-sm text-gray-500">USD</span>
          <span class="text-lg font-bold text-mp-blue">{{ formatearResumen(resumen.USD, 'USD') }}</span>
        </div>
        <div class="pt-2 mt-2 border-t border-gray-100 text-xs text-gray-400">
          {{ resumen.cantidad }} desembolso{{ resumen.cantidad !== 1 ? 's' : '' }} en total
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold text-gray-800">Mis Lotes</h2>
      <span class="text-sm text-gray-400 font-medium">{{ lotesFiltrados.length }} lote{{ lotesFiltrados.length !== 1 ? 's' : '' }}</span>
    </div>

    <div class="relative mb-4">
      <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
      <input
        v-model="busqueda"
        type="text"
        class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none"
        placeholder="Buscar lote..."
      />
    </div>

    <div v-if="store.loading" class="text-center py-8 text-gray-400">
      <Icon icon="ph:spinner-fill" class="w-8 h-8 mx-auto mb-2 animate-spin text-mp-blue" />
      <p class="text-sm">Cargando...</p>
    </div>

    <div v-else-if="store.lotes.length === 0" class="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
      <div class="w-16 h-16 bg-mp-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="ph:tractor-fill" class="w-8 h-8 text-mp-blue" />
      </div>
      <p class="text-gray-700 font-semibold mb-1">No tenés lotes cargados aún</p>
      <p class="text-sm text-gray-400 mb-4">Presioná el botón "+" en el menú inferior para empezar.</p>
    </div>

    <div v-else-if="lotesFiltrados.length === 0" class="text-center py-8 text-gray-400">
      <Icon icon="ph:magnifying-glass" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
      <p class="text-sm">No hay lotes que coincidan con "{{ busqueda }}"</p>
    </div>

    <template v-else>
      <button v-if="lotesInactivos.length > 0" @click="mostrarInactivos = !mostrarInactivos" class="text-xs text-gray-400 hover:text-gray-600 transition mb-3 flex items-center gap-1">
        <Icon :icon="mostrarInactivos ? 'ph:eye-slash' : 'ph:eye'" class="w-4 h-4" />
        {{ mostrarInactivos ? 'Ocultar inactivos' : `Mostrar ${lotesInactivos.length} inactivo${lotesInactivos.length !== 1 ? 's' : ''}` }}
      </button>
      <div class="space-y-3">
        <router-link
          v-for="lote in lotesFiltrados"
          :key="lote.id"
          :to="`/lote/${lote.id}`"
          class="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          :class="{ 'opacity-50': lote.activo === false }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="lote.activo === false ? 'bg-gray-100' : 'bg-mp-blue-light'">
                <Icon icon="ph:plant-fill" class="w-5 h-5" :class="lote.activo === false ? 'text-gray-400' : 'text-mp-blue'" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold truncate" :class="lote.activo === false ? 'text-gray-400' : 'text-gray-800'">{{ lote.nombre }}</h3>
                <p v-if="lote.ubicacion" class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Icon icon="ph:map-pin-fill" class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">{{ lote.ubicacion.nombre || lote.ubicacion.lat.toFixed(4) + ', ' + lote.ubicacion.lng.toFixed(4) }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0 ml-3">
              <div class="text-right">
                <div v-if="gastoLote(lote).ARS > 0" class="text-xs font-bold text-mp-blue">{{ formatearResumen(gastoLote(lote).ARS, 'ARS') }}</div>
                <div v-if="gastoLote(lote).USD > 0" class="text-xs font-bold text-mp-blue">{{ formatearResumen(gastoLote(lote).USD, 'USD') }}</div>
              </div>
              <Icon icon="ph:caret-right" class="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </router-link>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
import { useLotesStore } from '../stores/lotes'

export default {
  name: 'HomeView',

  data() {
    return {
      store: useLotesStore(),
      mostrarInactivos: false,
      busqueda: ''
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
    },
    lotesFiltrados() {
      if (!this.busqueda.trim()) return this.lotesVisibles
      const q = this.busqueda.toLowerCase().trim()
      return this.lotesVisibles.filter(l => l.nombre.toLowerCase().includes(q))
    },
    tab() {
      return this.$route.query.tab === 'actividad' ? 'actividad' : 'inicio'
    },
    resumen() {
      return this.store.resumenFinanciero
    },
    actividades() {
      return this.store.ultimasActividades
    }
  },

  created() {
    this.store.cargarLotes()
  },

  methods: {
    gastoLote(lote) {
      let ARS = 0, USD = 0
      for (const d of (lote.desembolsos || [])) {
        const m = Number(d.monto)
        if (isNaN(m)) continue
        const moneda = d.moneda || (m % 1 !== 0 ? 'USD' : 'ARS')
        if (moneda === 'USD') USD += m
        else ARS += m
      }
      return { ARS: Math.round(ARS * 100) / 100, USD: Math.round(USD * 100) / 100 }
    },

    formatearResumen(monto, moneda) {
      try {
        if (moneda === 'USD') {
          const num = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto)
          return `US$ ${num}`
        }
        const num = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto)
        return `$ ${num}`
      } catch {
        return `${moneda === 'USD' ? 'US$' : '$'} ${monto}`
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return ''
      const [y, m, d] = fecha.split('-')
      return `${d}/${m}`
    }
  }
}
</script>