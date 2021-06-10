<template>
  <div
    class="overlay"
    v-show="isSidebarOpened"
    @click="setSidebarOpened(false)"
  >
    <div class="sidebar">
      <div class="sidebar-title">
        <img
          class="sidebar-title__logo"
          :src="imgLogo"
          :title="host"
          @click.stop="$router.push('/')"
        />
        <img
          class="sidebar-title__close-button"
          @click.stop="setSidebarOpened(false)"
          :src="imgClose"
          alt="X"
        />
      </div>
      <div
        class="sidebar-item"
        v-for="(item, index) in sidebarItems"
        :key="index"
        @click="item.action ? item.action : null"
      >
        <img
          class="sidebar-item__prepend-icon"
          v-if="item.imgSrcPrependIcon"
          :src="item.imgSrcPrependIcon"
          alt="&nbsp;"
        />
        <span class="sidebar-item__text">
          {{ item.text }}
        </span>
        <img
          class="sidebar-item__append-icon"
          v-if="item.imgSrcAppendIcon"
          :src="item.imgSrcAppendIcon"
          alt=""
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

import { ISidebarItem } from './index'

export default defineComponent({
  name: 'SideBar',
  props: {
    imgLogo: {
      type: String,
      required: true,
    },
    imgClose: {
      type: String,
      required: false,
      default: '/assets/img/close.svg',
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
  setup (props) {
    const router = useRouter()

    const isSidebarOpened = ref(false)

    const getIcon = (path: string): string | undefined => {
      switch (path) {
        case '/': return '/assets/img/home_white.svg'
        case '/about': return '/assets/img/info_white.svg'
        default: return undefined
      }
    }
    const getSidebarItems = () => {
      if (props.items === undefined)
        return router.options.routes
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
      else
        return props.items
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
  position: fixed
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
      height: 32px
      object-fit: contain

      cursor: pointer

    &__close
      width: 32px
      height: 32px
      object-fit: contain
      border-radius: 50%

      cursor: pointer

  &-item
    padding: 8px
    display: flex
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

    cursor: pointer
</style>
