<template>
  <form class="form">
    <BaseInput
      label="Model title"
      :validationFunctions="[nonEmpty, lettersAndNumbers]"
      v-model:value="model.title"
      @setValid="setValidStatus"
    />
    <BaseInput
      label="Description"
      :validationFunctions="[ascii]"
      v-model:value="model.description"
      @setValid="setValidStatus"
    />
    <BaseInput
      label="Author"
      :validationFunctions="[nonEmpty, lettersAndNumbers]"
      v-model:value="model.author"
      @setValid="setValidStatus"
    />
    <BaseButton
      class="assign-self-button"
      title="Fill author field with your name"
      @click="assignSelf"
    >
      This is my model
    </BaseButton>
    <BaseInput
      label="Categories"
      hint="List of categories separated with whitespace"
      :validationFunctions="[letters]"
      @update:value="updateCategories"
      @setValid="setValidStatus"
    />
    <FileInput
      label="Image"
      accept="image/*"
      @update:value="updateImage"
      @setValid="setValidStatus"
    />
    <FileInput
      label="Model"
      accept=".gltf,.glb"
      hint="Supported extensions: .gltf, .glb"
      @update:value="updateModel"
      @setValid="setValidStatus"
    />
    <BaseButton
      :isDisabled="!isFormValid"
      @click="submit"
    >
      Add
    </BaseButton>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue'
import { useStore } from '@/store'
import {
  nonEmpty,
  lettersAndNumbers,
  letters,
  ascii
} from '@/lib/validators'

import BaseInput from '@/components/Input/BaseInput.vue'
import FileInput from '@/components/Input/FileInput.vue'
import BaseButton from '@/components/Input/BaseButton.vue'

export default defineComponent({
  name: 'AddView',
  components: {
    BaseInput,
    FileInput,
    BaseButton,
  },
  setup () {
    const store = useStore()

    const model = reactive({
      title: '',
      description: '',
      author: '',
      categories: [] as string[],
      image: {
        src: '',
        alt: '',
      },
      url: '',
    })

    const assignSelf = () => model.author = store.state.User!.displayName!

    const updateCategories =
      (text: string) => model.categories =
        text
          .split(' ')
          .filter(el => !!el)
          .map(el => el.trim())

    const updateImage = (file: File) => model.image = {
      src: `image/${Date.now()}${file.name}`,
      alt: file.name.slice(0, file.name.lastIndexOf('.'))
    }

    const updateModel = (file: File) => model.url = `${Date.now()}${file.name}`

    const formValidStatus = ref<{ [key: string]: boolean }>({})
    const setValidStatus = (event: { state: boolean, id: string }) =>
      formValidStatus.value[event.id] = event.state
    const isFormValid = computed(
      () => Object
        .keys(formValidStatus.value)
        .every(el => formValidStatus.value[el])
    )

    return {
      model,
      assignSelf,
      updateCategories,
      updateImage,
      updateModel,
      setValidStatus,
      isFormValid,
      nonEmpty,
      lettersAndNumbers,
      letters,
      ascii,
      formValidStatus,
    }
  }
})
</script>

<style lang="sass" scoped>
.form
  padding: 1.5em 2.5em
  display: grid
  grid-template-columns: 2fr 5fr
  grid-gap: 1em

.assign-self-button
  grid-column: 2
  max-width: 180px

.submit
  +button
</style>
