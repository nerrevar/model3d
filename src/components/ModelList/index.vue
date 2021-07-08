<template>
  <div
    :class="[
      'models',
      {
        'models_is-rated': isRated,
      }
    ]"
  >
    <PreviewModal
      v-if="previewUrl"
      :url="previewUrl"
      :name="previewName"
      :clickPosition="clickPosition"
      @close="previewUrl = ''"
    />
    <div
      :class="[
        'model',
        {
          'model_is-short': isShort,
          'model_is-rated': isRated,
        }
      ]"
      v-for="(model, index) in models"
      :key="index"
      @click="openPreview($event, model.url, model.title)"
    >
      <img
        class="model__img"
        :src="model.img.src"
        :alt="model.img.alt"
      />
      <div class="model__title">
        {{ model.title }}
      </div>
      <div class="model-rating">
        <span class="model-rating__rating">
          {{ model.rating.toFixed(2) }}/{{ ratingScaleSize }}
        </span>
        <div class="model-rating__stars">
          <img
            class="model-rating__star model-rating__star_full"
            v-for="fullIndex in Array(Math.floor(model.rating))"
            :key="`starFull${fullIndex}`"
            src="~@mdi/svg/svg/star.svg"
            alt=''
          />
          <img
            class="model-rating__star model-rating__star_half"
            v-if="model.rating % 1 > 0.5"
            src="~@mdi/svg/svg/star-half.svg"
            alt=''
          />
          <img
            class="model-rating__star model-rating__star_empty"
            v-for="emptyIndex in Array(
              Math.floor(ratingScaleSize - model.rating)
            )"
            :key="`starEmpty${emptyIndex}`"
            src="~@mdi/svg/svg/star.svg"
            alt=''
          />
        </div>
      </div>
      <div class="model__description">
        {{ model.description }}
      </div>
      <div class="model-categories">
        <span
          class="model-categories__category"
          v-for="(category, index) in model.categories"
          :key="index"
          @click="searchWithCategory"
        >
          {{ category }}
        </span>
      </div>
      <div class="model-author">
        Author: <span class="model-author__author">{{ model.author }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue'
import { useStore } from '@/store'

import { IClickPosition } from '@/types'

import PreviewModal from '@/components/PreviewModal/index.vue'

export default defineComponent({
  name: 'ModelList',
  props: {
    isShort: {
      type: Boolean,
      default: true,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PreviewModal,
  },
  setup (_) {
    const store = useStore()

    const models = computed(
      () => _.isRated
        ? store.state.Models.rated
        : store.state.Models.currentList
    )

    const previewUrl = ref('')
    const previewName = ref('')
    const clickPosition = reactive<IClickPosition>({
      x: 0,
      y: 0,
      clientY: 0,
      clientX: 0,
    })
    const openPreview = (
      { pageX, pageY, clientX, clientY }: MouseEvent,
      modelUrl: string,
      modelName: string
    ) => {
      previewUrl.value = modelUrl
      previewName.value = modelName
      clickPosition.x = pageX
      clickPosition.y = pageY
      clickPosition.clientX = clientX
      clickPosition.clientY = clientY
    }

    const ratingScaleSize = 5 // TODO: get from store
    return {
      models,
      ratingScaleSize,
      previewUrl,
      previewName,
      clickPosition,
      openPreview,
    }
  },
})
</script>

<style lang="sass" scoped>
.models
  display: flex
  flex-flow: row wrap
  padding: 2em

  &_is-rated
    flex-wrap: nowrap
    padding: 2em 4em

.model
  padding: 0.5em
  margin: 0.3em

  +shadow
  display: flex
  flex-flow: column nowrap
  justify-content: space-between

  cursor: pointer

  &_is-short
    width: 350px

  &_is-rated
    width: 200px

  &__img
    object-fit: cover

  &__title
    padding: 0.5em 0
    color: $mainFontColor
    font-weight: 800

  &-rating
    color: $lightgrey
    font-size: 13px

    display: flex
    flex-flow: row nowrap
    justify-content: flex-start
    align-items: center

    &__rating
      padding-right: 0.5em

    &__star
      filter: invert(75%)

      &_full, &_half
        filter: invert(50%) hue-rotate(60deg) saturate(200%)

  &__description
    padding: 0.5em 0
    color: #222

  &-categories
    display: flex
    flex-flow: row wrap
    justify-content: flex-start

    &__category
      +chip
      margin: 0 0.3em 0 0

  &-author
    align-self: flex-end
    color: $lightgrey
    font-size: 0.8em

    &__author
      color: $mainFontColor
      font-size: 1rem
      font-weight: 800
</style>
