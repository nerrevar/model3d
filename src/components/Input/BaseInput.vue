<template>
  <label
    :for="`input-${_uuid}`"
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
    :id="`input-${_uid}`"
    :type="type"
    :class="{
      'input': isValid,
      'invalid': !isValid
    }"
    :value="value"
    @input="
      $emit('update:value', $event.target.value),
      validate($event.target.value, _.uid)
    "
  />
  <div
    v-if="!!errorText"
    class="error"
  >
    {{ errorText }}
  </div>
  <slot />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

type TValidator = (value: string) => false | string

export default defineComponent({
  name: 'BaseInput',
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    validationFunctions: {
      type: Array as () => TValidator[],
      required: false,
      default: () => [() => false] as TValidator[],
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
  emits: ['update:value', 'setValid'],
  setup (_, { emit }) {
    const isValid = ref(true)
    const errorText = ref('')
    const validate = (text: string, uid: string) => {
      let error: boolean | string = false
      for (let fn of _.validationFunctions) {
        error = fn(text)
        if (error) {
          emit('setValid', { state: false, id: `input-${uid}` })
          errorText.value = error
          return
        }
        emit('setValid', { state: true, id: `input-${uid}` })
        errorText.value = ''
      }
    }

    return {
      date: Date.now(),
      isValid,
      errorText,
      validate,
    }
  }
})
</script>

<style lang="sass" scoped>
.base-input
  padding: 0.3em 0

.label
  margin: 0.3em 1em
  grid-column: 1

.input
  line-height: 2em
  padding: 0.3em 1em
  +input
  grid-column: 2

.invalid
  line-height: 2em
  padding: 0.3em 1em
  border: none
  border-radius: 2em
  +shadow(red)

  &:focus-visible
    outline-style: none

.error
  color: red
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
