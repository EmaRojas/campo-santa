import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'
import App from './App.vue'
import router from './router'
import './style.css'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const app = createApp(App)

app.component('Icon', Icon)
app.use(createPinia())
app.use(router)

app.mount('#app')
