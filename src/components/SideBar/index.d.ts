import { NavigationFailure } from 'vue-router'

type routerPush = () => Promise<void | NavigationFailure | undefined>
type genericFunction = () => void | Promise<void>

export interface ISidebarItem {
  imgSrcPrependIcon?: string | undefined,
  text: string,
  imgSrcAppendIcon?: string | undefined,
  action?: routerPush | genericFunction,
}
