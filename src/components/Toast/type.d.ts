import { Ref } from 'vue'

export interface IToastState {
  isShown: boolean,
  state: 'success' | 'warning' | 'error',
  message: string
}

declare const state: IToastState

export interface ToastController {
  success: (message: string) => void,
  error: (message: string) => void,
  warning: (message: string) => void
}
