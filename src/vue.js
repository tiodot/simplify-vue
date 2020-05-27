import {observe} from './observer'
import Watcher from './observer/watcher'
import {isReserved, proxy, noop} from './util'
import {createElement} from './vdom/create-element'
import patch from './vdom/patch'

export default class Vue {
  constructor(options) {
    // 需要渲染一个简单的data属性
    this.$options = options

    this._isVue = true // 避免属性被响应式

    // lifecycle 相关变量初始化
    this._watcher = null

    // render
    this._vnode = null
    this.$createElement = (a, b, c, d) => createElement(this, a, b, c, d, true)

    // state
    // 1. props TODO:
    // 2. method TODO:
    // 3. data
    this._watchers = []
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
      if (!isReserved(key)) {
        proxy(this, '_data', key)
      }
    }
    observe(data, true)
  }

  // 组件更新
  _update(vnode) {
    const prevVnode = this._vnode
    const prevEl = this.$el
    this._vnode = vnode
    this.$el = patch(prevVnode || this.$el, vnode)

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
    this._watcher = new Watcher(this, updateComponent, noop)
    return this
  }
}