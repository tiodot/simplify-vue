import {observe} from './observer'
import Watcher from './observer/watcher'
import patch from './vdom/patch'
import {noop} from './util'
import {createElement} from './vdom/create-element'
import {installRenderHelpers} from './instance/render-helpers'
import {setActiveInstance} from './instance/lifecycle'

export default class Vue {
  constructor(options) {
    // 需要渲染一个简单的data属性
    this.$options = options
    this._self = this
    // render
    this._vnode = null
    this.$createElement = (tag, data, children) => createElement(this, tag, data, children)

    this._watchers = []

    // lifecycle
    const parent = options.parent
    if (parent) {
      parent.$children.push(this)
    }
    this.$parent = parent
    this.$children = []

    this.initData()

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
    this.$el = el = document.querySelector(el)
    const updateComponent = () => {
      this._update(this._render())
    }
    new Watcher(this, updateComponent, noop)
    return this
  }
}

installRenderHelpers(Vue.prototype)