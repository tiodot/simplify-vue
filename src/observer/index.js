import {hasOwn, isObject, def} from '../util'
import Dep from './dep'
import VNode from '../vdom/vnode'

export default class Observer {
  constructor (value) {
    // 使用def定义一个不可枚举属性，避免walk中递归解析 __ob__ 造成栈溢出   
    def(value, '__ob__', this) 

    // 针对childOb使用
    this.dep = new Dep() 
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
export function defineReactive(obj, key, val, shallow) {
  const dep = new Dep()
  
  val = val === undefined ? obj[key] : val

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
        }
      }
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      childOb = !shallow && observe(newVal);
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