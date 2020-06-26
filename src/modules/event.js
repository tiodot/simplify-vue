import {isDef, isUndef, cached, isTrue} from '../util'

let target = null

function updateDOMListeners(oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }

  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}

  target = vnode.elm
  updateListeners(on, oldOn)
  target = null
}

/**
 * 解析一些快捷方式，像passive, once等
 */
const normalizeEvent = cached(function (name) {
  const passive = name.charAt(0) === '&'
  name = passive ? name.slice(1) : name
  const once = name.charAt(0) === '~'
  name = once ? name.slice(1) : name
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name

  return {name, once, capture, passive}
})

function createFnInvoker(fns) {
  function invoker () {
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      for (let fn of cloned) {
        fn.apply(null, arguments)
      }
    } else {
      fns.apply(null, arguments)
    }
  }
  invoker.fns = fns
  return invoker
}

function add (name, handler, capture, passive) {
  target.addEventListener(name, handler, {
    capture, 
    passive
  })
}

function remove (name, handler, capture, _target) {
  (_target || target).removeEventListener(name, handler, capture)
}


/** 该函数在 Vue2中定义在 core/vdom/helpers 目录中的update-listeners文件 */
export function updateListeners (on, oldOn) {
  let name, cur, old, event
  for (name in on) {
    cur = on[name]
    old = oldOn[name]

    event = normalizeEvent(name)

    if (isDef(cur) && isUndef(old)) {
      // 收集绑定的事件
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }

      if (isTrue(event.once)) {
        // TODO: 只执行一次的事件，暂不实现
      }
      add(event.name, cur, event.capture, event.passive)
    } else if (cur !== old) {
      old.fns = cur
      on[name] = old // 已经绑定过事件，直接替换就行好了。
    }
  }

  // 移除未绑定的事件
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}