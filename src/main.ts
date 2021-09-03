import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'

// Global prime
import PrimeVue from 'primevue/config'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
// Prime theme
import 'primevue/resources/themes/saga-blue/theme.css'
// Prime components
import primeComponents from './prime-components'

import './style.sass'

import { browserLocalPersistence, User } from 'firebase/auth'

store.state.Firebase.auth.useDeviceLanguage()
store.state.Firebase.auth.setPersistence(browserLocalPersistence)
store.state.Firebase.auth.onAuthStateChanged(
  (user: User) => store.commit('setUser', user)
)

document.title = 'Model 3D'

const app = createApp(App)
  .use(store, key)
  .use(router)
  .use(PrimeVue, { ripple: true })

primeComponents.forEach(el => app.component(el.name, el))

app.mount('#app')
