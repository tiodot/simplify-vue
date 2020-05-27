import Vue from './src/vue'

new Vue({
  el: '#app',
  data() {
    return {
      message: '简单文本渲染'
    }
  },
  render(h) {
    return h('div', null, this.message)
  },
})