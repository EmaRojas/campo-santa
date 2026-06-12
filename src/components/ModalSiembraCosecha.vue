<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6">
      <h3 class="text-lg font-bold mb-4">{{ titulo }}</h3>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Variedad de semilla</label>
          <input
            v-model="form.variedad"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none bg-gray-50/50"
            placeholder="Ej: DK 72-10, DM 4670"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
          <input
            v-model="form.fecha"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none bg-gray-50/50"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button @click="$emit('cerrar')" class="flex-1 font-semibold px-5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm">
          Cancelar
        </button>
        <button @click="guardar" class="flex-1 bg-mp-blue text-white font-semibold px-5 py-3 rounded-xl hover:bg-mp-blue-dark transition shadow-sm text-sm">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalSiembraCosecha',

  props: {
    titulo: String,
    datos: Object
  },

  emits: ['guardar', 'cerrar'],

  data() {
    return {
      form: {
        variedad: this.datos?.variedad || '',
        fecha: this.datos?.fecha || ''
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