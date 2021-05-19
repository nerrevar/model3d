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
        :openOnHover="true"
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
      }
    ]

    return {
      imgLogo: store.state.imgLogo,
      authorized: store.state.IsAuthorized,
      itemsAuth,
    }
  }
})
</script>
