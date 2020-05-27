import {
  isPrimitive,
  isDef,
  resolveAsset,
} from '../util/base'
import VNode, {createEmptyVNode, createTextVNode} from './vnode'
import {createComponent} from './create-component'

const SIMPLE_NORMALIZE = 1;
const ALWAYS_NORMALIZE = 2;
export function createElement(
  context, 
  tag, 
  data, 
  children, 
  normalizationType, 
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (alwaysNormalize === true) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _creatElement(context, tag, data, children, normalizationType)
}

export function _creatElement(
  context,
  tag,
  data,
  children,
  normalizationType
) {
  // Avoid using observed data object as vnode data
  if (isDef(data) && isDef(data.__ob__)) {
    return createEmptyVNode()
  }
  // is 功能
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  } 

  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }

  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 防止二维场景, 扁平化一下
    children = children.flat()
  }

  let vnode;
  if (typeof tag === 'string') {
    // 如果组件类型
    let component = resolveAsset(context.$options, 'components', tag)
    if (!data && isDef(component)) {
      vnode = createComponent(component, data, context, children, tag)
    } else {
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  } else {
    vnode = createComponent(tag, data, context, children)
  }

  if (isDef(vnode)) {
    return vnode
  } else {
    return createEmptyVNode()
  }

}


function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? children.flat()
      : undefined
}