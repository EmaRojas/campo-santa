<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6">
      <h3 class="text-lg font-bold mb-4">Registrar Desembolso</h3>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
          <input
            v-model="form.descripcion"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none bg-gray-50/50"
            placeholder="Ej: Compra de semillas"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Moneda</label>
          <div class="flex bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              @click="form.moneda = 'ARS'"
              class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition"
              :class="form.moneda === 'ARS' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              $ ARS
            </button>
            <button
              type="button"
              @click="form.moneda = 'USD'"
              class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition"
              :class="form.moneda === 'USD' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              US$ USD
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">{{ form.moneda === 'USD' ? 'Monto (US$)' : 'Monto ($)' }}</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="text-gray-400 font-semibold text-sm">{{ form.moneda === 'USD' ? 'US$' : '$' }}</span>
            </div>
            <input
              ref="montoInput"
              @input="onInput"
              @focus="onFocus"
              @blur="onBlur"
              type="text"
              inputmode="decimal"
              required
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none bg-gray-50/50 text-right"
              :placeholder="form.moneda === 'USD' ? '0.00' : '0,00'"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Método de pago</label>
          <select
            v-model="form.metodoPago"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mp-blue/30 focus:border-mp-blue outline-none bg-white"
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Cheque">Cheque</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="A Cosecha">A Cosecha</option>
            <option value="Otro">Otro</option>
          </select>
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
  name: 'ModalDesembolso',

  props: {
    datos: Object
  },

  emits: ['guardar', 'cerrar'],

  data() {
    let moneda = 'ARS'
    const montoVal = this.datos?.monto
    if (montoVal !== undefined && montoVal !== '' && montoVal !== null) {
      moneda = Number(montoVal) % 1 !== 0 ? 'USD' : 'ARS'
    }
    return {
      form: {
        descripcion: this.datos?.descripcion || '',
        monto: montoVal !== undefined ? montoVal : '',
        metodoPago: this.datos?.metodoPago || '',
        moneda
      }
    }
  },

  watch: {
    'form.moneda'() {
      this.form.monto = ''
      this.$nextTick(() => {
        const input = this.$refs.montoInput
        if (input) {
          input.value = ''
          input.focus()
        }
      })
    }
  },

  methods: {
    onFocus(e) {
      const num = Number(this.form.monto)
      if (!isNaN(num) && this.form.monto !== '') {
        e.target.value = this.form.moneda === 'USD'
          ? num.toFixed(num % 1 !== 0 ? 2 : 0)
          : num.toFixed(2).replace('.', ',')
      } else {
        e.target.value = ''
      }
    },

    onInput(e) {
      const input = e.target
      const sep = this.form.moneda === 'USD' ? '.' : ','
      const cursorPos = input.selectionStart
      const oldVal = input.value

      let cleaned = this.form.moneda === 'USD'
        ? oldVal.replace(/,/g, '').replace(/[^0-9.]/g, '')
        : oldVal.replace(/\./g, '').replace(/[^0-9,]/g, '')

      const firstSep = cleaned.indexOf(sep)
      let intRaw = ''
      let decRaw = ''
      if (firstSep !== -1) {
        intRaw = cleaned.slice(0, firstSep).replace(/[^0-9]/g, '')
        decRaw = cleaned.slice(firstSep + 1).replace(new RegExp('\\' + sep, 'g'), '').slice(0, 2)
      } else {
        intRaw = cleaned.replace(/[^0-9]/g, '')
      }

      let intFormatted = intRaw
      if (intRaw) {
        const locale = this.form.moneda === 'USD' ? 'en-US' : 'es-AR'
        intFormatted = new Intl.NumberFormat(locale).format(parseInt(intRaw, 10))
      }

      const newValue = intFormatted + (firstSep !== -1 ? sep + decRaw : '')

      if (newValue !== oldVal) {
        const digitsBefore = (oldVal.slice(0, cursorPos).match(/[0-9]/g) || []).length
        let newCursor = newValue.length
        let digitCount = 0
        for (let i = 0; i < newValue.length; i++) {
          if (/[0-9]/.test(newValue[i])) {
            digitCount++
            if (digitCount === digitsBefore) {
              newCursor = i + 1
              break
            }
          }
        }
        if (firstSep !== -1 && oldVal.includes(sep) && cursorPos > oldVal.indexOf(sep)) {
          const decIdx = newValue.indexOf(sep)
          if (decIdx !== -1) {
            const offset = cursorPos - oldVal.indexOf(sep) - 1
            newCursor = Math.min(decIdx + 1 + offset, newValue.length)
          }
        }
        input.value = newValue
        input.setSelectionRange(newCursor, newCursor)
      }

      const numStr = intRaw + (decRaw ? '.' + decRaw : '')
      const num = parseFloat(numStr)
      if (!isNaN(num)) {
        this.form.monto = num
      } else {
        this.form.monto = ''
      }
    },

    onBlur(e) {
      if (this.form.monto === '' || this.form.monto === null) return
      const num = Number(this.form.monto)
      if (!isNaN(num)) {
        this.form.monto = Number(num.toFixed(2))
        const locale = this.form.moneda === 'USD' ? 'en-US' : 'es-AR'
        try {
          e.target.value = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: this.form.moneda === 'USD' ? 'USD' : 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(num).replace(/^[A-Z$]+\s?/, '')
        } catch {
          e.target.value = String(num)
        }
      }
    },

    guardar() {
      const monto = this.form.monto === '' ? '' : Number(this.form.monto)
      this.$emit('guardar', {
        ...this.form,
        monto,
        id: this.datos?.id
      })
    }
  }
}
</script>