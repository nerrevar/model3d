import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'

import './style.sass'

import { browserLocalPersistence, User } from 'firebase/auth'

store.state.Firebase.auth.useDeviceLanguage()
store.state.Firebase.auth.setPersistence(browserLocalPersistence)
store.state.Firebase.auth.onAuthStateChanged(
  (user: User) => store.commit('setUser', user)
)

document.title = 'Model 3D'

createApp(App).use(store, key).use(router).mount('#app')
