<template>
  <div class="header">
    <img
      class="header__logo logo"
      src="@/assets/img/logo.gif"
      alt=""
      @click="$router.push('/')"
    />
    <div class="header-toolbox">
      <CustomDropdown
        v-if="!isAuthenticated"
        openOnHover
        class="header-toolbox__auth"
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
        v-else
        class="header-toolbox__auth-complete"
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

      <div
        v-if="isAuthenticated"
        class="header-toolbox__add-model-button"
        @click="$router.push('/add')"
      >
        <Icon
          icon="mdi:plus"
          color="white"
        />
        Add model
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'

import { Icon } from '@iconify/vue'

import CustomDropdown from '@/components/CustomDropdown/index.vue'

export default defineComponent({
  name: 'HeaderComponent',
  components: {
    CustomDropdown,
    Icon,
  },
  setup () {
    const store = useStore()

    return {
      user: computed(() => store.state.User),
      authenticate:
        (providerName: string) => store.dispatch('auth', providerName),
      logout: () => store.dispatch('logout'),
      isAuthenticated: computed(() => store.getters.isAuthenticated),
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

    &__add-model-button
      +button(14px)
</style>
