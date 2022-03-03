<template>
  <Sidebar
    v-model:visible="isSidebarOpened"
    :showCloseIcon="false"
  >
    <div class="sidebar-title">
      <img
        class="sidebar-title__logo logo"
        src="@/assets/img/logo.gif"
        :title="host"
        @click.stop="$router.push('/')"
      />
      <Icon
        icon="mdi:close"
        color="black"
        class="sidebar-title__close-button"
        @click.stop="setSidebarOpened(false)"
      />
    </div>
    <div
      class="sidebar-item p-link"
      v-for="(item, index) in sidebarItems"
      :key="index"
      @click="item.action ? item.action : null"
    >
      <Icon
        class="sidebar-item__prepend-icon"
        v-if="item.imgSrcPrependIcon"
        :icon="`mdi:${item.imgSrcPrependIcon}`"
        color="white"
      />
      <span class="sidebar-item__text">
        {{ item.text }}
      </span>
      <Icon
        class="sidebar-item__append-icon"
        v-if="item.imgSrcAppendIcon"
        :icon="`mdi:${item.imgSrcAppendIcon}`"
        color="white"
      />
    </div>
  </Sidebar>
  <div
    class="sidebar-open-button"
    v-show="!isSidebarOpened"
    @click="setSidebarOpened(true)"
  >
    &gt;
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

import { ISidebarItem } from './index'

const props = defineProps({
  pathFilters: {
    type: Array as () => Array<string>,
    required: false,
    default: () => [],
  },
})

const router = useRouter()

const isSidebarOpened = ref(false)
const setSidebarOpened = (val: boolean) => isSidebarOpened.value = val

const getIcon = (path: string): any => {
  switch (path) {
    case '/': return 'home'
    case '/about': return 'info'
    case '/add': return 'plus'
    default: return undefined
  }
}
const sidebarItems =
  computed(() => router.options.routes
    .filter(
      (r: RouteRecordRaw) => ['/:pathMatch(.*)*', ...props.pathFilters]
        .indexOf(r.path) === -1
    )
    .map((r: RouteRecordRaw): ISidebarItem => {
      return {
        imgSrcPrependIcon: getIcon(r.path),
        text: r.name ? r.name.toString() : r.path,
        action: () => router.push(r.path),
      }
    })
  )

const host = document.location.host
</script>

<style lang="sass" scoped>
.sidebar
  &-title
    display: flex
    justify-content: space-between
    align-items: center

    &__logo
      height: 35px
      object-fit: contain

      cursor: pointer

    &__close
      width: 35px
      height: 35px
      object-fit: contain
      border-radius: 50%

      cursor: pointer

  &-item
    padding: 8px
    display: flex
    align-items: center

    cursor: pointer

    &:hover
      background-color: #a0d2fa

    &__prepend-icon, &__append-icon
      margin: 0 0.5em
      width: 1.2em
      height: 1.2em
      object-fit: contain

    &__text
      flex: 1 0
      text-align: left

.sidebar-open-button
  position: fixed
  z-index: 150
  top: calc(50vh - 64px)
  bottom: calc(50vh - 64px)
  left: -32px
  width: 64px

  background-color: $mainBackground
  font-size: 32px
  border-radius: 0 50% 50% 0
  text-align: right
  padding-top: 48px
  padding-right: 4px
  color: white
  +shadow

  cursor: pointer
</style>
