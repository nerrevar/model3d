import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import { initializeApp } from 'firebase/app'

import { State, IFirebaseConfig } from '@/types'
import { User, getAuth } from 'firebase/auth'

const firebaseConfig: IFirebaseConfig = {
  apiKey: 'AIzaSyBoOuFaBPdtbqG_Stx6_Zq5nGDFdfHe75g',
  authDomain: 'model-catalog-303814.firebaseapp.com',
  projectId: 'model-catalog-303814',
  storageBucket: 'model-catalog-303814.appspot.com',
  messagingSenderId: '712573757834',
  appId: '1:712573757834:web:d969e1bce947165c624073',
}

export const store = createStore<State>({
  state: {
    imgLogo: '/assets/img/logo.gif',
    IsAuthorized: false,
    Firebase: {
      app: initializeApp(firebaseConfig),
    },
    User: null,
  },
  mutations: {
    setUser: (state: State, user: User | null) => {
      state.User = user
    },
  },
  actions: {
  },
  modules: {
  },
})

export const key: InjectionKey<Store<State>> = Symbol('VuexStore')

export function useStore () {
  return baseUseStore(key)
}
