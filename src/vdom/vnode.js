import {isPrimitive} from '../util'

export default class VNode {
  constructor(tag, data, children, text, elm, context, componentOptions) {
    this.tag = tag
    this.data = data
    // 处理一下文本的情况
    this.children = isPrimitive(children) ? [createTextVNode(children)] : children
   
    this.text = text
    this.elm = elm

    this.context = context
    this.componentOptions = componentOptions
    this.componentInstance = undefined
  }
}

export function createTextVNode (text) {
  return new VNode(undefined, undefined, undefined, String(text))
}

export function createEmptyVNode (text = '') {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}