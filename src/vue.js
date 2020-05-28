import VNode from './vnode'
import patch from './patch'


export default class Vue {
  constructor(options) {
    // 需要渲染一个简单的data属性
    this.$options = options

    this.$createElement = (tag, data, children) => new VNode(tag, data, children)

    this.initData()

    if (this.$options.el) {
      this.mount(this.$options.el)
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
  }

  update(vnode) {
    this.$el = patch(this.$el, vnode)
    this.$el.__vue__ = this
  }
  render() {
    const render = this.$options.render
    // 返回 vnode
    return render.call(this, this.$createElement)
  }

  mount(el) {
    this.$el = el = document.querySelector(el)
    this.update(this.render())
    return this
  }
}