<template>
  <ModelList isRated />
  <MainToolbox />
  <ModelList />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { useStore } from '@/store'

import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore'

import MainToolbox from '@/components/MainToolbox/index.vue'
import ModelList from '@/components/ModelList/index.vue'

import { IModel } from '@/types'

export default defineComponent({
  name: 'MainView',
  components: {
    MainToolbox,
    ModelList,
  },
  setup () {
    const store = useStore()

    onBeforeMount(async () => {
      const modelsSnapshot = await getDocs(
        collection(store.state.Firebase.db, 'model')
      )
      const models: Array<IModel> = []
      modelsSnapshot.forEach((doc: QueryDocumentSnapshot<unknown>) => {
        models.push(doc.data() as IModel)
      })
      store.commit('setCurrentModels', models)
      store.commit('setRatedModels', models)
    })

    return {}
  },
})
</script>
