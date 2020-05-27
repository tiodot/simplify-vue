import {
  isObject,
  isDef
} from '../util/base'

export function createComponent (Ctor, data = {}, context, children, tag) {
  const baseCtor = context.$options._base

  // 转化构造函数？
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }
}

function transformModel(options, data = {}) {
  const prop = (options.model && options.model.prop) || 'value'
  const event = (options.model && options.model.event) || 'input'
  if (!data.attrs) {
    data.attrs = {}
  }
  data.attrs[prop] = data.model.value
  const on = data.on || (data.on = {})
  const callback = data.model.callback
  if (isDef(on[event])) {
    const events = on[event]
    on[event] = [... new Set([callback].concat(events))]
  } else {
    on[event] = callback
  }
}