import {isPrimitive} from './util.js'

export default class VNode {
  constructor(tag, data, children, text, elm) {
    this.tag = tag
    this.data = data
    // 处理一下文本的情况
    this.children = isPrimitive(children) ? [createTextVNode(children)] : children
   
    this.text = text
    this.elm = elm
  }
}

function createTextVNode (text) {
  return new VNode(undefined, undefined, undefined, String(text))
}