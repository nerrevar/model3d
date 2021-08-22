<template>
  <div
    class="button"
    :class="{
      'disabled': isDisabled
    }"
    @click="isDisabled && $emit('click', $event)"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})
</script>

<style lang="sass">
.button
  +button

.disabled
  +buttonDisabled
</style>
