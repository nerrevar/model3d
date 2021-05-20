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

    return {
      imgLogo: store.state.imgLogo,
    }
  },
})
</script>
