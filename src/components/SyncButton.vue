<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      :disabled="syncStore.subiendo || syncStore.bajando"
      class="p-2 rounded-lg hover:bg-white/10 transition text-lg leading-none"
      :class="{ 'animate-pulse': syncStore.subiendo || syncStore.bajando }"
      title="Sincronizar"
    >
      <Icon v-if="syncStore.subiendo || syncStore.bajando" icon="ph:arrows-clockwise-fill" class="w-5 h-5 animate-spin" />
      <Icon v-else-if="feedback === 'success'" icon="ph:check-circle-fill" class="w-5 h-5" />
      <Icon v-else-if="feedback === 'error'" icon="ph:warning-circle-fill" class="w-5 h-5" />
      <Icon v-else icon="ph:cloud-fill" class="w-5 h-5" />
    </button>

    <div
      v-if="abierto"
      class="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 w-56 z-50 overflow-hidden"
    >
      <button
        @click="subir"
        :disabled="syncStore.subiendo"
        class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition font-medium flex items-center gap-3 disabled:opacity-50"
      >
        <Icon icon="ph:upload-fill" class="w-4 h-4" />
        <span>{{ syncStore.subiendo ? 'Subiendo...' : 'Subir datos a la nube' }}</span>
      </button>

      <hr class="border-gray-100" />

      <button
        @click="bajar"
        :disabled="syncStore.bajando"
        class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition font-medium flex items-center gap-3 disabled:opacity-50"
      >
        <Icon icon="ph:download-fill" class="w-4 h-4" />
        <span>{{ syncStore.bajando ? 'Bajando...' : 'Bajar datos de la nube' }}</span>
      </button>

      <div v-if="syncStore.errorLimpio" class="px-4 py-2 bg-red-50 text-xs text-red-600 text-center border-t border-red-100">
        ⚠️ {{ syncStore.errorLimpio }}
      </div>
      <div v-else-if="syncStore.ultimaSync" class="px-4 py-2 bg-gray-50 text-xs text-gray-400 text-center border-t border-gray-100">
        Última sync: {{ syncStore.ultimaSync }}
      </div>
    </div>
  </div>
</template>

<script>
import { useSyncStore } from '../stores/sync'

export default {
  name: 'SyncButton',

  data() {
    return {
      syncStore: useSyncStore(),
      abierto: false,
      feedback: null
    }
  },

  methods: {
    toggleDropdown() {
      if (this.syncStore.subiendo || this.syncStore.bajando) return
      this.abierto = !this.abierto
    },

    async subir() {
      this.abierto = false
      try {
        await this.syncStore.subirLotes()
        this.mostrarFeedback('success')
      } catch {
        this.mostrarFeedback('error')
      }
    },

    async bajar() {
      this.abierto = false
      try {
        await this.syncStore.bajarLotes()
        this.mostrarFeedback('success')
      } catch {
        this.mostrarFeedback('error')
      }
    },

    mostrarFeedback(tipo) {
      this.feedback = tipo
      setTimeout(() => { this.feedback = null }, 2500)
    }
  },

  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) this.abierto = false
    })
  }
}
</script>
