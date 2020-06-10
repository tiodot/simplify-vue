import { isDef, isObject } from './base'

export function genClassForVnode(vnode) {
  let data = vnode.data
  let childNode = vnode
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data)
    }
  }

  return renderClass(data.staticClass, data.class)
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  }
}

export function renderClass (staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, dynamicClass)
  }
}

export function concat (a, b) {
  return a 
    ? (b ? [a, b].join(' ') : a)
    : (b || '')
}

export function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  return ''
}

function stringifyArray(value) {
  let res = []
  let stringified
  for (let val of value) {
    stringified = stringifyClass(val)
    if (stringified) {
      res.push(stringified)
    }
  }
  return res.join(' ')
}

function stringifyObject(value) {
  let res = []
  for (const key in value) {
    if (value[key]) {
      res.push(value[key])
    }
  }
  return res.join(' ')
}