<template>
  <div class="header">
    <img
      class="header__logo"
      src="./assets/logo.gif"
      alt=""
      @click="$router.push('/')"
    />
    <div class="header-toolbox">
      <CustomDropdown
        class="header-toolbox__auth"
        v-if="user === null"
        openOnHover
      >
        <template v-slot:title>
          <Icon
            class="iconify"
            icon="mdi:account"
            color="white"
          />
          Sign in
        </template>
        <template v-slot:items>
          <div
            class="dropdown-item"
            @click="authenticate('google')"
          >
            <Icon
              class="iconify"
              icon="mdi:google"
              color="white"
            />
            Google
          </div>
          <div
            class="dropdown-item"
            @click="authenticate('github')"
          >
            <Icon
              class="iconify"
              icon="mdi:github"
              color="white"
            />
            GitHub
          </div>
        </template>
      </CustomDropdown>
      <CustomDropdown
        class="header-toolbox__auth-complete"
        v-if="user !== null"
      >
        <template v-slot:title>
          <img
            v-if="!!user.photoURL"
            :src="user.photoURL"
            alt=""
          />
          <Icon
            v-else
            class="iconify"
            icon="mdi:account"
            color="white"
          />
          {{ user.displayName }}
        </template>
        <template v-slot:items>
          <div
            class="dropdown-item"
            @click="logout"
          >
            <Icon
              class="iconify"
              icon="mdi:logout"
              color="white"
            />
            Logout
          </div>
        </template>
      </CustomDropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'

import { Icon } from '@iconify/vue'

import {
  getAuth,
  UserCredential,
  OAuthCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  browserLocalPersistence
} from 'firebase/auth'

import CustomDropdown from '@/components/CustomDropdown/index.vue'

export default defineComponent({
  name: 'HeaderComponent',
  components: {
    CustomDropdown,
    Icon,
  },
  setup () {
    const store = useStore()

    const getProvider =
      (providerName: string): GoogleAuthProvider | GithubAuthProvider => {
        switch (providerName) {
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
          default: throw new Error('Invalid auth provider name!')
        }
      }
    const getCredentialStr =
      (userCredential: UserCredential, providerName: string): string => {
        let credential: OAuthCredential = {} as OAuthCredential
        switch (providerName) {
          case 'google': {
            credential = GoogleAuthProvider
              .credentialFromResult(userCredential)!
            break
          }
          case 'github': {
            credential = GithubAuthProvider
              .credentialFromResult(userCredential)!
            break
          }
          default:
            throw new Error('Invalid auth provider name!')
        }
        return JSON.stringify(credential)
      }

    const auth = getAuth(store.state.Firebase.app)
    auth.useDeviceLanguage()
    auth.setPersistence(browserLocalPersistence)

    const authenticate = (providerName: string) =>
      signInWithPopup(auth, getProvider(providerName))
        .then((userCredential: UserCredential) => {
          store.commit('setUser', userCredential.user)
          localStorage.setItem(
            'authCredential',
            getCredentialStr(userCredential, providerName)
          )
          localStorage.setItem('userInfo', JSON.stringify(userCredential.user))
        })
        .catch(error => {
          console.log(`Auth error ${error.code}: ${error.message}`)
        })

    return {
      user: computed(() => store.state.User),
      authenticate,
    }
  },
})
</script>

<style lang="sass" scoped>
$titleBackground: #CE93D8
$color: white

.header
  display: flex
  flex-flow: row nowrap
  justify-content: space-between

  background-color: $mainColor
  padding: 0.5em

  &__logo
    height: 2.2em

  &-toolbox
    display: flex
    flex: 1 0
    flex-flow: row-reverse nowrap

    height: 2.2em

    & svg
      font-size: 24px
      margin-right: 14px

    &__auth-complete
      display: flex
      flex: 0 0
      padding: 0.3em
      background-color: $titleBackground
      color: $color
      +shadow(grey)

      &__img
        margin-right: 1em
        border-radius: 50%
</style>
