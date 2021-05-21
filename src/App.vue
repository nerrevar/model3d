<template>
  <SideBar
    :imgLogo="imgLogo"
  />
  <HeaderComponent />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store'

import {
  getAuth,
  reauthenticateWithCredential,
  User,
  AuthCredential,
  SignInMethod,
} from 'firebase/auth'

import SideBar from '@/components/SideBar/index.vue'
import HeaderComponent from '@/components/HeaderComponent/index.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    SideBar,
    HeaderComponent,
  },
  setup () {
    const store = useStore()

    const userStr = localStorage.getItem('userInfo')
    const authCredentialStr = localStorage.getItem('authCredential')
    if (userStr !== null && authCredentialStr !== null) {
      const user: User = JSON.parse(userStr)
      const authCredential: AuthCredential = JSON.parse(authCredentialStr)
      // reauthenticateWithCredential(
      //   user,
      //   authCredential
      // ).then(() => store.commit('setUser', getAuth().currentUser))
    }

    return {
      imgLogo: store.state.imgLogo,
    }
  },
})
</script>
