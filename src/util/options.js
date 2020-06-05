import {LIFECYCLE_HOOKS} from '../constants'
import {hasOwn} from './base'
const optionsMergeStrategies = Object.create(null)

LIFECYCLE_HOOKS.forEach(hook => {
  optionsMergeStrategies[hook] = mergeHook
})

export function mergeOptions (parent, child, vm) {
  // 先扩展 hooks相关
  if (child.mixins) { // 支持mixin扩展
    for (let mixin of child.mixins) {
      parent = mergeOptions(parent, mixin, vm)
    }
  }
  const options = {}

  const defaultStrategy = (parent, child) => {
    return child === undefined ? parent : child
  } 

  const mergeField = (key) => {
    const strategy = optionsMergeStrategies[key] || defaultStrategy
    options[key] = strategy(parent[key], child[key], vm, key)
  }
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  return options
}

function mergeHook (parentVal, childVal) {
  let res = parentVal
  if (childVal) {
    if (parentVal) {
      res = parentVal.concat(childVal)
    } else {
      res = Array.isArray(childVal) ? childVal : [childVal]
    }
  }
  return res ? dedupeHooks(res) : res
}

function dedupeHooks(hooks) {
  const res = []
  for (let hook of hooks) {
    if (!res.includes(hook)) {
      res.push(hook)
    }
  }
  return res
}

