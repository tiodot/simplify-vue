import {hasOwn, isObject} from './util.js'
import Dep from './dep'
import VNode from './vnode'

export default class Observer {
  constructor (value) {
    this.value = value
    
    value.__ob__ = this

    this.walk(value)
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key)
    })
  }
}

/**
 * 定义属性的的get/set 用于收集依赖项
 * @param {*} obj 
 * @param {*} key 
 * @param {*} val 
 */
export function defineReactive(obj, key, val) {
  const dep = new Dep()
  
  val = val === undefined ? obj[key] : val

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if (Dep.target) {
        // dep 会被当前的 Dep.target 收录，实现依赖的收集
        dep.depend() // ===> Dep.target.addDep(dep)
      }
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}

export function observe (value) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob = null
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}