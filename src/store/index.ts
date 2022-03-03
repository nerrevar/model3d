import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import { initializeApp } from 'firebase/app'

import { State, IFirebaseConfig, IModel } from '@/types'
import {
  getAuth,
  signInWithPopup,
  signOut,
  // types
  User
} from 'firebase/auth'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'

import { getProvider } from '@/lib/auth'

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
    auth: ({ state }, providerName: string) =>
      signInWithPopup(state.Firebase.auth, getProvider(providerName)),
    logout: ({ state }) => signOut(state.Firebase.auth),
    uploadModel: async ({ state }, { model, imageFile, modelFile }) => {
      const imageRef = storageRef(state.Firebase.storage, model.img.src)
      await uploadBytes(imageRef, imageFile)
      const modelRef = storageRef(state.Firebase.storage, model.url)
      await uploadBytes(modelRef, modelFile)
      await addDoc(collection(state.Firebase.db, 'model'), model)
      return true
    },
  },
  getters: {
    isAuthenticated: (state: State) => state.User !== null,
  },
  modules: {
  },
})

export const key: InjectionKey<Store<State>> = Symbol('VuexStore')

export function useStore (): Store<State> {
  return baseUseStore(key)
}
