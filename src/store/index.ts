import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import { State } from '@/types'

export const store = createStore<State>({
  state: {
    imgLogo: '@/assets/img/logo.png',
    IsAuthorized: false,
  },
  mutations: {
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
