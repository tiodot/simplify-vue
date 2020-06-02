import {toString} from '../../util'
import {createTextVNode} from '../../vdom/vnode'

export function installRenderHelpers (target) {
  target._s = toString
  target._v = createTextVNode
}