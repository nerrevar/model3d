<template>
  <div class="header">
    <img
      class="header__logo"
      :src="imgLogo"
      alt=""
      @click="$router.push('/')"
    />
    <div class="header-toolbox">
      <CustomDropdown
        class="header-toolbox__auth"
        v-if="!authorized"
        imgTitle="/assets/img/account_white.svg"
        textTitle="Sign in"
        :openOnHover="true"
        :action="auth"
        :items="itemsAuth"
      />
      <div
        class="header-toolbox__auth-complete"
        v-else
      >
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store'

import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  AuthProvider
} from 'firebase/auth'

import { IAuthItem } from '@/types'

import CustomDropdown from '@/components/CustomDropdown/index.vue'

export default defineComponent({
  name: 'HeaderComponent',
  components: {
    CustomDropdown,
  },
  setup () {
    const store = useStore()

    const itemsAuth: IAuthItem[] = [
      {
        type: 'google',
        name: 'Google',
      },
      {
        type: 'github',
        name: 'GitHub',
      }
    ]

    const auth = (item: IAuthItem) => {
      const auth = getAuth(store.state.Firebase.app)
      const getProvider = (): AuthProvider => {
        switch (item.type) {
          case 'google': {
            const provider: GoogleAuthProvider = new GoogleAuthProvider()
            provider.addScope('profile')
            provider.addScope('email')
            return provider
          }
          case 'github': {
            const provider: GithubAuthProvider = new GithubAuthProvider()
            provider.setCustomParameters({
              allow_signup: 'false',
            })
            provider.addScope('read:user')
            provider.addScope('user:email')
            return provider
          }
          default: return new GoogleAuthProvider()
        }
      }
      signInWithPopup(auth, getProvider())
        .then(result => {
          store.commit('setUser', result.user)
        })
        .catch(error => {
          console.log(`Auth error ${error.code}: ${error.message}`)
        })
    }

    return {
      imgLogo: store.state.imgLogo,
      authorized: store.state.IsAuthorized,
      itemsAuth,
      auth,
    }
  },
})
</script>

<style lang="sass" scoped>
.header
  display: flex
  flex-flow: row nowrap
  justify-content: space-between

  background-color: #C5CAE9
  padding: 0.5em

  &__logo
    height: 2.2em

  &-toolbox
    display: flex
    flex: 1 0
    flex-flow: row-reverse nowrap

    height: 2.2em
</style>
