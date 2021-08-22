<template>
  <label
    :for="`input-${type}-${date}`"
    class="label"
  >
    {{label}}
    <span
      v-if="hint"
      class="hint"
      :title="hint"
    >
      ?
    </span>
  </label>
  <input
    :id="`input-${type}-${date}`"
    class="input"
    type="file"
    :accept="accept"
    :multiple="multiple"
    :value="value"
    @change="$emit('update:value', multiple ? $event.target.files : $event.target.files[0] || {})"
  />
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseInput',
  props: {
    label: {
      type: String,
      required: true,
    },
    accept: {
      type: String,
      required: false,
      default: '*',
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
    hint: {
      type: String,
      required: false,
    },
  },
  emits: ['update:value'],
})
</script>

<style lang="sass" scoped>
.label
  margin: 0.3em 1em
  grid-column: 1

.input
  line-height: 2em
  padding: 0.3em 1em
  grid-column: 2

.hint
  display: inline-block
  background-color: #64B5F6
  color: white
  border-radius: 50%
  width: 1.3em
  height: 1.3em
  text-align: center
  margin-left: 1em
  +shadow
</style>
