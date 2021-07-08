<template>
  <div class="toolbox">
    <CustomDropdown
      class="toolbox__sort"
      openOnHover
    >
      <template v-slot:title class="dropdown-title">
        <img :src="currentSort.img" alt="" />
        {{ currentSort.text }}
      </template>
      <template v-slot:items>
        <div
          class="dropdown-item"
          v-for="sort in otherSorts"
          :key="sort.name"
          @click="currentSort = sort"
        >
          <img :src="sort.img" alt="" />
          {{ sort.text }}
        </div>
      </template>
    </CustomDropdown>
    <div class="toolbox__right">
      <div class="toolbox__search">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search..."
          @update="search"
        />
        <img src="./assets/search.svg" alt="" />
      </div>
      <CustomDropdown
        class="toolbox__switch-layout"
        openOnHover
      >
        <template v-slot:title>
          <img :src="currentLayout.img" alt="" />
        </template>
        <template v-slot:items>
          <div
            class="dropdown-item"
            v-for="layout in otherLayouts"
            :key="layout.name"
            @click="currentLayout = layout"
          >
            <img :src="layout.img" alt="" />
          </div>
        </template>
      </CustomDropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, inject } from 'vue'

import { ISortType, ILayoutType } from '@/types'

import CustomDropdown from '@/components/CustomDropdown/index.vue'

export default defineComponent({
  name: 'MainToolbox',
  components: { CustomDropdown },
  setup () {
    const sortTypes: ISortType[] = [
      {
        name: 'ratingDesc',
        text: 'Rating desc',
        img: require('./assets/sort-variant_white.svg'),
      },
      {
        name: 'ratingAsc',
        text: 'Rating asc',
        img: require('./assets/sort-reverse-variant_white.svg'),
      }
    ]
    const currentSort = ref(sortTypes[0])
    const otherSorts = computed(
      () => sortTypes.filter(type => type.name !== currentSort.value.name)
    )
    const updateSort = inject('updateSort', (val: ISortType) => val)
    watch(() => currentSort.value, val => updateSort(val))

    const layoutTypes: ILayoutType[] = [
      {
        name: 'layoutList',
        img: require('./assets/view-list_white.svg'),
      },
      {
        name: 'layoutModule',
        img: require('./assets/view-module_white.svg'),
      }
    ]
    const currentLayout = ref(layoutTypes[0])
    const otherLayouts = computed(
      () => layoutTypes.filter(type => type.name !== currentLayout.value.name)
    )
    const updateLayout = inject('updateLayout', (val: ILayoutType) => val)
    watch(() => currentLayout.value, val => updateLayout(val))

    const searchText = ref('')
    const setSearchText = inject('setSearchText', (val: string) => val)
    const search = () => setSearchText(searchText.value)

    return {
      currentSort,
      otherSorts,
      currentLayout,
      otherLayouts,
      searchText,
      search,
    }
  },
})
</script>

<style lang="sass" scoped>
.toolbox
  background-color: $mainColor
  display: flex
  flex-flow: row nowrap
  justify-content: space-between
  padding: 0.5em

  &__sort
    margin-left: 30px

    & .dropdown-item, & .dropdown-title
      width: 190px !important

  &__right
    display: flex
    flex-flow: row nowrap

  &__search
    display: flex
    margin-right: 5em

    input
      +input
      padding: 0.5em 1.5em

    img
      margin-left: -28px

  &__switch-layout
    div
      padding: 0.5em !important

      img
        margin: 0
</style>
