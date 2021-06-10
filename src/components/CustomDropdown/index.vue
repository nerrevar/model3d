<template>
  <div
    :class="{
      'dropdown': !opened,
      'dropdown_opened': opened,
    }"
    @click="setOpened(!opened)"
    @mouseenter="onHover"
    @mouseleave="setOpened(false)"
  >
    <div class="dropdown-title">
      <img
        class="dropdown-title__img"
        v-if="imgTitle !== ''"
        :src="imgTitle"
        alt=""
      />
      <span
        class="dropdown-title__text"
        v-if="textTitle !== ''"
      >
        {{ textTitle }}
      </span>
    </div>
    <div
      class="dropdown-item"
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      @click="action(item)"
    >
      <img
        class="dropdown-item__img"
        v-if="item.imgSrc !== undefined"
        :src="item.imgSrc"
        alt="&nbsp;"
      />
      <span class="dropdown-item__name">
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CustomDropdown',
  props: {
    imgTitle: {
      type: String,
      required: false,
      default: '',
    },
    textTitle: {
      type: String,
      required: false,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
    action: {
      type: Function,
      required: true,
    },
    openOnHover: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup (props) {
    const opened = ref(false)
    const setOpened = (val: boolean) => opened.value = val
    const onHover = () => {
      if (props.openOnHover)
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

<style lang="sass" scoped>
$titleBackground: #CE93D8
$itemBackgrount: #2196F3
$color: white

=shadow
  box-shadow: 1px 1px 5px grey

.dropdown
  color: $color
  height: 2.2em
  overflow: clip
  white-space: nowrap
  +shadow

  &_opened
    color: $color
    white-space: nowrap
    +shadow

  &-title, &-item
    padding: 0.5em 1.5em
    line-height: 1.2em
    display: flex
    align-items: center

  &-title
    background-color: $titleBackground
    +shadow

    &__img
      margin-right: 1em

  &-item
    background-color: $itemBackgrount

    &:hover
      background-color: lighten($itemBackgrount, 3)

    &__img
      margin-right: 1em
</style>
