import {observe} from './observer'
import Watcher from './observer/watcher'
import patch from './vdom/patch'
import {noop, mergeOptions} from './util'
import {createElement} from './vdom/create-element'
import {installRenderHelpers} from './instance/render-helpers'
import {setActiveInstance, callHook} from './instance/lifecycle'

export default class Vue {
  constructor(options) {
    // 需要渲染一个简单的data属性
    this.$options = mergeOptions({}, options)

    this._self = this
    // lifecycle
    const parent = options.parent
    if (parent) {
      parent.$children.push(this)
    }
    this.$parent = parent
    this.$children = []
    this._isMounted = false

    // render
    this._vnode = null
    this.$createElement = (tag, data, children) => createElement(this, tag, data, children)
    callHook(this, 'beforeCreate')
    // state
    this._watchers = []
    this.initData()
    callHook(this, 'created')

    if (this.$options.el) {
      this.$mount(this.$options.el)
    }

  }
  initData() {
    let data = this.$options.data
    data = this._data = typeof data === 'function' ? data.call(this, this) : (data || {})
    const keys = Object.keys(data)
    for (let key of keys) {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: function () { return this._data[key]},
        set: function (val) { this._data[key] = val}
      })
    }
    observe(data)
  }

  // 组件更新
  _update(vnode) {
    const prevVnode = this._vnode
    const prevEl = this.$el
    const restoreActiveInstance = setActiveInstance(this)
    this._vnode = vnode
    this.$el = patch(prevVnode || this.$el, vnode)
    restoreActiveInstance()

    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (this.$el) {
      this.$el.__vue__ = this
    }
  }
  _render() {
    const render = this.$options.render
    // 返回 vnode
    return render.call(this, this.$createElement)
  }

  $mount(el) {
    const vm = this
    this.$el = el = document.querySelector(el)
    callHook(vm, 'beforeMount')
    const updateComponent = () => {
      this._update(this._render())
    }
    new Watcher(this, updateComponent, {
      before() {
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate')
        }
      }
    })
    if (!vm.$vnode) {
      vm._isMounted = true
      callHook(vm, 'mounted')
    }
    return this
  }
}

// fix chrome 异常
Vue.config = {devtools: false}

installRenderHelpers(Vue.prototype)