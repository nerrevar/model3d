import { reactive, App, h } from 'vue'

import Toast from './index.vue'

export default {
  install: (app: App, _: any) => {
    app.component('toast', Toast)
    const $toastState = reactive({
      isShown: false,
      state: 'success',
      message: ''
    })
    app.provide('$toastState', $toastState)
    app.provide(
      '$toast',
      {
        success: (message = '') => {
          $toastState.state = 'success'
          $toastState.message = message
          $toastState.isShown = true
        },
        error: (message = '') => {
          $toastState.state = 'error'
          $toastState.message = message
          $toastState.isShown = true
        },
        warning: (message = '') => {
          $toastState.state = 'warning'
          $toastState.message = message
          $toastState.isShown = true
        }
      }
    )
  }
}
