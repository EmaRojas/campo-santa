<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-green-700 text-white p-4 shadow-md">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold">Campo App</router-link>
        <SyncButton />
      </div>
    </header>
    <main class="flex-1 max-w-2xl mx-auto w-full p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import SyncButton from './components/SyncButton.vue'

export default {
  name: 'App',
  components: { SyncButton }
}
</script>
