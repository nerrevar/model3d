<template>
  <div
    :class="[
      'dropdown',
      {
        'dropdown_opened': opened,
      }
    ]"
    @click="setOpened(!opened)"
    @mouseenter="onHover"
    @mouseleave="setOpened(false)"
  >
    <div class="dropdown-title">
      <slot name="title" />
    </div>
    <div class="dropdown__items" v-show="opened">
      <slot name="items" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CustomDropdown',
  props: {
    openOnHover: {
      type: Boolean,
      default: false,
    },
  },
  setup (_) {
    const opened = ref(false)
    const setOpened = (val: boolean) => opened.value = val
    const onHover = () => {
      if (_.openOnHover)
        setOpened(true)
    }

    return {
      opened,
      setOpened,
      onHover,
    }
  },
})
</script>

<style lang="sass">
$titleBackground: #CE93D8
$itemBackground: #2196F3
$color: white

.dropdown
  color: $color
  height: 2.2em
  overflow: clip
  white-space: nowrap
  +shadow

  &-title
    height: 100%

  &-title, &__items > *
    padding: 0.5em 1.5em !important
    line-height: 1.2em
    display: flex
    align-items: center
    cursor: pointer

    & > img
      margin-right: 1em
      max-width: 24px
      border-radius: 50%

  &-title
    background-color: $titleBackground

  &__items
    position: absolute

    & > *
      background-color: $itemBackground

      &:hover
        background-color: lighten($itemBackground, 3)
</style>
