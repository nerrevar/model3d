<template>
  <teleport to="body">
    <div
      class="overlay"
      @click.stop="$emit('close')"
    >
      <div
        class="preview"
        @click.stop="() => null"
      >
        <div class="preview-header">
          <span class="preview-header__name">{{ name }}</span>
          <Icon
            icon="mdi:close"
            color="white"
            class="preview-header__close"
            @click.stop="$emit('close')"
          />
        </div>
        <div class="preview-settings">
          <CustomDropdown class="preview-settings__light">
            <template v-slot:title>
              {{ light }}
            </template>
            <template v-slot:items>
              <div
                v-for="(item, index) in Object.keys(lights)"
                :key="index"
                @click.stop="light = item"
              >
                {{ item }}
              </div>
            </template>
          </CustomDropdown>
        </div>
        <div class="preview__preview">
          <div id="preview-model" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { ILights } from '@/types'

import CustomDropdown from '@/components/CustomDropdown/index.vue'

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
  },
  emits: ['close'],
  components: {
    CustomDropdown,
    Icon,
  },
  setup (_) {
    const renderer = new three.WebGLRenderer({ antialias: true })
    const scene = new three.Scene()

    const camera = new three.PerspectiveCamera(75, 16 / 9, 0.01, 200)
    camera.position.x = -1
    camera.position.z = 1
    camera.lookAt(scene.position)
    scene.add(camera)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true

    const directionalLight = new three.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, -80, 0)

    const hemisphereLight = new three.HemisphereLight(0xffffff, 0xffffff, 1)

    const spotLight = new three.SpotLight(0xffffff)
    spotLight.position.set(0, -80, 0)

    const ambientLight = new three.AmbientLight(0xffffff)
    scene.add(ambientLight)

    const lights: ILights = {
      directionalLight,
      hemisphereLight,
      spotLight,
      ambientLight,
    }

    const light = ref('ambientLight')
    watch(
      () => light.value,
      (val: string, oldVal: string) => {
        scene.remove(lights[oldVal])
        scene.add(lights[val])
      }
    )

    const parentWidth = computed(
      () => document.querySelector('#preview-model')?.clientWidth
    )
    const parentHeight = computed(
      () => document.querySelector('#preview-model')?.clientHeight
    )
    watch(
      () => [parentWidth.value, parentHeight.value],
      ([w, h]) => {
        if (w && h)
          renderer.setSize(w, h)
      }
    )

    const animate = () => {
      renderer.render(scene, camera)
      controls.update()
      requestAnimationFrame(animate)
    }

    onMounted(async () => {
      renderer.setPixelRatio(window.devicePixelRatio)

      const loader = new GLTFLoader()
      loader.load(_.url, gltf => scene.add(gltf.scene))

      const rendererParentNode = document.getElementById('preview-model')
      renderer.setSize(
        rendererParentNode!.offsetWidth,
        rendererParentNode!.offsetHeight
      )
      rendererParentNode!.appendChild(renderer.domElement)

      requestAnimationFrame(animate)
    })

    return {
      light,
      lights,
      // test
      parentWidth,
      parentHeight,
    }
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

  &-settings
    display: flex
    flex-flow: row wrap
    justify-content: flex-start

  &__preview
    width: 100%
    height: 100%

#preview-model
  width: 100%
  height: 100%

  display: flex
  justify-content: center
</style>
