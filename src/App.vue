<template>
  <SideBar
    :imgLogo="imgLogo"
  />
  <HeaderComponent @click="showToast" />
  <router-view />
  <Toast />
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useStore } from '@/store'

import SideBar from '@/components/SideBar/index.vue'
import HeaderComponent from '@/components/HeaderComponent/index.vue'
import Toast from '@/components/Toast/index.vue'

import { ToastController } from '@/components/Toast/type.js'

export default defineComponent({
  name: 'Layout',
  components: {
    SideBar,
    HeaderComponent,
    Toast,
  },
  setup () {
    const store = useStore()

    const $toast = inject('$toast') as ToastController
    const showToast = () => $toast.warning('Yes')

    return {
      imgLogo: store.state.imgLogo,
      showToast,
    }
  },
})
</script>
