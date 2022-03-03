<template>
  <img
    :src="srcRef"
    :alt="alt"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'
import { useStore } from '@/store'

import { ref as storageRef, getDownloadURL } from 'firebase/storage'

export default defineComponent({
  name: 'FirebaseImg',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
  setup (_) {
    const store = useStore()

    const srcRef = ref('')

    onBeforeMount(
      async () =>
        await getDownloadURL(storageRef(store.state.Firebase.storage, _.src))
          .then((url: string) => srcRef.value = url)
    )

    return { srcRef }
  },
})
</script>
