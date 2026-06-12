<template>
  <div class="min-h-screen flex flex-col bg-[#F5F5F5]">
    <header class="bg-mp-blue text-white px-4 pt-5 pb-6 shadow-sm">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">C</div>
          <span class="text-lg font-bold">Campo App</span>
        </div>
        <SyncButton />
      </div>
    </header>

    <main class="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-24">
      <router-view />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div class="max-w-2xl mx-auto flex items-center justify-around py-2">
        <router-link to="/" class="flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium" :class="tabActivo === 'inicio' ? 'text-mp-blue' : 'text-gray-400'">
          <Icon :icon="tabActivo === 'inicio' ? 'ph:house-fill' : 'ph:house'" class="w-6 h-6" />
          Inicio
        </router-link>

        <router-link to="/lote/nuevo" class="flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium text-gray-400">
          <div class="w-10 h-10 bg-mp-blue rounded-full flex items-center justify-center -mt-3 shadow-md">
            <Icon icon="ph:plus" class="w-6 h-6 text-white" />
          </div>
          <span class="text-mp-blue font-semibold">Nuevo</span>
        </router-link>

        <router-link to="/?tab=actividad" class="flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium" :class="tabActivo === 'actividad' ? 'text-mp-blue' : 'text-gray-400'">
          <Icon :icon="tabActivo === 'actividad' ? 'ph:clock-counter-clockwise-fill' : 'ph:clock-counter-clockwise'" class="w-6 h-6" />
          Actividad
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
import SyncButton from './components/SyncButton.vue'

export default {
  name: 'App',
  components: { SyncButton },
  computed: {
    tabActivo() {
      if (this.$route.query.tab === 'actividad') return 'actividad'
      return 'inicio'
    }
  }
}
</script>
