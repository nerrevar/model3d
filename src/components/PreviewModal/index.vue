<template>
  <teleport to="body">
    <div
      class="overlay"
      @click.stop="$emit('close')"
    >
      <div class="preview">
        <div class="preview-header">
          <span class="preview-header__name">{{ name }}</span>
          <img
            class="preview-header__close"
            src="./assets/close_white.svg"
            alt="X"
            @click.stop="$emit('close')"
          />
        </div>
        <div class="preview__preview">
          <div id="preview-model" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import {
  getStorage,
  ref as firebaseRef,
  getDownloadURL
} from 'firebase/storage'

import { IClickPosition, ISize } from '@/types'

export default defineComponent({
  name: 'PreviewModal',
  props: {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    clickPosition: {
      type: Object as () => IClickPosition,
      required: true,
    },
  },
  emits: ['close'],
  setup (_) {
    const storage = getStorage()

    const renderer = new three.WebGLRenderer({ antialias: true })
    const scene = new three.Scene()

    let camera = new three.PerspectiveCamera(75, 16 / 9, 0.01, 200)
    camera.lookAt(scene.position)
    scene.add(camera)

    const light = new three.DirectionalLight(0xffffff, 1)
    light.position.set(10, -3, 80)
    scene.add(light)

    const windowSize = ref<ISize>({
      width: 0,
      height: 0,
    })
    watch(
      () => windowSize.value,
      (val: ISize) => {
        renderer.setSize(val.width, val.height)
      }
    )

    const animate = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    onMounted(async () => {
      windowSize.value = {
        width: window.innerWidth - 200,
        height: window.innerHeight - 130,
      }
      renderer.setPixelRatio(window.devicePixelRatio)

      const loader = new GLTFLoader()
      fetch(`https://storage.googleapis.com/model-catalog-303814/${_.url}`)
        .then((res: Response) => res.json())
        .then(data => {
          loader.parse(
            data,
            './',
            modelObj => {
              scene.add(modelObj.scene)
            },
          )
        })

      requestAnimationFrame(animate)
    })
  },
})
</script>

<style lang="sass" scoped>
.overlay
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  background-color: rgba(128, 128, 128, 0.4)

.preview
  position: fixed
  z-index: 100
  top: 50px
  right: 100px
  bottom: 50px
  left: 100px

  display: flex
  flex-flow: column nowrap
  background-color: #000

  &-header
    display: flex

    &__name
      flex: 1 0

      color: white
      text-align: center
</style>
