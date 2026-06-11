<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.15)] max-w-sm w-full p-6">
      <h3 class="text-lg font-semibold mb-4">Registrar Lluvia</h3>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            v-model="form.fecha"
            type="date"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Milímetros</label>
          <input
            v-model="form.mm"
            type="number"
            step="0.1"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Ej: 25.5"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button @click="$emit('cerrar')" class="flex-1 font-medium px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button @click="guardar" class="flex-1 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition shadow-sm">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalLluvia',

  props: {
    datos: Object
  },

  emits: ['guardar', 'cerrar'],

  data() {
    return {
      form: {
        fecha: this.datos?.fecha || '',
        mm: this.datos?.mm || ''
      }
    }
  },

  methods: {
    guardar() {
      this.$emit('guardar', { ...this.form, id: this.datos?.id })
    }
  }
}
</script>
