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
      @click="openPreview(model.url, model.title)"
    >
      <FirebaseImg
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
          <Icon
            v-for="fullIndex in Array(Math.floor(model.rating))"
            :key="`starFull${fullIndex}`"
            icon="mdi:star"
            color="#ffea00"
            class="iconify model-rating__star model-rating__star_full"
          />
          <Icon
            v-if="model.rating % 1 > 0.5"
            icon="mdi:star-half"
            color="#ffea00"
            class="model-rating__star model-rating__star_half"
          />
          <Icon
            v-for="emptyIndex in Array(
              Math.floor(ratingScaleSize - model.rating + 0.5)
            )"
            :key="`starEmpty${emptyIndex}`"
            icon="mdi:star"
            color="#757575"
            class="model-rating__star model-rating__star_empty"
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
import { defineComponent, ref, computed } from 'vue'
import { useStore } from '@/store'

import { ref as storageRef, getDownloadURL } from 'firebase/storage'

import PreviewModal from '@/components/PreviewModal/index.vue'
import FirebaseImg from '@/components/FirebaseImg.vue'

import { Icon } from '@iconify/vue'

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
    FirebaseImg,
    Icon,
  },
  setup (_) {
    const store = useStore()

    const getSrc = async (url: string) =>
      await getDownloadURL(storageRef(store.state.Firebase.storage, url))

    const models = computed(
      () => _.isRated
        ? store.state.Models.rated
        : store.state.Models.currentList
    )

    const previewUrl = ref('')
    const previewName = ref('')
    const openPreview = (
      modelUrl: string,
      modelName: string
    ) => {
      getDownloadURL(storageRef(store.state.Firebase.storage, modelUrl))
        .then((url: string) => previewUrl.value = url)
      previewName.value = modelName
    }

    const ratingScaleSize = 5 // TODO: get from store

    return {
      models,
      ratingScaleSize,
      previewUrl,
      previewName,
      openPreview,
      getSrc,
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
      font-size: 24px

      &_half
        background-color: #757575
        clip-path: path("M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z")

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
