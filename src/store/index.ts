import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import { initializeApp } from 'firebase/app'

import { State, IFirebaseConfig, IModel } from '@/types'
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  // types
  User,
  UserCredential,
  OAuthCredential,
  AuthProvider
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import {
  getProvider,
  getCredentialStr,
  getCredentialFromStorage
} from '@/lib/auth'

const firebaseConfig: IFirebaseConfig = {
  apiKey: 'AIzaSyBplaQdF1Nr4xuG9pV_BjIjkckfuIwBKkg',
  authDomain: 'model-catalog-303814.firebaseapp.com',
  projectId: 'model-catalog-303814',
  storageBucket: 'model-catalog-303814.appspot.com',
  messagingSenderId: '712573757834',
  appId: '1:712573757834:web:0481e2d581c867be624073',
}

export const store = createStore<State>({
  state: {
    imgLogo: '/assets/img/logo.gif',
    IsAuthorized: false,
    Firebase: {
      app: initializeApp(firebaseConfig),
      auth: getAuth(),
      db: getFirestore(),
      storage: getStorage(),
    },
    User: null,
    Models: {
      rated: [],
      currentList: [],
    },
  },
  mutations: {
    setUser: (state: State, user: User | null) => {
      state.User = user
    },
    setRatedModels: (state: State, models: Array<IModel>) => {
      state.Models.rated = models
    },
    setCurrentModels: (state: State, models: Array<IModel>) => {
      state.Models.currentList = models
    },
    addCurrentModels: (state: State, models: Array<IModel>) => {
      state.Models.currentList.push(...models)
    },
  },
  actions: {
    auth: ({ state, commit }, providerName: string) =>
      signInWithPopup(state.Firebase.auth, getProvider(providerName))
        .catch(error => {
          console.log(`Auth error ${error.code}: ${error.message}`)
        }),
    logout: ({ state }) => signOut(state.Firebase.auth)
  },
  getters: {
    isAuthenticated: (state: State) => state.User !== null,
  },
  modules: {
  },
})

export const key: InjectionKey<Store<State>> = Symbol('VuexStore')

export function useStore () {
  return baseUseStore(key)
}
