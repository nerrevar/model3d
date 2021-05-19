<template>
  <RatedModels />
  <MainToolbox />
  <ModelList />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RatedModels from '@/components/RatedModels/index.vue'
import MainToolbox from '@/components/MainToolbox/index.vue'
import ModelList from '@/components/ModelList/index.vue'

export default defineComponent({
  name: 'MainView',
  components: {
    RatedModels,
    MainToolbox,
    ModelList,
  },
  setup () {
    return {}
  },
})
</script>
