<template>
  <div
    class="overlay"
    v-show="isSidebarOpened"
    @click="setSidebarOpened(false)"
  >
    <div class="sidebar">
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
        class="sidebar-item"
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
    </div>
  </div>
  <div
    class="sidebar-open-button"
    v-show="!isSidebarOpened"
    @click="setSidebarOpened(true)"
  >
    &gt;
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

import { ISidebarItem } from './index'

export default defineComponent({
  name: 'SideBar',
  props: {
    imgLogo: {
      type: String,
      required: true,
    },
    items: {
      type: Array as () => Array<ISidebarItem>,
      required: false,
    },
    pathFilters: {
      type: Array as () => Array<string>,
      required: false,
      default: () => [],
    },
  },
  components: { Icon },
  setup (_) {
    const router = useRouter()

    const isSidebarOpened = ref(false)

    const getIcon = (path: string): any => {
      switch (path) {
        case '/': return 'home'
        case '/about': return 'info'
        case '/add': return 'plus'
        default: return undefined
      }
    }
    const getSidebarItems = () => {
      if (_.items === undefined)
        return router.options.routes
          .filter(
            (r: RouteRecordRaw) => ['/:pathMatch(.*)*', ..._.pathFilters]
              .indexOf(r.path) === -1
          )
          .map((r: RouteRecordRaw): ISidebarItem => {
            return {
              imgSrcPrependIcon: getIcon(r.path),
              text: r.name ? r.name.toString() : r.path,
              action: () => router.push(r.path),
            }
          })
      else
        return _.items
    }

    return {
      isSidebarOpened,
      setSidebarOpened: (val: boolean) => isSidebarOpened.value = val,
      sidebarItems: getSidebarItems(),
      host: document.location.host,
    }
  },
})
</script>

<style lang="sass" scoped>
$sidebarSize: 200px
$sidebarBackground: darken(lightblue, 3)
$itemBackground: lighten($sidebarBackground, 3)

.overlay
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  background-color: rgba(128, 128, 128, 0.4)

.sidebar
  position: absolute
  z-index: 150
  top: 0
  bottom: 0
  left: 0
  width: $sidebarSize

  background-color: $sidebarBackground
  box-shadow: 0 1px 5px 0 grey

  &-title
    padding: 8px
    display: flex
    justify-content: space-between

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
    background-color: $itemBackground

    cursor: pointer

    &:hover
      background-color: lighten($itemBackground, 3)

    &__prepend-icon, &__append-icon
      margin: 0 0.5em
      width: 1.2em
      height: 1.2em
      object-fit: contain

    &__text
      flex: 1 0
      text-align: left

  &-open-button
    position: fixed
    z-index: 150
    top: calc(50vh - 64px)
    bottom: calc(50vh - 64px)
    left: -32px
    width: 64px

    background-color: $sidebarBackground
    font-size: 32px
    border-radius: 0 50% 50% 0
    text-align: right
    padding-top: 48px
    padding-right: 4px
    color: white
    +shadow

    cursor: pointer
</style>
