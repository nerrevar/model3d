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
        v-if="user === null"
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
        <img
          class="header-toolbox__auth-complete__img"
          :src="user.photoURL"
          alt=""
        />
        <span
          class="header-toolbox__auth-complete__text"
        >
          {{ user.displayName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'

import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  browserLocalPersistence

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
        imgSrc: '/assets/img/google_white.svg',
      },
      {
        type: 'github',
        name: 'GitHub',
        imgSrc: '/assets/img/github_white.svg',
      }
    ]

    const auth = (item: IAuthItem) => {
      const auth = getAuth(store.state.Firebase.app)
      auth.useDeviceLanguage()
      auth.setPersistence(browserLocalPersistence)
      const getProvider = (): GoogleAuthProvider | GithubAuthProvider => {
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
          default: throw new Error('Invalid auth provider type!')
        }
      }
      const provider: GoogleAuthProvider | GithubAuthProvider = getProvider()
      const isGoogle = typeof provider === typeof GoogleAuthProvider
      signInWithPopup(auth, getProvider())
        .then(userCredential => {
          store.commit('setUser', userCredential.user)
          localStorage.setItem(
            'authCredential',
            JSON.stringify(
              isGoogle
                ? GoogleAuthProvider.credentialFromResult(userCredential)!
                : GithubAuthProvider.credentialFromResult(userCredential)!
            )
          )
          localStorage.setItem('userInfo', JSON.stringify(userCredential.user))
        })
        .catch(error => {
          console.log(`Auth error ${error.code}: ${error.message}`)
        })
    }

    return {
      imgLogo: store.state.imgLogo,
      user: computed(() => store.state.User),
      itemsAuth,
      auth,
    }
  },
})
</script>

<style lang="sass" scoped>
$titleBackground: #CE93D8
$color: white
=shadow
  box-shadow: 1px 1px 5px grey

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

    &__auth-complete
      display: flex
      flex: 0 0
      padding: 0.3em
      background-color: $titleBackground
      color: $color
      +shadow

      &__img
        margin-right: 1em
        border-radius: 50%
</style>
