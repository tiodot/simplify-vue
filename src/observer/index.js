import {def, hasOwn, isPlainObject, isObject} from '../util'
import Dep from './dep'
import VNode from '../vdom/vnode'

export default class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0

    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key)
    })
  }
  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

export const arrayMethods = Object.create(Array.prototype)

/**
 * 定义属性的的get/set 用于收集依赖项
 * @param {*} obj 
 * @param {*} key 
 * @param {*} val 
 * @param {*} shallow 
 */
export function defineReactive(obj, key, val, shallow) {
  const dep = new Dep()

  if (arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if (Dep.target) {
        // dep 会被当前的 Dep.target 收录，实现依赖的收集
        dep.depend() // ===> Dep.target.addDep(dep)
        if (childOb) { 
          childOb.dep.depend()
          if (Array.isArray(val)) {
            dependArray(val)
          }
        }
      }
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i] 
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

export function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }

  let ob = null
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    (Array.isArray(value) || isPlainObject(value)) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    // 需要针对Object拦截属性？
    return val
  }
  if (hasOwn(target)) {
    target[key] = val
    return val
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    return
  }
  // 属性不存在也可以删除
  delete target[key]
  if (ob) {
    ob.dep.notify()
  }
}

function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}