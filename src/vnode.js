

export default class VNode {
  constructor(tag, data, children, text) {
    this.tag = tag
    this.data = data
    // 处理一下文本的情况
    this.children = isPrimitive(children) ? [createTextVNode(children)] : children
    this.text = text
  }
}

function createTextVNode (text) {
  return new VNode(undefined, undefined, undefined, String(text))
}

function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}